import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, dirname, basename } from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { createUser } from "../server/auth.js";
import { blankBlock } from "../shared/content.js";
import { pageShell } from "../integration/seo.js";
let db, app, dir, admin, editor, adminCsrf, editorCsrf;
const origin = "http://localhost:3100";
const pass = "test-only-password-very-long";
const page = () => ({
  schemaVersion: 1,
  title: "Test page",
  path: `/test-${randomUUID()}`,
  seo: {
    title: "Test title",
    description: "A useful page description.",
    canonical: "",
    ogImage: "",
    noindex: false,
  },
  blocks: [{ ...blankBlock(), heading: "Published heading" }],
});
const write = (agent, method, path, body, csrf = adminCsrf) =>
  agent[method](path)
    .set("Origin", origin)
    .set("X-CSRF-Token", csrf)
    .send(body);
before(async () => {
  dir = await mkdtemp(join(tmpdir(), "ozo-cms-"));
  db = await openDb({ url: null, path: join(dir, "db.sqlite") });
  app = await createApp(db, {
    origin,
    mediaDir: join(dir, "media"),
    production: false,
  });
  await createUser(db, "admin@example.test", pass);
  await createUser(db, "editor@example.test", pass, "editor");
  admin = request.agent(app);
  editor = request.agent(app);
  adminCsrf = (
    await admin
      .post("/api/cms/login")
      .set("Origin", origin)
      .send({ email: "admin@example.test", password: pass })
      .expect(200)
  ).body.csrf;
  editorCsrf = (
    await editor
      .post("/api/cms/login")
      .set("Origin", origin)
      .send({ email: "editor@example.test", password: pass })
      .expect(200)
  ).body.csrf;
});
after(async () => {
  await db.close();
  if (
    dirname(resolve(dir)) !== resolve(tmpdir()) ||
    !basename(dir).startsWith("ozo-cms-")
  )
    throw Error("Refusing cleanup outside test directory");
  await rm(dir, { recursive: true, force: true });
});
test("private endpoints, login and CSRF are enforced", async () => {
  await request(app).get("/api/cms/documents").expect(401);
  await request(app)
    .get(`/api/cms/documents/${randomUUID()}/preview`)
    .expect(401);
  await request(app)
    .post("/api/cms/login")
    .set("Origin", "https://evil.test")
    .send({ email: "admin@example.test", password: pass })
    .expect(403);
  await request(app)
    .post("/api/cms/login")
    .set("Origin", origin)
    .send({ email: "admin@example.test", password: "wrong" })
    .expect(401);
  await admin
    .post("/api/cms/documents")
    .set("Origin", origin)
    .send({ kind: "page", data: page() })
    .expect(403);
});
test("draft creation/save do not expose changes; stale updates are rejected", async () => {
  const data = page();
  let d = (
    await write(admin, "post", "/api/cms/documents", {
      kind: "page",
      data,
    }).expect(201)
  ).body;
  await request(app)
    .get("/api/public/page")
    .query({ path: data.path })
    .expect(404);
  d = (
    await write(admin, "post", `/api/cms/documents/${d.id}/publish`, {
      version: d.version,
    }).expect(200)
  ).body;
  assert.equal(
    (
      await request(app)
        .get("/api/public/page")
        .query({ path: data.path })
        .expect(200)
    ).body.blocks[0].heading,
    "Published heading",
  );
  const edited = structuredClone(d.draft);
  edited.blocks[0].heading = "Secret draft";
  d = (
    await write(admin, "put", `/api/cms/documents/${d.id}`, {
      version: d.version,
      data: edited,
    }).expect(200)
  ).body;
  assert.equal(
    (await request(app).get("/api/public/page").query({ path: data.path })).body
      .blocks[0].heading,
    "Published heading",
  );
  await write(admin, "put", `/api/cms/documents/${d.id}`, {
    version: 1,
    data: edited,
  }).expect(409);
  await write(admin, "post", `/api/cms/documents/${d.id}/publish`, {
    version: 1,
  }).expect(409);
  const revs = (
    await admin.get(`/api/cms/documents/${d.id}/revisions`).expect(200)
  ).body;
  d = (
    await write(
      admin,
      "post",
      `/api/cms/documents/${d.id}/restore/${revs.find((r) => r.action === "create").id}`,
      { version: d.version },
    ).expect(200)
  ).body;
  assert.equal(d.draft.blocks[0].heading, "Published heading");
  await write(admin, "post", `/api/cms/documents/${d.id}/unpublish`, {
    version: d.version,
  }).expect(200);
  await request(app)
    .get("/api/public/page")
    .query({ path: data.path })
    .expect(404);
});
test("editors save but cannot publish or unpublish", async () => {
  const d = (
    await write(
      editor,
      "post",
      "/api/cms/documents",
      { kind: "page", data: page() },
      editorCsrf,
    ).expect(201)
  ).body;
  await write(
    editor,
    "post",
    `/api/cms/documents/${d.id}/publish`,
    { version: d.version },
    editorCsrf,
  ).expect(403);
  await write(
    editor,
    "post",
    `/api/cms/documents/${d.id}/unpublish`,
    { version: d.version },
    editorCsrf,
  ).expect(403);
});
test("shared sections use published snapshots and changes require page republish", async () => {
  let shared = (
    await write(admin, "post", "/api/cms/documents", {
      kind: "section",
      data: { ...blankBlock("cta"), heading: "First CTA" },
    })
  ).body;
  const data = page();
  data.blocks = [{ id: randomUUID(), type: "shared", sectionId: shared.id }];
  let d = (
    await write(admin, "post", "/api/cms/documents", { kind: "page", data })
  ).body;
  await write(admin, "post", `/api/cms/documents/${d.id}/publish`, {
    version: d.version,
  }).expect(422);
  shared = (
    await write(admin, "post", `/api/cms/documents/${shared.id}/publish`, {
      version: shared.version,
    }).expect(200)
  ).body;
  d = (
    await write(admin, "post", `/api/cms/documents/${d.id}/publish`, {
      version: d.version,
    }).expect(200)
  ).body;
  shared = (
    await write(admin, "put", `/api/cms/documents/${shared.id}`, {
      version: shared.version,
      data: { ...shared.draft, heading: "Second CTA" },
    })
  ).body;
  await write(admin, "post", `/api/cms/documents/${shared.id}/publish`, {
    version: shared.version,
  }).expect(200);
  assert.equal(
    (await request(app).get("/api/public/page").query({ path: data.path })).body
      .blocks[0].heading,
    "First CTA",
  );
  await write(admin, "post", `/api/cms/documents/${d.id}/publish`, {
    version: d.version,
  }).expect(200);
  assert.equal(
    (await request(app).get("/api/public/page").query({ path: data.path })).body
      .blocks[0].heading,
    "Second CTA",
  );
});
test("duplicate published paths fail atomically; invalid links, blocks and reserved paths rejected", async () => {
  const data = page();
  const a = (
    await write(admin, "post", "/api/cms/documents", { kind: "page", data })
  ).body;
  const b = (
    await write(admin, "post", "/api/cms/documents", { kind: "page", data })
  ).body;
  await write(admin, "post", `/api/cms/documents/${a.id}/publish`, {
    version: a.version,
  }).expect(200);
  await write(admin, "post", `/api/cms/documents/${b.id}/publish`, {
    version: b.version,
  }).expect(409);
  assert.equal(
    (await admin.get("/api/cms/documents")).body.find((x) => x.id === b.id)
      .published,
    null,
  );
  for (const href of ["javascript:alert(1)", "//evil.test", "/\\evil.test"]) {
    const bad = page();
    bad.blocks[0].href = href;
    await write(admin, "post", "/api/cms/documents", {
      kind: "page",
      data: bad,
    }).expect(400);
  }
  const bad = page();
  bad.path = "/admin";
  await write(admin, "post", "/api/cms/documents", {
    kind: "page",
    data: bad,
  }).expect(400);
  bad.path = "/valid";
  bad.blocks[0].type = "html";
  await write(admin, "post", "/api/cms/documents", {
    kind: "page",
    data: bad,
  }).expect(400);
});
test("concurrent saves have one winner", async () => {
  const d = (
    await write(admin, "post", "/api/cms/documents", {
      kind: "page",
      data: page(),
    })
  ).body;
  const results = await Promise.all(
    ["One", "Two"].map((title) =>
      write(admin, "put", `/api/cms/documents/${d.id}`, {
        version: d.version,
        data: { ...d.draft, title },
      }),
    ),
  );
  assert.deepEqual(results.map((r) => r.status).sort(), [200, 409]);
});
test("media verifies bytes and converts image; menu public API exposes only published content", async () => {
  const image = await sharp({
    create: { width: 8, height: 8, channels: 3, background: "#ffcc00" },
  })
    .png()
    .toBuffer();
  const result = await admin
    .post("/api/cms/media")
    .set("Origin", origin)
    .set("X-CSRF-Token", adminCsrf)
    .field("alt", "Yellow square")
    .attach("file", image, "test.png")
    .expect(201);
  await request(app)
    .get(result.body.url)
    .expect("Content-Type", /webp/)
    .expect(200);
  await admin
    .post("/api/cms/media")
    .set("Origin", origin)
    .set("X-CSRF-Token", adminCsrf)
    .field("alt", "Unsafe SVG")
    .attach("file", Buffer.from("<svg/>"), "test.svg")
    .expect(400);
  let d = (
    await write(admin, "post", "/api/cms/documents", {
      kind: "menu",
      data: {
        name: "Main",
        location: "header",
        items: [
          { id: randomUUID(), label: "Home", href: "/#home", newTab: false },
        ],
      },
    })
  ).body;
  assert.equal(
    (await request(app).get("/api/public/site")).body.menus.length,
    0,
  );
  await write(admin, "post", `/api/cms/documents/${d.id}/publish`, {
    version: d.version,
  }).expect(200);
  assert.equal(
    (await request(app).get("/api/public/site")).body.menus[0].items[0].href,
    "/#home",
  );
});
test("SEO shell escapes content and noindex pages are omitted from sitemap", async () => {
  const data = page();
  data.seo.title = "<script>bad</script>";
  data.seo.noindex = true;
  const html = pageShell(
    '<head><title>Old</title><meta name="description" content="old"></head>',
    data,
    "https://example.test",
  );
  assert.ok(!html.includes("<script>"));
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(html.includes("noindex,nofollow"));
  assert.ok(!html.includes('content="old"'));
  const d = (
    await write(admin, "post", "/api/cms/documents", { kind: "page", data })
  ).body;
  await write(admin, "post", `/api/cms/documents/${d.id}/publish`, {
    version: d.version,
  }).expect(200);
  assert.ok(
    !(await request(app).get("/api/public/sitemap")).body.some(
      (x) => x.path === data.path,
    ),
  );
});
test("logout revokes the server session", async () => {
  const agent = request.agent(app);
  const login = await agent
    .post("/api/cms/login")
    .set("Origin", origin)
    .send({ email: "admin@example.test", password: pass })
    .expect(200);
  await write(agent, "post", "/api/cms/logout", {}, login.body.csrf).expect(
    200,
  );
  await agent.get("/api/cms/me").expect(401);
});

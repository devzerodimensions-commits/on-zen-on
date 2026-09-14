import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { openDb } from "../cms/server/db.js";
import { createWebsite } from "../server/website.js";
import { seedCms, stableId } from "../server/seed-cms.js";
import { createUser } from "../cms/server/auth.js";
import { templateDefaults } from "../shared/templates.js";
import { pageSchema } from "../cms/shared/content.js";
test("integrated public website, template drafts, menus, inquiries, users and restart persistence", async () => {
  const db = await openDb({ url: null, path: ":memory:" });
  try {
    await seedCms(db);
    await createUser(db, "owner@example.test", "integration-test-password");
    const origin = "http://localhost:3001";
    const app = await createWebsite(db, { origin, production: false });
    const agent = request.agent(app);
    const login = await agent
      .post("/api/cms/login")
      .set("Origin", origin)
      .send({
        email: "owner@example.test",
        password: "integration-test-password",
      })
      .expect(200);
    const csrf = login.body.csrf;
    const write = (method, url, data) =>
      agent[method](url)
        .set("Origin", origin)
        .set("X-CSRF-Token", csrf)
        .send(data);
    await request(app)
      .get("/")
      .expect(200)
      .expect(/Creation Meets Growth/);
    await request(app)
      .get("/admin/")
      .expect(200)
      .expect(/On Zen On — Admin/);
    await request(app).get("/missing-page").expect(404);
    await request(app)
      .post("/api/admin/login")
      .send({ user: "admin", password: "admin123" })
      .expect(410);
    const homepage = (
      await request(app).get("/api/public/page?path=/").expect(200)
    ).body;
    assert.equal(homepage.blocks.length, 15);
    assert.ok(homepage.blocks.every((b) => b.type === "template"));
    let d = (await agent.get("/api/cms/documents")).body.find(
      (d) => d.id === stableId("home"),
    );
    const draft = structuredClone(d.draft);
    const key = Object.keys(draft.blocks[0].fields).find((k) =>
      draft.blocks[0].fields[k].startsWith("Web, apps"),
    );
    draft.blocks[0].fields[key] = "Private changed title";
    d = (
      await write("put", `/api/cms/documents/${d.id}`, {
        version: d.version,
        data: draft,
      }).expect(200)
    ).body;
    assert.notEqual(
      (await request(app).get("/api/public/page?path=/")).body.blocks[0].fields[
        key
      ],
      "Private changed title",
    );
    await write("post", `/api/cms/documents/${d.id}/publish`, {
      version: d.version,
    }).expect(200);
    assert.equal(
      (await request(app).get("/api/public/page?path=/")).body.blocks[0].fields[
        key
      ],
      "Private changed title",
    );
    await seedCms(db);
    assert.equal(
      (await request(app).get("/api/public/page?path=/")).body.blocks[0].fields[
        key
      ],
      "Private changed title",
    );
    const layout = (await agent.get("/api/cms/documents")).body.find(
      (d) => d.id === stableId("site-header"),
    );
    await write("post", `/api/cms/documents/${layout.id}/publish`, {
      version: layout.version,
    }).expect(200);
    assert.equal(
      (await request(app).get("/api/public/site")).body.layouts.length,
      2,
    );
    await request(app)
      .post("/api/inquiries")
      .send({
        name: "Test only",
        email: "test@example.test",
        message: "Integration test inquiry",
      })
      .expect(201);
    await request(app)
      .post("/api/inquiries")
      .send({ name: "", email: "bad", message: "" })
      .expect(400);
    const inquiry = (await agent.get("/api/cms/inquiries").expect(200)).body[0];
    await write("patch", `/api/cms/inquiries/${inquiry.id}`, {
      status: "contacted",
      notes: "Test note",
    }).expect(200);
    await request(app).get("/api/cms/inquiries").expect(401);
    await write("post", "/api/cms/users", {
      email: "new-editor@example.test",
      password: "editor-very-long-password",
      role: "editor",
    }).expect(201);
    const users = (await agent.get("/api/cms/users")).body;
    const owner = users.find((u) => u.email === "owner@example.test");
    assert.ok(!("password" in owner));
    await write("patch", `/api/cms/users/${owner.id}`, {
      role: "editor",
      active: false,
    }).expect(400);
    const editor = request.agent(app);
    const eLogin = await editor
      .post("/api/cms/login")
      .set("Origin", origin)
      .send({
        email: "new-editor@example.test",
        password: "editor-very-long-password",
      })
      .expect(200);
    await editor.get("/api/cms/inquiries").expect(403);
    await editor.get("/api/cms/users").expect(403);
    const u = users.find((u) => u.email === "new-editor@example.test");
    await write("patch", `/api/cms/users/${u.id}`, {
      role: "editor",
      active: false,
    }).expect(200);
    await editor.get("/api/cms/me").expect(401);
    await request(app)
      .get("/sitemap.xml")
      .expect(200)
      .expect(/<loc>http:\/\/localhost:3001\/<\/loc>/);
  } finally {
    await db.close();
  }
});
test("template schema rejects executable links, unknown fields and duplicate original anchors", () => {
  const page = {
    schemaVersion: 1,
    title: "Example",
    path: "/example",
    seo: {
      title: "Example",
      description: "Description",
      canonical: "",
      ogImage: "",
      noindex: false,
    },
    blocks: [structuredClone(templateDefaults.hero)],
  };
  assert.equal(pageSchema.safeParse(page).success, true);
  page.blocks[0].fields.unexpected = "<script>bad</script>";
  assert.equal(pageSchema.safeParse(page).success, false);
  delete page.blocks[0].fields.unexpected;
  const link = Object.keys(page.blocks[0].fields).find((k) =>
    k.startsWith("link"),
  );
  page.blocks[0].fields[link] = "javascript:alert(1)";
  assert.equal(pageSchema.safeParse(page).success, false);
  page.blocks = [
    templateDefaults.hero,
    { ...templateDefaults.hero, id: crypto.randomUUID() },
  ];
  assert.equal(pageSchema.safeParse(page).success, false);
});

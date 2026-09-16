import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, dirname, basename } from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { openDb } from "../cms/server/db.js";
import { createApp } from "../cms/server/app.js";
import { createUser } from "../cms/server/auth.js";
import { blankBlock } from "../cms/shared/content.js";
import {
  themeDefaults,
  themeCss,
  colorPresets,
  contrastRatio,
  readableOn,
} from "../shared/theme.js";

let db, app, dir, admin, csrf;
const origin = "http://localhost:3100";
const pass = "test-only-password-very-long";
const write = (method, path, body) =>
  admin[method](path)
    .set("Origin", origin)
    .set("X-CSRF-Token", csrf)
    .send(body);

before(async () => {
  dir = await mkdtemp(join(tmpdir(), "ozo-studio-"));
  db = await openDb({ url: null, path: join(dir, "db.sqlite") });
  app = await createApp(db, {
    origin,
    mediaDir: join(dir, "media"),
    production: false,
  });
  await createUser(db, "admin@example.test", pass);
  admin = request.agent(app);
  csrf = (
    await admin
      .post("/api/cms/login")
      .set("Origin", origin)
      .send({ email: "admin@example.test", password: pass })
      .expect(200)
  ).body.csrf;
});
after(async () => {
  await db.close();
  if (
    dirname(resolve(dir)) !== resolve(tmpdir()) ||
    !basename(dir).startsWith("ozo-studio-")
  )
    throw Error("Refusing cleanup outside test directory");
  await rm(dir, { recursive: true, force: true });
});

test("appearance settings publish and reach the public site as CSS", async () => {
  const theme = {
    ...themeDefaults,
    ...colorPresets.forest.colors,
    enabled: true,
    preset: "forest",
    font: "poppins",
    headingFont: "playfair",
    bodySize: 19,
    buttonStyle: "pill",
    cardShadow: "strong",
  };
  const created = await write("post", "/api/cms/documents", {
    kind: "settings",
    data: {
      siteName: "On Zen On",
      tagline: "Creation meets growth.",
      footerText: "",
      email: "hello@onzenon.com",
      phone: "",
      theme,
    },
  }).expect(201);
  await write("post", `/api/cms/documents/${created.body.id}/publish`, {
    version: created.body.version,
  }).expect(200);

  const site = await admin.get("/api/public/site").expect(200);
  const published = site.body.settings.theme;
  assert.equal(published.font, "poppins");
  assert.equal(published.headingFont, "playfair");
  assert.equal(published.primary, colorPresets.forest.colors.primary);

  const css = themeCss(published);
  assert.match(css, /Poppins/);
  assert.match(css, /Playfair Display/);
  assert.match(css, /font-size:19px/);
  assert.match(css, /border-radius:999px/);
  assert.equal(themeCss({ ...published, enabled: false }), "");
});

test("settings saved before the appearance studio existed still validate", async () => {
  const legacy = {
    siteName: "On Zen On",
    tagline: "Creation meets growth.",
    footerText: "",
    email: "hello@onzenon.com",
    phone: "",
    theme: {
      enabled: true,
      font: "system",
      bodySize: 16,
      headingSize: 48,
      lineHeight: 1.7,
      primary: "#1119a5",
      secondary: "#08723b",
      accent: "#ecb900",
      background: "#f9f8f1",
      text: "#172e35",
      buttonText: "#ffffff",
      radius: 12,
      sectionSpacing: 80,
      logoSize: 160,
      mobileLogoSize: 112,
    },
  };
  const created = await write("post", "/api/cms/documents", {
    kind: "settings",
    data: legacy,
  }).expect(201);
  /* Missing newer keys are filled with their defaults rather than rejected. */
  assert.equal(created.body.draft.theme.buttonStyle, "solid");
  assert.equal(created.body.draft.theme.surface, "#ffffff");
  assert.ok(themeCss(created.body.draft.theme).length > 0);
});

test("a hidden section stays in the draft and is published, ready to show again", async () => {
  const created = await write("post", "/api/cms/documents", {
    kind: "page",
    data: {
      schemaVersion: 1,
      title: "Hidden section page",
      path: `/hidden-${randomUUID().slice(0, 8)}`,
      seo: {
        title: "Hidden section page",
        description: "Checks that hidden sections survive publishing.",
        canonical: "",
        ogImage: "",
        noindex: false,
      },
      blocks: [
        { ...blankBlock(), heading: "Visible" },
        { ...blankBlock("cta"), heading: "Switched off", hidden: true },
      ],
    },
  }).expect(201);
  assert.equal(created.body.draft.blocks[1].hidden, true);
  const live = await write(
    "post",
    `/api/cms/documents/${created.body.id}/publish`,
    { version: created.body.version },
  ).expect(200);
  assert.equal(live.body.published.blocks.length, 2);
  assert.equal(live.body.published.blocks[0].hidden, false);
  assert.equal(live.body.published.blocks[1].hidden, true);
});

test("a hidden shared reference hides the section it points at", async () => {
  const section = await write("post", "/api/cms/documents", {
    kind: "section",
    data: { ...blankBlock("cta"), heading: "Shared promo" },
  }).expect(201);
  await write("post", `/api/cms/documents/${section.body.id}/publish`, {
    version: section.body.version,
  }).expect(200);
  const page = await write("post", "/api/cms/documents", {
    kind: "page",
    data: {
      schemaVersion: 1,
      title: "Shared reference page",
      path: `/shared-${randomUUID().slice(0, 8)}`,
      seo: {
        title: "Shared reference page",
        description: "Checks hidden shared references.",
        canonical: "",
        ogImage: "",
        noindex: false,
      },
      blocks: [
        { ...blankBlock(), heading: "Visible" },
        {
          id: randomUUID(),
          type: "shared",
          hidden: true,
          sectionId: section.body.id,
        },
      ],
    },
  }).expect(201);
  const live = await write(
    "post",
    `/api/cms/documents/${page.body.id}/publish`,
    {
      version: page.body.version,
    },
  ).expect(200);
  assert.equal(live.body.published.blocks[1].heading, "Shared promo");
  assert.equal(live.body.published.blocks[1].hidden, true);
});

test("pictures can be renamed, and deleting one that is still in use is refused", async () => {
  const file = await sharp({
    create: { width: 10, height: 10, channels: 3, background: "#3366cc" },
  })
    .png()
    .toBuffer();
  const uploaded = await admin
    .post("/api/cms/media")
    .set("Origin", origin)
    .set("X-CSRF-Token", csrf)
    .field("alt", "Blue square")
    .attach("file", file, "square.png")
    .expect(201);

  await write("patch", `/api/cms/media/${uploaded.body.id}`, {
    alt: "Team photo from the studio",
  }).expect(200);
  const listed = await admin.get("/api/cms/media").expect(200);
  assert.equal(
    listed.body.find((m) => m.id === uploaded.body.id).alt,
    "Team photo from the studio",
  );

  const page = await write("post", "/api/cms/documents", {
    kind: "page",
    data: {
      schemaVersion: 1,
      title: "Picture page",
      path: `/picture-${randomUUID().slice(0, 8)}`,
      seo: {
        title: "Picture page",
        description: "Checks that used pictures cannot be deleted.",
        canonical: "",
        ogImage: "",
        noindex: false,
      },
      blocks: [
        {
          ...blankBlock(),
          heading: "With a picture",
          image: uploaded.body.url,
          alt: "Team photo",
        },
      ],
    },
  }).expect(201);
  const refused = await write(
    "delete",
    `/api/cms/media/${uploaded.body.id}`,
  ).expect(409);
  assert.match(refused.body.error, /still used/);

  /* Once the picture is off the page the deletion goes through. */
  await write("put", `/api/cms/documents/${page.body.id}`, {
    version: page.body.version,
    data: {
      ...page.body.draft,
      blocks: [{ ...page.body.draft.blocks[0], image: "", alt: "" }],
    },
  }).expect(200);
  await write("delete", `/api/cms/media/${uploaded.body.id}`).expect(200);
  await admin.get(uploaded.body.url).expect(404);
});

test("every ready-made theme keeps its text readable", () => {
  for (const [name, preset] of Object.entries(colorPresets)) {
    const c = preset.colors;
    const css = themeCss({ ...themeDefaults, ...c, enabled: true });
    /* The colour the generator chose for text on the brand-coloured banner. */
    const [, onBanner] = css.match(
      /\.contact\) :is\(p,[^{]*\{color:(#[0-9a-f]{6})/,
    );
    const pairs = {
      "body text on the page": [c.text, c.background],
      "lighter text on a card": [c.muted, c.surface],
      "text on the brand banner": [onBanner, c.primary],
      "text on the second colour": [readableOn(c.secondary), c.secondary],
      "button text on the button": [c.buttonText, c.primary],
      "menu text on the header": [c.headerText, c.headerBackground],
      "footer text on the footer": [c.footerTextColor, c.footerBackground],
    };
    for (const [what, [front, back]] of Object.entries(pairs))
      assert.ok(
        contrastRatio(front, back) >= 4.5,
        `${name}: ${what} is ${contrastRatio(front, back)}:1, below WCAG AA`,
      );
  }
});

test("softened text never drops below the readable threshold", () => {
  /* A brand colour whose ideal text colour is only just readable must not be
     softened any further. */
  for (const primary of ["#b3401b", "#0f737c", "#767676", "#ffdd00"]) {
    const css = themeCss({
      ...themeDefaults,
      ...colorPresets.original.colors,
      primary,
      enabled: true,
    });
    const [, onBanner] = css.match(
      /\.contact\) :is\(p,[^{]*\{color:(#[0-9a-f]{6})/,
    );
    assert.ok(
      contrastRatio(onBanner, primary) >= 4.5,
      `${primary}: banner text is ${contrastRatio(onBanner, primary)}:1`,
    );
  }
});

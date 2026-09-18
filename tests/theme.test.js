import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { openDb } from "../cms/server/db.js";
import { createUser } from "../cms/server/auth.js";
import { seedCms, stableId } from "../server/seed-cms.js";
import { createWebsite } from "../server/website.js";
import { themeDefaults, themeSchema, themeCss } from "../shared/theme.js";
test("theme settings validate, stay private as drafts, publish and restore original design", async () => {
  const db = await openDb({ url: null, path: ":memory:" });
  try {
    await seedCms(db);
    const origin = "http://localhost";
    const app = await createWebsite(db, { origin, production: false });
    await createUser(db, "theme@example.test", "theme-test-password-only");
    const agent = request.agent(app);
    const {
      body: { csrf },
    } = await agent
      .post("/api/cms/login")
      .set("Origin", origin)
      .send({
        email: "theme@example.test",
        password: "theme-test-password-only",
      })
      .expect(200);
    const id = stableId("settings");
    const [row] = await db.query("SELECT * FROM documents WHERE id=$1", [id]);
    const data = JSON.parse(row.draft);
    data.theme = {
      ...themeDefaults,
      enabled: true,
      font: "serif",
      primary: "#254e70",
      bodySize: 18,
    };
    const write = (method, path, body) =>
      agent[method](path)
        .set("Origin", origin)
        .set("X-CSRF-Token", csrf)
        .send(body);
    const saved = await write("put", "/api/cms/documents/" + id, {
      version: row.version,
      data,
    }).expect(200);
    assert.equal(
      (await request(app).get("/api/public/site")).body.settings.theme,
      undefined,
    );
    await write("post", "/api/cms/documents/" + id + "/publish", {
      version: saved.body.version,
    }).expect(200);
    const live = (await request(app).get("/api/public/site")).body.settings
      .theme;
    assert.equal(live.primary, "#254e70");
    assert.match(themeCss(live), /Georgia/);
    assert.equal(themeCss({ ...live, enabled: false }), "");
    assert.equal(themeCss({ ...live, primary: "red;}body{display:none" }), "");
    assert.equal(
      themeSchema.safeParse({ ...live, bodySize: 1000 }).success,
      false,
    );
    assert.equal(
      themeSchema.safeParse({ ...live, font: "url(https://bad.test)" }).success,
      false,
    );
  } finally {
    await db.close();
  }
});

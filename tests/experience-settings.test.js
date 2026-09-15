import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { openDb } from "../cms/server/db.js";
import { createUser } from "../cms/server/auth.js";
import { seedCms, stableId } from "../server/seed-cms.js";
import { createWebsite } from "../server/website.js";
import { experienceDefaults } from "../shared/experience-settings.js";
const origin = "http://localhost:3117";
test("feature drafts stay private and published controls govern backend behavior", async () => {
  const db = await openDb({ url: null, path: ":memory:" });
  try {
    await seedCms(db);
    const app = await createWebsite(db, { origin, production: false });
    await createUser(db, "owner@example.test", "local-test-password-long");
    const admin = request.agent(app);
    const csrf = (
      await admin
        .post("/api/cms/login")
        .set("Origin", origin)
        .send({
          email: "owner@example.test",
          password: "local-test-password-long",
        })
        .expect(200)
    ).body.csrf;
    const id = stableId("settings");
    const [row] = await db.query("SELECT * FROM documents WHERE id=$1", [id]);
    const draft = JSON.parse(row.draft);
    draft.experience = {
      ...experienceDefaults,
      chatTitle: "Custom guide",
      customAnswers: [
        {
          question: "Can you help my shop?",
          answer: "Yes, send us your shop requirements.",
        },
      ],
      bookingEnabled: false,
      portalServices: ["Special service"],
      darkModeEnabled: false,
      motionEnabled: false,
    };
    const write = (method, path, body) =>
      admin[method](path)
        .set("Origin", origin)
        .set("X-CSRF-Token", csrf)
        .send(body);
    await write("put", "/api/cms/documents/" + id, {
      version: row.version,
      data: draft,
    }).expect(200);
    assert.equal(
      (await request(app).get("/api/public/experience")).body.chatTitle,
      experienceDefaults.chatTitle,
    );
    await write("post", "/api/cms/documents/" + id + "/publish", {
      version: row.version + 1,
    }).expect(200);
    assert.equal(
      (await request(app).get("/api/public/experience")).body.chatTitle,
      "Custom guide",
    );
    const answer = (
      await request(app)
        .post("/api/guide")
        .set("Origin", origin)
        .send({ question: "Can you help my shop?" })
        .expect(200)
    ).body;
    assert.equal(answer.text, "Yes, send us your shop requirements.");
    const form = {
      name: "Test visitor",
      email: "test@example.test",
      service: "Special service",
      message: "Please build a customer portal.",
    };
    await request(app)
      .post("/api/portal/requests")
      .set("Origin", origin)
      .send({ ...form, starts: Date.now() + 86400000 })
      .expect(400);
    await request(app)
      .post("/api/portal/requests")
      .set("Origin", origin)
      .send({ ...form, service: "Unknown" })
      .expect(400);
    const saved = (
      await request(app)
        .post("/api/portal/requests")
        .set("Origin", origin)
        .send(form)
        .expect(201)
    ).body;
    draft.experience.portalEnabled = false;
    draft.experience.chatEnabled = false;
    await write("put", "/api/cms/documents/" + id, {
      version: row.version + 2,
      data: draft,
    }).expect(200);
    await write("post", "/api/cms/documents/" + id + "/publish", {
      version: row.version + 3,
    }).expect(200);
    await request(app)
      .post("/api/portal/requests")
      .set("Origin", origin)
      .send(form)
      .expect(503);
    await request(app)
      .post("/api/portal/status")
      .set("Origin", origin)
      .send({ id: saved.id, access: saved.access })
      .expect(200);
    assert.deepEqual(
      (
        await request(app)
          .post("/api/guide")
          .set("Origin", origin)
          .send({ question: "backend" })
      ).body.links,
      [],
    );
    draft.experience.bookingLeadHours = -1;
    await write("put", "/api/cms/documents/" + id, {
      version: row.version + 4,
      data: draft,
    }).expect(400);
  } finally {
    await db.close();
  }
});

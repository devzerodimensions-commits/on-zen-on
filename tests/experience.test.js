import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { openDb } from "../cms/server/db.js";
import { createUser } from "../cms/server/auth.js";
import { seedCms } from "../server/seed-cms.js";
import { createWebsite } from "../server/website.js";
import { guideAnswer } from "../server/service-guide.js";
const origin = "http://localhost:3116";
test("portal protects requests and allows only authenticated admins to update status", async () => {
  const db = await openDb({ url: null, path: ":memory:" });
  try {
    await seedCms(db);
    const app = await createWebsite(db, { production: false, origin });
    const data = {
      name: "Test client",
      email: "client@example.test",
      service: "Software engineering",
      message: "A customer dashboard for our team.",
      starts: Date.now() + 86400000,
    };
    await request(app).post("/api/portal/requests").send(data).expect(403);
    await request(app)
      .post("/api/portal/requests")
      .set("Origin", origin)
      .send({ ...data, email: "bad" })
      .expect(400);
    const created = (
      await request(app)
        .post("/api/portal/requests")
        .set("Origin", origin)
        .send(data)
        .expect(201)
    ).body;
    const lookup = { id: created.id, access: created.access };
    const row = (
      await request(app)
        .post("/api/portal/status")
        .set("Origin", origin)
        .send(lookup)
        .expect(200)
    ).body;
    assert.equal(row.status, "received");
    assert.equal(row.email, undefined);
    assert.equal(row.message, undefined);
    await request(app)
      .post("/api/portal/status")
      .set("Origin", origin)
      .send({ ...lookup, access: "0".repeat(64) })
      .expect(404);
    const [stored] = await db.query(
      "SELECT access_hash FROM service_requests WHERE id=$1",
      [created.id],
    );
    assert.notEqual(stored.access_hash, created.access);
    await request(app).get("/api/cms/requests").expect(401);
    await createUser(db, "test-admin@example.test", "test-only-password-long");
    const agent = request.agent(app);
    const { csrf } = (
      await agent
        .post("/api/cms/login")
        .set("Origin", origin)
        .send({
          email: "test-admin@example.test",
          password: "test-only-password-long",
        })
        .expect(200)
    ).body;
    await agent
      .patch("/api/cms/requests/" + created.id)
      .set("Origin", origin)
      .send({ status: "reviewing" })
      .expect(403);
    await agent
      .patch("/api/cms/requests/" + created.id)
      .set("Origin", origin)
      .set("X-CSRF-Token", csrf)
      .send({ status: "reviewing" })
      .expect(200);
    const second = (
      await request(app)
        .post("/api/portal/requests")
        .set("Origin", origin)
        .send(data)
        .expect(201)
    ).body;
    const confirmations = await Promise.all(
      [created, second].map((r) =>
        agent
          .patch("/api/cms/appointments/" + r.id)
          .set("Origin", origin)
          .set("X-CSRF-Token", csrf)
          .send({ status: "confirmed" }),
      ),
    );
    assert.deepEqual(confirmations.map((r) => r.status).sort(), [200, 409]);
    await request(app)
      .post("/api/portal/requests")
      .set("Origin", origin)
      .send({ ...data, starts: Date.now() - 1000 })
      .expect(400);
    assert.equal(
      (
        await request(app)
          .post("/api/portal/status")
          .set("Origin", origin)
          .send(lookup)
      ).body.status,
      "reviewing",
    );
    const publicPage = await request(app).get("/portal").expect(200);
    assert.ok(publicPage.headers["content-security-policy"]);
    assert.equal(publicPage.headers["x-content-type-options"], "nosniff");
  } finally {
    await db.close();
  }
});
test("guide uses published content and keeps service context for follow-up", async () => {
  const db = await openDb({ url: null, path: ":memory:" });
  try {
    await seedCms(db);
    const answer = await guideAnswer(db, { question: "backend development" });
    assert.equal(answer.context, "/services/backend-development");
    assert.ok(answer.text.length > 200);
    const follow = await guideAnswer(db, {
      question: "Tell me more",
      context: answer.context,
    });
    assert.equal(follow.context, answer.context);
    assert.notEqual(follow.text, answer.text);
    await db.query("UPDATE documents SET draft=$1 WHERE public_key=$2", [
      JSON.stringify({ title: "UNPUBLISHED SECRET" }),
      "page:/services/backend-development",
    ]);
    assert.ok(
      !(await guideAnswer(db, { question: "backend" })).text.includes(
        "UNPUBLISHED SECRET",
      ),
    );
    const app = await createWebsite(db, { production: false, origin });
    await request(app)
      .post("/api/guide")
      .set("Origin", origin)
      .send({ question: "x".repeat(501) })
      .expect(400);
    await request(app)
      .post("/api/guide")
      .send({ question: "backend" })
      .expect(403);
  } finally {
    await db.close();
  }
});

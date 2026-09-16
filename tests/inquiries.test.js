import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { openDb } from "../cms/server/db.js";
import { createWebsite } from "../server/website.js";
test("inquiry validates, persists trimmed email, rejects foreign origin and never reports success on failed storage", async () => {
  const db = await openDb({ url: null, path: ":memory:" });
  try {
    const app = await createWebsite(db, {
      origin: "http://localhost",
      production: false,
    });
    const body = {
      name: " Test person ",
      email: " person@example.test ",
      message: " Test inquiry ",
    };
    await request(app)
      .post("/api/inquiries")
      .set("Origin", "http://localhost")
      .send(body)
      .expect(201);
    const [row] = await db.query("SELECT * FROM inquiries");
    assert.equal(row.name, "Test person");
    assert.equal(row.email, "person@example.test");
    assert.equal(row.status, "new");
    await request(app)
      .post("/api/inquiries")
      .send({ ...body, message: " " })
      .expect(400);
    await request(app)
      .post("/api/inquiries")
      .set("Origin", "https://foreign.example")
      .send(body)
      .expect(403);
    const page = await request(app).get("/thank-you").expect(200);
    assert.match(page.headers["x-robots-tag"], /noindex/);
    await db.query("DROP TABLE inquiries");
    const failed = await request(app)
      .post("/api/inquiries")
      .send(body)
      .expect(503);
    assert.equal(failed.body.ok, undefined);
    assert.match(failed.body.error, /could not save/);
  } finally {
    await db.close();
  }
});

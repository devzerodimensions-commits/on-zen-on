import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { access } from "node:fs/promises";
import { openDb } from "../cms/server/db.js";
import { seedCms, stableId } from "../server/seed-cms.js";
import { createWebsite } from "../server/website.js";
import { blogArticles } from "../server/blog-pages.js";
test("three editable articles are linked from home and Tech Updates and survive reseeding", async () => {
  const db = await openDb({ url: null, path: ":memory:" });
  try {
    await seedCms(db);
    const app = await createWebsite(db, {
      origin: "http://localhost:3119",
      production: false,
    });
    for (const path of ["/", "/tech-updates"]) {
      const page = (
        await request(app).get("/api/public/page").query({ path }).expect(200)
      ).body;
      const cards = page.blocks.find((b) => b.type === "updates");
      assert.equal(cards.items.length, 3);
      for (const card of cards.items) {
        await access("public" + card.image);
        await request(app).get(card.href).expect(200);
      }
    }
    const site = (await request(app).get("/api/public/site")).body;
    assert.ok(
      site.menus.some((m) =>
        m.items.some(
          (i) => i.label === "Tech updates" && i.href === "/tech-updates",
        ),
      ),
    );
    for (const a of blogArticles) {
      const page = (
        await request(app)
          .get("/api/public/page")
          .query({ path: "/blog/" + a.slug })
      ).body;
      assert.ok(page.blocks.filter((b) => b.type === "about").length >= 5);
      assert.ok(page.seo.title.length <= 70);
      assert.equal(page.blocks[0].image, a.image);
    }
    const id = stableId("blog-" + blogArticles[0].slug);
    const [row] = await db.query("SELECT draft FROM documents WHERE id=$1", [
      id,
    ]);
    const draft = JSON.parse(row.draft);
    draft.blocks[0].heading = "Editor changed article";
    await db.query("UPDATE documents SET draft=$1,published=NULL WHERE id=$2", [
      JSON.stringify(draft),
      id,
    ]);
    await seedCms(db);
    const [after] = await db.query(
      "SELECT draft,published FROM documents WHERE id=$1",
      [id],
    );
    assert.equal(
      JSON.parse(after.draft).blocks[0].heading,
      "Editor changed article",
    );
    assert.equal(after.published, null);
  } finally {
    await db.close();
  }
});

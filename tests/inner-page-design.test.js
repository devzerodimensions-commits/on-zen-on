import { test } from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../cms/server/db.js";
import { seedCms } from "../server/seed-cms.js";
import { migrateInnerPageDesign } from "../server/inner-page-design.js";
import { defaultSectionCss } from "../shared/theme.js";

test("inner-page design preserves custom draft choices and runs once", async () => {
  const db = await openDb({ url: null, path: ":memory:" });
  try {
    await seedCms(db);
    const [row] = await db.query(
      "SELECT * FROM documents WHERE public_key='page:/industries'",
    );
    const draft = JSON.parse(row.draft);
    const published = JSON.parse(row.published);
    draft.blocks[1].tone = "purple";
    draft.blocks[1].items[0].icon = "phone";
    published.blocks[1].tone = "white";
    delete published.blocks[1].items[0].icon;
    await db.query("UPDATE documents SET draft=$1,published=$2 WHERE id=$3", [
      JSON.stringify(draft),
      JSON.stringify(published),
      row.id,
    ]);
    await db.query("DELETE FROM cms_migrations WHERE id=$1", [
      "inner-page-design-v2",
    ]);
    await migrateInnerPageDesign(db);
    const [after] = await db.query("SELECT * FROM documents WHERE id=$1", [
      row.id,
    ]);
    assert.equal(JSON.parse(after.draft).blocks[1].tone, "purple");
    assert.equal(JSON.parse(after.draft).blocks[1].items[0].icon, "phone");
    assert.equal(JSON.parse(after.published).blocks[1].tone, "green");
    assert.ok(JSON.parse(after.published).blocks[1].items[0].icon);
    await migrateInnerPageDesign(db);
    const [again] = await db.query("SELECT * FROM documents WHERE id=$1", [
      row.id,
    ]);
    assert.deepEqual(again, after);
  } finally {
    await db.close();
  }
});

test("section colors remain available without enabling a custom global theme", () => {
  assert.match(defaultSectionCss, /cms-tone-green/);
  assert.match(defaultSectionCss, /cms-tone-yellow/);
  assert.match(defaultSectionCss, /oz-service-card/);
  assert.ok(
    defaultSectionCss.split("\n").every((line) => line.includes(".cms-tone-")),
  );
});

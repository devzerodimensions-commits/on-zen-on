import { test } from "node:test";
import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { openDb } from "../cms/server/db.js";
import { seedCms } from "../server/seed-cms.js";
import { migratePortfolioShowcase } from "../server/portfolio-showcase.js";
test("portfolio publishes nine distinct editable previews and does not reseed edits", async () => {
 const db = await openDb({url:null,path:":memory:"});
 try {
  await seedCms(db);
  const [row] = await db.query("SELECT * FROM documents WHERE public_key='page:/portfolio'");
  const page = JSON.parse(row.published);
  const items = page.blocks.find(b=>b.type==="casestudies").items;
  assert.equal(items.length,9);
  assert.equal(new Set(items.map(i=>i.image)).size,9);
  for(const icon of ["code","phone","server"])assert.equal(items.filter(i=>i.icon===icon).length,3);
  for(const item of items)await access(`public${item.image}`);
  assert.match(page.blocks[0].body,/concepts/);
  await migratePortfolioShowcase(db);
  const [after]=await db.query("SELECT * FROM documents WHERE id=$1",[row.id]);
  assert.deepEqual(after,row);
 } finally {await db.close();}
});

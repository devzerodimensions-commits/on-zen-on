import {test} from "node:test";
import assert from "node:assert/strict";
import {existsSync} from "node:fs";
import {openDb} from "../cms/server/db.js";
import {seedCms,stableId} from "../server/seed-cms.js";
import {applyServiceSectionImages,migrateServiceSectionImages} from "../server/service-section-images.js";
import visuals from "../shared/service-section-images.json" with {type:"json"};

test("all service image placements are unique and migration preserves custom edits",async()=>{
 const db=await openDb({url:null,path:":memory:"});
 try {
  await seedCms(db);
  const rows=await db.query("SELECT draft FROM documents WHERE kind='page'");
  const seen=new Set();
  for(const row of rows){
   const page=JSON.parse(row.draft);
   if(!page.path.startsWith("/services"))continue;
   for(const b of page.blocks)for(const item of [b,...(b.items||[])]){
    if(!item.image)continue;
    assert.ok(!seen.has(item.image),page.path+" repeats "+item.image);
    assert.ok(existsSync("public"+item.image),item.image+" missing");
    seen.add(item.image);
   }
  }
  const id=stableId("service-backend-development");
  const [row]=await db.query("SELECT draft FROM documents WHERE id=$1",[id]);
  const legacy=JSON.parse(row.draft);
  for(const v of visuals.filter(v=>v.path===legacy.path)){
   const b=legacy.blocks.find(b=>b.id===v.blockId);
   const target=v.index<0?b:b.items.find(i=>i.title===v.title);
   target.image=v.original;
  }
  const draft=structuredClone(legacy);
  draft.blocks[0].image="/assets/custom-upload.webp";
  draft.blocks[0].heading="My custom headline";
  const items=draft.blocks.find(b=>b.anchor==="included-services").items;
  items.reverse();items[0].image="/assets/custom-card.webp";
  const savedTitle=items[0].title;
  await db.query("UPDATE documents SET draft=$1,published=$2 WHERE id=$3",[JSON.stringify(draft),JSON.stringify(legacy),id]);
  await db.query("DELETE FROM cms_migrations WHERE id=$1",["service-section-images-v1"]);
  await migrateServiceSectionImages(db);
  const [after]=await db.query("SELECT draft,published,version FROM documents WHERE id=$1",[id]);
  const updated=JSON.parse(after.draft);
  assert.equal(updated.blocks[0].image,"/assets/custom-upload.webp");
  assert.equal(updated.blocks[0].heading,"My custom headline");
  assert.equal(updated.blocks.find(b=>b.anchor==="included-services").items.find(i=>i.title===savedTitle).image,"/assets/custom-card.webp");
  assert.equal(applyServiceSectionImages(JSON.parse(after.published)),false);
  await migrateServiceSectionImages(db);
  const [again]=await db.query("SELECT version FROM documents WHERE id=$1",[id]);
  assert.equal(again.version,after.version);
 }finally{await db.close();}
});

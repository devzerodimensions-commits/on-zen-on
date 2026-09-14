import {test} from "node:test";
import assert from "node:assert/strict";
import {openDb} from "../cms/server/db.js";
import {seedCms,stableId} from "../server/seed-cms.js";
import {migrateMarketingImages} from "../server/marketing-images.js";
import {serviceOfferings} from "../server/service-catalog-content.js";
import photos from "../shared/service-photos.json" with {type:"json"};
import images from "../shared/marketing-offering-images.json" with {type:"json"};

test("marketing image migration matches titles, preserves custom uploads and runs once",async()=>{
 const db=await openDb({url:null,path:":memory:"});
 try {
  await seedCms(db);
  const id=stableId("service-digital-marketing");
  const [row]=await db.query("SELECT draft FROM documents WHERE id=$1",[id]);
  const page=JSON.parse(row.draft);
  const items=page.blocks.find(b=>b.anchor==="included-services").items;
  assert.equal(new Set(items.map(i=>i.image)).size,12);
  for(const item of items){
   const offering=serviceOfferings["digital-marketing"].find(o=>o[0]===item.title);
   assert.equal(item.image,images[item.title].image);
   item.image=photos[offering[4]].image;
  }
  const draft=structuredClone(page);
  draft.blocks.find(b=>b.anchor==="included-services").items[0].image="/assets/custom-upload.webp";
  await db.query("UPDATE documents SET draft=$1,published=$2 WHERE id=$3",[JSON.stringify(draft),JSON.stringify(page),id]);
  await db.query("DELETE FROM cms_migrations WHERE id=$1",["marketing-offering-images-v1"]);
  await migrateMarketingImages(db);
  const [after]=await db.query("SELECT draft,published,version FROM documents WHERE id=$1",[id]);
  assert.equal(JSON.parse(after.draft).blocks.find(b=>b.anchor==="included-services").items[0].image,"/assets/custom-upload.webp");
  for(const item of JSON.parse(after.published).blocks.find(b=>b.anchor==="included-services").items) assert.equal(item.image,images[item.title].image);
  await migrateMarketingImages(db);
  const [again]=await db.query("SELECT version FROM documents WHERE id=$1",[id]);
  assert.equal(again.version,after.version);
 } finally {await db.close();}
});

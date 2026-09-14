import {test} from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import {openDb} from "../cms/server/db.js";
import {seedCms,stableId} from "../server/seed-cms.js";
import {createWebsite} from "../server/website.js";
import {mainServices,mainServiceLinks} from "../shared/main-services.js";
import {migrateMainServices} from "../server/main-service-pages.js";

test("four main homepage cards link to published pages and preserve custom edits",async()=>{
 const db=await openDb({url:null,path:":memory:"});
 try{
  await seedCms(db);
  const app=await createWebsite(db,{production:false,origin:"http://localhost:3112"});
  const home=(await request(app).get("/api/public/page?path=/").expect(200)).body;
  const cards=home.blocks.find(b=>b.template==="services");
  for(const [key,href] of Object.entries(mainServiceLinks))assert.equal(cards.fields[key],href);
  for(const service of mainServices){
   const path="/services/"+service.slug;
   await request(app).get(path).expect(200);
   const page=(await request(app).get("/api/public/page").query({path}).expect(200)).body;
   assert.equal(page.seo.canonical,path);
   for(const block of page.blocks.filter(b=>b.anchor==="specialist-services"))
    for(const item of block.items)await request(app).get(item.href).expect(200);
  }
  const id=stableId("home");
  const draft=structuredClone(home);const b=draft.blocks.find(b=>b.template==="services");
  b.fields.link_8="/custom-service";b.fields.link_13="/#contact";b.fields.text_6="Custom title";
  const published=structuredClone(home);
  published.blocks.find(b=>b.template==="services").fields.link_8="/#contact";
  await db.query("UPDATE documents SET draft=$1,published=$2 WHERE id=$3",[JSON.stringify(draft),JSON.stringify(published),id]);
  await db.query("DELETE FROM cms_migrations WHERE id=$1",["main-service-links-v1"]);
  await migrateMainServices(db,stableId);
  const [updated]=await db.query("SELECT draft,published,version FROM documents WHERE id=$1",[id]);
  const updatedFields=JSON.parse(updated.draft).blocks.find(b=>b.template==="services").fields;
  assert.equal(updatedFields.link_8,"/custom-service");assert.equal(updatedFields.text_6,"Custom title");
  assert.equal(updatedFields.link_13,mainServiceLinks.link_13);
  assert.equal(JSON.parse(updated.published).blocks.find(b=>b.template==="services").fields.link_8,mainServiceLinks.link_8);
  await seedCms(db);
  const [again]=await db.query("SELECT draft,version FROM documents WHERE id=$1",[id]);
  assert.equal(again.draft,updated.draft);assert.equal(again.version,updated.version);
 }finally{await db.close();}
});

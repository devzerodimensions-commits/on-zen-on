import {test} from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import sharp from "sharp";
import {openDb} from "../cms/server/db.js";
import {seedCms} from "../server/seed-cms.js";
import {createWebsite} from "../server/website.js";
import {createUser} from "../cms/server/auth.js";

test("every service section and card accepts uploaded images and publishes without a deployment",async()=>{
 const db=await openDb({url:null,path:":memory:"});
 try{
  await seedCms(db);await createUser(db,"service-editor@example.test","local-test-password-only");
  const origin="http://localhost:3110",app=await createWebsite(db,{origin,production:false}),admin=request.agent(app);
  const login=await admin.post("/api/cms/login").set("Origin",origin).send({email:"service-editor@example.test",password:"local-test-password-only"}).expect(200);
  const csrf=login.body.csrf;
  const image=await sharp({create:{width:10,height:10,channels:3,background:"#184e36"}}).png().toBuffer();
  const upload=await admin.post("/api/cms/media").set("Origin",origin).set("X-CSRF-Token",csrf).field("alt","Replacement service image").attach("file",image,"replacement.png").expect(201);
  const url=upload.body.url;
  const docs=(await admin.get("/api/cms/documents").expect(200)).body.filter(d=>d.kind==="page"&&d.draft.path.startsWith("/services"));
  assert.equal(docs.length,11);
  for(const doc of docs){
   const data=structuredClone(doc.draft);
   for(const b of data.blocks){
    b.heading="Edited "+b.heading;b.body="Updated section content";b.image=url;b.alt="New section photo";
    b.imageCaption="Custom caption";b.imageCaptionStrong="Custom emphasis";b.cardLinkLabel="Learn more";
    for(const item of b.items){item.image=url;item.alt="New card photo";item.text="Updated card content";item.icon="cloud";}
   }
   const saved=await admin.put("/api/cms/documents/"+doc.id).set("Origin",origin).set("X-CSRF-Token",csrf).send({version:doc.version,data}).expect(200);
   const before=(await request(app).get("/api/public/page").query({path:data.path})).body;
   assert.notEqual(before.blocks[0].image,url);
   await admin.post("/api/cms/documents/"+doc.id+"/publish").set("Origin",origin).set("X-CSRF-Token",csrf).send({version:saved.body.version}).expect(200);
   const live=(await request(app).get("/api/public/page").query({path:data.path})).body;
   assert.deepEqual(live.blocks,saved.body.draft.blocks);
  }
  await seedCms(db);
  for(const doc of docs){
   const live=(await request(app).get("/api/public/page").query({path:doc.draft.path})).body;
   assert.ok(live.blocks.every(b=>b.image===url&&b.body==="Updated section content"));
  }
  await request(app).get(url).expect(200).expect("Content-Type",/webp/);
 }finally{await db.close();}
});

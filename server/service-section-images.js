import visuals from "../shared/service-section-images.json" with {type:"json"};

export function applyServiceSectionImages(page) {
 let changed=false;
 for(const visual of visuals) {
  if(page.path!==visual.path) continue;
  const block=page.blocks.find(b=>b.id===visual.blockId);
  if(!block) continue;
  const target=visual.index<0 ? block : block.items?.find(item=>item.title===visual.title && item.image===visual.original);
  if(!target || target.image!==visual.original) continue;
  target.image=visual.image;
  target.alt=visual.alt;
  if(block.type==="hero" && visual.index<0 && page.seo?.ogImage===visual.original) page.seo.ogImage=visual.image;
  changed=true;
 }
 return changed;
}

export async function migrateServiceSectionImages(db) {
 await db.transaction(async q=>{
  const marker=await q.query("INSERT INTO cms_migrations (id) VALUES ($1) ON CONFLICT(id) DO NOTHING RETURNING id",["service-section-images-v1"]);
  if(!marker.length) return;
  const rows=await q.query("SELECT id,draft,published FROM documents WHERE kind='page'");
  for(const row of rows) {
   const next={...row}; let changed=false;
   for(const field of ["draft","published"]) {
    if(!row[field]) continue;
    const page=JSON.parse(row[field]);
    if(applyServiceSectionImages(page)){next[field]=JSON.stringify(page);changed=true;}
   }
   if(changed) await q.query("UPDATE documents SET draft=$1,published=$2,version=version+1,updated=$3 WHERE id=$4",[next.draft,next.published,Date.now(),row.id]);
  }
 });
}

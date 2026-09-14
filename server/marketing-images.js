import images from "../shared/marketing-offering-images.json" with { type: "json" };
import photos from "../shared/service-photos.json" with { type: "json" };
import { serviceOfferings } from "./service-catalog-content.js";

export async function migrateMarketingImages(db) {
  await db.transaction(async q => {
    const marker = await q.query("INSERT INTO cms_migrations (id) VALUES ($1) ON CONFLICT(id) DO NOTHING RETURNING id", ["marketing-offering-images-v1"]);
    if (!marker.length) return;
    const rows = await q.query("SELECT id,draft,published FROM documents WHERE kind='page'");
    const originals = new Map(serviceOfferings["digital-marketing"].map(([title,,,,photo]) => [title, photos[photo].image]));
    for (const row of rows) {
      const next = {...row};
      let changed = false;
      for (const field of ["draft", "published"]) {
        if (!row[field]) continue;
        const page = JSON.parse(row[field]);
        if (page.path !== "/services/digital-marketing") continue;
        let updated = false;
        for (const block of page.blocks) {
          if (block.anchor !== "included-services") continue;
          for (const item of block.items || []) {
            if (images[item.title] && item.image === originals.get(item.title)) {
              Object.assign(item, images[item.title]);
              updated = true;
            }
          }
        }
        if (updated) { next[field] = JSON.stringify(page); changed = true; }
      }
      if (changed) await q.query("UPDATE documents SET draft=$1,published=$2,version=version+1,updated=$3 WHERE id=$4", [next.draft,next.published,Date.now(),row.id]);
    }
  });
}

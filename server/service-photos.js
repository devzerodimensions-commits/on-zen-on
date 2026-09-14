import photos from "../shared/service-photos.json" with { type: "json" };
import { serviceForTitle } from "../shared/services.js";

const illustrations = new Set([
  "/assets/software-laptop-3d.png",
  "/assets/portfolio-floating-sites.png",
  "/assets/hero-orbit.png",
]);

export function applyServicePhotos(page, eligibleImages = illustrations) {
  if (page.path !== "/services" && !page.path?.startsWith("/services/"))
    return false;
  const photo =
    photos[page.path === "/services" ? "overview" : page.path.split("/")[2]];
  if (!photo) return false;
  let changed = false;
  const replace = (item, replacement) => {
    if (replacement && eligibleImages.has(item.image)) {
      item.image = replacement.image;
      item.alt = replacement.alt;
      changed = true;
    }
  };
  for (const block of page.blocks) {
    replace(block, photo);
    for (const item of block.items || []) {
      const service = serviceForTitle(item.title);
      replace(item, service ? photos[service.slug] : photo);
    }
  }
  if (eligibleImages.has(page.seo?.ogImage)) {
    page.seo.ogImage = photo.image;
    changed = true;
  }
  return changed;
}

export async function migrateServicePhotos(db, migrationId = "service-photos-v1", eligibleImages = illustrations) {
  await db.query(
    "CREATE TABLE IF NOT EXISTS cms_migrations (id TEXT PRIMARY KEY)",
  );
  await db.transaction(async (q) => {
    const marker = await q.query(
      "INSERT INTO cms_migrations (id) VALUES ($1) ON CONFLICT(id) DO NOTHING RETURNING id",
      [migrationId],
    );
    if (!marker.length) return;
    const rows = await q.query(
      "SELECT id,draft,published FROM documents WHERE kind='page'",
    );
    for (const row of rows) {
      let changed = false;
      const values = {};
      for (const field of ["draft", "published"]) {
        values[field] = row[field];
        if (!row[field]) continue;
        const page = JSON.parse(row[field]);
        if (applyServicePhotos(page, eligibleImages)) {
          values[field] = JSON.stringify(page);
          changed = true;
        }
      }
      if (changed)
        await q.query(
          "UPDATE documents SET draft=$1,published=$2,version=version+1,updated=$3 WHERE id=$4",
          [values.draft, values.published, Date.now(), row.id],
        );
    }
  });
}

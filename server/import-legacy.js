import { stableId } from "./seed-cms.js";
import { pageSchema, blankBlock } from "../cms/shared/content.js";
// Existing content was not wired to public routes. Preserve it as editable drafts.
export async function importLegacy(db) {
  let rows;
  try {
    rows = await db.query(
      "SELECT id,type,title,slug,excerpt,body FROM content_items",
    );
  } catch (e) {
    if (e.code === "42P01" || String(e.message).includes("no such table"))
      return;
    throw e;
  }
  for (const row of rows) {
    const path = `${row.type === "post" ? "/blog" : ""}/${row.slug}`;
    const data = {
      schemaVersion: 1,
      title: row.title,
      path,
      seo: {
        title: row.title.slice(0, 70),
        description: (row.excerpt || row.title).slice(0, 170),
        canonical: "",
        ogImage: "",
        noindex: false,
      },
      blocks: [
        {
          ...blankBlock("about"),
          heading: row.title,
          body: String(row.body || row.excerpt || "").slice(0, 15000),
        },
      ],
    };
    if (!pageSchema.safeParse(data).success) {
      console.warn(
        `Legacy content ${row.id} retained in content_items; its path needs manual review.`,
      );
      continue;
    }
    await db.query(
      "INSERT INTO documents (id,kind,draft,updated) VALUES ($1,$2,$3,$4) ON CONFLICT(id) DO NOTHING",
      [stableId(`legacy-${row.id}`), "page", JSON.stringify(data), Date.now()],
    );
  }
}

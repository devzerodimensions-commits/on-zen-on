import { schemas } from "../cms/shared/content.js";
const previous = [
  "white",
  "tint",
  "white",
  "yellow",
  "white",
  "tint",
  "white",
  "brand",
];
const palette = [
  "green",
  "white",
  "yellow",
  "tint",
  "green",
  "white",
  "yellow",
  "brand",
];
function icon(title) {
  const t = title.toLowerCase();
  if (/phone|mobile|booking/.test(t)) return "phone";
  if (/secure|health|finance|protect/.test(t)) return "shield";
  if (/cloud|travel|canada|australia|india/.test(t)) return "cloud";
  if (/design|education|research/.test(t)) return "design";
  if (/backend|manufactur|database/.test(t)) return "server";
  if (/marketing|commerce|growth|estate|startup/.test(t)) return "growth";
  if (/email|api|software|saas/.test(t)) return "code";
  return "spark";
}
export async function migrateInnerPageDesign(db) {
  await db.transaction(async (q) => {
    const done = await q.query(
      "INSERT INTO cms_migrations(id)VALUES($1)ON CONFLICT(id)DO NOTHING RETURNING id",
      ["inner-page-design-v2"],
    );
    if (!done.length) return;
    for (const row of await q.query(
      "SELECT id,draft,published FROM documents WHERE kind='page'",
    )) {
      const next = { ...row };
      let changed = false;
      for (const field of ["draft", "published"]) {
        if (!row[field]) continue;
        const page = JSON.parse(row[field]);
        if (
          !["/services", "/industries", "/contact"].includes(page.path) &&
          !page.path.startsWith("/services/")
        )
          continue;
        let touched = false;
        page.blocks.forEach((b, i) => {
          if (b.type === "template" || b.type === "shared") return;
          if (
            i > 0 &&
            (!b.tone ||
              b.tone === "default" ||
              b.tone === previous[(i - 1) % previous.length])
          ) {
            b.tone =
              b.type === "contact" && page.path !== "/contact"
                ? "green"
                : b.type === "cta"
                  ? "yellow"
                  : b.type === "faq"
                    ? "white"
                    : palette[(i - 1) % palette.length];
            touched = true;
          }
          for (const item of b.items || []) {
            if (!item.icon) {
              item.icon = icon(item.title);
              touched = true;
            }
          }
        });
        if (touched) {
          next[field] = JSON.stringify(schemas.page.parse(page));
          changed = true;
        }
      }
      if (changed)
        await q.query(
          "UPDATE documents SET draft=$1,published=$2,version=version+1,updated=$3 WHERE id=$4",
          [next.draft, next.published, Date.now(), row.id],
        );
    }
  });
}

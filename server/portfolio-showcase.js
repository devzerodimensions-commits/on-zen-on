import { schemas } from "../cms/shared/content.js";
import { portfolioProjects } from "../shared/portfolio-projects.js";
export async function migratePortfolioShowcase(db) {
  await db.transaction(async (q) => {
    const done = await q.query(
      "INSERT INTO cms_migrations(id)VALUES($1)ON CONFLICT(id)DO NOTHING RETURNING id",
      ["portfolio-showcase-v2"],
    );
    if (!done.length) return;
    const rows = await q.query(
      "SELECT id,draft,published FROM documents WHERE public_key='page:/portfolio'",
    );
    for (const row of rows) {
      const next = { ...row };
      let changed = false;
      for (const field of ["draft", "published"]) {
        if (!row[field]) continue;
        const page = JSON.parse(row[field]);
        const gallery = page.blocks.find(
          (b) =>
            b.type === "casestudies" &&
            ((b.heading === "Selected project builds" &&
              b.items.length === 6 && b.items[0].title === "Service business website") ||
             (b.heading === "The kinds of projects we build" &&
              b.items.length === 4 && b.items[0].title === "Business website with enquiry and booking")),
        );
        if (!gallery) continue;
        gallery.heading = "Nine ideas. Endless possibilities.";
        gallery.body =
          "Explore original website, application and software concepts. Open a preview to see the interface in detail, then talk to us about a product built around your business.";
        gallery.tone = "white";
        gallery.items = portfolioProjects.map(
          ([id, title, type, tag, text, ink, bg, cta, headline, icon]) => ({
            title,
            text,
            icon,
            image: `/assets/portfolio-${id}.svg`,
            alt: `${title} ${type.toLowerCase()} interface design concept`,
            href: "/contact",
          }),
        );
        const lead = page.blocks.find((b) => b.type === "hero");
        if (lead?.heading === "The work we take on.") {
          lead.heading = "Digital ideas, brought to life.";
          lead.eyebrow = "THE CONCEPT COLLECTION";
          lead.body =
            "A closer look at what your next digital product could become. Discover nine original design concepts across websites, mobile applications and business software.";
          lead.buttonLabel = "Explore the collection";
          lead.href = "#types";
          lead.image = "/assets/portfolio-flow.svg";
          lead.alt = "Flowdesk CRM software dashboard concept";
        }
        next[field] = JSON.stringify(schemas.page.parse(page));
        changed = true;
      }
      if (changed)
        await q.query(
          "UPDATE documents SET draft=$1,published=$2,version=version+1,updated=$3 WHERE id=$4",
          [next.draft, next.published, Date.now(), row.id],
        );
    }
  });
}

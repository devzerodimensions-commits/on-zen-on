const escape = (v) =>
  String(v).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export function pageShell(html, page, origin) {
  const canonical = new URL(page.seo.canonical || page.path, origin).href;
  const tags = [
    `<title>${escape(page.seo.title)}</title>`,
    `<meta name="description" content="${escape(page.seo.description)}">`,
    `<meta name="robots" content="${page.seo.noindex ? "noindex,nofollow" : "index,follow"}">`,
    `<link rel="canonical" href="${escape(canonical)}">`,
    `<meta property="og:title" content="${escape(page.seo.title)}">`,
    `<meta property="og:description" content="${escape(page.seo.description)}">`,
    `<meta property="og:url" content="${escape(canonical)}">`,
    `<meta property="og:type" content="website">`,
  ];
  if (page.seo.ogImage)
    tags.push(
      `<meta property="og:image" content="${escape(new URL(page.seo.ogImage, origin).href)}">`,
    );
  return html
    .replace(/<title>[\s\S]*?<\/title>/gi, "")
    .replace(
      /<meta\b[^>]*(?:name=["'](?:description|robots)["']|property=["']og:[^"']+["'])[^>]*>/gi,
      "",
    )
    .replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi, "")
    .replace("</head>", `${tags.join("\n")}\n</head>`);
}
// Mount this BEFORE the existing SPA fallback, AFTER /api and static assets.
// Only published CMS pages are handled; existing uncatalogued routes use next().
export function cmsShellHandler(db, { html, origin }) {
  return async (req, res, next) => {
    try {
      if (req.method !== "GET") return next();
      const [row] = await db.query(
        "SELECT published FROM documents WHERE public_key=$1 AND published IS NOT NULL",
        [`page:${req.path}`],
      );
      if (!row) return next();
      const page = JSON.parse(row.published);
      res
        .set("Cache-Control", "no-cache")
        .type("html")
        .send(pageShell(html, page, origin));
    } catch (e) {
      next(e);
    }
  };
}
export function sitemapHandler(db, origin) {
  return async (_req, res, next) => {
    try {
      const rows = await db.query(
        "SELECT published FROM documents WHERE kind='page' AND published IS NOT NULL",
      );
      const urls = rows
        .map((r) => JSON.parse(r.published))
        .filter((p) => !p.seo.noindex)
        .map(
          (p) =>
            `<url><loc>${escape(new URL(p.path, origin).href)}</loc></url>`,
        )
        .join("");
      res
        .type("application/xml")
        .send(
          `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
        );
    } catch (e) {
      next(e);
    }
  };
}

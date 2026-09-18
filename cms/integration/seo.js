const escape = (v) =>
  String(v).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
/* Structured data (schema.org JSON-LD). Search engines and AI assistants read
   this to understand who the business is, what it sells and what it answers,
   so it is built from the page content already published rather than typed by
   hand anywhere. */
export function structuredData(page, settings, origin) {
  const url = new URL(page.path, origin).href;
  const name = settings?.siteName || "On Zen On";
  const blocks = (page.blocks || []).filter((b) => !b.hidden);
  const organization = {
    "@type": "Organization",
    "@id": `${origin}/#organization`,
    name,
    url: `${origin}/`,
    logo: {
      "@type": "ImageObject",
      url: new URL("/assets/on-zen-on-official-logo.png", origin).href,
    },
    ...(settings?.tagline ? { slogan: settings.tagline } : {}),
    ...(settings?.footerText ? { description: settings.footerText } : {}),
    ...(settings?.email ? { email: settings.email } : {}),
    ...(settings?.phone ? { telephone: settings.phone } : {}),
    ...(settings?.social?.length
      ? { sameAs: settings.social.map((s) => s.url).filter(Boolean) }
      : {}),
  };
  const graph = [
    organization,
    {
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      url: `${origin}/`,
      name,
      publisher: { "@id": `${origin}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: page.seo.title || page.title,
      ...(page.seo.description ? { description: page.seo.description } : {}),
      isPartOf: { "@id": `${origin}/#website` },
      ...(page.seo.ogImage
        ? {
            primaryImageOfPage: {
              "@type": "ImageObject",
              url: new URL(page.seo.ogImage, origin).href,
            },
          }
        : {}),
    },
  ];
  if (page.path !== "/") {
    const parts = page.path.split("/").filter(Boolean);
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
        ...parts.map((segment, i) => ({
          "@type": "ListItem",
          position: i + 2,
          name:
            i === parts.length - 1
              ? page.title || segment
              : segment
                  .replace(/-/g, " ")
                  .replace(/^./, (c) => c.toUpperCase()),
          item: new URL(`/${parts.slice(0, i + 1).join("/")}`, origin).href,
        })),
      ],
    });
  }
  const questions = blocks
    .filter((b) => b.type === "faq")
    .flatMap((b) => b.items || [])
    .filter((item) => item.title && item.text)
    .slice(0, 50);
  if (questions.length)
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: questions.map((item) => ({
        "@type": "Question",
        name: item.title,
        acceptedAnswer: { "@type": "Answer", text: item.text },
      })),
    });
  const reviews = blocks
    .filter((b) => b.type === "testimonials")
    .flatMap((b) => b.items || [])
    .filter((item) => item.title && item.text)
    .slice(0, 25);
  if (reviews.length)
    graph.push(
      ...reviews.map((item, i) => ({
        "@type": "Review",
        "@id": `${url}#review-${i + 1}`,
        itemReviewed: { "@id": `${origin}/#organization` },
        author: { "@type": "Person", name: item.title },
        reviewBody: item.text,
      })),
    );
  if (page.path.startsWith("/services/"))
    graph.push({
      "@type": "Service",
      "@id": `${url}#service`,
      name: page.title,
      ...(page.seo.description ? { description: page.seo.description } : {}),
      provider: { "@id": `${origin}/#organization` },
      url,
    });
  return { "@context": "https://schema.org", "@graph": graph };
}
export function pageShell(html, page, origin, settings) {
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
  /* "<" is escaped so no published text can close the script element early. */
  tags.push(
    `<script type="application/ld+json">${JSON.stringify(
      structuredData(page, settings, origin),
    ).replace(/</g, String.raw`\u003c`)}</script>`,
  );
  return html
    .replace(/<title>[\s\S]*?<\/title>/gi, "")
    .replace(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,
      "",
    )
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

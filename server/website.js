import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { mountGuide } from "./service-guide.js";
import { mountPortal, portalTable } from "./portal.js";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { z } from "zod";
import { createApp } from "../cms/server/app.js";
import { pageShell, sitemapHandler } from "../cms/integration/seo.js";
export async function createWebsite(
  db,
  {
    origin = process.env.APP_ORIGIN ||
      process.env.RENDER_EXTERNAL_URL ||
      `http://localhost:${process.env.PORT || 3001}`,
    production = process.env.NODE_ENV === "production",
  } = {},
) {
  const app = express();
  await portalTable(db);
  app.disable("x-powered-by");
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: { "upgrade-insecure-requests": production ? [] : null },
      },
    }),
  );
  app.set(
    "trust proxy",
    Number(process.env.TRUST_PROXY_HOPS || (production ? "1" : "0")),
  );
  if (!production && !process.env.DATABASE_URL)
    await db.query(
      "CREATE TABLE IF NOT EXISTS inquiries (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,email TEXT NOT NULL,message TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'new',notes TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)",
    );
  const cms = await createApp(db, {
    origin,
    production,
    dist: resolve("dist/admin"),
  });
  app.use((req, res, next) =>
    /^\/(admin|api\/cms|api\/public|media)(\/|$)/.test(req.path)
      ? cms(req, res, next)
      : next(),
  );
  app.use("/api/admin", (_req, res) =>
    res
      .status(410)
      .json({ error: "The old admin API has been retired. Use /admin/." }),
  );
  app.get("/api/health", async (_req, res) => {
    try {
      await db.query("SELECT 1");
      res.json({
        ok: true,
        version: "cms-1",
        commit: process.env.RENDER_GIT_COMMIT || "local",
      });
    } catch {
      res.status(503).json({ ok: false });
    }
  });
  app.post(
    "/api/inquiries",
    rateLimit({
      windowMs: 15 * 60000,
      limit: 10,
      standardHeaders: true,
      legacyHeaders: false,
    }),
    express.json({ limit: "16kb" }),
    async (req, res) => {
      if (req.get("origin") && req.get("origin") !== origin)
        return res.status(403).json({ error: "Origin not allowed" });
      const result = z
        .object({
          name: z.string().trim().min(1).max(150),
          email: z.string().trim().max(254).pipe(z.email()),
          message: z.string().trim().min(1).max(10000),
        })
        .strict()
        .safeParse(req.body);
      if (!result.success)
        return res.status(400).json({
          error: "Enter your name, a valid email address and a message.",
        });
      try {
        const { name, email, message } = result.data;
        await db.query(
          "INSERT INTO inquiries (name,email,message) VALUES ($1,$2,$3)",
          [name, email, message],
        );
        res.status(201).json({ ok: true });
      } catch (err) {
        console.error("Inquiry persistence failed", {
          code: err.code || "unknown",
        });
        res
          .status(503)
          .json({ error: "We could not save your inquiry. Please try again." });
      }
    },
  );
  mountGuide(app, db, origin);
  mountPortal(app, db, origin);
  app.get("/thank-you", async (_req, res) =>
    res
      .set({ "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" })
      .type("html")
      .send(
        (await readFile("dist/index.html", "utf8")).replace(
          /<title>.*?<\/title>/,
          "<title>Thank you | On Zen On</title>",
        ),
      ),
  );
  app.get("/portal", async (_req, res) =>
    res
      .set({ "Cache-Control": "no-store", "X-Robots-Tag": "noindex" })
      .type("html")
      .send(await readFile("dist/index.html", "utf8")),
  );
  app.get("/sitemap.xml", sitemapHandler(db, origin));
  app.get("/robots.txt", (_req, res) =>
    res
      .type("text")
      .send(
        `User-agent: *\nDisallow: /admin/\nDisallow: /_preview/\nSitemap: ${origin}/sitemap.xml\n`,
      ),
  );
  app.use(express.static(resolve("dist"), { index: false }));
  app.get("/_preview/:id", async (req, res) => {
    if (!z.string().uuid().safeParse(req.params.id).success)
      return res.sendStatus(404);
    res
      .set({ "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" })
      .type("html")
      .send(await readFile("dist/index.html", "utf8"));
  });
  app.get("/{*path}", async (req, res) => {
    const [row] = await db.query(
      "SELECT published FROM documents WHERE public_key=$1 AND published IS NOT NULL",
      [`page:${req.path}`],
    );
    const html = await readFile("dist/index.html", "utf8");
    if (!row) return res.status(404).type("html").send(html);
    /* Company details feed the Organization entry in the page's structured data. */
    const [config] = await db.query(
      "SELECT published FROM documents WHERE public_key='settings:global' AND published IS NOT NULL",
    );
    res
      .set("Cache-Control", "no-cache")
      .type("html")
      .send(
        pageShell(
          html,
          JSON.parse(row.published),
          origin,
          config ? JSON.parse(config.published) : null,
        ),
      );
  });
  app.use((err, _req, res, _next) => {
    console.error(err.message);
    res.status(500).json({ error: "Request could not be completed" });
  });
  return app;
}

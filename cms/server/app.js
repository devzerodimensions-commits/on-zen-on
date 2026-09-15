import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import multer from "multer";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";
import { z } from "zod";
import { schemas, pageSchema } from "../shared/content.js";
import {
  token,
  digest,
  hashPassword,
  verifyPassword,
  createUser,
} from "./auth.js";
const fail = (status, message) => Object.assign(new Error(message), { status });
const idSchema = z.string().uuid();
const payload = z
  .object({ version: z.number().int().positive(), data: z.unknown() })
  .strict();
const versionSchema = z
  .object({ version: z.number().int().positive() })
  .strict();
const decode = (row) => ({
  ...row,
  draft: JSON.parse(row.draft),
  published: row.published ? JSON.parse(row.published) : null,
});
export async function createApp(
  db,
  {
    origin = process.env.APP_ORIGIN || "http://localhost:3100",
    mediaDir = process.env.MEDIA_DIR || "./data/media",
    production = process.env.NODE_ENV === "production",
    dist = resolve("dist"),
  } = {},
) {
  if (
    production &&
    (!origin.startsWith("https://") || !process.env.DATABASE_URL)
  )
    throw Error("Production requires HTTPS APP_ORIGIN and DATABASE_URL");
  const app = express();
  app.set("trust proxy", Number(process.env.TRUST_PROXY_HOPS || (production ? 1 : 0)));
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: { "upgrade-insecure-requests": production ? [] : null },
      },
    }),
  );
  app.use(express.json({ limit: "512kb" }), cookieParser());
  app.use("/api/cms", (_req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });
  const cookie = {
    httpOnly: true,
    secure: production,
    sameSite: "strict",
    path: "/api/cms",
    maxAge: 8 * 3600 * 1000,
  };
  const cookieName = production ? "__Secure-ozo" : "ozo";
  const dummyHash = await hashPassword(token());
  app.use("/api/cms", (req, _res, next) => {
    if (
      !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
      req.get("origin") !== origin
    )
      return next(fail(403, "Origin not allowed"));
    next();
  });
  app.post(
    "/api/cms/login",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 10,
      standardHeaders: "draft-8",
      legacyHeaders: false,
    }),
    async (req, res) => {
      const { email, password } = z
        .object({ email: z.email().max(254), password: z.string().max(200) })
        .parse(req.body);
      const [user] = await db.query(
        "SELECT * FROM users WHERE email=$1 AND active=1",
        [email.toLowerCase()],
      );
      const valid = await verifyPassword(password, user?.password || dummyHash);
      if (!user || !valid) throw fail(401, "Invalid email or password");
      const value = token(),
        csrf = token();
      await db.query("DELETE FROM sessions WHERE expires<$1", [Date.now()]);
      await db.query(
        "INSERT INTO sessions (token,user_id,csrf,expires) VALUES ($1,$2,$3,$4)",
        [digest(value), user.id, csrf, Date.now() + cookie.maxAge],
      );
      res
        .cookie(cookieName, value, cookie)
        .json({ email: user.email, role: user.role, csrf });
    },
  );
  app.use("/api/cms", async (req, _res, next) => {
    const value = req.cookies[cookieName];
    if (!value) return next(fail(401, "Please sign in"));
    const [session] = await db.query(
      "SELECT sessions.*,users.email,users.role FROM sessions JOIN users ON users.id=sessions.user_id WHERE token=$1 AND expires>$2 AND users.active=1",
      [digest(value), Date.now()],
    );
    if (!session) return next(fail(401, "Session expired"));
    req.session = session;
    if (
      !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
      req.get("x-csrf-token") !== session.csrf
    )
      return next(fail(403, "Invalid CSRF token"));
    next();
  });
  const admin = (req, _res, next) =>
    next(
      req.session.role === "admin"
        ? undefined
        : fail(403, "An administrator must publish content"),
    );
  app.get("/api/cms/me", (req, res) =>
    res.json({
      email: req.session.email,
      role: req.session.role,
      csrf: req.session.csrf,
    }),
  );
  app.post("/api/cms/logout", async (req, res) => {
    await db.query("DELETE FROM sessions WHERE token=$1", [req.session.token]);
    res
      .clearCookie(cookieName, { ...cookie, maxAge: undefined })
      .json({ ok: true });
  });
  const getDoc = async (q, id) => {
    idSchema.parse(id);
    const [row] = await q.query("SELECT * FROM documents WHERE id=$1", [id]);
    if (!row) throw fail(404, "Content not found");
    return row;
  };
  const revision = async (q, row, actor, action, body) =>
    q.query(
      "INSERT INTO revisions (id,document_id,body,created,actor,action) VALUES ($1,$2,$3,$4,$5,$6)",
      [randomUUID(), row.id, body, Date.now(), actor, action],
    );
  app.get("/api/cms/documents", async (_req, res) =>
    res.json(
      (await db.query("SELECT * FROM documents ORDER BY updated DESC")).map(
        decode,
      ),
    ),
  );
  app.post("/api/cms/documents", async (req, res) => {
    const { kind, data } = z
      .object({
        kind: z.enum(["page", "section", "menu", "settings"]),
        data: z.unknown(),
      })
      .strict()
      .parse(req.body);
    const body = JSON.stringify(schemas[kind].parse(data)),
      id = randomUUID();
    await db.transaction(async (q) => {
      await q.query(
        "INSERT INTO documents (id,kind,draft,updated) VALUES ($1,$2,$3,$4)",
        [id, kind, body, Date.now()],
      );
      await revision(q, { id }, req.session.user_id, "create", body);
    });
    res.status(201).json(decode(await getDoc(db, id)));
  });
  app.put("/api/cms/documents/:id", async (req, res) => {
    const { version, data } = payload.parse(req.body);
    await db.transaction(async (q) => {
      const row = await getDoc(q, req.params.id);
      const body = JSON.stringify(schemas[row.kind].parse(data));
      const changed = await q.query(
        "UPDATE documents SET draft=$1,version=version+1,updated=$2 WHERE id=$3 AND version=$4 RETURNING id",
        [body, Date.now(), row.id, version],
      );
      if (!changed.length)
        throw fail(
          409,
          "Another editor changed this content. Reload before saving.",
        );
      await revision(q, row, req.session.user_id, "save", body);
    });
    res.json(decode(await getDoc(db, req.params.id)));
  });
  async function resolvePage(q, data) {
    const resolved = [];
    for (const b of data.blocks) {
      if (b.type !== "shared") {
        resolved.push(b);
        continue;
      }
      const row = await getDoc(q, b.sectionId);
      if (row.kind !== "section" || !row.published)
        throw fail(
          422,
          "Publish each reusable section before using it on a page",
        );
      resolved.push({ ...JSON.parse(row.published), id: b.id });
    }
    return pageSchema.parse({ ...data, blocks: resolved });
  }
  app.post("/api/cms/documents/:id/publish", admin, async (req, res) => {
    const { version } = versionSchema.parse(req.body);
    await db.transaction(async (q) => {
      const row = await getDoc(q, req.params.id);
      let data = schemas[row.kind].parse(JSON.parse(row.draft));
      if (row.kind === "page") {
        data = await resolvePage(q, data);
        if (!data.seo.title || !data.seo.description || !data.blocks.length)
          throw fail(
            422,
            "Add SEO title, description and at least one section before publishing",
          );
      }
      const images = [];
      const collect = (v) => {
        if (typeof v === "string" && v.startsWith("/media/")) images.push(v);
        else if (v && typeof v === "object") Object.values(v).forEach(collect);
      };
      collect(data);
      for (const url of new Set(images))
        if (!(await q.query("SELECT id FROM media WHERE url=$1", [url])).length)
          throw fail(422, "A selected media file is missing");
      const key =
        row.kind === "page"
          ? `page:${data.path}`
          : row.kind === "menu"
            ? `menu:${data.location}`
            : row.kind === "settings"
              ? "settings:global"
              : data.type === "template" && data.template.startsWith("site-")
                ? `layout:${data.template}`
                : `section:${row.id}`;
      const body = JSON.stringify(data);
      const changed = await q.query(
        "UPDATE documents SET published=$1,public_key=$2,version=version+1,updated=$3 WHERE id=$4 AND version=$5 RETURNING id",
        [body, key, Date.now(), row.id, version],
      );
      if (!changed.length)
        throw fail(
          409,
          "Another editor changed this content. Reload before publishing.",
        );
      await revision(q, row, req.session.user_id, "publish", body);
    });
    res.json(decode(await getDoc(db, req.params.id)));
  });
  app.post("/api/cms/documents/:id/unpublish", admin, async (req, res) => {
    const { version } = versionSchema.parse(req.body);
    await db.transaction(async (q) => {
      const row = await getDoc(q, req.params.id);
      const changed = await q.query(
        "UPDATE documents SET published=NULL,public_key=NULL,version=version+1,updated=$1 WHERE id=$2 AND version=$3 RETURNING id",
        [Date.now(), row.id, version],
      );
      if (!changed.length) throw fail(409, "Content changed. Reload first.");
      await revision(q, row, req.session.user_id, "unpublish", row.draft);
    });
    res.json(decode(await getDoc(db, req.params.id)));
  });
  app.get("/api/cms/documents/:id/revisions", async (req, res) => {
    await getDoc(db, req.params.id);
    res.json(
      await db.query(
        "SELECT id,body,created,actor,action FROM revisions WHERE document_id=$1 ORDER BY created DESC LIMIT 100",
        [req.params.id],
      ),
    );
  });
  app.post("/api/cms/documents/:id/restore/:revisionId", async (req, res) => {
    const { version } = versionSchema.parse(req.body);
    idSchema.parse(req.params.revisionId);
    await db.transaction(async (q) => {
      const row = await getDoc(q, req.params.id);
      const [rev] = await q.query(
        "SELECT body FROM revisions WHERE id=$1 AND document_id=$2",
        [req.params.revisionId, row.id],
      );
      if (!rev) throw fail(404, "Revision not found");
      const body = JSON.stringify(
        schemas[row.kind].parse(JSON.parse(rev.body)),
      );
      const changed = await q.query(
        "UPDATE documents SET draft=$1,version=version+1,updated=$2 WHERE id=$3 AND version=$4 RETURNING id",
        [body, Date.now(), row.id, version],
      );
      if (!changed.length) throw fail(409, "Content changed. Reload first.");
      await revision(q, row, req.session.user_id, "restore", body);
    });
    res.json(decode(await getDoc(db, req.params.id)));
  });
  app.get("/api/cms/documents/:id/preview", async (req, res) => {
    const row = await getDoc(db, req.params.id);
    res.set("X-Robots-Tag", "noindex, nofollow");
    res.json(
      row.kind === "page"
        ? await resolvePage(db, JSON.parse(row.draft))
        : JSON.parse(row.draft),
    );
  });
  app.get("/api/cms/users", admin, async (_req, res) =>
    res.json(
      await db.query("SELECT id,email,role,active FROM users ORDER BY email"),
    ),
  );
  app.post("/api/cms/users", admin, async (req, res) => {
    const data = z
      .object({
        email: z.email(),
        password: z.string().min(14).max(200),
        role: z.enum(["admin", "editor"]),
      })
      .strict()
      .parse(req.body);
    await createUser(db, data.email, data.password, data.role);
    res.status(201).json({ ok: true });
  });
  app.patch("/api/cms/users/:id", admin, async (req, res) => {
    idSchema.parse(req.params.id);
    const data = z
      .object({ role: z.enum(["admin", "editor"]), active: z.boolean() })
      .strict()
      .parse(req.body);
    if (req.params.id === req.session.user_id)
      throw fail(
        400,
        "Ask another administrator to change your role or disable your account",
      );
    const changed = await db.query(
      "UPDATE users SET role=$1,active=$2 WHERE id=$3 RETURNING id",
      [data.role, data.active ? 1 : 0, req.params.id],
    );
    if (!changed.length) throw fail(404, "User not found");
    await db.query("DELETE FROM sessions WHERE user_id=$1", [req.params.id]);
    res.json({ ok: true });
  });
  app.get("/api/cms/inquiries", admin, async (_req, res) =>
    res.json(
      await db.query(
        "SELECT id,name,email,message,status,notes,created_at FROM inquiries ORDER BY created_at DESC LIMIT 200",
      ),
    ),
  );
  app.get("/api/cms/requests",admin,async(_req,res)=>res.json(await db.query("SELECT r.id,r.name,r.email,r.service,r.message,r.status,r.created,a.starts,a.status AS appointment_status FROM service_requests r LEFT JOIN appointment_requests a ON a.request_id=r.id ORDER BY r.created DESC LIMIT 200")));
  app.patch("/api/cms/appointments/:id",admin,async(req,res)=>{
    const id=idSchema.parse(req.params.id);
    const {status}=z.object({status:z.enum(["confirmed","cancelled"])}).strict().parse(req.body);
    await db.transaction(async q=>{
      await q.query("UPDATE scheduling_lock SET id=1 WHERE id=1");
      const [row]=await q.query("SELECT starts FROM appointment_requests WHERE request_id=$1",[id]);
      if(!row)throw fail(404,"Appointment not found");
      const starts=Number(row.starts);
      if(status==="confirmed"){
        if(starts<=Date.now())throw fail(400,"This requested time has passed");
        const overlap=await q.query("SELECT request_id FROM appointment_requests WHERE status='confirmed' AND request_id<>$1 AND starts>$2 AND starts<$3",[id,starts-1800000,starts+1800000]);
        if(overlap.length)throw fail(409,"Another confirmed 30-minute appointment overlaps this time");
      }
      await q.query("UPDATE appointment_requests SET status=$1 WHERE request_id=$2",[status,id]);
    });res.json({ok:true});
  });
  app.patch("/api/cms/requests/:id",admin,async(req,res)=>{
    const id=idSchema.parse(req.params.id);
    const {status}=z.object({status:z.enum(["received","reviewing","contacted","completed","cancelled"])}).strict().parse(req.body);
    const rows=await db.query("UPDATE service_requests SET status=$1 WHERE id=$2 RETURNING id",[status,id]);
    if(!rows.length)throw fail(404,"Request not found");res.json({ok:true});
  });
  app.patch("/api/cms/inquiries/:id", admin, async (req, res) => {
    const data = z
      .object({
        status: z.enum(["new", "contacted", "closed"]),
        notes: z.string().max(10000),
      })
      .strict()
      .parse(req.body);
    const id = z.string().regex(/^\d+$/).parse(req.params.id);
    const rows = await db.query(
      "UPDATE inquiries SET status=$1,notes=$2 WHERE id=$3 RETURNING id",
      [data.status, data.notes, id],
    );
    if (!rows.length) throw fail(404, "Inquiry not found");
    res.json({ ok: true });
  });
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 8 * 1024 * 1024, files: 1, fields: 2 },
  });
  app.get("/api/cms/media", async (_req, res) =>
    res.json(await db.query("SELECT * FROM media ORDER BY created DESC")),
  );
  app.post("/api/cms/media", upload.single("file"), async (req, res) => {
    if (!req.file) throw fail(400, "Choose a PNG, JPEG or WebP image");
    const alt = z.string().min(1).max(250).parse(req.body.alt);
    let meta;
    try {
      meta = await sharp(req.file.buffer, {
        limitInputPixels: 40000000,
      }).metadata();
    } catch {
      throw fail(400, "Image is corrupt or exceeds the pixel limit");
    }
    if (!["jpeg", "png", "webp"].includes(meta.format))
      throw fail(400, "Only PNG, JPEG and WebP are supported");
    const id = randomUUID(),
      name = `${id}.webp`,
      url = `/media/${name}`,
      path = resolve(mediaDir, name);
    let converted;
    try {
      converted = await sharp(req.file.buffer, { limitInputPixels: 40000000 })
        .rotate()
        .resize({
          width: 2400,
          height: 2400,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 85 })
        .toBuffer({ resolveWithObject: true });
    } catch {
      throw fail(400, "Image could not be decoded");
    }
    const { data, info } = converted;
    await db.transaction(async (q) => {
      await q.query(
        "INSERT INTO media (id,url,alt,original_name,width,height,created) VALUES ($1,$2,$3,$4,$5,$6,$7)",
        [
          id,
          url,
          alt,
          req.file.originalname.slice(0, 250),
          info.width,
          info.height,
          Date.now(),
        ],
      );
      await q.query(
        "INSERT INTO media_data (media_id,encoded) VALUES ($1,$2)",
        [id, data.toString("base64")],
      );
    });
    res
      .status(201)
      .json({ id, url, alt, width: info.width, height: info.height });
  });
  app.get("/media/:file", async (req, res) => {
    const id = z
      .string()
      .uuid()
      .parse(req.params.file.replace(/\.webp$/, ""));
    if (req.params.file !== `${id}.webp`) throw fail(404, "Image not found");
    const [row] = await db.query(
      "SELECT encoded FROM media_data WHERE media_id=$1",
      [id],
    );
    if (!row) throw fail(404, "Image not found");
    res
      .set("Cache-Control", "public,max-age=31536000,immutable")
      .type("image/webp")
      .send(Buffer.from(row.encoded, "base64"));
  });
  app.get("/api/public/page", async (req, res) => {
    const path = z
      .string()
      .max(200)
      .parse(req.query.path || "/");
    const [row] = await db.query(
      "SELECT published FROM documents WHERE public_key=$1 AND published IS NOT NULL",
      [`page:${path}`],
    );
    if (!row) throw fail(404, "Published page not found");
    res.set("Cache-Control", "no-cache").json(JSON.parse(row.published));
  });
  app.get("/api/public/site", async (_req, res) => {
    const rows = await db.query(
      "SELECT kind,published FROM documents WHERE published IS NOT NULL AND kind IN ('menu','settings','section')",
    );
    res.set("Cache-Control", "no-cache").json({
      layouts: rows
        .filter((r) => r.kind === "section")
        .map((r) => JSON.parse(r.published))
        .filter((d) => d.type === "template" && d.template.startsWith("site-")),
      menus: rows
        .filter((r) => r.kind === "menu")
        .map((r) => JSON.parse(r.published)),
      settings: rows.find((r) => r.kind === "settings")
        ? JSON.parse(rows.find((r) => r.kind === "settings").published)
        : null,
    });
  });
  app.get("/api/public/sitemap", async (_req, res) => {
    const rows = await db.query(
      "SELECT published,updated FROM documents WHERE kind='page' AND published IS NOT NULL",
    );
    res.json(
      rows
        .map((r) => ({ page: JSON.parse(r.published), updated: r.updated }))
        .filter((r) => !r.page.seo.noindex)
        .map((r) => ({ path: r.page.path, updated: r.updated })),
    );
  });
  app.get("/health", async (_req, res) => {
    await db.query("SELECT 1");
    res.json({ ok: true });
  });
  app.use(
    "/admin",
    (_req, res, next) => {
      res.set("X-Robots-Tag", "noindex, nofollow");
      next();
    },
    express.static(dist),
  );
  app.get("/admin/{*path}", (_req, res) =>
    res.sendFile(resolve(dist, "index.html")),
  );
  app.use((_req, _res, next) => next(fail(404, "Not found")));
  app.use((err, _req, res, _next) => {
    if (err instanceof z.ZodError)
      return res.status(400).json({
        error: err.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("; "),
      });
    if (
      err.code === "23505" ||
      String(err.message).includes("UNIQUE constraint")
    )
      return res.status(409).json({
        error:
          "This page path or menu location is already published. Choose another.",
      });
    const status =
      err.status || (err instanceof multer.MulterError ? 400 : 500);
    if (status === 500) console.error(err);
    res.status(status).json({
      error: status === 500 ? "Could not complete this request" : err.message,
    });
  });
  return app;
}

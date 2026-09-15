import express from "express";
import rateLimit from "express-rate-limit";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { token, digest } from "../cms/server/auth.js";
export async function portalTable(db) {
  await db.query(
    "CREATE TABLE IF NOT EXISTS service_requests (id TEXT PRIMARY KEY,access_hash TEXT NOT NULL,name TEXT NOT NULL,email TEXT NOT NULL,service TEXT NOT NULL,message TEXT NOT NULL,status TEXT NOT NULL,created BIGINT NOT NULL)",
  );
  await db.query(
    "CREATE TABLE IF NOT EXISTS appointment_requests (request_id TEXT PRIMARY KEY REFERENCES service_requests(id),starts BIGINT NOT NULL,status TEXT NOT NULL DEFAULT 'requested')",
  );
  await db.query(
    "CREATE TABLE IF NOT EXISTS scheduling_lock (id INTEGER PRIMARY KEY)",
  );
  await db.query(
    "INSERT INTO scheduling_lock (id) VALUES (1) ON CONFLICT (id) DO NOTHING",
  );
}
export function mountPortal(app, db, origin) {
  app.use(
    "/api/portal",
    rateLimit({
      windowMs: 15 * 60000,
      limit: 30,
      standardHeaders: true,
      legacyHeaders: false,
    }),
    express.json({ limit: "16kb" }),
    (req, res, next) => {
      res.set("Cache-Control", "no-store");
      if (req.get("origin") !== origin)
        return res.status(403).json({ error: "Origin not allowed" });
      next();
    },
  );
  app.post("/api/portal/requests", async (req, res) => {
    const parsed = z
      .object({
        name: z.string().trim().min(1).max(150),
        email: z.email().max(254),
        service: z.string().trim().min(1).max(150),
        message: z.string().trim().min(10).max(5000),
        starts: z
          .number()
          .int()
          .refine(
            (v) => v > Date.now() + 3600000 && v < Date.now() + 180 * 86400000,
          )
          .optional(),
      })
      .strict()
      .safeParse(req.body);
    if (!parsed.success)
      return res
        .status(400)
        .json({
          error:
            "Complete all fields with a valid email and at least 10 characters about your project. A preferred time must be at least one hour ahead and within 180 days.",
        });
    const id = randomUUID(),
      access = token(),
      d = parsed.data;
    await db.transaction(async (q) => {
      await q.query(
        "INSERT INTO service_requests (id,access_hash,name,email,service,message,status,created) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
        [
          id,
          digest(access),
          d.name,
          d.email,
          d.service,
          d.message,
          "received",
          Date.now(),
        ],
      );
      if (d.starts)
        await q.query(
          "INSERT INTO appointment_requests (request_id,starts,status) VALUES ($1,$2,$3)",
          [id, d.starts, "requested"],
        );
    });
    res
      .status(201)
      .json({
        id,
        access,
        status: "received",
        appointment: d.starts
          ? { starts: d.starts, status: "requested" }
          : null,
      });
  });
  app.post("/api/portal/status", async (req, res) => {
    const parsed = z
      .object({
        id: z.string().uuid(),
        access: z.string().regex(/^[a-f0-9]{64}$/),
      })
      .strict()
      .safeParse(req.body);
    if (!parsed.success)
      return res
        .status(400)
        .json({ error: "Enter your request ID and private access code." });
    const [row] = await db.query(
      "SELECT id,service,status,created FROM service_requests WHERE id=$1 AND access_hash=$2",
      [parsed.data.id, digest(parsed.data.access)],
    );
    if (!row)
      return res
        .status(404)
        .json({ error: "Request not found. Check your ID and access code." });
    const [appointment] = await db.query(
      "SELECT starts,status FROM appointment_requests WHERE request_id=$1",
      [row.id],
    );
    res.json({ ...row, appointment: appointment || null });
  });
}

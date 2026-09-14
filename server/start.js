import "dotenv/config";
import { createWebsite } from "./website.js";
import { openDb } from "../cms/server/db.js";
import { createUser } from "../cms/server/auth.js";
import { seedCms } from "./seed-cms.js";
import { importLegacy } from "./import-legacy.js";
const db = await openDb();
await seedCms(db);
await importLegacy(db);
if (
  !(await db.query("SELECT id FROM users LIMIT 1")).length &&
  process.env.ADMIN_EMAIL &&
  process.env.ADMIN_PASSWORD
) {
  await createUser(db, process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
  console.log(
    "Initial administrator provisioned. Remove ADMIN_PASSWORD from the Render environment after setup.",
  );
}
const app = await createWebsite(db);
const port = Number(process.env.PORT || 3001);
const server = app.listen(
  port,
  process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1",
  () => console.log(`On Zen On website and admin ready on port ${port}`),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () =>
    server.close(async () => {
      await db.close();
      process.exit(0);
    }),
  );

import { openDb } from "./db.js";
import { createUser } from "./auth.js";
const db = await openDb();
try {
  if (!process.env.ADMIN_PASSWORD)
    throw Error(
      "Set ADMIN_PASSWORD in this process environment. It is never saved to source.",
    );
  await createUser(
    db,
    process.env.ADMIN_EMAIL || "",
    process.env.ADMIN_PASSWORD,
    process.env.ADMIN_ROLE || "admin",
  );
  console.log("User created. Clear ADMIN_PASSWORD from your environment.");
} finally {
  await db.close();
}

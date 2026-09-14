import {
  scrypt,
  randomBytes,
  timingSafeEqual,
  createHash,
  randomUUID,
} from "node:crypto";
import { promisify } from "node:util";
const derive = promisify(scrypt);
export const token = () => randomBytes(32).toString("hex");
export const digest = (v) => createHash("sha256").update(v).digest("hex");
export async function hashPassword(password) {
  const salt = token();
  const key = await derive(password, salt, 64);
  return `${salt}:${key.toString("hex")}`;
}
export async function verifyPassword(password, stored) {
  const [salt, key] = stored.split(":");
  const candidate = await derive(password, salt, 64);
  return timingSafeEqual(candidate, Buffer.from(key, "hex"));
}
export async function createUser(db, email, password, role = "admin") {
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    password.length < 14 ||
    password.length > 200 ||
    !["admin", "editor"].includes(role)
  )
    throw Error(
      "Valid email, 14–200 character password and admin/editor role required",
    );
  await db.query(
    "INSERT INTO users (id,email,password,role) VALUES ($1,$2,$3,$4)",
    [randomUUID(), email.toLowerCase(), await hashPassword(password), role],
  );
}

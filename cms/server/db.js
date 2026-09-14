import { DatabaseSync } from "node:sqlite";
import pg from "pg";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
export async function openDb({
  url = process.env.DATABASE_URL,
  path = process.env.SQLITE_PATH || "./data/cms.db",
} = {}) {
  let pool,
    sqlite,
    queue = Promise.resolve();
  if (url) pool = new pg.Pool({ connectionString: url });
  else {
    mkdirSync(dirname(path), { recursive: true });
    sqlite = new DatabaseSync(path);
    sqlite.exec("PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;");
  }
  const run = async (sql, args = []) => {
    if (pool) return (await pool.query(sql, args)).rows;
    const q = sqlite.prepare(sql.replace(/\$\d+/g, "?"));
    return q.all(...args);
  };
  const db = {
    query: (sql, args = []) =>
      pool ? run(sql, args) : queue.then(() => run(sql, args)),
    transaction: async (fn) => {
      if (pool) {
        const c = await pool.connect();
        try {
          await c.query("BEGIN");
          const val = await fn({
            query: async (s, a = []) => (await c.query(s, a)).rows,
          });
          await c.query("COMMIT");
          return val;
        } catch (e) {
          await c.query("ROLLBACK");
          throw e;
        } finally {
          c.release();
        }
      }
      const work = queue.then(async () => {
        sqlite.exec("BEGIN IMMEDIATE");
        try {
          const val = await fn({ query: run });
          sqlite.exec("COMMIT");
          return val;
        } catch (e) {
          sqlite.exec("ROLLBACK");
          throw e;
        }
      });
      queue = work.catch(() => {});
      return work;
    },
    close: async () => (pool ? pool.end() : sqlite.close()),
  };
  await run(
    `CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('admin','editor')),active INTEGER NOT NULL DEFAULT 1)`,
  );
  await run(
    `CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),csrf TEXT NOT NULL,expires BIGINT NOT NULL)`,
  );
  await run(
    `CREATE TABLE IF NOT EXISTS documents (id TEXT PRIMARY KEY,kind TEXT NOT NULL CHECK(kind IN ('page','section','menu','settings')),draft TEXT NOT NULL,published TEXT,version INTEGER NOT NULL DEFAULT 1,public_key TEXT UNIQUE,updated BIGINT NOT NULL)`,
  );
  await run(
    `CREATE TABLE IF NOT EXISTS revisions (id TEXT PRIMARY KEY,document_id TEXT NOT NULL REFERENCES documents(id),body TEXT NOT NULL,created BIGINT NOT NULL,actor TEXT NOT NULL REFERENCES users(id),action TEXT NOT NULL)`,
  );
  await run(
    `CREATE TABLE IF NOT EXISTS media (id TEXT PRIMARY KEY,url TEXT UNIQUE NOT NULL,alt TEXT NOT NULL,original_name TEXT NOT NULL,width INTEGER NOT NULL,height INTEGER NOT NULL,created BIGINT NOT NULL)`,
  );
  await run(
    "CREATE INDEX IF NOT EXISTS revisions_document ON revisions(document_id,created)",
  );
  await run("CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires)");
  await run(
    "CREATE TABLE IF NOT EXISTS media_data (media_id TEXT PRIMARY KEY REFERENCES media(id), encoded TEXT NOT NULL)",
  );
  return db;
}

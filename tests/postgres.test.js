import { test } from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../cms/server/db.js";
import { seedCms } from "../server/seed-cms.js";
import { randomUUID } from "node:crypto";
test(
  "PostgreSQL schema, transaction rollback, seeding and media persistence",
  { skip: !process.env.CMS_TEST_DATABASE_URL },
  async () => {
    const url = new URL(process.env.CMS_TEST_DATABASE_URL);
    if (
      !["localhost", "127.0.0.1"].includes(url.hostname) ||
      url.pathname !== "/cms_test"
    )
      throw Error(
        "This check accepts only the isolated local cms_test database",
      );
    const db = await openDb({ url: url.href });
    try {
      await seedCms(db);
      const rows = await db.query(
        "SELECT published FROM documents WHERE public_key='page:/'",
      );
      assert.equal(JSON.parse(rows[0].published).blocks.length, 15);
      const id = randomUUID();
      await assert.rejects(
        db.transaction(async (q) => {
          await q.query(
            "INSERT INTO documents (id,kind,draft,updated) VALUES ($1,$2,$3,$4)",
            [id, "page", "{}", Date.now()],
          );
          throw Error("Test rollback");
        }),
      );
      assert.equal(
        (await db.query("SELECT id FROM documents WHERE id=$1", [id])).length,
        0,
      );
      const mediaId = randomUUID();
      await db.transaction(async (q) => {
        await q.query(
          "INSERT INTO media (id,url,alt,original_name,width,height,created) VALUES ($1,$2,$3,$4,$5,$6,$7)",
          [
            mediaId,
            `/media/${mediaId}.webp`,
            "test",
            "test.webp",
            1,
            1,
            Date.now(),
          ],
        );
        await q.query(
          "INSERT INTO media_data (media_id,encoded) VALUES ($1,$2)",
          [mediaId, Buffer.from("test bytes").toString("base64")],
        );
      });
      assert.equal(
        Buffer.from(
          (
            await db.query("SELECT encoded FROM media_data WHERE media_id=$1", [
              mediaId,
            ])
          )[0].encoded,
          "base64",
        ).toString(),
        "test bytes",
      );
    } finally {
      await db.close();
    }
  },
);

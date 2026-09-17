import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { openDb } from "../cms/server/db.js";
import { seedCms, stableId } from "../server/seed-cms.js";
import { createWebsite } from "../server/website.js";
import {
  migrateCompanyPages,
  migrateProcessSteps,
} from "../server/company-pages.js";
import { pageSchema } from "../cms/shared/content.js";

const origin = "http://localhost:3100";
const published = async (db, path) => {
  const [row] = await db.query(
    "SELECT published FROM documents WHERE public_key=$1 AND published IS NOT NULL",
    [`page:${path}`],
  );
  return row ? JSON.parse(row.published) : null;
};

test("about, portfolio and contact are published and valid", async () => {
  const db = await openDb({ url: null, path: ":memory:" });
  try {
    await seedCms(db);
    for (const path of ["/about", "/portfolio", "/contact"]) {
      const page = await published(db, path);
      assert.ok(page, `${path} was not published`);
      assert.ok(pageSchema.safeParse(page).success, `${path} is not valid`);
      assert.ok(page.seo.title && page.seo.description, `${path} lacks SEO`);
      assert.ok(page.blocks.length >= 4, `${path} is too thin`);
      const ids = page.blocks.map((b) => b.id);
      assert.equal(new Set(ids).size, ids.length, `${path} has repeated ids`);
    }
    /* The contact page must carry the block that renders the enquiry form. */
    const contact = await published(db, "/contact");
    assert.ok(contact.blocks.some((b) => b.type === "contact"));
  } finally {
    await db.close();
  }
});

test("the menus point at the new pages instead of home-page anchors", async () => {
  const db = await openDb({ url: null, path: ":memory:" });
  try {
    await seedCms(db);
    const [header] = await db.query(
      "SELECT published FROM documents WHERE public_key='menu:header'",
    );
    const items = JSON.parse(header.published).items;
    const href = (label) =>
      items.find((i) => new RegExp(label, "i").test(i.label))?.href;
    assert.equal(href("about"), "/about");
    assert.equal(href("portfolio"), "/portfolio");
    assert.equal(href("contact"), "/contact");
    /* There is no industries page, so that link keeps its anchor. */
    assert.equal(href("industries"), "/#industries");
  } finally {
    await db.close();
  }
});

test("a link an editor already changed is left alone", async () => {
  const db = await openDb({ url: null, path: ":memory:" });
  try {
    await seedCms(db);
    await db.query("DELETE FROM cms_migrations WHERE id=$1", [
      "company-pages-v1",
    ]);
    const [header] = await db.query(
      "SELECT id,published FROM documents WHERE public_key='menu:header'",
    );
    const menu = JSON.parse(header.published);
    menu.items.find((i) => /about/i.test(i.label)).href = "/our-story";
    /* The SQLite adapter turns $n into positional ?, so a repeated placeholder
       must be passed twice. */
    await db.query("UPDATE documents SET draft=$1,published=$2 WHERE id=$3", [
      JSON.stringify(menu),
      JSON.stringify(menu),
      header.id,
    ]);
    await migrateCompanyPages(db, stableId);
    const [after] = await db.query(
      "SELECT published FROM documents WHERE public_key='menu:header'",
    );
    const changed = JSON.parse(after.published).items.find((i) =>
      /about/i.test(i.label),
    );
    assert.equal(changed.href, "/our-story", "an editor's own link was moved");
  } finally {
    await db.close();
  }
});

test("the migration runs once and never overwrites edits", async () => {
  const db = await openDb({ url: null, path: ":memory:" });
  try {
    await seedCms(db);
    const [before] = await db.query(
      "SELECT id,version FROM documents WHERE public_key='page:/about'",
    );
    const edited = await published(db, "/about");
    edited.blocks[0].heading = "Our own heading";
    await db.query("UPDATE documents SET draft=$1,published=$2 WHERE id=$3", [
      JSON.stringify(edited),
      JSON.stringify(edited),
      before.id,
    ]);
    await migrateCompanyPages(db, stableId);
    const after = await published(db, "/about");
    assert.equal(after.blocks[0].heading, "Our own heading");
  } finally {
    await db.close();
  }
});

test("the new pages are served, indexed and described to search engines", async () => {
  const db = await openDb({ url: null, path: ":memory:" });
  try {
    await seedCms(db);
    const app = await createWebsite(db, { production: false, origin });
    for (const path of ["/about", "/portfolio", "/contact"]) {
      const response = await request(app).get(path).expect(200);
      assert.match(response.text, /application\/ld\+json/);
      assert.match(response.text, /<link rel="canonical"/);
    }
    const sitemap = await request(app).get("/sitemap.xml").expect(200);
    for (const path of ["/about", "/portfolio", "/contact"])
      assert.ok(sitemap.text.includes(path), `${path} missing from sitemap`);
  } finally {
    await db.close();
  }
});

test("the website guide can answer from the new pages", async () => {
  const db = await openDb({ url: null, path: ":memory:" });
  try {
    await seedCms(db);
    const { guideAnswer } = await import("../server/service-guide.js");
    const answer = await guideAnswer(db, {
      question: "who owns the work you build",
    });
    assert.ok(
      !answer.text.startsWith("I could not find that"),
      "the guide could not use the new About content",
    );
  } finally {
    await db.close();
  }
});

test("step numbers live in the timeline, not typed into the headings", async () => {
  const db = await openDb({ url: null, path: ":memory:" });
  try {
    await seedCms(db);
    const page = await published(db, "/about");
    const steps = page.blocks.find((b) => b.type === "process").items;
    for (const step of steps)
      assert.ok(
        !/^\s*\d/.test(step.title),
        `"${step.title}" still carries its own number, which the timeline also draws`,
      );
  } finally {
    await db.close();
  }
});

test("a page seeded before the timeline loses its doubled numbers", async () => {
  const db = await openDb({ url: null, path: ":memory:" });
  try {
    await seedCms(db);
    const [row] = await db.query(
      "SELECT id FROM documents WHERE public_key='page:/about'",
    );
    /* Put the page back the way the first version seeded it, then check the
       migration corrects content that is already in the database. */
    const page = await published(db, "/about");
    const steps = page.blocks.find((b) => b.type === "process").items;
    steps.forEach((step, i) => {
      step.title = `${String(i + 1).padStart(2, "0")} — ${step.title}`;
    });
    const renamed = "Grow with us";
    steps[steps.length - 1].title = renamed;
    const body = JSON.stringify(page);
    await db.query("UPDATE documents SET draft=$1,published=$2 WHERE id=$3", [
      body,
      body,
      row.id,
    ]);
    await db.query("DELETE FROM cms_migrations WHERE id=$1", [
      "company-process-numbering-v1",
    ]);
    await migrateProcessSteps(db);

    for (const field of ["draft", "published"]) {
      const [after] = await db.query(
        `SELECT ${field} FROM documents WHERE id=$1`,
        [row.id],
      );
      const items = JSON.parse(after[field]).blocks.find(
        (b) => b.type === "process",
      ).items;
      assert.deepEqual(
        items.slice(0, 4).map((i) => i.title),
        ["Understand", "Shape", "Build", "Launch"],
        `${field} still has numbers in the headings`,
      );
      /* A heading the editor rewrote is theirs, so it is left alone. */
      assert.equal(items[4].title, renamed);
    }
  } finally {
    await db.close();
  }
});

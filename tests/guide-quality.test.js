import { test } from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../cms/server/db.js";
import { seedCms } from "../server/seed-cms.js";
import { guideAnswer } from "../server/service-guide.js";

const ask = (db, question, context) => guideAnswer(db, { question, context });

test("the guide answers from the page the question is actually about", async () => {
  const db = await openDb({ url: null, path: ":memory:" });
  try {
    await seedCms(db);
    /* "Do you build for mobile screens?" is a frontend question on the site and
       used to hijack this one, answering about responsive layouts instead. */
    const apps = await ask(db, "do you build mobile apps?");
    assert.equal(apps.context, "/services/mobile-app-development");

    const marketing = await ask(db, "I need help with google ranking");
    assert.equal(marketing.context, "/services/digital-marketing");

    /* A long page must not win simply by containing more words. */
    const security = await ask(db, "how do you keep my website secure");
    assert.notEqual(security.context, "/services/frontend-development");
    assert.match(security.text.toLowerCase(), /secur/);
  } finally {
    await db.close();
  }
});

test("the guide searches the whole site, not only service pages", async () => {
  const db = await openDb({ url: null, path: ":memory:" });
  try {
    await seedCms(db);
    const answer = await ask(db, "how do you keep my website secure");
    assert.ok(
      answer.context && !answer.context.startsWith("/services/"),
      `expected a non-service page, got ${answer.context}`,
    );
  } finally {
    await db.close();
  }
});

test("the guide offers follow-up questions it can actually answer", async () => {
  const db = await openDb({ url: null, path: ":memory:" });
  try {
    await seedCms(db);
    const answer = await ask(db, "do you build mobile apps?");
    assert.ok(answer.suggestions.length > 0);
    /* Every suggestion must be a question the guide can answer, so offering it
       never leads a visitor into the "I could not find that" reply. */
    for (const suggestion of answer.suggestions) {
      const followed = await ask(db, suggestion);
      assert.ok(
        !followed.text.startsWith("I could not find that"),
        `suggested "${suggestion}" but could not answer it`,
      );
    }
  } finally {
    await db.close();
  }
});

test("the guide says who the company is when asked", async () => {
  const db = await openDb({ url: null, path: ":memory:" });
  try {
    await seedCms(db);
    /* Every word of "who are you" is a stop word, so without its own handling
       this falls through to "I could not find that". */
    for (const question of ["who are you", "tell me about your company"]) {
      const answer = await ask(db, question);
      assert.ok(
        !answer.text.startsWith("I could not find that"),
        `"${question}" was not answered`,
      );
      assert.match(answer.text, /On Zen On/);
    }
  } finally {
    await db.close();
  }
});

test("the guide admits when the website does not cover something", async () => {
  const db = await openDb({ url: null, path: ":memory:" });
  try {
    await seedCms(db);
    const answer = await ask(db, "do you sell refrigerators and tractors");
    assert.ok(answer.text.startsWith("I could not find that"));
    assert.ok(answer.suggestions.length > 0, "a dead end must offer a way on");
    assert.equal(answer.context, null);
  } finally {
    await db.close();
  }
});

test("unpublished and hidden content never reaches a visitor", async () => {
  const db = await openDb({ url: null, path: ":memory:" });
  try {
    await seedCms(db);
    const [row] = await db.query(
      "SELECT published FROM documents WHERE public_key=$1",
      ["page:/services/mobile-app-development"],
    );
    const page = JSON.parse(row.published);
    page.blocks = page.blocks.map((b) =>
      b.type === "faq"
        ? {
            ...b,
            hidden: true,
            items: (b.items || []).map((i) => ({
              ...i,
              text: "HIDDEN SECTION TEXT",
            })),
          }
        : b,
    );
    await db.query("UPDATE documents SET published=$1 WHERE public_key=$2", [
      JSON.stringify(page),
      "page:/services/mobile-app-development",
    ]);
    for (const question of [
      "do you build mobile apps?",
      "can the app work offline",
    ]) {
      const answer = await ask(db, question);
      assert.ok(!answer.text.includes("HIDDEN SECTION TEXT"));
      assert.ok(!answer.suggestions.join(" ").includes("HIDDEN SECTION TEXT"));
    }
  } finally {
    await db.close();
  }
});

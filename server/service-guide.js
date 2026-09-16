import { z } from "zod";
import rateLimit from "express-rate-limit";
import express from "express";
import { getExperience } from "./experience-settings.js";

const input = z
  .object({
    question: z.string().trim().min(1).max(500),
    context: z.string().max(200).optional(),
  })
  .strict();
const words = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/front[ -]end/g, "frontend")
    .replace(/back[ -]end/g, "backend")
    .match(/[a-z0-9]+/g) || [];
const stop = new Set(
  "a an the this that these those i we you your our us me my to for of and or is are do does did can could would should what how when where which who why tell about please more details it in on with at from be been have has had will want need help".split(
    " ",
  ),
);
/* "apps" and "app" are the same question. Plurals are folded so they match, and
   comparison is word by word: matching on the joined text would let "and" hit
   "brand" and let "apps" miss "app" entirely. */
const stem = (word) =>
  word.length > 3 && word.endsWith("s") && !word.endsWith("ss")
    ? word.slice(0, -1)
    : word;
const tokens = (text) => [
  ...new Set(
    words(text)
      .filter((w) => !stop.has(w))
      .map(stem),
  ),
];
const bag = (text) => new Set(words(text).map(stem));
const normalize = (text) => words(text).join(" ");
const contact = { label: "Open self-service portal", href: "/portal" };

/* Everything the guide is allowed to say, assembled from published pages only.
   A draft or a hidden section never reaches it, so an editor controls exactly
   what a visitor can be told. */
async function knowledge(db) {
  const rows = await db.query(
    "SELECT published FROM documents WHERE kind='page' AND published IS NOT NULL",
  );
  const pages = rows
    .map((r) => JSON.parse(r.published))
    .filter((p) => p && !p.seo?.noindex);
  const entries = [];
  for (const page of pages) {
    const blocks = (page.blocks || []).filter(
      (b) => !b.hidden && b.type !== "template" && b.type !== "contact",
    );
    for (const block of blocks) {
      if (block.heading && block.body)
        entries.push({
          kind: "section",
          question: block.heading,
          text: block.body,
          path: page.path,
          pageTitle: page.title,
        });
      for (const item of block.items || []) {
        if (!item.title || !item.text) continue;
        entries.push({
          kind: block.type === "faq" ? "faq" : "card",
          question: item.title,
          text: item.text,
          path: page.path,
          pageTitle: page.title,
        });
      }
    }
  }
  return { pages, entries };
}

/* Words that appear on every page say little about which page is meant, so
   each term is weighted by how rare it is across the whole site. */
function weights(entries) {
  const seen = new Map();
  for (const entry of entries)
    for (const term of bag(`${entry.question} ${entry.text}`))
      seen.set(term, (seen.get(term) || 0) + 1);
  const total = Math.max(entries.length, 1);
  return (term) => Math.log(1 + total / (1 + (seen.get(term) || 0)));
}

const score = (entry, terms, weight) => {
  entry.questionBag ??= bag(entry.question);
  entry.textBag ??= bag(entry.text);
  return terms.reduce(
    (sum, term) =>
      sum +
      (entry.questionBag.has(term) ? weight(term) * 3 : 0) +
      (entry.textBag.has(term) ? weight(term) : 0),
    0,
  );
};

/* Similarity between what was asked and a question the site already answers.
   Both directions count: the stored answer must cover what was asked AND not be
   mostly about something else. Dividing by the shorter side instead would let a
   two-word heading match almost any question. Rare words weigh more, so
   "mobile" counts for far more than "website". */
function overlap(asked, stored, weight) {
  const a = new Set(tokens(asked));
  const b = new Set(tokens(stored));
  if (!a.size || !b.size) return 0;
  let shared = 0,
    askedWeight = 0,
    storedWeight = 0;
  for (const term of a) {
    askedWeight += weight(term);
    if (b.has(term)) shared += weight(term);
  }
  for (const term of b) storedWeight += weight(term);
  if (!askedWeight || !storedWeight) return 0;
  const covered = shared / askedWeight;
  const onTopic = shared / storedWeight;
  return covered + onTopic ? (2 * covered * onTopic) / (covered + onTopic) : 0;
}

const suggestionsFrom = (entries, terms, weight, exclude) =>
  entries
    .filter((e) => e.kind === "faq" && e.question !== exclude)
    .map((e) => ({ e, s: score(e, terms, weight) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, 3)
    .map(({ e }) => e.question);

export async function guideAnswer(db, { question, context }) {
  const config = await getExperience(db);
  if (!config.chatEnabled)
    return {
      text: "The website guide is currently unavailable.",
      links: [],
      suggestions: [],
      context: null,
    };

  const custom = config.customAnswers.find(
    (a) => normalize(a.question) === normalize(question),
  );
  if (custom)
    return {
      text: custom.answer,
      links: [contact],
      suggestions: [],
      context: context || null,
    };

  const { pages, entries } = await knowledge(db);
  const weight = weights(entries);
  const q = question.toLowerCase();
  const aliases = [
    [/(seo|ppc|advertis|social|campaign|rank|google)/, "marketing seo"],
    [
      /(react|html|css|javascript|website|web page|landing)/,
      "frontend website",
    ],
    [/(android|ios|flutter|mobile|phone|app store)/, "mobile app"],
    [
      /(chatbot|assistant|automate|automation|workflow)/,
      "ai automation workflow",
    ],
    [/(database|nodejs|node|api|server|integration)/, "backend api"],
    [
      /(hack|breach|secure|security|protect|safe|attack)/,
      "cybersecurity security secure",
    ],
    [/(cloud|hosting|devops|deploy|server)/, "cloud devops"],
    [/(design|brand|look|ux|ui)/, "design experience"],
  ];
  const terms = tokens(
    `${question} ${aliases
      .filter(([re]) => re.test(q))
      .map(([, term]) => term)
      .join(" ")}`,
  );

  const follow =
    /^(tell me more|more|details|what else|what is included|how does it work|what do you include|continue|go on)[?.!]*$/.test(
      q,
    );
  const ranked = pages
    .map((page) => {
      const own = entries.filter((e) => e.path === page.path);
      const title = bag(
        `${page.title || ""} ${page.path.replace(/[/-]/g, " ")}`,
      );
      /* Judge a page by its best match plus a little support from the next
         few, not by the total. Summing every match let a long page beat a
         short, exactly-on-topic one simply by having more words. */
      const matched = own
        .map((e) => score(e, terms, weight))
        .sort((a, b) => b - a);
      return {
        page,
        score:
          terms.reduce((n, t) => n + (title.has(t) ? weight(t) * 8 : 0), 0) +
          (matched[0] || 0) +
          matched.slice(1, 4).reduce((n, v) => n + v, 0) * 0.25,
      };
    })
    .sort((a, b) => b.score - a.score);
  const selected =
    follow && context
      ? pages.find((p) => p.path === context)
      : ranked[0]?.score >= 1
        ? ranked[0].page
        : null;

  /* A question the site already answers in writing is answered word for word. */
  const asked = entries
    .filter((e) => e.kind === "faq")
    .map((e) => ({ e, match: overlap(question, e.question, weight) }))
    .sort((a, b) => b.match - a.match)[0];
  /* Only answer straight from an FAQ when that FAQ sits on the page the
     question is most about. Otherwise a near-miss on another service answers
     confidently and wrongly. */
  const bestPage = ranked[0]?.score >= 1 ? ranked[0].page.path : null;
  if (asked && asked.match >= 0.6 && (!bestPage || asked.e.path === bestPage))
    return {
      text: asked.e.text,
      links: [
        { label: `Read more on ${asked.e.pageTitle}`, href: asked.e.path },
        contact,
      ],
      suggestions: suggestionsFrom(entries, terms, weight, asked.e.question),
      context: asked.e.path,
    };

  if (
    /\b(who are you|who you are|about you|about us|about the company|about your company|your company|which company)\b/.test(
      q,
    )
  )
    return {
      text: [
        config.aboutAnswer,
        "Ask me about any service and I will explain what it includes.",
      ]
        .filter(Boolean)
        .join("\n\n"),
      links: [{ label: "About On Zen On", href: "/" }, contact],
      suggestions: suggestionsFrom(entries, terms, weight),
      context: null,
    };
  if (/\b(price|cost|budget|quote|pricing|charge|fee)\b/.test(q))
    return {
      text: config.pricingAnswer,
      links: [contact],
      suggestions: suggestionsFrom(entries, terms, weight),
      context: context || null,
    };
  if (
    /\b(book|booking|schedule|scheduling|appointment|contact|human|email|call|support|inquiry|talk|meet)\b/.test(
      q,
    )
  )
    return {
      text: config.contactAnswer,
      links: [contact],
      suggestions: suggestionsFrom(entries, terms, weight),
      context: context || null,
    };
  if (/\b(timeline|deadline|duration|long|fast|quick)\b/.test(q))
    return {
      text: config.timelineAnswer,
      links: [contact],
      suggestions: suggestionsFrom(entries, terms, weight),
      context: context || null,
    };

  if (!selected) {
    const questions = entries
      .filter((e) => e.kind === "faq")
      .slice(0, 3)
      .map((e) => e.question);
    return {
      text: "I could not find that on the website. I can explain our services, what each one includes, how we work, and how to start a project. Try one of the questions below, or ask about a topic such as websites, mobile apps, SEO, cloud hosting or security.",
      links: [
        ...pages
          .filter((p) =>
            [
              "software-engineering",
              "digital-marketing",
              "ai-workflow-automation",
              "secure-experience-design",
            ].some((s) => p.path.endsWith(`/${s}`)),
          )
          .map((p) => ({ label: p.title, href: p.path })),
        contact,
      ],
      suggestions: questions,
      context: null,
    };
  }

  const own = entries.filter((e) => e.path === selected.path);
  const matches = own
    .map((entry, index) => ({
      entry,
      index,
      s: score(entry, terms, weight),
    }))
    .sort((a, b) => b.s - a.s || a.index - b.index);
  const details = (follow ? matches.slice(3, 7) : matches.slice(0, 4)).map(
    (m) => m.entry,
  );
  const intro =
    (selected.blocks || []).find((b) => !b.hidden && b.type === "hero")?.body ||
    selected.seo?.description ||
    "Here is what the website says about this.";
  return {
    text: [
      selected.title,
      intro,
      ...(details.length ? details : own.slice(0, 4)).map(
        (e) => `${e.question}: ${e.text}`,
      ),
      "Would you like more details, or help starting a project?",
    ]
      .join("\n\n")
      .slice(0, 6500),
    links: [{ label: `Read ${selected.title}`, href: selected.path }, contact],
    suggestions: suggestionsFrom(entries, terms, weight),
    context: selected.path,
  };
}

export function mountGuide(app, db, origin) {
  app.post(
    "/api/guide",
    rateLimit({
      windowMs: 60000,
      limit: 25,
      standardHeaders: true,
      legacyHeaders: false,
    }),
    express.json({ limit: "4kb" }),
    async (req, res) => {
      res.set("Cache-Control", "no-store");
      if (req.get("origin") !== origin)
        return res.status(403).json({ error: "Origin not allowed" });
      const data = input.safeParse(req.body);
      if (!data.success)
        return res
          .status(400)
          .json({ error: "Enter a question of up to 500 characters." });
      res.json(await guideAnswer(db, data.data));
    },
  );
}

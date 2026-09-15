import { z } from "zod";
import rateLimit from "express-rate-limit";
import express from "express";

const input = z
  .object({
    question: z.string().trim().min(1).max(500),
    context: z.string().max(200).optional(),
  })
  .strict();
const words = (text) =>
  text
    .toLowerCase()
    .replace(/front[ -]end/g, "frontend")
    .replace(/back[ -]end/g, "backend")
    .match(/[a-z0-9]+/g) || [];
const stop = new Set(
  "a an the this that these those i we you your our me my to for of and or is are do does can what how tell about please more details it in with on services service development".split(
    " ",
  ),
);
const tokens = (text) => [...new Set(words(text).filter((w) => !stop.has(w)))];
const contact = { label: "Open self-service portal", href: "/portal" };
export async function guideAnswer(db, { question, context }) {
  const rows = await db.query(
    "SELECT published FROM documents WHERE kind='page' AND published IS NOT NULL",
  );
  const pages = rows
    .map((r) => JSON.parse(r.published))
    .filter((p) => p.path.startsWith("/services/") && !p.seo?.noindex);
  const q = question.toLowerCase();
  if (/\b(price|cost|budget|quote|pricing)\b/.test(q))
    return {
      text: "We prepare a quote after reviewing your scope. Share the features you need, existing systems, integrations and target launch date. The team will confirm pricing; this guide cannot issue a binding quote.",
      links: [contact],
      context,
    };
  if (
    /\b(book|booking|schedule|scheduling|appointment|contact|human|email|call|support|inquiry)\b/.test(
      q,
    )
  )
    return {
      text: "The self-service portal helps you send a project request and review its status. For a conversation with the team, include your preferred contact time. I am an automated guide, not a live agent.",
      links: [contact],
      context,
    };
  if (/\b(timeline|deadline|duration)\b|how long/.test(q))
    return {
      text: "Your schedule depends on the agreed features, integrations, content and review rounds. Share your launch target in the portal so the team can confirm a realistic plan.",
      links: [contact],
      context,
    };
  const aliases=[[/\b(seo|ppc|advertising|social)\b/,"marketing"],[/\b(react|html|css|javascript)\b/,"frontend"],[/\b(android|ios|flutter)\b/,"mobile"],[/\b(chatbot|assistant)\b/,"automation"],[/\b(database|nodejs)\b/,"backend"]];
  const terms = tokens(question+" "+aliases.filter(([re])=>re.test(q)).map(([,term])=>term).join(" "));
  const ranked = pages
    .map((p) => {
      const title = words(p.title || p.path).join(" ");
      const body = p.blocks
        .filter((b) => b.type !== "template")
        .map((b) =>
          [
            b.heading,
            b.body,
            ...(b.items || []).flatMap((i) => [i.title, i.text]),
          ].join(" "),
        )
        .join(" ");
      const score = terms.reduce(
        (n, t) =>
          n +
          (title.includes(t) ? 8 : 0) +
          (body.toLowerCase().includes(t) ? 1 : 0),
        0,
      );
      return { p, score };
    })
    .sort((a, b) => b.score - a.score);
  const follow =
    /^(tell me more|more|details|what else|what is included|how does it work|what do you include)[?.!]*$/.test(
      q,
    );
  const selected =
    follow && context
      ? pages.find((p) => p.path === context)
      : ranked[0]?.score >= 1
        ? ranked[0].p
        : null;
  if (!selected)
    return {
      text: "I can explain our published services and what each includes. Which area are you interested in: software engineering, digital marketing, AI automation, or secure experience design? You can also ask about a specific topic such as React, SEO, mobile apps or cloud hosting.",
      links: pages
        .filter((p) =>
          [
            "software-engineering",
            "digital-marketing",
            "ai-workflow-automation",
            "secure-experience-design",
          ].some((s) => p.path.endsWith("/" + s)),
        )
        .map((p) => ({ label: p.title, href: p.path })),
      context: null,
    };
  const blocks = selected.blocks.filter(
    (b) => b.type !== "template" && b.type !== "contact",
  );
  const candidates = blocks
    .flatMap((b) =>
      (b.items || []).map((i) => ({ title: i.title, text: i.text })),
    )
    .filter((i) => i.title && i.text);
  const matches = candidates
    .map((i, index) => ({
      ...i,
      index,
      score: terms.reduce(
        (n, t) =>
          n +
          (i.title.toLowerCase().includes(t) ? 4 : 0) +
          (i.text.toLowerCase().includes(t) ? 1 : 0),
        0,
      ),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index);
  const details = follow ? candidates.slice(3, 7) : matches.slice(0, 4);
  const intro =
    blocks.find((b) => b.type === "hero")?.body ||
    "Explore the published service details below.";
  return {
    text: [
      selected.title,
      intro,
      ...(details.length ? details : candidates.slice(0, 4)).map(
        (i) => `${i.title}: ${i.text}`,
      ),
      "Would you like more details, or help starting a project?",
    ]
      .join("\n\n")
      .slice(0, 6500),
    links: [
      { label: "Read full service details", href: selected.path },
      contact,
    ],
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

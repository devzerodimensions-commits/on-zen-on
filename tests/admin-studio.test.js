import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, dirname, basename } from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { openDb } from "../cms/server/db.js";
import { createApp } from "../cms/server/app.js";
import { createUser } from "../cms/server/auth.js";
import {
  blankBlock,
  sectionTypes,
  blockSchema,
} from "../cms/shared/content.js";
import { starterBlock } from "../cms/shared/starters.js";
import {
  sectionClasses,
  sectionStyleDefaults,
  sectionStyleOptions,
  sectionCustomCss,
  pageCustomCss,
} from "../shared/section-style.js";
import { schemas } from "../cms/shared/content.js";
import { templateManifest } from "../shared/templates.js";
import {
  themeDefaults,
  themeCss,
  colorPresets,
  contrastRatio,
  readableOn,
} from "../shared/theme.js";

let db, app, dir, admin, csrf;
const origin = "http://localhost:3100";
const pass = "test-only-password-very-long";
/* Every section colour offered in the admin. */
const tones = [
  "white",
  "tint",
  "brand",
  "dark",
  "accent",
  "green",
  "yellow",
  "blue",
  "purple",
  "red",
  "teal",
];
const write = (method, path, body) =>
  admin[method](path)
    .set("Origin", origin)
    .set("X-CSRF-Token", csrf)
    .send(body);

before(async () => {
  dir = await mkdtemp(join(tmpdir(), "ozo-studio-"));
  db = await openDb({ url: null, path: join(dir, "db.sqlite") });
  app = await createApp(db, {
    origin,
    mediaDir: join(dir, "media"),
    production: false,
  });
  await createUser(db, "admin@example.test", pass);
  admin = request.agent(app);
  csrf = (
    await admin
      .post("/api/cms/login")
      .set("Origin", origin)
      .send({ email: "admin@example.test", password: pass })
      .expect(200)
  ).body.csrf;
});
after(async () => {
  await db.close();
  if (
    dirname(resolve(dir)) !== resolve(tmpdir()) ||
    !basename(dir).startsWith("ozo-studio-")
  )
    throw Error("Refusing cleanup outside test directory");
  await rm(dir, { recursive: true, force: true });
});

test("appearance settings publish and reach the public site as CSS", async () => {
  const theme = {
    ...themeDefaults,
    ...colorPresets.forest.colors,
    enabled: true,
    preset: "forest",
    font: "poppins",
    headingFont: "playfair",
    bodySize: 19,
    buttonStyle: "pill",
    cardShadow: "strong",
  };
  const created = await write("post", "/api/cms/documents", {
    kind: "settings",
    data: {
      siteName: "On Zen On",
      tagline: "Creation meets growth.",
      footerText: "",
      email: "hello@onzenon.com",
      phone: "",
      theme,
    },
  }).expect(201);
  await write("post", `/api/cms/documents/${created.body.id}/publish`, {
    version: created.body.version,
  }).expect(200);

  const site = await admin.get("/api/public/site").expect(200);
  const published = site.body.settings.theme;
  assert.equal(published.font, "poppins");
  assert.equal(published.headingFont, "playfair");
  assert.equal(published.primary, colorPresets.forest.colors.primary);

  const css = themeCss(published);
  assert.match(css, /Poppins/);
  assert.match(css, /Playfair Display/);
  assert.match(css, /font-size:19px/);
  assert.match(css, /border-radius:999px/);
  assert.equal(themeCss({ ...published, enabled: false }), "");
});

test("settings saved before the appearance studio existed still validate", async () => {
  const legacy = {
    siteName: "On Zen On",
    tagline: "Creation meets growth.",
    footerText: "",
    email: "hello@onzenon.com",
    phone: "",
    theme: {
      enabled: true,
      font: "system",
      bodySize: 16,
      headingSize: 48,
      lineHeight: 1.7,
      primary: "#1119a5",
      secondary: "#08723b",
      accent: "#ecb900",
      background: "#f9f8f1",
      text: "#172e35",
      buttonText: "#ffffff",
      radius: 12,
      sectionSpacing: 80,
      logoSize: 160,
      mobileLogoSize: 112,
    },
  };
  const created = await write("post", "/api/cms/documents", {
    kind: "settings",
    data: legacy,
  }).expect(201);
  /* Missing newer keys are filled with their defaults rather than rejected. */
  assert.equal(created.body.draft.theme.buttonStyle, "solid");
  assert.equal(created.body.draft.theme.surface, "#ffffff");
  assert.ok(themeCss(created.body.draft.theme).length > 0);
});

test("a hidden section stays in the draft and is published, ready to show again", async () => {
  const created = await write("post", "/api/cms/documents", {
    kind: "page",
    data: {
      schemaVersion: 1,
      title: "Hidden section page",
      path: `/hidden-${randomUUID().slice(0, 8)}`,
      seo: {
        title: "Hidden section page",
        description: "Checks that hidden sections survive publishing.",
        canonical: "",
        ogImage: "",
        noindex: false,
      },
      blocks: [
        { ...blankBlock(), heading: "Visible" },
        { ...blankBlock("cta"), heading: "Switched off", hidden: true },
      ],
    },
  }).expect(201);
  assert.equal(created.body.draft.blocks[1].hidden, true);
  const live = await write(
    "post",
    `/api/cms/documents/${created.body.id}/publish`,
    { version: created.body.version },
  ).expect(200);
  assert.equal(live.body.published.blocks.length, 2);
  assert.equal(live.body.published.blocks[0].hidden, false);
  assert.equal(live.body.published.blocks[1].hidden, true);
});

test("a hidden shared reference hides the section it points at", async () => {
  const section = await write("post", "/api/cms/documents", {
    kind: "section",
    data: { ...blankBlock("cta"), heading: "Shared promo" },
  }).expect(201);
  await write("post", `/api/cms/documents/${section.body.id}/publish`, {
    version: section.body.version,
  }).expect(200);
  const page = await write("post", "/api/cms/documents", {
    kind: "page",
    data: {
      schemaVersion: 1,
      title: "Shared reference page",
      path: `/shared-${randomUUID().slice(0, 8)}`,
      seo: {
        title: "Shared reference page",
        description: "Checks hidden shared references.",
        canonical: "",
        ogImage: "",
        noindex: false,
      },
      blocks: [
        { ...blankBlock(), heading: "Visible" },
        {
          id: randomUUID(),
          type: "shared",
          hidden: true,
          sectionId: section.body.id,
        },
      ],
    },
  }).expect(201);
  const live = await write(
    "post",
    `/api/cms/documents/${page.body.id}/publish`,
    {
      version: page.body.version,
    },
  ).expect(200);
  assert.equal(live.body.published.blocks[1].heading, "Shared promo");
  assert.equal(live.body.published.blocks[1].hidden, true);
});

test("pictures can be renamed, and deleting one that is still in use is refused", async () => {
  const file = await sharp({
    create: { width: 10, height: 10, channels: 3, background: "#3366cc" },
  })
    .png()
    .toBuffer();
  const uploaded = await admin
    .post("/api/cms/media")
    .set("Origin", origin)
    .set("X-CSRF-Token", csrf)
    .field("alt", "Blue square")
    .attach("file", file, "square.png")
    .expect(201);

  await write("patch", `/api/cms/media/${uploaded.body.id}`, {
    alt: "Team photo from the studio",
  }).expect(200);
  const listed = await admin.get("/api/cms/media").expect(200);
  assert.equal(
    listed.body.find((m) => m.id === uploaded.body.id).alt,
    "Team photo from the studio",
  );

  const page = await write("post", "/api/cms/documents", {
    kind: "page",
    data: {
      schemaVersion: 1,
      title: "Picture page",
      path: `/picture-${randomUUID().slice(0, 8)}`,
      seo: {
        title: "Picture page",
        description: "Checks that used pictures cannot be deleted.",
        canonical: "",
        ogImage: "",
        noindex: false,
      },
      blocks: [
        {
          ...blankBlock(),
          heading: "With a picture",
          image: uploaded.body.url,
          alt: "Team photo",
        },
      ],
    },
  }).expect(201);
  const refused = await write(
    "delete",
    `/api/cms/media/${uploaded.body.id}`,
  ).expect(409);
  assert.match(refused.body.error, /still used/);

  /* Once the picture is off the page the deletion goes through. */
  await write("put", `/api/cms/documents/${page.body.id}`, {
    version: page.body.version,
    data: {
      ...page.body.draft,
      blocks: [{ ...page.body.draft.blocks[0], image: "", alt: "" }],
    },
  }).expect(200);
  await write("delete", `/api/cms/media/${uploaded.body.id}`).expect(200);
  await admin.get(uploaded.body.url).expect(404);
});

test("every ready-made theme keeps its text readable", () => {
  for (const [name, preset] of Object.entries(colorPresets)) {
    const c = preset.colors;
    const css = themeCss({ ...themeDefaults, ...c, enabled: true });
    /* The colour the generator chose for text on the brand-coloured banner. */
    const [, onBanner] = css.match(
      /\.contact\) :is\(p,[^{]*\{color:(#[0-9a-f]{6})/,
    );
    const pairs = {
      "body text on the page": [c.text, c.background],
      "lighter text on a card": [c.muted, c.surface],
      "text on the brand banner": [onBanner, c.primary],
      "text on the second colour": [readableOn(c.secondary), c.secondary],
      "button text on the button": [c.buttonText, c.primary],
      "menu text on the header": [c.headerText, c.headerBackground],
      "footer text on the footer": [c.footerTextColor, c.footerBackground],
    };
    for (const [what, [front, back]] of Object.entries(pairs))
      assert.ok(
        contrastRatio(front, back) >= 4.5,
        `${name}: ${what} is ${contrastRatio(front, back)}:1, below WCAG AA`,
      );
  }
});

test("softened text never drops below the readable threshold", () => {
  /* A brand colour whose ideal text colour is only just readable must not be
     softened any further. */
  for (const primary of ["#b3401b", "#0f737c", "#767676", "#ffdd00"]) {
    const css = themeCss({
      ...themeDefaults,
      ...colorPresets.original.colors,
      primary,
      enabled: true,
    });
    const [, onBanner] = css.match(
      /\.contact\) :is\(p,[^{]*\{color:(#[0-9a-f]{6})/,
    );
    assert.ok(
      contrastRatio(onBanner, primary) >= 4.5,
      `${primary}: banner text is ${contrastRatio(onBanner, primary)}:1`,
    );
  }
});

test("card text beats the brand-section text rule that surrounds it", () => {
  /* Cards keep a pale surface inside a brand-coloured section. If the rule for
     text on the brand colour outranks the rule for text on a card, card text
     turns almost white on white, which is exactly what shipped once before.
     The card rule must therefore be nested at least as deeply as the section
     rule AND come after it, so it wins on specificity or on source order. */
  const css = themeCss({
    ...themeDefaults,
    ...colorPresets.original.colors,
    surface: "#ffffff",
    enabled: true,
  });
  const lines = css.split(String.fromCharCode(10));
  const sectionRule = lines.findIndex(
    (l) =>
      l.includes(":is(.hero,.services,.contact) :is(p,") &&
      !l.includes(".service-card"),
  );
  const cardRule = lines.findIndex(
    (l) => l.includes(".service-card") && l.includes(":is(p,small,span"),
  );
  assert.ok(sectionRule !== -1, "no rule colours text on brand sections");
  assert.ok(cardRule !== -1, "no rule colours text inside cards");
  assert.ok(
    cardRule > sectionRule,
    "the card rule must come after the brand-section rule",
  );
  assert.ok(
    lines[cardRule].includes(".hero,.services,.contact"),
    "the card rule must be nested inside the same sections to match their specificity",
  );
});

test("a case studies section saves and publishes like any other", async () => {
  const created = await write("post", "/api/cms/documents", {
    kind: "page",
    data: {
      schemaVersion: 1,
      title: "Our work",
      path: `/work-${randomUUID().slice(0, 8)}`,
      seo: {
        title: "Our work",
        description: "Projects we have delivered.",
        canonical: "",
        ogImage: "",
        noindex: false,
      },
      blocks: [
        {
          ...blankBlock("casestudies"),
          heading: "Selected projects",
          items: [
            {
              title: "A project name",
              text: "What the customer needed and what changed.",
              href: "/services",
              image: "",
              alt: "",
            },
          ],
        },
      ],
    },
  }).expect(201);
  assert.equal(created.body.draft.blocks[0].type, "casestudies");
  const live = await write(
    "post",
    `/api/cms/documents/${created.body.id}/publish`,
    { version: created.body.version },
  ).expect(200);
  assert.equal(live.body.published.blocks[0].items[0].title, "A project name");
});

test("a call to action stays visible on a brand-coloured section", () => {
  /* The generic button rule paints buttons in the brand colour. On the hero,
     services and contact sections the background IS the brand colour, so the
     button vanished into it and only its text showed — measured at 1.0:1 on
     the published site. */
  for (const [name, preset] of Object.entries(colorPresets)) {
    const css = themeCss({ ...themeDefaults, ...preset.colors, enabled: true });
    const rule = css
      .split(String.fromCharCode(10))
      .find((line) =>
        line.includes(":is(.hero,.services,.contact) :is(.button"),
      );
    assert.ok(rule, `${name}: no call-to-action rule for brand sections`);
    const background = rule.match(/background:(#[0-9a-f]{6})/)[1];
    const text = rule.match(/!important;color:(#[0-9a-f]{6})/)[1];
    assert.ok(
      contrastRatio(background, preset.colors.primary) >= 3,
      `${name}: button is ${contrastRatio(background, preset.colors.primary)}:1 against the section behind it`,
    );
    assert.ok(
      contrastRatio(text, background) >= 4.5,
      `${name}: button text is ${contrastRatio(text, background)}:1 on the button`,
    );
  }
});

test("neighbouring pale sections are told apart", () => {
  /* Six near-white sections ran together down the page. Alternating white with
     a brand-tinted band gives the middle of the page a rhythm. */
  const css = themeCss({
    ...themeDefaults,
    ...colorPresets.original.colors,
    enabled: true,
  });
  const lines = css.split(String.fromCharCode(10));
  const white = lines.find((l) =>
    l.includes(".technology,.industries-showcase"),
  );
  const tinted = lines.find((l) => l.includes(".outcomes,.results,.showcase"));
  assert.ok(white && tinted, "both halves of the alternation must exist");
  const a = white.match(/background:(#[0-9a-f]{6})/)[1];
  const b = tinted.match(/background:(#[0-9a-f]{6})/)[1];
  assert.notEqual(a, b, "alternating sections must not share a background");
  /* Different enough to see, close enough not to fight the content. */
  const difference = contrastRatio(a, b);
  assert.ok(
    difference > 1.03 && difference < 1.6,
    `bands differ by ${difference}`,
  );
});

test("an unreadable colour pairing is never rendered", () => {
  /* The published site had a cream footer saved with pale footer text: 1.2:1,
     invisible. The studio warns below 4.5, but nothing may RENDER below 3. */
  const css = themeCss({
    ...themeDefaults,
    ...colorPresets.original.colors,
    enabled: true,
    footerBackground: "#f9f8f1",
    footerTextColor: "#dbe6df",
    text: "#f2f2f2",
    background: "#ffffff",
  });
  const lines = css.split(String.fromCharCode(10));
  const footer = lines.find((l) => l.startsWith("html body footer{"));
  const footerColour = footer.match(/color:(#[0-9a-f]{6})/)[1];
  assert.ok(
    contrastRatio(footerColour, "#f9f8f1") >= 4.5,
    `footer text rendered at ${contrastRatio(footerColour, "#f9f8f1")}:1`,
  );
  const body = lines.find((l) =>
    l.includes("body{background:#ffffff!important"),
  );
  const bodyColour = body.match(/color:(#[0-9a-f]{6})/)[1];
  assert.ok(
    contrastRatio(bodyColour, "#ffffff") >= 4.5,
    `body text rendered at ${contrastRatio(bodyColour, "#ffffff")}:1`,
  );
});

test("a section can be recoloured on its own, and stays readable", () => {
  /* Changing a colour in the theme changed every section at once. A section now
     carries its own named tone, and each tone derives its text from its own
     background, so no combination can be made unreadable. */
  for (const [name, preset] of Object.entries(colorPresets)) {
    const css = themeCss({
      ...themeDefaults,
      ...preset.colors,
      enabled: true,
    }).split(String.fromCharCode(10));
    for (const tone of tones) {
      const background = css
        .find((l) => l.includes(`.cms-tone-${tone}{`))
        .match(/background:(#[0-9a-f]{6})/)[1];
      const heading = css
        .find((l) => l.includes(`.cms-tone-${tone} :is(h1,`))
        .match(/color:(#[0-9a-f]{6})/)[1];
      const body = css
        .find((l) => l.includes(`.cms-tone-${tone} :is(p,li,`))
        .match(/color:(#[0-9a-f]{6})/)[1];
      assert.ok(
        contrastRatio(heading, background) >= 4.5,
        `${name}/${tone}: heading is ${contrastRatio(heading, background)}:1`,
      );
      assert.ok(
        contrastRatio(body, background) >= 4.5,
        `${name}/${tone}: body is ${contrastRatio(body, background)}:1`,
      );
      /* A card has to be visible against the section it sits on. */
      const card = css
        .find((l) => l.includes(`.cms-tone-${tone} :is(.service-card`))
        .match(/background:(#[0-9a-f]{6})/)[1];
      assert.notEqual(
        card,
        background,
        `${name}/${tone}: card matches section`,
      );
    }
  }
});

test("cards with their own dark panel do not take the pale section's text colour", () => {
  /* The result cards paint dark panels inside a pale section. The rule
     colouring text for that pale section reached inside them, so their text
     rendered dark on dark and could not be read. Each panel now works its own
     text out from the colour it actually sits on. */
  for (const [name, preset] of Object.entries(colorPresets)) {
    const css = themeCss({
      ...themeDefaults,
      ...preset.colors,
      enabled: true,
    }).split(String.fromCharCode(10));
    const pick = (selector) =>
      css.find((l) => l.includes(selector)).match(/color:(#[0-9a-f]{6})/)[1];
    const panels = [
      [".result-cards article :is(strong,h3)", preset.colors.primary],
      [".result-cards article p", preset.colors.primary],
      [".result-cards article b", preset.colors.primary],
      [
        ".result-cards article:nth-child(2) :is(strong,h3)",
        preset.colors.secondary,
      ],
      [".result-cards article:nth-child(2) p", preset.colors.secondary],
      [".result-cards article:nth-child(2) b", preset.colors.secondary],
    ];
    for (const [selector, background] of panels) {
      const colour = pick(selector);
      assert.ok(
        contrastRatio(colour, background) >= 4.5,
        `${name}: ${selector} is ${contrastRatio(colour, background)}:1 on its panel`,
      );
    }
  }
});

test("a new section arrives filled in, not as an empty box", () => {
  /* Adding a section used to drop "New section" onto the page with nothing in
     it, leaving the editor to invent a heading, a body and every card. */
  for (const type of sectionTypes) {
    const block = starterBlock(type);
    assert.ok(blockSchema.safeParse(block).success, `${type} is not valid`);
    assert.notEqual(block.heading, "New section", `${type} is still empty`);
    assert.ok(block.heading.length > 3, `${type} has no heading`);
    /* Types that show a list of cards arrive with cards to rename. */
    if (
      [
        "services",
        "industries",
        "features",
        "process",
        "faq",
        "casestudies",
      ].includes(type)
    ) {
      assert.ok(block.items.length >= 3, `${type} arrived with no cards`);
      for (const item of block.items)
        assert.ok(item.title && item.text, `${type} has a blank card`);
    }
  }
});

test("every kind of section can be recoloured, branded ones included", () => {
  /* The colour control only reached sections built from generic blocks; the
     branded layouts, which are most of the home page, had no way to change. */
  const branded = {
    id: randomUUID(),
    type: "template",
    template: "hero",
    tone: "dark",
    fields: Object.fromEntries(
      Object.keys(templateManifest.hero.fields).map((key) => [
        key,
        templateManifest.hero.fields[key].label,
      ]),
    ),
  };
  const parsed = schemas.section.safeParse(branded);
  assert.ok(parsed.success, "a branded section cannot carry a tone");
  assert.equal(parsed.data.tone, "dark");
  /* And it defaults to leaving the section alone. */
  const { tone, ...without } = branded;
  assert.equal(schemas.section.parse(without).tone, "default");
});

test("style choices reach the page, and nothing else does", () => {
  /* Defaults add no classes at all, so a page nobody has styled renders
     exactly as it did before and the stylesheet has nothing extra to fight. */
  assert.equal(sectionClasses(sectionStyleDefaults), "");
  assert.equal(sectionClasses({}), "");
  assert.equal(sectionClasses(null), "");

  const styled = sectionClasses({
    tone: "dark",
    align: "center",
    headingScale: "xlarge",
    spacing: "roomy",
    hideOn: "mobile",
  });
  for (const expected of [
    "cms-tone-dark",
    "cms-align-center",
    "cms-scale-xlarge",
    "cms-space-roomy",
    "cms-hide-mobile",
  ])
    assert.ok(styled.includes(expected), `${expected} never reached the page`);

  /* A value that is not one of the offered choices is dropped rather than
     written into the class attribute. */
  assert.equal(
    sectionClasses({ tone: '"><script>alert(1)</script>', align: "sideways" }),
    "",
  );
});

test("every style choice offered in the admin is one the schema accepts", () => {
  /* The dropdowns and the schema have to agree, or a choice an editor makes
     is rejected when they try to save it. */
  for (const [field, options] of Object.entries(sectionStyleOptions)) {
    for (const [value] of options) {
      const parsed = blockSchema.safeParse({
        ...blankBlock(),
        [field]: value,
      });
      assert.ok(
        parsed.success,
        `${field}="${value}" is offered in the admin but rejected on save`,
      );
      assert.equal(parsed.data[field], value);
    }
    assert.ok(
      options.some(([value]) => value === sectionStyleDefaults[field]),
      `${field} has no option matching its own default`,
    );
  }
});

test("typography set on one section reaches the page, scoped to it", async () => {
  const styled = {
    ...blankBlock(),
    heading: "A styled section",
    fontFamily: "poppins",
    headingSize: 50,
    fontWeight: 700,
    textTransform: "uppercase",
    lineHeight: 1.16,
    letterSpacing: -0.8,
    wordSpacing: 2,
    headingColor: "#ffffff",
    textColor: "#d0d0d0",
  };
  const plain = { ...blankBlock(), heading: "An ordinary section" };

  /* The schema has to accept every one of those fields. */
  const created = await write("post", "/api/cms/documents", {
    kind: "page",
    data: {
      schemaVersion: 1,
      title: "Typography",
      path: `/type-${randomUUID().slice(0, 8)}`,
      seo: {
        title: "Typography",
        description: "Checks per-section typography survives publishing.",
        canonical: "",
        ogImage: "",
        noindex: false,
      },
      blocks: [styled, plain],
    },
  }).expect(201);
  const saved = created.body.draft.blocks[0];
  assert.equal(saved.headingSize, 50);
  assert.equal(saved.fontFamily, "poppins");
  assert.equal(saved.headingColor, "#ffffff");

  const live = await write(
    "post",
    `/api/cms/documents/${created.body.id}/publish`,
    { version: created.body.version },
  ).expect(200);
  const blocks = live.body.published.blocks;

  const css = pageCustomCss(blocks);
  assert.match(css, /font-size:50px!important/);
  assert.match(css, /Poppins/);
  assert.match(css, /text-transform:uppercase!important/);
  assert.match(css, /letter-spacing:-0\.8px!important/);
  assert.match(css, /color:#d0d0d0!important/);

  /* Every rule is scoped to the styled section, and the plain one beside it
     produces nothing at all. */
  const scope = `.cms-s-${blocks[0].id}`;
  for (const rule of css.split(String.fromCharCode(10)))
    assert.ok(rule.startsWith(scope), `a rule escaped its section: ${rule}`);
  assert.equal(sectionCustomCss(blocks[1]), "");
  assert.equal(sectionClasses(blocks[1]), "");
  assert.ok(sectionClasses(blocks[0]).includes(`cms-s-${blocks[0].id}`));
});

test("a colour the editor never set writes no rule", () => {
  /* Automatic has to mean automatic: an untouched section must not start
     emitting colour rules that fight the published theme. */
  const block = { ...blankBlock() };
  assert.equal(sectionCustomCss(block), "");
  assert.equal(pageCustomCss([block, { ...blankBlock() }]), "");
});

test("dark mode is generated for every section and every colour", () => {
  /* Every rule was scoped to light mode, so with dark mode on the site fell
     back to a half-finished stylesheet: eleven of fifteen home page sections
     measured under 4.5, several near 1.0, and two kept white backgrounds. */
  for (const [name, preset] of Object.entries(colorPresets)) {
    const css = themeCss({
      ...themeDefaults,
      ...preset.colors,
      enabled: true,
    }).split(String.fromCharCode(10));
    const dark = css.filter((l) => l.startsWith('html[data-theme="dark"]'));
    assert.ok(dark.length > 30, `${name}: only ${dark.length} dark rules`);

    /* The page itself must actually be dark. */
    const page = dark
      .find((l) => l.startsWith('html[data-theme="dark"] body{'))
      .match(/background:(#[0-9a-f]{6})/)[1];
    assert.ok(
      contrastRatio(page, "#ffffff") > 8,
      `${name}: dark page background is ${page}`,
    );

    /* And every tone has readable text on it in dark mode too. */
    for (const tone of tones) {
      const bg = dark
        .find((l) =>
          l.startsWith(`html[data-theme="dark"] body .cms-tone-${tone}{`),
        )
        .match(/background:(#[0-9a-f]{6})/)[1];
      const text = dark
        .find((l) =>
          l.startsWith(
            `html[data-theme="dark"] body .cms-tone-${tone} :is(p,li,`,
          ),
        )
        .match(/color:(#[0-9a-f]{6})/)[1];
      assert.ok(
        contrastRatio(text, bg) >= 4.5,
        `${name}/${tone} in dark mode is ${contrastRatio(text, bg)}:1`,
      );
    }
  }
});

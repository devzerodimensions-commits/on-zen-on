import { test } from "node:test";
import assert from "node:assert/strict";
import { structuredData, pageShell } from "../cms/integration/seo.js";

const origin = "https://on-zen-on.onrender.com";
const settings = {
  siteName: "On Zen On Private Limited",
  tagline: "Creation meets growth.",
  footerText: "We create secure digital products.",
  email: "hello@onzenon.com",
  phone: "+91 00000 00000",
};
const page = (extra = {}) => ({
  path: "/",
  title: "Home",
  seo: {
    title: "On Zen On | Creation Meets Growth",
    description: "Web, apps and AI built to grow your business.",
    canonical: "",
    ogImage: "",
    noindex: false,
  },
  blocks: [],
  ...extra,
});
const typesIn = (data) => data["@graph"].map((entry) => entry["@type"]);

test("every page describes the business to search engines and AI assistants", () => {
  const data = structuredData(page(), settings, origin);
  assert.equal(data["@context"], "https://schema.org");
  assert.ok(typesIn(data).includes("Organization"));
  assert.ok(typesIn(data).includes("WebSite"));
  assert.ok(typesIn(data).includes("WebPage"));
  const org = data["@graph"].find((e) => e["@type"] === "Organization");
  assert.equal(org.name, settings.siteName);
  assert.equal(org.email, settings.email);
  assert.equal(org.telephone, settings.phone);
  assert.match(org.logo.url, /^https:\/\//);
  /* The home page is the site root, so it needs no breadcrumb trail. */
  assert.ok(!typesIn(data).includes("BreadcrumbList"));
});

test("a service page is described as a service, with a breadcrumb trail", () => {
  const data = structuredData(
    page({ path: "/services/cybersecurity", title: "Cybersecurity" }),
    settings,
    origin,
  );
  const service = data["@graph"].find((e) => e["@type"] === "Service");
  assert.equal(service.name, "Cybersecurity");
  assert.equal(service.provider["@id"], `${origin}/#organization`);
  const crumbs = data["@graph"].find((e) => e["@type"] === "BreadcrumbList");
  assert.deepEqual(
    crumbs.itemListElement.map((i) => i.name),
    ["Home", "Services", "Cybersecurity"],
  );
});

test("questions on a page become answerable FAQ data", () => {
  const data = structuredData(
    page({
      blocks: [
        {
          type: "faq",
          items: [
            { title: "Do you run security audits?", text: "Yes, we do." },
            { title: "No answer yet", text: "" },
          ],
        },
      ],
    }),
    settings,
    origin,
  );
  const faq = data["@graph"].find((e) => e["@type"] === "FAQPage");
  assert.equal(
    faq.mainEntity.length,
    1,
    "a question with no answer is skipped",
  );
  assert.equal(faq.mainEntity[0].name, "Do you run security audits?");
  assert.equal(faq.mainEntity[0].acceptedAnswer.text, "Yes, we do.");
});

test("a section hidden from visitors is hidden from search engines too", () => {
  const data = structuredData(
    page({
      blocks: [
        {
          type: "faq",
          hidden: true,
          items: [{ title: "Secret", text: "Not published." }],
        },
        {
          type: "testimonials",
          hidden: true,
          items: [{ title: "Someone", text: "A review." }],
        },
      ],
    }),
    settings,
    origin,
  );
  assert.ok(!typesIn(data).includes("FAQPage"));
  assert.ok(!typesIn(data).includes("Review"));
});

test("published text cannot break out of the structured data script", () => {
  const html = pageShell(
    "<head><title>Old</title></head>",
    page({
      seo: { ...page().seo, title: "</script><script>alert(1)</script>" },
    }),
    origin,
    settings,
  );
  assert.ok(html.includes('type="application/ld+json"'));
  /* The hostile title survives as inert text inside the JSON. What matters is
     that it opens no element: the structured-data script is the only one, and
     the closing tag that would have ended it early is escaped away. */
  assert.equal(html.match(/<script/g).length, 1);
  assert.equal(html.match(/<\/script>/g).length, 1);
  assert.ok(!html.includes("<script>alert"));
  assert.ok(html.includes("u003c/scriptu003e") || html.includes("u003c"));
});

test("structured data survives a page with no company settings saved", () => {
  const data = structuredData(page(), null, origin);
  const org = data["@graph"].find((e) => e["@type"] === "Organization");
  assert.ok(org.name.length > 0);
  assert.ok(!("email" in org));
});

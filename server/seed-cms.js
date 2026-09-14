import { createHash } from "node:crypto";
import { templateDefaults, menuDefaults } from "../shared/templates.js";
import { schemas } from "../cms/shared/content.js";
export const stableId = (name) => {
  const h = createHash("sha256").update(`onzenon-cms-v1:${name}`).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
};
export async function seedCms(db) {
  const home = {
    schemaVersion: 1,
    title: "Home",
    path: "/",
    seo: {
      title: "On Zen On | Creation Meets Growth",
      description:
        "On Zen On delivers software development, digital marketing and intelligent automation solutions for ambitious businesses.",
      canonical: "",
      ogImage: "/assets/software-laptop-3d.png",
      noindex: false,
    },
    blocks: Object.values(templateDefaults).filter(
      (b) => !b.template.startsWith("site-"),
    ),
  };
  const seeds = [
    [
      "settings",
      "settings",
      {
        siteName: "On Zen On Private Limited",
        tagline: "Creation meets growth.",
        footerText:
          "We create secure digital products, intelligent automation and growth-focused marketing for businesses ready to move forward.",
        email: "hello@onzenon.com",
        phone: "+91 00000 00000",
      },
      "settings:global",
    ],
    ["home", "page", home, "page:/"],
    [
      "site-header",
      "section",
      templateDefaults["site-header"],
      "layout:site-header",
    ],
    [
      "site-footer",
      "section",
      templateDefaults["site-footer"],
      "layout:site-footer",
    ],
    ...Object.entries(menuDefaults).map(([location, items]) => [
      `menu-${location}`,
      "menu",
      {
        name: `${location[0].toUpperCase() + location.slice(1)} menu`,
        location,
        items,
      },
      `menu:${location}`,
    ]),
  ];
  await db.transaction(async (q) => {
    for (const [name, kind, data, key] of seeds) {
      const json = JSON.stringify(schemas[kind].parse(data));
      await q.query(
        "INSERT INTO documents (id,kind,draft,published,public_key,updated) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT(id) DO NOTHING",
        [stableId(name), kind, json, json, key, Date.now()],
      );
    }
  });
}

import { themeSchema } from "../../shared/theme.js";
import { z } from "zod";
import { experienceSchema } from "../../shared/experience-settings.js";
import { templateManifest } from "../../shared/templates.js";
const short = z.string().max(250);
export const safeLink = z
  .string()
  .max(2048)
  .refine(
    (v) => !v || /^(\/(?!\/)|#[a-zA-Z]|https:\/\/|mailto:|tel:)/.test(v),
    "Use a relative path, anchor, HTTPS, email or telephone link",
  )
  .refine((v) => !/[\s\\<>"']/.test(v), "Link contains unsafe characters");
const image = z
  .string()
  .regex(
    /^$|^\/media\/[a-f0-9-]+\.webp$|^\/assets\/[a-zA-Z0-9._-]+\.(png|webp|jpg|jpeg)$/,
  );
export const templateSchema = z
  .object({
    id: z.string().uuid(),
    type: z.literal("template"),
    template: z.enum(Object.keys(templateManifest)),
    hidden: z.boolean().default(false),
    fields: z.record(z.string(), z.string().max(15000)),
  })
  .strict()
  .superRefine((v, ctx) => {
    const spec = templateManifest[v.template].fields;
    for (const key of new Set([
      ...Object.keys(v.fields),
      ...Object.keys(spec),
    ])) {
      if (!(key in spec) || !(key in v.fields)) {
        ctx.addIssue({
          code: "custom",
          message: "Template fields do not match the original design",
        });
        continue;
      }
      const validator =
        spec[key].kind === "link"
          ? safeLink
          : spec[key].kind === "image"
            ? image
            : z.string();
      if (!validator.safeParse(v.fields[key]).success)
        ctx.addIssue({
          code: "custom",
          path: ["fields", key],
          message: "Invalid link or image",
        });
    }
  });
const canonical = z
  .string()
  .max(2048)
  .refine(
    (v) =>
      !v ||
      /^https:\/\/[^\s\\<>"']+$/.test(v) ||
      /^\/(?!\/)[^\s\\<>"']*$/.test(v),
    "Canonical must be an HTTPS URL or relative path",
  )
  .refine((v) => {
    if (!v) return true;
    try {
      const u = new URL(v, "https://on-zen-on.onrender.com");
      return (
        u.protocol === "https:" && !!u.hostname && !u.username && !u.password
      );
    } catch {
      return false;
    }
  }, "Invalid canonical URL");
export const sectionTypes = [
  "hero",
  "about",
  "services",
  "industries",
  "technology",
  "features",
  "process",
  "updates",
  "gallery",
  "faq",
  "testimonials",
  "casestudies",
  "cta",
  "contact",
];
const item = z
  .object({
    title: short.default(""),
    text: z.string().max(5000).default(""),
    href: safeLink.default(""),
    image: image.default(""),
    alt: short.default(""),
    icon: z
      .enum([
        "code",
        "server",
        "phone",
        "spark",
        "growth",
        "design",
        "cloud",
        "shield",
      ])
      .optional(),
  })
  .strict();
export const blockSchema = z
  .object({
    id: z.string().uuid(),
    type: z.enum(sectionTypes),
    hidden: z.boolean().default(false),
    anchor: z
      .string()
      .max(80)
      .regex(/^[a-z][a-z0-9-]*$|^$/)
      .default(""),
    eyebrow: short.default(""),
    imageCaption: short.optional(),
    imageCaptionStrong: short.optional(),
    cardLinkLabel: short.optional(),
    heading: short.default(""),
    body: z.string().max(15000).default(""),
    buttonLabel: short.default(""),
    href: safeLink.default(""),
    image: image.default(""),
    alt: short.default(""),
    items: z.array(item).max(60).default([]),
  })
  .strict();
const reference = z
  .object({
    id: z.string().uuid(),
    type: z.literal("shared"),
    hidden: z.boolean().default(false),
    sectionId: z.string().uuid(),
  })
  .strict();
export const pageSchema = z
  .object({
    schemaVersion: z.literal(1),
    title: short.min(1),
    path: z
      .string()
      .max(200)
      .regex(/^\/$|^\/[a-z0-9]+(?:[\/-][a-z0-9]+)*$/)
      .refine(
        (v) => !/^\/(admin|api|media|assets|portal|thank-you)(\/|$)/.test(v),
        "Reserved path",
      ),
    seo: z
      .object({
        title: z.string().max(70),
        description: z.string().max(170),
        canonical: canonical.default(""),
        ogImage: image.default(""),
        noindex: z.boolean().default(false),
      })
      .strict(),
    blocks: z.array(z.union([blockSchema, reference, templateSchema])).max(80),
  })
  .strict()
  .superRefine((v, ctx) => {
    const ids = v.blocks.map((b) => b.id);
    const anchors = v.blocks.filter((b) => b.anchor).map((b) => b.anchor);
    const templates = v.blocks
      .filter((b) => b.type === "template")
      .map((b) => b.template);
    if (
      templates.some((t) => t.startsWith("site-")) ||
      new Set(templates).size !== templates.length
    )
      ctx.addIssue({
        code: "custom",
        message:
          "Use each original layout once per page; header and footer are managed globally",
      });
    if (
      new Set(ids).size !== ids.length ||
      new Set(anchors).size !== anchors.length
    )
      ctx.addIssue({
        code: "custom",
        message: "Block IDs and anchors must be unique",
      });
  });
const menuItem = z
  .object({
    id: z.string().uuid(),
    label: short.min(1),
    href: safeLink.refine(Boolean, "Link required"),
    newTab: z.boolean().default(false),
  })
  .strict();
export const schemas = {
  page: pageSchema,
  section: z.union([blockSchema, templateSchema]),
  menu: z
    .object({
      name: short.min(1),
      location: z.enum(["header", "footer", "services"]),
      items: z.array(menuItem).max(40),
    })
    .strict(),
  settings: z
    .object({
      siteName: short.min(1),
      tagline: short,
      footerText: z.string().max(2000),
      email: z.email(),
      phone: short,
      experience: experienceSchema.optional(),
      theme: themeSchema.optional(),
    })
    .strict(),
};
export function blankBlock(type = "hero") {
  return {
    id: crypto.randomUUID(),
    type,
    hidden: false,
    anchor: "",
    eyebrow: "",
    heading: "New section",
    body: "",
    buttonLabel: "",
    href: "",
    image: "",
    alt: "",
    items: [],
  };
}

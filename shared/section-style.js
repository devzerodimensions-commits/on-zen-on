/* Per-section presentation, chosen in the admin's Style and Advanced tabs.

   These are deliberately named steps rather than free numbers. A free padding
   box, a colour picker and a z-index will let anyone produce a page that is
   unreadable, overlapping or invisible, and the people editing this site are
   not meant to need CSS to fix it afterwards. Every option here is a choice
   between designed outcomes, so the worst an editor can do is pick one they
   later change their mind about. */

import { fontCatalog } from "./theme.js";

/* Typography and colour set directly on one section. Unlike the named choices
   below these are free values, so they are written as CSS scoped to that one
   section rather than as classes. A field left empty emits nothing at all,
   which is what keeps an unstyled section rendering exactly as it did. */
export const sectionTypeDefaults = {
  headingColor: "",
  textColor: "",
  fontFamily: "",
  headingSize: 0,
  fontWeight: 0,
  textTransform: "",
  fontStyle: "",
  textDecoration: "",
  lineHeight: 0,
  letterSpacing: 0,
  wordSpacing: 0,
};

export const sectionStyleDefaults = {
  tone: "default",
  align: "left",
  headingScale: "normal",
  spacing: "normal",
  hideOn: "none",
};

export const sectionStyleOptions = {
  tone: [
    ["default", "Page default"],
    ["white", "White"],
    ["tint", "Soft brand tint"],
    ["brand", "Brand colour"],
    ["dark", "Dark"],
    ["accent", "Highlight"],
    ["green", "Green"],
    ["yellow", "Yellow"],
    ["blue", "Blue"],
    ["purple", "Purple"],
    ["red", "Red"],
    ["teal", "Teal"],
  ],
  align: [
    ["left", "Left"],
    ["center", "Centred"],
    ["right", "Right"],
  ],
  headingScale: [
    ["small", "Small"],
    ["normal", "Normal"],
    ["large", "Large"],
    ["xlarge", "Extra large"],
  ],
  spacing: [
    ["compact", "Compact"],
    ["normal", "Normal"],
    ["roomy", "Roomy"],
    ["none", "None"],
  ],
  hideOn: [
    ["none", "Show everywhere"],
    ["mobile", "Hide on phones"],
    ["desktop", "Hide on computers"],
  ],
};

/* The classes a section carries for the choices made against it. Anything left
   on its default adds nothing, so a page nobody has styled stays exactly as it
   was and the stylesheet has nothing extra to fight. */
const classPrefix = {
  tone: "tone",
  align: "align",
  headingScale: "scale",
  spacing: "space",
  hideOn: "hide",
};
export function sectionClasses(block) {
  if (!block) return "";
  const names = [];
  for (const key of Object.keys(sectionStyleDefaults)) {
    const value = block[key];
    if (!value || value === sectionStyleDefaults[key]) continue;
    if (!sectionStyleOptions[key].some(([option]) => option === value))
      continue;
    names.push(`cms-${classPrefix[key]}-${value}`);
  }
  if (block.id && sectionCustomCss(block)) names.push(`cms-s-${block.id}`);
  return names.length ? ` ${names.join(" ")}` : "";
}

const px = (n) => `${n}px`;
/* Rules for one section's own typography and colour, scoped to it alone. Only
   the fields that were actually set produce anything. */
export function sectionCustomCss(block) {
  if (!block?.id) return "";
  const scope = `.cms-s-${block.id}`;
  const text = [];
  const heading = [];
  const get = (key) => block[key] ?? sectionTypeDefaults[key];

  const family = get("fontFamily");
  if (family && fontCatalog[family])
    text.push(`font-family:${fontCatalog[family].stack}!important`);
  const weight = Number(get("fontWeight"));
  if (weight) heading.push(`font-weight:${weight}!important`);
  const transform = get("textTransform");
  if (transform) heading.push(`text-transform:${transform}!important`);
  const style = get("fontStyle");
  if (style) heading.push(`font-style:${style}!important`);
  const decoration = get("textDecoration");
  if (decoration) heading.push(`text-decoration:${decoration}!important`);
  const letter = Number(get("letterSpacing"));
  if (letter) heading.push(`letter-spacing:${px(letter)}!important`);
  const word = Number(get("wordSpacing"));
  if (word) text.push(`word-spacing:${px(word)}!important`);
  const line = Number(get("lineHeight"));
  if (line) text.push(`line-height:${line}!important`);
  const size = Number(get("headingSize"));
  if (size) heading.push(`font-size:${px(size)}!important`);
  const headingColor = get("headingColor");
  if (headingColor) heading.push(`color:${headingColor}!important`);
  const textColor = get("textColor");
  if (textColor) text.push(`color:${textColor}!important`);

  const rules = [];
  if (text.length)
    rules.push(
      `${scope},${scope} :is(p,li,small,span,label,.cms-body){${text.join(";")}}`,
    );
  if (heading.length)
    rules.push(`${scope} :is(h1,h2,h3,h4){${heading.join(";")}}`);
  /* A family set for the section applies to its headings too. */
  if (family && fontCatalog[family])
    rules.push(
      `${scope} :is(h1,h2,h3,h4){font-family:${fontCatalog[family].stack}!important}`,
    );
  return rules.join("\n");
}

/* Every section's own rules, for one style element on the page. */
export function pageCustomCss(blocks = []) {
  return blocks
    .map((block) => sectionCustomCss(block))
    .filter(Boolean)
    .join("\n");
}

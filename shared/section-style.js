/* Per-section presentation, chosen in the admin's Style and Advanced tabs.

   These are deliberately named steps rather than free numbers. A free padding
   box, a colour picker and a z-index will let anyone produce a page that is
   unreadable, overlapping or invisible, and the people editing this site are
   not meant to need CSS to fix it afterwards. Every option here is a choice
   between designed outcomes, so the worst an editor can do is pick one they
   later change their mind about. */

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
    if (!sectionStyleOptions[key].some(([option]) => option === value)) continue;
    names.push(`cms-${classPrefix[key]}-${value}`);
  }
  return names.length ? ` ${names.join(" ")}` : "";
}

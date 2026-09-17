import { z } from "zod";
const color = z.string().regex(/^#[0-9a-fA-F]{6}$/);

/* Every font the appearance studio offers. `google` is the fonts.googleapis.com
   family query; an empty string means the stack needs no download. */
export const fontCatalog = {
  site: {
    label: "Website default (Manrope)",
    stack: "Manrope, Arial, sans-serif",
    google: "Manrope:wght@400;500;600;700;800",
  },
  system: {
    label: "Modern sans serif",
    stack: "system-ui, sans-serif",
    google: "",
  },
  humanist: {
    label: "Friendly sans serif",
    stack: "'Trebuchet MS', Arial, sans-serif",
    google: "",
  },
  serif: { label: "Classic serif", stack: "Georgia, serif", google: "" },
  mono: { label: "Monospace", stack: "'Courier New', monospace", google: "" },
  inter: {
    label: "Inter — clean and neutral",
    stack: "Inter, system-ui, sans-serif",
    google: "Inter:wght@400;500;600;700;800",
  },
  poppins: {
    label: "Poppins — round and friendly",
    stack: "Poppins, system-ui, sans-serif",
    google: "Poppins:wght@400;500;600;700;800",
  },
  montserrat: {
    label: "Montserrat — strong headings",
    stack: "Montserrat, system-ui, sans-serif",
    google: "Montserrat:wght@400;500;600;700;800",
  },
  lato: {
    label: "Lato — calm and readable",
    stack: "Lato, system-ui, sans-serif",
    google: "Lato:wght@400;700;900",
  },
  opensans: {
    label: "Open Sans — very readable",
    stack: "'Open Sans', system-ui, sans-serif",
    google: "Open+Sans:wght@400;500;600;700;800",
  },
  roboto: {
    label: "Roboto — classic web font",
    stack: "Roboto, system-ui, sans-serif",
    google: "Roboto:wght@400;500;700;900",
  },
  dmsans: {
    label: "DM Sans — modern and simple",
    stack: "'DM Sans', system-ui, sans-serif",
    google: "DM+Sans:wght@400;500;700;800",
  },
  worksans: {
    label: "Work Sans — business feel",
    stack: "'Work Sans', system-ui, sans-serif",
    google: "Work+Sans:wght@400;500;600;700;800",
  },
  nunito: {
    label: "Nunito — soft and warm",
    stack: "Nunito, system-ui, sans-serif",
    google: "Nunito:wght@400;600;700;800",
  },
  raleway: {
    label: "Raleway — elegant sans",
    stack: "Raleway, system-ui, sans-serif",
    google: "Raleway:wght@400;500;600;700;800",
  },
  playfair: {
    label: "Playfair Display — premium serif",
    stack: "'Playfair Display', Georgia, serif",
    google: "Playfair+Display:wght@400;600;700;800",
  },
  merriweather: {
    label: "Merriweather — editorial serif",
    stack: "Merriweather, Georgia, serif",
    google: "Merriweather:wght@400;700;900",
  },
};
/* Kept so earlier imports of `fonts` keep working. */
export const fonts = Object.fromEntries(
  Object.entries(fontCatalog).map(([key, f]) => [key, f.stack]),
);
export const fontKeys = Object.keys(fontCatalog);

/* One-click colour themes, in the style of a WordPress theme picker. */
export const colorPresets = {
  signature: {
    label: "On Zen On signature",
    hint: "Recommended — the logo's blue, green and gold, tuned for readability",
    colors: {
      primary: "#17218c",
      secondary: "#0b6b3c",
      accent: "#f0b52a",
      background: "#f7f7f3",
      surface: "#ffffff",
      text: "#101822",
      muted: "#55636e",
      buttonText: "#ffffff",
      headerBackground: "#ffffff",
      headerText: "#101822",
      footerBackground: "#0b1226",
      footerTextColor: "#cdd6e6",
    },
  },
  original: {
    label: "On Zen On original",
    hint: "The colours the website launched with",
    colors: {
      primary: "#1119a5",
      secondary: "#08723b",
      accent: "#ecb900",
      background: "#f9f8f1",
      surface: "#ffffff",
      text: "#172e35",
      muted: "#5a6a72",
      buttonText: "#ffffff",
      headerBackground: "#ffffff",
      headerText: "#172e35",
      footerBackground: "#06152c",
      footerTextColor: "#dbe6df",
    },
  },
  midnight: {
    label: "Midnight blue",
    hint: "Deep navy with a bright cyan highlight",
    colors: {
      primary: "#10275c",
      secondary: "#1f6f8b",
      accent: "#38bdf8",
      background: "#f4f7fb",
      surface: "#ffffff",
      text: "#14202e",
      muted: "#5a6b80",
      buttonText: "#ffffff",
      headerBackground: "#ffffff",
      headerText: "#14202e",
      footerBackground: "#0b1626",
      footerTextColor: "#d6e2f0",
    },
  },
  forest: {
    label: "Forest green",
    hint: "Natural greens with a warm sand page",
    colors: {
      primary: "#14603c",
      secondary: "#2f7d4f",
      accent: "#d9a520",
      background: "#f6f6ef",
      surface: "#ffffff",
      text: "#17251d",
      muted: "#5b6b5f",
      buttonText: "#ffffff",
      headerBackground: "#ffffff",
      headerText: "#17251d",
      footerBackground: "#10241a",
      footerTextColor: "#dbe8dd",
    },
  },
  sunset: {
    label: "Sunset orange",
    hint: "Warm orange and plum, high energy",
    colors: {
      primary: "#b3401b",
      secondary: "#6d2c5a",
      accent: "#f2a516",
      background: "#fdf6f0",
      surface: "#ffffff",
      text: "#2b1a17",
      muted: "#7a5f56",
      buttonText: "#ffffff",
      headerBackground: "#ffffff",
      headerText: "#2b1a17",
      footerBackground: "#2b1214",
      footerTextColor: "#f3ddd2",
    },
  },
  royal: {
    label: "Royal purple",
    hint: "Purple and violet with a soft grey page",
    colors: {
      primary: "#4c2a9a",
      secondary: "#7b3fa0",
      accent: "#f0b429",
      background: "#f7f5fb",
      surface: "#ffffff",
      text: "#221a33",
      muted: "#655a7a",
      buttonText: "#ffffff",
      headerBackground: "#ffffff",
      headerText: "#221a33",
      footerBackground: "#1c1430",
      footerTextColor: "#e2dbf2",
    },
  },
  ocean: {
    label: "Ocean teal",
    hint: "Teal and aqua, fresh and calm",
    colors: {
      primary: "#0e6b74",
      secondary: "#0f737c",
      accent: "#f4b942",
      background: "#f2f8f8",
      surface: "#ffffff",
      text: "#122a2c",
      muted: "#537072",
      buttonText: "#ffffff",
      headerBackground: "#ffffff",
      headerText: "#122a2c",
      footerBackground: "#092527",
      footerTextColor: "#d3e8e8",
    },
  },
  crimson: {
    label: "Crimson red",
    hint: "Confident red with charcoal text",
    colors: {
      primary: "#a81d2d",
      secondary: "#3d1f27",
      accent: "#e5a23b",
      background: "#faf5f4",
      surface: "#ffffff",
      text: "#25181a",
      muted: "#6f585c",
      buttonText: "#ffffff",
      headerBackground: "#ffffff",
      headerText: "#25181a",
      footerBackground: "#1e1113",
      footerTextColor: "#efdada",
    },
  },
  minimal: {
    label: "Minimal black & white",
    hint: "Neutral greys, letting your photos lead",
    colors: {
      primary: "#1a1a1a",
      secondary: "#4a4a4a",
      accent: "#c8a24a",
      background: "#f7f7f5",
      surface: "#ffffff",
      text: "#141414",
      muted: "#6a6a6a",
      buttonText: "#ffffff",
      headerBackground: "#ffffff",
      headerText: "#141414",
      footerBackground: "#111111",
      footerTextColor: "#dcdcdc",
    },
  },
};
export const presetKeys = Object.keys(colorPresets);

export const themeDefaults = {
  enabled: false,
  preset: "original",
  /* Typography */
  font: "system",
  headingFont: "",
  bodySize: 16,
  headingSize: 48,
  h3Size: 26,
  smallSize: 13,
  lineHeight: 1.7,
  headingWeight: 800,
  letterSpacing: 0,
  headingCase: "none",
  /* Colours */
  primary: "#1119a5",
  secondary: "#08723b",
  accent: "#ecb900",
  background: "#f9f8f1",
  surface: "#ffffff",
  text: "#172e35",
  muted: "#5a6a72",
  buttonText: "#ffffff",
  linkColor: "",
  headerBackground: "#ffffff",
  headerText: "#172e35",
  footerBackground: "#06152c",
  footerTextColor: "#dbe6df",
  /* Buttons */
  buttonStyle: "solid",
  buttonRadius: 12,
  buttonSize: "medium",
  buttonShadow: true,
  /* Layout */
  radius: 12,
  sectionSpacing: 80,
  contentWidth: 1280,
  cardShadow: "soft",
  /* Logo */
  logoSize: 160,
  mobileLogoSize: 112,
};

export const themeSchema = z
  .object({
    enabled: z.boolean().default(false),
    preset: z.string().max(40).default("original"),
    font: z.enum(fontKeys).default("system"),
    headingFont: z.union([z.literal(""), z.enum(fontKeys)]).default(""),
    bodySize: z.number().int().min(13).max(24).default(16),
    headingSize: z.number().int().min(24).max(84).default(48),
    h3Size: z.number().int().min(14).max(48).default(26),
    smallSize: z.number().int().min(10).max(20).default(13),
    lineHeight: z.number().min(1.2).max(2.2).default(1.7),
    headingWeight: z.number().int().min(300).max(900).default(800),
    letterSpacing: z.number().min(-2).max(4).default(0),
    headingCase: z.enum(["none", "uppercase", "capitalize"]).default("none"),
    primary: color,
    secondary: color,
    accent: color,
    background: color,
    surface: color.default("#ffffff"),
    text: color,
    muted: color.default("#5a6a72"),
    buttonText: color,
    linkColor: z.union([z.literal(""), color]).default(""),
    headerBackground: color.default("#ffffff"),
    headerText: color.default("#172e35"),
    footerBackground: color.default("#06152c"),
    footerTextColor: color.default("#dbe6df"),
    buttonStyle: z.enum(["solid", "outline", "pill"]).default("solid"),
    buttonRadius: z.number().int().min(0).max(40).default(12),
    buttonSize: z.enum(["small", "medium", "large"]).default("medium"),
    buttonShadow: z.boolean().default(true),
    radius: z.number().int().min(0).max(40).default(12),
    sectionSpacing: z.number().int().min(24).max(160).default(80),
    contentWidth: z.number().int().min(960).max(1800).default(1280),
    cardShadow: z.enum(["none", "soft", "strong"]).default("soft"),
    logoSize: z.number().int().min(60).max(240).default(160),
    mobileLogoSize: z.number().int().min(48).max(160).default(112),
  })
  .strict();

const buttonPadding = {
  small: "11px 16px",
  medium: "16px 22px",
  large: "20px 30px",
};
const shadows = {
  none: "none",
  soft: "0 12px 30px rgba(9,26,43,.10)",
  strong: "0 22px 48px rgba(9,26,43,.22)",
};
const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const luminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
/* Used by the studio to warn an editor before unreadable colours are published.
   Whichever of near-black and white reads better on the colour wins, rather than
   a fixed lightness threshold, so unusual brand colours are handled too. */
export function readableOn(hex) {
  const l = luminance(hex);
  /* Pure black and white are used rather than softer near-blacks: on an awkward
     mid-tone brand colour they are the only choices that still clear WCAG AA. */
  return (l + 0.05) / 0.05 > 1.05 / (l + 0.05) ? "#000000" : "#ffffff";
}
export function contrastRatio(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
}
/* Blend a text colour towards its background for a softer look, but only as far
   as still clears WCAG AA, so no theme can be published with unreadable text. */
const soften = (fg, bg, amount) => {
  for (let a = amount; a > 0; a -= 0.03) {
    const blended = mix(fg, bg, a);
    if (contrastRatio(blended, bg) >= 4.6) return blended;
  }
  return fg;
};
/* A very pale wash of a colour, keeping its hue instead of mixing towards it.
   Blending a warm cream towards a blue just desaturates to grey; taking the
   brand hue at a high lightness gives a band that still reads as the brand. */
const tint = (hex, lightness) => {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  const sum = max + min;
  const saturation = d ? d / (sum > 1 ? 2 - sum : sum || 1) : 0;
  const s2 = Math.min(saturation, 0.5);
  const c = (1 - Math.abs(2 * lightness - 1)) * s2;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = lightness - c / 2;
  const seg = Math.floor(h * 6) % 6;
  const rgb = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][seg];
  return `#${rgb
    .map((v) =>
      Math.round((v + m) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
};
const mix = (hex, other, amount) => {
  const a = hexToRgb(hex),
    b = hexToRgb(other);
  return `#${a
    .map((v, i) =>
      Math.round(v + (b[i] - v) * amount)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
};

/* The webfont stylesheet the public site and the live preview both need. */
export function themeFontUrl(value) {
  const parsed = themeSchema.safeParse(value);
  if (!parsed.success || !parsed.data.enabled) return "";
  const families = new Set(
    [parsed.data.font, parsed.data.headingFont || parsed.data.font]
      .map((key) => fontCatalog[key]?.google)
      .filter(Boolean),
  );
  if (!families.size) return "";
  return `https://fonts.googleapis.com/css2?${[...families]
    .map((f) => `family=${f}`)
    .join("&")}&display=swap`;
}

export function themeCss(value) {
  const parsed = themeSchema.safeParse(value);
  if (!parsed.success || !parsed.data.enabled) return "";
  const t = parsed.data;
  const body = fontCatalog[t.font].stack;
  const heading = fontCatalog[t.headingFont || t.font].stack;
  const link = t.linkColor || t.primary;
  const fontUrl = themeFontUrl(t);
  const light = 'html:not([data-theme="dark"]) body';
  const buttonFace =
    t.buttonStyle === "outline"
      ? `background:transparent!important;color:${t.primary}!important;border:2px solid ${t.primary}!important`
      : `background:${t.primary}!important;color:${t.buttonText}!important;border:0!important`;
  const buttonRadius = t.buttonStyle === "pill" ? 999 : t.buttonRadius;
  const buttonShadow =
    t.buttonShadow && t.buttonStyle !== "outline"
      ? `4px 4px 0 ${mix(t.primary, "#000000", 0.35)}`
      : "none";
  /* Each section can carry its own tone, chosen in the admin. The background
     comes from the published theme and the text is derived from it, so a
     section can be recoloured without anyone being able to make it
     unreadable. */
  const link0 = t.linkColor || t.primary;
  const toneRules = (name, background) => {
    const ink = readableOn(background);
    const body = soften(ink, background, 0.22);
    const link = contrastRatio(t.accent, background) >= 4.5 ? t.accent : ink;
    const scope = `${light} .cms-tone-${name}`;
    return [
      `${scope}{background:${background}!important}`,
      `${scope} :is(h1,h2,h3,h4,strong,summary,cite){color:${ink}!important}`,
      `${scope} :is(p,li,small,span,label,blockquote,.cms-body){color:${body}!important}`,
      `${scope} .eyebrow{color:${link}!important}`,
      `${scope} a:not(.button):not(.oz-action){color:${link}!important}`,
      /* Cards inside a coloured section keep their own pale surface. */
      /* Cards sit on the section, so they take the pale surface — unless the
         section is already that colour, where a soft tint separates them. */
      `${scope} :is(.service-card,.cms-cases article,.cms-quotes figure,.cms-faq){background:${
        contrastRatio(t.surface, background) < 1.05
          ? tint(t.primary, 0.96)
          : t.surface
      }!important;border-color:${mix(background, ink, 0.18)}!important}`,
      `${scope} :is(.service-card,.cms-cases article,.cms-quotes figure,.cms-faq) :is(h1,h2,h3,strong,summary,cite){color:${t.text}!important}`,
      `${scope} :is(.service-card,.cms-cases article,.cms-quotes figure,.cms-faq) :is(p,li,small,span){color:${t.muted}!important}`,
      `${scope} :is(.service-card,.cms-cases article,.cms-faq) a:not(.button){color:${link0}!important}`,
    ].join("\n");
  };
  const headingCase =
    t.headingCase === "none"
      ? ""
      : `;text-transform:${t.headingCase}!important`;
  /* Sections painted in the brand colours need text that reads against them,
     not the muted colour meant for pale backgrounds. */
  const onPrimary = readableOn(t.primary);
  const onPrimarySoft = soften(onPrimary, t.primary, 0.18);
  const onSecondary = readableOn(t.secondary);
  /* The services banner runs from the brand colour into the second colour, so
     its text has to read against whichever of the two is harder. */
  const onBanner =
    contrastRatio("#ffffff", t.primary) < contrastRatio("#ffffff", t.secondary)
      ? readableOn(t.primary)
      : readableOn(t.secondary);
  /* Cards keep their own pale surface even inside a brand-coloured section, so
     their text is matched to the card, and the selector is deliberately as
     specific as the section rule above it so it wins on source order. */
  /* Six near-white sections run back to back down the page, close enough in
     tone to read as one flat stretch. Alternating plain white with a band
     tinted by the brand colour gives that run a rhythm without repainting the
     site: turning the custom design off restores the original tones. */
  const pale = [".technology", ".industries-showcase", ".blog-listing"];
  const band = tint(t.primary, 0.965);
  /* A call to action sitting on a brand-coloured section must not be painted in
     that same brand colour, or the button disappears and only its text shows.
     The accent is used when it stands out enough, otherwise plain black or
     white, whichever reads better on the section. */
  /* A published combination can still be unreadable — a cream footer was saved
     with pale footer text at 1.2:1, invisible on the live site. The studio warns
     below 4.5, but nothing may actually RENDER below 3, so any pairing that bad
     falls back to plain black or white on that background. */
  const legible = (foreground, background) =>
    contrastRatio(foreground, background) >= 3
      ? foreground
      : readableOn(background);
  const bodyText = legible(t.text, t.background);
  const mutedText = legible(t.muted, t.surface);
  const headText = legible(t.headerText, t.headerBackground);
  const footText = legible(t.footerTextColor, t.footerBackground);
  const ctaBackground =
    contrastRatio(t.accent, t.primary) >= 3 ? t.accent : readableOn(t.primary);
  const ctaText = readableOn(ctaBackground);
  /* Service cards carry the section's identity, so they get the brand bar,
     a lift on hover and an arrow that steps out — decoration only, nothing
     that moves content or changes what the card says. */
  const serviceCard = `${light} :is(.hero,.services,.contact,.intro,.outcomes,.cms-section) .service-card`;
  const cardIn = `${light} :is(.hero,.services,.contact,.intro,.outcomes,.cms-section) :is(.service-card,.outcome-grid div,.floating-card)`;
  return `${fontUrl ? `@import url('${fontUrl}');\n` : ""}
html body{font-family:${body}!important;font-size:${t.bodySize}px;--logo-blue:${t.primary};--logo-green:${t.secondary};--logo-gold:${t.accent};--cream:${t.background};--logo-ink:${t.text};--blue:${t.primary};--green:${t.secondary};--yellow:${t.accent};--mist:${t.background};--ink:${t.text};--oz-surface:${t.surface};--oz-muted:${t.muted}}
html body :is(p,a,button,input,textarea,select,li,span,small,label,td,th){font-family:${body}!important}
html body :is(h1,h2,h3,h4,h5){font-family:${heading}!important;font-weight:${t.headingWeight}!important;letter-spacing:${t.letterSpacing / 100}em!important${headingCase}}
html body main p,html body .oz-services p{font-size:${t.bodySize}px!important;line-height:${t.lineHeight}!important}
html body :is(small,.eyebrow,figcaption,.note){font-size:${t.smallSize}px!important}
html body main h1,html body .hero h1{font-size:clamp(30px,6vw,${t.headingSize + 16}px)!important}
html body main h2,html body .section h2{font-size:clamp(24px,4.4vw,${t.headingSize}px)!important}
html body main h3,html body .service-card h3{font-size:clamp(17px,2.4vw,${t.h3Size}px)!important}
html body :is(.button,.oz-action,.inquiry-card button,.inquiry-thanks-card a,.contact form button){${buttonFace};border-radius:${buttonRadius}px!important;padding:${buttonPadding[t.buttonSize]}!important;box-shadow:${buttonShadow}!important}
html body :is(.button,.oz-action):hover{filter:brightness(1.07)}
html body :is(.service-card,.oz-service-card,.inquiry-card,.inquiry-thanks-card,.outcome-grid div,.floating-card){border-radius:${t.radius}px!important;box-shadow:${shadows[t.cardShadow]}!important}
html body main>section,html body .oz-services>section,html body .section{padding-top:${t.sectionSpacing}px!important;padding-bottom:${t.sectionSpacing}px!important}
html body .public-site-header{height:${t.logoSize + 16}px!important;background:${t.headerBackground}!important;color:${headText}!important}
html body .public-site-header :is(a:not(.button):not(.oz-action),nav a,span:not(.pulse)){color:${headText}!important}
html body .public-site-header :is(.button,.oz-action){background:${t.primary}!important;color:${legible(t.buttonText, t.primary)}!important;border-color:${t.primary}!important}
html body .public-site-header .brand{width:${t.logoSize}px!important;height:${t.logoSize}px!important;flex-basis:${t.logoSize}px!important}
html body .public-site-header .brand img{width:${t.logoSize}px!important;height:${t.logoSize}px!important}
html body footer{background:${t.footerBackground}!important;color:${footText}!important}
html body footer :is(p,a,small,span,li,.footer-brand p,.footer-tagline,.reach-us p){color:${footText}!important}
html body footer :is(strong,b,h2,h3,h4,.footer-heading){color:${legible(t.accent, t.footerBackground)}!important}
${light}{background:${t.background}!important;color:${bodyText}!important}
${light} :is(.hero,.services,.contact,.notice){background:${t.primary}!important}
${light} :is(.intro,.cms-section,.oz-service-section,.outcomes,.results,.showcase){background:${band}!important;color:${t.text}!important}
${light} :is(${pale.join(",")}){background:${t.surface}!important;color:${t.text}!important}
${light} :is(.intro,.outcomes,.results,.showcase,${pale.join(",")}){border-top:1px solid ${mix(t.background, t.text, 0.08)}}
${light} :is(.service-card,.outcome-grid div,.floating-card){background:${t.surface}!important}
${serviceCard}{position:relative;overflow:hidden;transition:transform .28s cubic-bezier(.2,.7,.3,1),box-shadow .28s ease}
${serviceCard}:before{content:"";position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,${t.primary},${t.accent});opacity:.9}
${serviceCard}:hover{transform:translateY(-6px);box-shadow:0 26px 52px rgba(9,26,43,.20)!important}
${serviceCard} a{transition:transform .22s ease;display:inline-block}
${serviceCard}:hover a{transform:translateX(5px)}
${serviceCard} .service-icon{transition:transform .28s ease}
${serviceCard}:hover .service-icon{transform:scale(1.12) rotate(-4deg)}
@media(prefers-reduced-motion:reduce){${serviceCard},${serviceCard} a,${serviceCard} .service-icon{transition:none}${serviceCard}:hover{transform:none}${serviceCard}:hover a{transform:none}${serviceCard}:hover .service-icon{transform:none}}
${light} :is(.cms-section,.intro,.oz-service-section,.outcomes,.results,.showcase,${pale.join(",")}) :is(h1,h2,h3,p){color:${t.text}!important}
${light} :is(.cms-section,.intro,.oz-service-section,.outcomes,.results,.showcase,${pale.join(",")}) :is(.cms-body,.split>div p,.section-head>p){color:${mutedText}!important}
${light} :is(.hero,.services,.contact) :is(.button,.oz-action,.contact form button){background:${t.buttonStyle === "outline" ? "transparent" : ctaBackground}!important;color:${t.buttonStyle === "outline" ? ctaBackground : ctaText}!important;border-color:${ctaBackground}!important;box-shadow:${t.buttonShadow && t.buttonStyle !== "outline" ? `4px 4px 0 ${mix(ctaBackground, "#000000", 0.45)}` : "none"}!important}
${light} :is(.hero,.services,.contact) :is(h1,h2,h3,strong,label){color:${onPrimary}!important}
${light} :is(.hero,.services,.contact) :is(p,li,small,.hero-text,.cms-body){color:${onPrimarySoft}!important}
${light} :is(.hero,.services,.contact) :is(.section-head,.split>div) p{color:${onPrimarySoft}!important}
${light} .ticker{background:${t.secondary}!important}
/* A flat band of the second colour made the services banner heavy; the brand
   gradient gives it depth and ties it back to the home page hero. */
${light} .oz-service-hero{background:linear-gradient(125deg,${t.primary} 0%,${mix(t.primary, t.secondary, 0.5)} 55%,${t.secondary} 100%)!important}
${light} :is(.ticker,.oz-service-hero) :is(h1,h2,h3,p,span,b,li){color:${onBanner}!important}
${light} .oz-service-hero :is(.eyebrow,em){color:${t.accent}!important}
${cardIn} :is(h1,h2,h3,strong){color:${t.text}!important}
${cardIn} :is(p,small,span,a){color:${t.muted}!important}
${cardIn} a{color:${link}!important}
${light} main a:not(.button):not(.oz-action){color:${link}}
html body :is(.hero h1 em,.hero .eyebrow,.services .eyebrow,.contact .eyebrow){color:${t.accent}!important}
${[
  ["white", t.surface],
  ["tint", band],
  ["brand", t.primary],
  ["dark", t.footerBackground],
  ["accent", t.accent],
]
  .map(([name, background]) => toneRules(name, background))
  .join("\n")}
@media(max-width:800px){html body .public-site-header{height:${t.mobileLogoSize + 16}px!important}html body .public-site-header .brand{width:${t.mobileLogoSize}px!important;height:${t.mobileLogoSize}px!important;flex-basis:${t.mobileLogoSize}px!important}html body .public-site-header .brand img{width:${t.mobileLogoSize}px!important;height:${t.mobileLogoSize}px!important}html body main>section,html body .oz-services>section,html body .section{padding-top:${Math.round(t.sectionSpacing * 0.65)}px!important;padding-bottom:${Math.round(t.sectionSpacing * 0.65)}px!important}}
`;
}

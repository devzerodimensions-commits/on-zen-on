import { z } from "zod";
const color = z.string().regex(/^#[0-9a-fA-F]{6}$/);
export const themeDefaults = {
  enabled: false,
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
};
export const themeSchema = z
  .object({
    enabled: z.boolean(),
    font: z.enum(["system", "humanist", "serif", "mono"]),
    bodySize: z.number().int().min(14).max(22),
    headingSize: z.number().int().min(28).max(72),
    lineHeight: z.number().min(1.3).max(2),
    primary: color,
    secondary: color,
    accent: color,
    background: color,
    text: color,
    buttonText: color,
    radius: z.number().int().min(0).max(32),
    sectionSpacing: z.number().int().min(32).max(120),
    logoSize: z.number().int().min(80).max(200),
    mobileLogoSize: z.number().int().min(64).max(128),
  })
  .strict();
export const fonts = {
  system: "system-ui, sans-serif",
  humanist: "Trebuchet MS, Arial, sans-serif",
  serif: "Georgia, serif",
  mono: "Courier New, monospace",
};
export function themeCss(value) {
  const parsed = themeSchema.safeParse(value);
  if (!parsed.success || !parsed.data.enabled) return "";
  const t = parsed.data;
  return `
html body{font-family:${fonts[t.font]}!important;font-size:${t.bodySize}px;--logo-blue:${t.primary};--logo-green:${t.secondary};--logo-gold:${t.accent};--cream:${t.background};--logo-ink:${t.text}}
html body :is(h1,h2,h3,h4,p,a,button,input,textarea,select){font-family:${fonts[t.font]}!important}
html body main p{font-size:${t.bodySize}px!important;line-height:${t.lineHeight}!important}
html body main h1{font-size:clamp(32px,6vw,${t.headingSize + 16}px)!important}
html body main h2{font-size:clamp(26px,4vw,${t.headingSize}px)!important}
html body main h3{font-size:clamp(20px,2.5vw,${Math.round(t.headingSize * 0.55)}px)!important}
html body :is(.button,.oz-action,.inquiry-card button,.inquiry-thanks-card a){background:${t.primary}!important;color:${t.buttonText}!important;border-radius:${t.radius}px!important;box-shadow:none!important}
html body :is(.service-card,.oz-service-card,.inquiry-card,.inquiry-thanks-card){border-radius:${t.radius}px!important}
html body main>section,html body .oz-services>section{padding-top:${t.sectionSpacing}px!important;padding-bottom:${t.sectionSpacing}px!important}
html body .public-site-header{height:${t.logoSize + 16}px!important}
html body .public-site-header .brand{width:${t.logoSize}px!important;height:${t.logoSize}px!important;flex-basis:${t.logoSize}px!important}
html body .public-site-header .brand img{width:${t.logoSize}px!important;height:${t.logoSize}px!important}
html:not([data-theme="dark"]) body{background:${t.background}!important;color:${t.text}!important}
html:not([data-theme="dark"]) body :is(.hero,.services,.contact,.notice){background:${t.primary}!important}
html:not([data-theme="dark"]) body :is(.ticker,.oz-service-hero){background:${t.secondary}!important}
html:not([data-theme="dark"]) body :is(.intro,.cms-section,.oz-service-section){background:${t.background}!important;color:${t.text}!important}
html:not([data-theme="dark"]) body :is(.cms-section,.intro,.oz-service-section) :is(h1,h2,h3,p){color:${t.text}!important}
html body .hero h1 em,html body .services .eyebrow{color:${t.accent}!important}
@media(max-width:800px){html body .public-site-header{height:${t.mobileLogoSize + 16}px!important}html body .public-site-header .brand{width:${t.mobileLogoSize}px!important;height:${t.mobileLogoSize}px!important;flex-basis:${t.mobileLogoSize}px!important}html body .public-site-header .brand img{width:${t.mobileLogoSize}px!important;height:${t.mobileLogoSize}px!important}html body main>section,html body .oz-services>section{padding-top:${Math.round(t.sectionSpacing * 0.65)}px!important;padding-bottom:${Math.round(t.sectionSpacing * 0.65)}px!important}}
`;
}

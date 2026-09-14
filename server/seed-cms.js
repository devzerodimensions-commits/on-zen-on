import { createHash } from "node:crypto";
import { templateDefaults, menuDefaults } from "../shared/templates.js";
import { schemas } from "../cms/shared/content.js";
import { servicePages } from "./service-pages.js";
import { applyServicePhotos, migrateServicePhotos } from "./service-photos.js";
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
  const servicesPage = {
    schemaVersion: 1,
    title: "Services",
    path: "/services",
    seo: {
      title: "IT Services | On Zen On Private Limited",
      description:
        "Explore On Zen On services including web development, mobile apps, backend systems, AI automation, SEO, PPC, AEO, cybersecurity and cloud solutions.",
      canonical: "/services",
      ogImage: "/assets/software-laptop-3d.png",
      noindex: false,
    },
    blocks: [
      {
        id: stableId("services-page-hero"),
        type: "hero",
        anchor: "services-hero",
        eyebrow: "ON ZEN ON SERVICES",
        heading: "Full-stack IT services for digital growth.",
        body:
          "From high-performance websites and mobile applications to secure backend systems, AI automation and search-led digital marketing, our team builds connected solutions that help businesses launch, scale and compete with confidence.",
        buttonLabel: "Start your project",
        href: "/#contact",
        image: "/assets/software-laptop-3d.png",
        alt: "3D laptop software platform with cloud and AI panels",
        items: [
          {
            title: "24/7",
            text: "Always-on business support",
            href: "",
            image: "",
            alt: "",
          },
          {
            title: "AI-first",
            text: "Automation-ready product thinking",
            href: "",
            image: "",
            alt: "",
          },
          {
            title: "Secure",
            text: "Zero-trust architecture mindset",
            href: "",
            image: "",
            alt: "",
          },
        ],
      },
      {
        id: stableId("services-page-core-services"),
        type: "services",
        anchor: "core-services",
        eyebrow: "WHAT WE BUILD",
        heading: "All IT services under one growth-focused team.",
        body:
          "Choose one service or combine several into a complete digital system. Each service is designed with clean UX, fast loading speed, SEO visibility, robust security and long-term maintainability.",
        buttonLabel: "",
        href: "",
        image: "",
        alt: "",
        items: [
          {
            title: "⌘ Frontend Development",
            text:
              "Responsive HTML, CSS, JavaScript and React interfaces with clean navigation, fast loading speed, accessibility and conversion-focused UI.",
            href: "/#contact",
            image: "/assets/portfolio-floating-sites.png",
            alt: "Website interface previews",
          },
          {
            title: "⬡ Backend Development",
            text:
              "Node.js APIs, database design, admin panels, authentication, dashboards and integrations that make your business systems reliable.",
            href: "/#contact",
            image: "/assets/software-laptop-3d.png",
            alt: "Software dashboard on laptop",
          },
          {
            title: "📱 Mobile App Development",
            text:
              "Android, iOS and cross-platform mobile applications with booking, scheduling, notifications, user accounts and secure data flows.",
            href: "/#contact",
            image: "/assets/hero-orbit.png",
            alt: "Digital orbit visual",
          },
          {
            title: "✦ AI & Workflow Automation",
            text:
              "AI-powered chatbots, virtual assistants, workflow automation, self-service portals and smart internal tools for faster operations.",
            href: "/#contact",
            image: "/assets/software-laptop-3d.png",
            alt: "AI workflow software visual",
          },
          {
            title: "↗ SEO, PPC & Digital Marketing",
            text:
              "SEO, PPC, AEO, content writing, social media marketing and campaign optimisation built to increase qualified traffic and leads.",
            href: "/#contact",
            image: "/assets/portfolio-floating-sites.png",
            alt: "Digital marketing website previews",
          },
          {
            title: "◈ UI/UX & Product Design",
            text:
              "Wireframes, product flows, interactive prototypes, motion UI, dark mode options and user journeys that feel simple and premium.",
            href: "/#contact",
            image: "/assets/hero-orbit.png",
            alt: "Product design visual",
          },
          {
            title: "☁ Cloud, API & DevOps",
            text:
              "Cloud-native, API-first architecture with scalable deployment, monitoring, edge processing and infrastructure support.",
            href: "/#contact",
            image: "/assets/software-laptop-3d.png",
            alt: "Cloud software dashboard",
          },
          {
            title: "🛡 Cybersecurity",
            text:
              "Advanced cybersecurity measures, zero-trust rules, protective defence, secure forms and safer application architecture.",
            href: "/#contact",
            image: "/assets/portfolio-floating-sites.png",
            alt: "Secure website previews",
          },
        ],
      },
      {
        id: stableId("services-page-technology"),
        type: "technology",
        anchor: "technology-stack",
        eyebrow: "TECHNOLOGY STACK",
        heading: "Languages, frameworks and platforms we use.",
        body:
          "We choose the right technology for each project, with a practical stack for frontend, backend, databases, cloud, automation and marketing operations.",
        buttonLabel: "",
        href: "",
        image: "",
        alt: "",
        items: [
          {
            title: "Frontend",
            text: "HTML5, CSS3, JavaScript, React, Vite, responsive UI and motion-ready components.",
            href: "",
            image: "",
            alt: "",
          },
          {
            title: "Backend",
            text: "Node.js, Express, REST APIs, authentication, admin panels and server-side business logic.",
            href: "",
            image: "",
            alt: "",
          },
          {
            title: "Database",
            text: "PostgreSQL, Neon-ready data modelling, migrations, inquiries, CMS content and reporting structures.",
            href: "",
            image: "",
            alt: "",
          },
          {
            title: "Marketing",
            text: "SEO, PPC, AEO, content systems, conversion tracking and campaign-ready landing pages.",
            href: "",
            image: "",
            alt: "",
          },
        ],
      },
      {
        id: stableId("services-page-process"),
        type: "process",
        anchor: "delivery-process",
        eyebrow: "HOW WE DELIVER",
        heading: "A clear process from idea to launch.",
        body:
          "Every project follows a practical flow so you always know what is being built, why it matters and what comes next.",
        buttonLabel: "",
        href: "",
        image: "",
        alt: "",
        items: [
          {
            title: "01. Strategy & Scope",
            text:
              "We understand your goals, audience, services, competitors and required features before design or development begins.",
            href: "",
            image: "",
            alt: "",
          },
          {
            title: "02. Design & Prototype",
            text:
              "We create the page structure, content flow, UI style, icons, images and interactive experience.",
            href: "",
            image: "",
            alt: "",
          },
          {
            title: "03. Build & Integrate",
            text:
              "Frontend, backend, database, admin panel, forms, CMS, APIs and automation are built into one working system.",
            href: "",
            image: "",
            alt: "",
          },
          {
            title: "04. Launch & Optimise",
            text:
              "We test speed, responsiveness, SEO, security, forms and deployment so your site is ready for real users.",
            href: "",
            image: "",
            alt: "",
          },
        ],
      },
      {
        id: stableId("services-page-features"),
        type: "features",
        anchor: "business-features",
        eyebrow: "FEATURES YOU CAN ADD",
        heading: "Modern features for a serious IT website.",
        body:
          "Your services page can connect into a wider digital product: self-service portals, online booking, automated scheduling, search, AI visibility optimisation, analytics and secure admin control.",
        buttonLabel: "",
        href: "",
        image: "",
        alt: "",
        items: [
          {
            title: "AI chatbots & virtual assistants",
            text: "Support customers, capture leads and answer service questions instantly.",
            href: "",
            image: "",
            alt: "",
          },
          {
            title: "Self-service portals",
            text: "Let customers submit requests, track status and manage their information online.",
            href: "",
            image: "",
            alt: "",
          },
          {
            title: "Booking & scheduling",
            text: "Automated appointment flows for consultation calls, demos and support.",
            href: "",
            image: "",
            alt: "",
          },
          {
            title: "Admin control",
            text: "Manage pages, inquiries, settings, media, users and site content from a private panel.",
            href: "",
            image: "",
            alt: "",
          },
          {
            title: "SEO + AEO visibility",
            text: "Content structured for search engines and AI answer engines.",
            href: "",
            image: "",
            alt: "",
          },
          {
            title: "Security-first foundation",
            text: "Protected forms, clean validation, database safety and safer deployment practices.",
            href: "",
            image: "",
            alt: "",
          },
        ],
      },
      {
        id: stableId("services-page-faq"),
        type: "faq",
        anchor: "services-faq",
        eyebrow: "FAQ",
        heading: "Services questions answered.",
        body: "",
        buttonLabel: "",
        href: "",
        image: "",
        alt: "",
        items: [
          {
            title: "Can you build the website and backend together?",
            text: "Yes. We can build the frontend, backend, database, admin panel, contact forms and deployment as one complete system.",
            href: "",
            image: "",
            alt: "",
          },
          {
            title: "Do you provide digital marketing with development?",
            text: "Yes. SEO, PPC, AEO, content writing and social media marketing can be planned with the website structure from the beginning.",
            href: "",
            image: "",
            alt: "",
          },
          {
            title: "Can this scale for startups and enterprise businesses?",
            text: "Yes. We can start with a focused launch and expand into portals, automation, APIs, cloud hosting and analytics when required.",
            href: "",
            image: "",
            alt: "",
          },
        ],
      },
      {
        id: stableId("services-page-contact"),
        type: "contact",
        anchor: "contact",
        eyebrow: "START A SERVICE REQUEST",
        heading: "Tell us what you want to build.",
        body:
          "Share your website, app, automation or marketing requirement and we will help shape it into a practical plan.",
        buttonLabel: "",
        href: "",
        image: "",
        alt: "",
        items: [],
      },
    ],
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
    ["services-page", "page", servicesPage, "page:/services"],
    ...servicePages(stableId),
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
      if (kind === "page") applyServicePhotos(data);
      const json = JSON.stringify(schemas[kind].parse(data));
      await q.query(
        "INSERT INTO documents (id,kind,draft,published,public_key,updated) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT(id) DO NOTHING",
        [stableId(name), kind, json, json, key, Date.now()],
      );
    }
  });
  await migrateServicePhotos(db);
  await updateServiceMenuLinks(db);
}

async function updateServiceMenuLinks(db) {
  const replacements = new Map([
    ["Frontend development", "/services#core-services"],
    ["Backend development", "/services#core-services"],
    ["Web & mobile applications", "/services#core-services"],
    ["AI & workflow automation", "/services#business-features"],
    ["Digital marketing", "/services#core-services"],
    ["SEO, PPC & AEO", "/services#core-services"],
    ["Cloud, API & security", "/services#business-features"],
    ["Services", "/services"],
    ["Services & technologies", "/services"],
  ]);
  const rows = await db.query(
    "SELECT id,draft,published FROM documents WHERE kind='menu'",
  );
  await db.transaction(async (q) => {
    for (const row of rows) {
      let changed = false;
      const next = {};
      for (const field of ["draft", "published"]) {
        if (!row[field]) continue;
        const data = JSON.parse(row[field]);
        data.items = data.items.map((item) => {
          const href = replacements.get(item.label);
          if (!href || item.href === href) return item;
          changed = true;
          return { ...item, href };
        });
        next[field] = JSON.stringify(schemas.menu.parse(data));
      }
      if (changed) {
        await q.query(
          "UPDATE documents SET draft=$1,published=$2,updated=$3 WHERE id=$4",
          [next.draft || row.draft, next.published || row.published, Date.now(), row.id],
        );
      }
    }
  });
}

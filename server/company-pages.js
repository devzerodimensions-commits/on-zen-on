import { schemas } from "../cms/shared/content.js";

/* About, Portfolio and Contact. The header and footer menus pointed at anchors
   on the home page, so these three topics had no page of their own, nothing to
   rank in search and nowhere to send a visitor who wanted detail. Everything
   here is editable in the page builder once it exists. */

const block = (stableId, key, type, heading, body, items = [], extra = {}) => ({
  id: stableId(key),
  type,
  hidden: false,
  anchor: key.replace(/^[a-z]+-/, ""),
  eyebrow: "",
  heading,
  body,
  buttonLabel: "",
  href: "",
  image: "",
  alt: "",
  items: items.map(([title, text, href = "", image = "", alt = ""]) => ({
    title,
    text,
    href,
    image,
    alt,
  })),
  ...extra,
});

function aboutPage(stableId) {
  const b = (key, ...rest) => block(stableId, `about-${key}`, ...rest);
  return {
    schemaVersion: 1,
    title: "About us",
    path: "/about",
    seo: {
      title: "About On Zen On | Creation Meets Growth",
      description:
        "On Zen On Private Limited builds websites, mobile apps, AI automation and digital marketing with one team covering design, engineering, security and growth.",
      canonical: "/about",
      ogImage: "/assets/main-software-engineering.webp",
      noindex: false,
    },
    blocks: [
      b(
        "intro",
        "hero",
        "One team for the whole digital picture.",
        "Most businesses end up with a website from one supplier, marketing from another and security as an afterthought. Nobody owns the result. On Zen On Private Limited puts design, engineering, automation, security and marketing under one roof, so the people who build your product are the people held to how it performs.",
        [],
        {
          eyebrow: "ABOUT ON ZEN ON",
          image: "/assets/main-software-engineering.webp",
          alt: "A team reviewing a software product together",
          buttonLabel: "Start a conversation",
          href: "/contact",
        },
      ),
      b(
        "belief",
        "about",
        "Creation meets growth.",
        "Our name is also the way we work. Creation without growth is a project that launches and then goes quiet. Growth without creation is spend against something that was never built to convert.\n\nWe treat the two as one job. A site is designed around the action you need a visitor to take. Automation is chosen because it removes real work, not because it is fashionable. Security is part of the build rather than a report at the end.",
        [],
        { eyebrow: "WHAT WE BELIEVE" },
      ),
      b(
        "difference",
        "features",
        "What changes when one team owns it all",
        "The practical differences our clients notice most.",
        [
          [
            "One accountable team",
            "No handoffs between a design agency, a developer and a marketer. One team, one plan, one place to ask why something is not working.",
          ],
          [
            "Built to be found",
            "Search visibility is designed in from the first wireframe: structure, speed, content and the technical detail search engines and AI assistants read.",
          ],
          [
            "Security from day one",
            "Access control, protected actions and safe handling of customer data are part of the build, not a later phase you pay for twice.",
          ],
          [
            "Automation where it pays",
            "We automate the work that actually repeats — enquiry handling, scheduling, follow-up — and leave judgement to your people.",
          ],
          [
            "You keep control",
            "Every page, image, colour and menu is editable by your own team in the admin panel. No developer needed for day-to-day changes.",
          ],
          [
            "Clear, plain answers",
            "We explain trade-offs in language you can act on, including when the honest answer is that something is not worth building.",
          ],
        ],
        { eyebrow: "HOW WE ARE DIFFERENT" },
      ),
      b(
        "approach",
        "process",
        "How a project runs with us",
        "A predictable shape, so you always know what happens next.",
        [
          [
            "01 — Understand",
            "We start with the business result, not the feature list: who you need to reach, what they should do, and what success would look like in numbers.",
          ],
          [
            "02 — Shape",
            "Scope, structure and priorities agreed in writing, with the trade-offs explained. You see what is included before anything is built.",
          ],
          [
            "03 — Build",
            "Design and engineering run together in short cycles, with something reviewable early rather than a reveal at the end.",
          ],
          [
            "04 — Launch",
            "Testing across devices, search setup, analytics and a handover so your team can run the site themselves.",
          ],
          [
            "05 — Grow",
            "Measure what visitors actually do, then improve content, campaigns and conversion against that evidence.",
          ],
        ],
        { eyebrow: "OUR PROCESS" },
      ),
      b(
        "reach",
        "industries",
        "Working across time zones",
        "We work with businesses in India, Canada, Australia and beyond, with offices supporting clients in different regions.",
        [
          [
            "India",
            "Our main delivery team, covering engineering, design, marketing and support.",
          ],
          ["Canada", "1102 3 Avenue South, Lethbridge, AB T1J 0J6."],
          [
            "Australia",
            "2/54 Hotham Street, St Kilda East, Melbourne, Victoria 3183.",
          ],
        ],
        { eyebrow: "WHERE WE WORK" },
      ),
      b(
        "questions",
        "faq",
        "Questions people ask before working with us",
        "",
        [
          [
            "What size of business do you work with?",
            "From a first website for a new business to a platform rebuild for an established company. What matters more than size is having a clear decision-maker and a result you want to move.",
          ],
          [
            "Can you work with our existing website?",
            "Usually yes. We can improve what you have, rebuild parts of it, or migrate it. We will tell you honestly when starting again would cost less than repairing.",
          ],
          [
            "Do you only build, or do you also run marketing?",
            "Both, and they work better together. You can also take just one: some clients use us for engineering and keep marketing in-house, or the reverse.",
          ],
          [
            "Who owns the work?",
            "You do. The content, the design and the site are yours, and you can edit everything yourself through the admin panel.",
          ],
          [
            "What if we need changes after launch?",
            "Day-to-day content, images and pages you change yourself in the admin. For anything structural, tell us the outcome you want and we will scope it.",
          ],
        ],
        { eyebrow: "BEFORE YOU ASK" },
      ),
      b(
        "next",
        "cta",
        "Tell us what you are trying to move.",
        "Send us the business result you are aiming for. We will tell you what it would realistically take, and whether we are the right team for it.",
        [],
        { buttonLabel: "Talk to the team", href: "/contact" },
      ),
    ],
  };
}

function portfolioPage(stableId) {
  const b = (key, ...rest) => block(stableId, `portfolio-${key}`, ...rest);
  return {
    schemaVersion: 1,
    title: "Portfolio",
    path: "/portfolio",
    seo: {
      title: "Our Work | On Zen On Private Limited",
      description:
        "The kinds of projects On Zen On builds: business websites, e-commerce, mobile apps, internal tools, automation and search-led growth campaigns.",
      canonical: "/portfolio",
      ogImage: "/assets/portfolio-floating-sites.png",
      noindex: false,
    },
    blocks: [
      b(
        "lead",
        "hero",
        "The work we take on.",
        "Every project below describes work we build and the shape an engagement usually takes. For detailed case studies with names, numbers and references, ask us — we share those directly, with our clients' permission.",
        [],
        {
          eyebrow: "OUR WORK",
          image: "/assets/portfolio-floating-sites.png",
          alt: "Illustration of several website layouts",
          buttonLabel: "Ask for case studies",
          href: "/contact",
        },
      ),
      b(
        "types",
        "casestudies",
        "Selected project builds",
        "Six builds we deliver regularly. Yours will differ in scope, but the shape and the standard are the same.",
        [
          [
            "Service business website",
            "A marketing site built around one action: a qualified enquiry. Search-ready service pages, an enquiry and booking flow that reaches the right inbox, and an admin panel the owner runs without a developer.",
            "/services/frontend-development",
            "/assets/service-frontend-development-overview--1.webp",
            "A business website shown across desktop and mobile",
          ],
          [
            "E-commerce storefront",
            "Product catalogue, search and filtering, and a checkout that works properly on a phone — with the analytics needed to see exactly where buyers drop out.",
            "/services/frontend-development",
            "/assets/marketing-ecommerce.webp",
            "An online store product listing page",
          ],
          [
            "Customer mobile app",
            "An app built around the few moments that matter — finding a service, booking it, staying informed — sharing one backend with the website so nothing falls out of step.",
            "/services/mobile-app-development",
            "/assets/service-mobile-app-development-overview--1.webp",
            "A mobile application on a phone screen",
          ],
          [
            "Internal tool and automation",
            "Spreadsheets and manual chasing replaced by a system that records the work, follows up what is overdue and shows the team what needs attention today.",
            "/services/ai-workflow-automation",
            "/assets/service-ai-workflow-automation-overview--1.webp",
            "An internal workflow dashboard",
          ],
          [
            "API platform and integrations",
            "A backend other systems can build on: documented APIs, connections to the tools a business already pays for, and hosting that stays up as traffic grows.",
            "/services/cloud-api-devops",
            "/assets/service-cloud-api-devops-overview--1.webp",
            "Cloud infrastructure and API connections",
          ],
          [
            "Security review and hardening",
            "An assessment of an existing site or application, then the work to close what it found: access control, protected actions and safer handling of customer data.",
            "/services/cybersecurity",
            "/assets/service-cybersecurity-overview--1.webp",
            "A security review of a live application",
          ],
        ],
        { eyebrow: "SELECTED WORK", cardLinkLabel: "Explore this service" },
      ),
      b(
        "included",
        "features",
        "What every project includes",
        "Whatever we build, these come as standard rather than as extras.",
        [
          [
            "An admin panel you control",
            "Change text, images, colours, fonts and menus yourself. Preview before publishing, and restore an earlier version if you change your mind.",
          ],
          [
            "Search and AI visibility",
            "Clean structure, fast pages and the technical detail that lets search engines and AI assistants describe your business correctly.",
          ],
          [
            "Mobile first, genuinely",
            "Checked at phone, tablet and desktop widths, because most of your visitors arrive on a phone.",
          ],
          [
            "Security built in",
            "Protected actions, controlled access and careful handling of anything a customer sends you.",
          ],
          [
            "Analytics that answer questions",
            "Set up to show what visitors actually do, so improvements are based on evidence rather than opinion.",
          ],
          [
            "A handover, not a hostage",
            "Documentation and a walkthrough, so your team can run it. You are never stuck waiting on us for a text change.",
          ],
        ],
        { eyebrow: "AS STANDARD" },
      ),
      b(
        "ask",
        "cta",
        "Want to see work like yours?",
        "Tell us your industry and what you are trying to build. We will send relevant examples and walk you through what was involved.",
        [],
        { buttonLabel: "Request case studies", href: "/contact" },
      ),
    ],
  };
}

function contactPage(stableId) {
  const b = (key, ...rest) => block(stableId, `contact-${key}`, ...rest);
  return {
    schemaVersion: 1,
    title: "Contact us",
    path: "/contact",
    seo: {
      title: "Contact On Zen On | Start Your Project",
      description:
        "Talk to On Zen On about a website, mobile app, automation or digital marketing project. Email hello@onzenon.com or send an enquiry.",
      canonical: "/contact",
      ogImage: "/assets/software-laptop-3d.png",
      noindex: false,
    },
    blocks: [
      b(
        "lead",
        "hero",
        "Ready when you are.",
        "Tell us what you are trying to build or fix. The more you can say about the business result you want, the more useful our first reply will be.",
        [],
        {
          eyebrow: "CONTACT ON ZEN ON",
          image: "/assets/hero-orbit.png",
          alt: "Abstract illustration representing connected digital systems",
        },
      ),
      b(
        "ways",
        "features",
        "How to reach us",
        "Pick whichever suits you.",
        [
          [
            "Email",
            "hello@onzenon.com — good for detail, attachments and anything you want in writing.",
            "mailto:hello@onzenon.com",
          ],
          [
            "Phone",
            "+91 7698536951 — best when you would rather talk it through than type it out.",
            "tel:+917698536951",
          ],
          [
            "Self-service portal",
            "Send a project request, choose a time to talk and check the status of an existing request.",
            "/portal",
          ],
          [
            "The form below",
            "The quickest route. It reaches the team directly and you will get a reply by email.",
            "#enquiry",
          ],
        ],
        { eyebrow: "GET IN TOUCH" },
      ),
      b(
        "enquiry",
        "contact",
        "Send us your project",
        "Tell us what you want to achieve, roughly when you need it, and anything you already have in place. If you are not sure what you need yet, say that too — early questions are welcome.",
        [],
        { eyebrow: "SEND AN ENQUIRY" },
      ),
      b(
        "offices",
        "industries",
        "Where we are",
        "",
        [
          ["India", "Our main delivery team. Phone +91 7698536951."],
          ["Canada", "1102 3 Avenue South, Lethbridge, AB T1J 0J6."],
          [
            "Australia",
            "2/54 Hotham Street, St Kilda East, Melbourne, Victoria 3183.",
          ],
        ],
        { eyebrow: "OUR OFFICES" },
      ),
      b(
        "expect",
        "faq",
        "What happens after you send it",
        "",
        [
          [
            "Who reads my enquiry?",
            "A member of the team, not an automated system. The website assistant can answer questions from our published pages, but anything you send through the form reaches a person.",
          ],
          [
            "What should I include?",
            "What you want to achieve, any deadline, whether you have an existing website or app, and roughly what you have budgeted. None of it is compulsory — send what you know.",
          ],
          [
            "Will you send me a price straight away?",
            "Not a binding one. Pricing depends on scope, integrations and content. We will tell you what the options are and what drives the cost, then confirm a figure once the scope is agreed.",
          ],
          [
            "Can we talk before committing to anything?",
            "Yes. A first conversation is to work out whether we are the right fit, and it carries no obligation.",
          ],
          [
            "Is my information kept private?",
            "What you send is used to respond to your enquiry. Please do not send passwords or payment details through the form.",
          ],
        ],
        { eyebrow: "WHAT TO EXPECT" },
      ),
    ],
  };
}

export function companyPages(stableId) {
  return [
    ["about-page", "page", aboutPage(stableId), "page:/about"],
    ["portfolio-page", "page", portfolioPage(stableId), "page:/portfolio"],
    ["contact-page", "page", contactPage(stableId), "page:/contact"],
  ];
}

/* Menu entries that pointed at a home-page anchor now point at the real page,
   but only where they still hold the old anchor: a link an editor has already
   changed is left exactly as they set it. */
const menuMoves = new Map([
  ["/#about", "/about"],
  ["#about", "/about"],
  ["/#work", "/portfolio"],
  ["#work", "/portfolio"],
  ["/#portfolio", "/portfolio"],
]);
const contactMoves = new Set(["/#contact", "#contact"]);

export async function migrateCompanyPages(db, stableId) {
  await db.transaction(async (q) => {
    const marker = await q.query(
      "INSERT INTO cms_migrations (id) VALUES ($1) ON CONFLICT(id) DO NOTHING RETURNING id",
      ["company-pages-v1"],
    );
    if (!marker.length) return;
    for (const [name, kind, data, key] of companyPages(stableId)) {
      const body = JSON.stringify(schemas.page.parse(data));
      await q.query(
        "INSERT INTO documents (id,kind,draft,published,public_key,updated) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT(id) DO NOTHING",
        [stableId(name), kind, body, body, key, Date.now()],
      );
    }
    for (const row of await q.query(
      "SELECT id,kind,draft,published FROM documents WHERE kind='menu'",
    )) {
      const next = { ...row };
      let changed = false;
      for (const field of ["draft", "published"]) {
        if (!row[field]) continue;
        const data = JSON.parse(row[field]);
        let touched = false;
        for (const item of data.items) {
          const moved = menuMoves.get(item.href);
          if (moved) {
            item.href = moved;
            touched = true;
            continue;
          }
          /* "Contact" moves to the new page; "Newsletter" shares the anchor but
             means something else, so it stays where it is. */
          if (contactMoves.has(item.href) && /contact/i.test(item.label)) {
            item.href = "/contact";
            touched = true;
          }
        }
        if (touched) {
          next[field] = JSON.stringify(schemas.menu.parse(data));
          changed = true;
        }
      }
      if (changed)
        await q.query(
          "UPDATE documents SET draft=$1,published=$2,version=version+1,updated=$3 WHERE id=$4",
          [next.draft, next.published, Date.now(), row.id],
        );
    }
  });
}

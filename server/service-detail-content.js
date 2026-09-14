import photos from "../shared/service-photos.json" with { type: "json" };

export const detailContent = {
  "frontend-development": {
    heading: "Interfaces that make every interaction count",
    story:
      "Your frontend is where customers experience your business. We organise content around their questions, make important actions easy to find, and build layouts that remain comfortable across screen sizes. From the first wireframe to the final component, we consider navigation, loading, empty states and feedback together. The result is an interface your customers can use and your team can maintain.",
    capabilities: [
      [
        "Design-to-code implementation",
        "Translate approved designs into reusable components with consistent spacing, typography and responsive behaviour.",
        "design",
      ],
      [
        "Interactive customer journeys",
        "Create search, filtering, forms, account screens and dashboards with clear loading, success and error states.",
        "phone",
      ],
      [
        "Accessible, faster experiences",
        "Review keyboard access, form labels, image delivery and key performance bottlenecks before handover.",
        "growth",
      ],
    ],
    examples: [
      [
        "Business & service websites",
        "Guide visitors from discovering your offer to making an inquiry, with structured service pages and clear calls to action.",
      ],
      [
        "Customer dashboards",
        "Give users a practical view of their activity, requests and account information through connected interfaces.",
      ],
      [
        "Campaign landing pages",
        "Build focused pages around one audience and action, with responsive forms and agreed analytics events.",
      ],
    ],
    tech: [
      [
        "React & JavaScript",
        "Component-based interfaces, reusable UI patterns and interactive application behaviour.",
      ],
      [
        "HTML & CSS",
        "Semantic structure, responsive layouts and a consistent visual foundation.",
      ],
      [
        "API integration",
        "Connect the interface to your backend with loading states, validation and useful failure messages.",
      ],
    ],
    faq: [
      [
        "Can you keep our existing website design?",
        "Yes. We can work from your current brand and layouts, then agree which interactions, components and responsive details need improvement.",
      ],
      [
        "Will our team be able to change the content?",
        "Where a CMS is in scope, we connect the interface to editable content fields and document the publishing workflow.",
      ],
      [
        "Do you build for mobile screens?",
        "Yes. We design responsive behaviour for agreed breakpoints and check important journeys on representative device sizes.",
      ],
    ],
  },
  "backend-development": {
    heading: "Connect your data, workflows and customer experience",
    story:
      "A useful backend does more than store information. It enforces business rules, connects systems and gives the right people access to the right actions. We begin with your workflows and data relationships, then define APIs, permissions and operational needs. Clear validation and predictable error handling help your frontend and integrations work reliably together.",
    capabilities: [
      [
        "Business APIs",
        "Build documented endpoints for your website, app or partners, with consistent validation and error responses.",
        "code",
      ],
      [
        "Data models & workflows",
        "Structure related records, transactional updates and migrations around the rules your business depends on.",
        "server",
      ],
      [
        "Accounts & permissions",
        "Introduce role-based access, protected sessions and controls for administrative actions.",
        "shield",
      ],
    ],
    examples: [
      [
        "Content & admin systems",
        "Manage pages, media, service details and publishing from a private dashboard.",
      ],
      [
        "Booking & operations",
        "Coordinate requests, availability, status changes and customer records in a shared system.",
      ],
      [
        "Connected business tools",
        "Synchronise agreed information between your application, CRM and other external services.",
      ],
    ],
    tech: [
      [
        "Node.js & Express",
        "Server-side application logic and REST APIs for connected web and mobile experiences.",
      ],
      [
        "PostgreSQL",
        "Relational models, constraints and transactions to keep business records consistent.",
      ],
      [
        "Integration workflows",
        "Webhooks, external APIs and background processing selected according to the project’s needs.",
      ],
    ],
    faq: [
      [
        "Can you connect to our current database?",
        "We first review its structure, access rules and data quality, then agree a safe integration or migration approach.",
      ],
      [
        "How do you handle sensitive information?",
        "We define what must be stored, restrict access, validate input and agree appropriate handling and retention practices for the project.",
      ],
      [
        "Will the API be documented?",
        "We include documentation for the agreed endpoints, authentication flow and integration responsibilities in the handover scope.",
      ],
    ],
  },
  "mobile-app-development": {
    heading: "An app built around real everyday moments",
    story:
      "The best mobile experiences make a specific task easier. We identify the journeys your users need most, prototype them, and connect the app to the data and services behind your business. From onboarding to notifications, we consider permissions, connectivity and helpful feedback so the experience feels coherent on a small screen.",
    capabilities: [
      [
        "Onboarding & accounts",
        "Create clear registration, sign-in and profile flows with appropriate access controls.",
        "phone",
      ],
      [
        "Useful connected features",
        "Bring bookings, order updates, notifications and account information into a focused mobile experience.",
        "spark",
      ],
      [
        "Device & release preparation",
        "Test agreed devices, review permissions and prepare the assets needed for the relevant distribution channels.",
        "shield",
      ],
    ],
    examples: [
      [
        "Booking & appointment apps",
        "Let customers explore services, request an appointment and follow updates in one place.",
      ],
      [
        "Customer companion apps",
        "Keep customers connected to their account, requests and relevant information after their first interaction.",
      ],
      [
        "Field-team tools",
        "Give teams a convenient way to capture information and check work status while away from their desks.",
      ],
    ],
    tech: [
      [
        "Platform planning",
        "Choose a native or cross-platform approach based on device features, audience and maintenance needs.",
      ],
      [
        "Connected backend",
        "Use authenticated APIs for user accounts, business records and application workflows.",
      ],
      [
        "Notifications & analytics",
        "Plan consent, event tracking and useful notifications around the journeys that matter.",
      ],
    ],
    faq: [
      [
        "Can one project support Android and iOS?",
        "We can evaluate a shared cross-platform approach or separate native builds. The choice depends on your features, budget and device requirements.",
      ],
      [
        "Can the app work without an internet connection?",
        "Some workflows can support offline capture and later synchronisation. We agree which data and actions need this behaviour during discovery.",
      ],
      [
        "Do you help with app-store release?",
        "We can prepare builds and submission assets within the agreed scope. Store accounts and review decisions remain with the account owner and platform.",
      ],
    ],
  },
  "ai-workflow-automation": {
    heading: "Practical automation with people in control",
    story:
      "We start with the work, not the tool: where information arrives, who checks it and what happens next. Rules-based automation can handle predictable steps, while AI can assist with tasks such as summarising or finding relevant information. We define review points and failure handling so your team can supervise the workflow and understand its limits.",
    capabilities: [
      [
        "Workflow mapping",
        "Identify repeated steps, ownership and exceptions before selecting an automation approach.",
        "design",
      ],
      [
        "Knowledge assistants",
        "Connect approved information sources to an assistant designed for a clearly defined audience and task.",
        "spark",
      ],
      [
        "Review & monitoring",
        "Add human approval for important actions, activity records and a route for handling failures.",
        "shield",
      ],
    ],
    examples: [
      [
        "Lead intake & routing",
        "Collect inquiries, organise key details and route them to the appropriate team for review.",
      ],
      [
        "Internal knowledge support",
        "Help staff find answers in approved documents while keeping source access and permissions in mind.",
      ],
      [
        "Document assistance",
        "Extract or summarise agreed information for a person to check before it enters a business process.",
      ],
    ],
    tech: [
      [
        "Connected tools",
        "Integrate the business applications and APIs your workflow already relies on.",
      ],
      [
        "Model selection",
        "Evaluate suitability for the task, data handling needs, response quality and operating cost.",
      ],
      [
        "Evaluation & controls",
        "Define representative examples, review criteria and fallback behaviour before wider rollout.",
      ],
    ],
    faq: [
      [
        "Do all workflows need AI?",
        "No. Predictable rules are often simpler and more reliable for structured tasks. We use AI assistance where the task benefits from it.",
      ],
      [
        "Can AI make mistakes?",
        "Yes. We plan review steps, evaluate representative examples and avoid treating generated output as automatically correct.",
      ],
      [
        "Can you work with our existing tools?",
        "We review available APIs, permissions and account limits before agreeing the integration scope.",
      ],
    ],
  },
  "digital-marketing": {
    heading: "Connect visibility to meaningful customer actions",
    story:
      "Marketing works best when the audience, message and destination agree. We review how people discover your business, what they need to know, and what action makes sense next. Search content, paid campaigns and landing pages can then support a shared plan, with measurement that helps you decide what to improve.",
    capabilities: [
      [
        "Search & content planning",
        "Map customer questions to useful pages and prioritise content and technical improvements.",
        "code",
      ],
      [
        "Campaign & landing-page alignment",
        "Connect audience targeting and ad messaging to a focused, relevant website experience.",
        "growth",
      ],
      [
        "Conversion measurement",
        "Define meaningful actions and review agreed tracking so reports support useful decisions.",
        "design",
      ],
    ],
    examples: [
      [
        "Service-business lead generation",
        "Create clear service content and inquiry journeys for people comparing providers.",
      ],
      [
        "Product or offer launches",
        "Coordinate a focused landing page, campaign message and measurement plan for a new offer.",
      ],
      [
        "Content-led discovery",
        "Develop helpful answers to audience questions with a structure that is easy to navigate and maintain.",
      ],
    ],
    tech: [
      [
        "Search foundations",
        "Review page structure, metadata, internal links and indexability as part of the agreed audit.",
      ],
      [
        "Campaign platforms",
        "Choose relevant paid channels according to the audience, offer and available budget.",
      ],
      [
        "Analytics & reporting",
        "Track agreed events and explain performance in context, including measurement limitations.",
      ],
    ],
    faq: [
      [
        "Can you guarantee rankings or leads?",
        "No. Results depend on competition, demand, budget and execution. We agree measurable objectives and review progress against them.",
      ],
      [
        "Is advertising spend included?",
        "Media spend and service fees are scoped separately so you can see where the budget is going.",
      ],
      [
        "Can marketing work alongside a website rebuild?",
        "Yes. Planning content, landing pages and measurement early helps the website support your acquisition goals.",
      ],
    ],
  },
  "ui-ux-product-design": {
    heading: "Make the next step feel obvious",
    story:
      "Good product design brings business goals and user needs into the same conversation. We organise information, explore alternatives and use prototypes to make decisions tangible before development. A consistent component language helps the finished experience feel connected across pages, devices and future additions.",
    capabilities: [
      [
        "Information & user journeys",
        "Define navigation, content hierarchy and the steps people take to complete important tasks.",
        "design",
      ],
      [
        "Interactive prototypes",
        "Explore screen flows and gather feedback before implementation makes changes more expensive.",
        "phone",
      ],
      [
        "Reusable design components",
        "Document visual patterns, responsive behaviour and component states for consistent development.",
        "code",
      ],
    ],
    examples: [
      [
        "Website experience refresh",
        "Improve content flow, navigation and visual consistency while respecting the existing brand.",
      ],
      [
        "New product concepts",
        "Turn an idea into tangible screens and a prototype that stakeholders can review together.",
      ],
      [
        "Complex dashboards",
        "Organise dense information and frequent actions into a clearer working environment.",
      ],
    ],
    tech: [
      [
        "Research & discovery",
        "Review existing material, stakeholder goals and available evidence about user needs.",
      ],
      [
        "Wireframes & prototypes",
        "Move from structural exploration to detailed interfaces at a level appropriate to the decision.",
      ],
      [
        "Design handoff",
        "Provide reusable components, states and implementation guidance within the agreed scope.",
      ],
    ],
    faq: [
      [
        "Can you use our current brand identity?",
        "Yes. We can apply your logo, colour palette and typography, and identify any missing patterns the product needs.",
      ],
      [
        "Do you also develop the design?",
        "Design can be delivered on its own or combined with our frontend and backend services.",
      ],
      [
        "How is feedback managed?",
        "We agree review milestones, collect feedback against the project goals and document approved decisions before moving forward.",
      ],
    ],
  },
  "cloud-api-devops": {
    heading: "A clearer path from build to production",
    story:
      "A live application needs repeatable releases and a practical operating plan. We review its dependencies, environments and failure points, then agree an approach that fits the team responsible for running it. Configuration, deployment checks and recovery procedures are treated as part of delivery rather than left until the end.",
    capabilities: [
      [
        "Environment & deployment planning",
        "Separate configuration and secrets, map dependencies and choose suitable hosting for the agreed workload.",
        "cloud",
      ],
      [
        "Repeatable releases",
        "Build delivery workflows with checks, traceable versions and an agreed rollback approach.",
        "code",
      ],
      [
        "Operational visibility",
        "Plan logs, alerts and backup responsibilities so the team has useful information when something goes wrong.",
        "server",
      ],
    ],
    examples: [
      [
        "First production launch",
        "Prepare an application, database and release process for use by real customers.",
      ],
      [
        "Release-process improvements",
        "Reduce manual deployment steps and introduce appropriate verification before changes go live.",
      ],
      [
        "Hosting consolidation",
        "Review existing services and organise them into an environment your team can understand and maintain.",
      ],
    ],
    tech: [
      [
        "Cloud services",
        "Select managed services based on the application, expected usage and operational capacity.",
      ],
      [
        "Build & delivery pipelines",
        "Automate repeatable checks and deployment steps using the project’s repository and hosting tools.",
      ],
      [
        "Logs, backups & recovery",
        "Define what needs monitoring, where backups live and how recovery will be validated.",
      ],
    ],
    faq: [
      [
        "Can you work with our existing hosting provider?",
        "We review the available features and access, then determine whether the agreed requirements can be supported there.",
      ],
      [
        "Are hosting costs included?",
        "Hosting and other provider charges are identified separately from implementation and support fees.",
      ],
      [
        "Do you provide ongoing monitoring?",
        "Monitoring and response responsibilities can be included in a separately agreed support scope.",
      ],
    ],
  },
  cybersecurity: {
    heading: "Turn security findings into practical improvements",
    story:
      "Security work starts with a defined system and a clear scope. We review how information enters the application, where it is stored and which actions each role can perform. Findings are prioritised by their relevance to your environment, then translated into changes your team can implement and verify. No review can establish that a system is free of every risk.",
    capabilities: [
      [
        "Application controls",
        "Review agreed authentication, session, permission and input-validation behaviour.",
        "shield",
      ],
      [
        "Configuration & secret handling",
        "Check how deployment settings and credentials are managed within the authorised scope.",
        "server",
      ],
      [
        "Remediation & verification",
        "Prioritise findings, apply agreed fixes and verify the affected behaviour after changes.",
        "code",
      ],
    ],
    examples: [
      [
        "Pre-launch application review",
        "Review agreed areas of a new application before opening it to customers.",
      ],
      [
        "Access-control improvements",
        "Clarify roles and reduce unnecessary access to administrative functions or sensitive records.",
      ],
      [
        "Existing-product hardening",
        "Address selected weaknesses in forms, sessions and deployment configuration through focused improvements.",
      ],
    ],
    tech: [
      [
        "Scope & authorisation",
        "Define the systems, access and testing activities that are permitted before work begins.",
      ],
      [
        "Review & evidence",
        "Record reproducible observations and explain their practical impact on the application.",
      ],
      [
        "Fixes & handover",
        "Document completed changes, verification results and any remaining actions for the owner.",
      ],
    ],
    faq: [
      [
        "Is this a compliance certification?",
        "No. Application review and hardening are distinct from formal certification. Any specialist compliance requirement must be scoped separately.",
      ],
      [
        "Can you test a live application?",
        "Only within explicitly authorised scope, with agreed limits and timing to protect normal operations.",
      ],
      [
        "What will we receive?",
        "The agreed deliverables can include findings, priority recommendations, implemented fixes and verification notes.",
      ],
    ],
  },
};

export function enrichServicePage(page, stableId) {
  const slug = page.path?.split("/")[2];
  const detail = detailContent[slug];
  if (!detail) return false;
  const item = ([title, text, icon = "spark"]) => ({
    title,
    text,
    icon,
    href: "",
    image: "",
    alt: "",
  });
  const block = (key, type, heading, body, items, extra = {}) => ({
    id: stableId(`${slug}-expanded-${key}`),
    type,
    anchor: `service-${key}`,
    eyebrow: "",
    heading,
    body,
    items: items.map(item),
    buttonLabel: "",
    href: "",
    image: "",
    alt: "",
    ...extra,
  });
  const additions = [
    block("approach", "about", detail.heading, detail.story, [], {
      eyebrow: "THE BIGGER PICTURE",
      image: photos[slug].image,
      alt: photos[slug].alt,
      buttonLabel: "Discuss your requirements",
      href: "#contact",
    }),
    block(
      "capabilities",
      "features",
      "More detail. Better decisions.",
      "Explore the work that can be included in your project. We agree the final scope around your priorities.",
      detail.capabilities,
      { eyebrow: "SERVICE CAPABILITIES" },
    ),
    block(
      "examples",
      "services",
      "What could this look like for your business?",
      "Illustrative project types to help you shape a brief. These are examples of possible work, not client case studies.",
      detail.examples,
      { eyebrow: "PROJECT IDEAS" },
    ),
    block(
      "tools",
      "technology",
      "The right foundation for your project",
      "Technology and delivery choices follow the requirements, existing systems and the people who will maintain the work.",
      detail.tech,
      { eyebrow: "TOOLS & APPROACH" },
    ),
    block(
      "faq",
      "faq",
      `More about ${page.title.toLowerCase()}`,
      "",
      detail.faq,
      { eyebrow: "YOUR SERVICE QUESTIONS" },
    ),
  ];
  const relatedImages = [
    photos[slug],
    photos.overview,
    photos[
      slug === "ui-ux-product-design"
        ? "frontend-development"
        : "ui-ux-product-design"
    ],
  ];
  additions[2].items.forEach((it, i) => {
    it.image = relatedImages[i].image;
    it.alt = relatedImages[i].alt;
    it.icon = detail.capabilities[i][2];
  });
  additions[3].items.forEach((it, i) => {
    it.icon = ["code", "server", "growth"][i];
  });
  const existingIds = new Set(page.blocks.map((b) => b.id));
  const fresh = additions.filter((b) => !existingIds.has(b.id));
  if (!fresh.length) return false;
  for (const addition of fresh) {
    let index =
      addition.anchor === "service-approach"
        ? page.blocks.findIndex((b) => b.type === "hero") + 1
        : page.blocks.findIndex(
            (b) => b.type === (addition.type === "faq" ? "contact" : "process"),
          );
    if (index < 0) index = page.blocks.length;
    page.blocks.splice(index, 0, addition);
  }
  return true;
}

export async function migrateServiceDetails(db, stableId) {
  await db.transaction(async (q) => {
    const marker = await q.query(
      "INSERT INTO cms_migrations (id) VALUES ($1) ON CONFLICT(id) DO NOTHING RETURNING id",
      ["service-detail-expansion-v1"],
    );
    if (!marker.length) return;
    const rows = await q.query(
      "SELECT id,draft,published FROM documents WHERE kind='page'",
    );
    for (const row of rows) {
      let changed = false;
      const next = { ...row };
      for (const field of ["draft", "published"]) {
        if (!row[field]) continue;
        const page = JSON.parse(row[field]);
        if (enrichServicePage(page, stableId)) {
          next[field] = JSON.stringify(page);
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

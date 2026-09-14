import photos from "../shared/service-photos.json" with { type: "json" };

// Each entry explains an individual service within its parent category.
// Title, summary, included work, icon and illustration category.
export const serviceOfferings = {
  "digital-marketing": [
    [
      "Search Engine Optimisation (SEO)",
      "Improve how your website answers relevant searches and helps visitors find the right information.",
      "Keyword and search-intent research, on-page titles and descriptions, internal linking, content recommendations and a prioritised technical SEO review.",
      "growth",
      "digital-marketing",
    ],
    [
      "Local SEO & Business Profiles",
      "Help customers understand where you operate, which services you offer and how to contact you.",
      "Business-profile review, consistent business details, location-page planning, local service content and a practical review-response workflow.",
      "cloud",
      "overview",
    ],
    [
      "Google Ads & PPC Campaigns",
      "Reach people actively looking for a relevant product or service with focused paid-search campaigns.",
      "Campaign structure, audience and keyword planning, ad copy, negative-keyword review, landing-page alignment and budget reporting. Advertising spend is agreed separately.",
      "growth",
      "digital-marketing",
    ],
    [
      "Paid Social Advertising",
      "Introduce your offer to relevant audiences through paid campaigns on suitable social platforms.",
      "Audience planning, creative briefs, ad variations, campaign setup and conversion-event review. Channel selection follows your audience, offer and budget.",
      "phone",
      "mobile-app-development",
    ],
    [
      "Social Media Management",
      "Build a consistent presence with content that reflects your brand and gives people a reason to engage.",
      "Channel review, content themes, a publishing calendar, post copy and creative coordination. Community-management responsibilities are defined in the scope.",
      "design",
      "ai-workflow-automation",
    ],
    [
      "Content Strategy & Copywriting",
      "Explain your expertise through useful content that supports both discovery and customer decisions.",
      "Audience questions, topic planning, service-page copy, article outlines, landing-page messaging and an editorial review process.",
      "design",
      "ui-ux-product-design",
    ],
    [
      "Email Marketing & Automation",
      "Keep in touch with people who have chosen to hear from your business through relevant, timely messages.",
      "Audience segmentation, email templates, welcome or follow-up sequences, preference and unsubscribe flows, and campaign measurement.",
      "spark",
      "backend-development",
    ],
    [
      "Landing Pages & Conversion Optimisation",
      "Make the next step clearer for visitors arriving from campaigns, search or email.",
      "Message hierarchy, calls to action, form review, mobile layouts and an experiment plan where enough traffic is available to evaluate changes.",
      "code",
      "frontend-development",
    ],
    [
      "Analytics & Conversion Tracking",
      "Understand which activities lead to meaningful customer actions rather than relying only on traffic totals.",
      "Measurement planning, agreed events, campaign tagging, tracking checks and reporting. Consent requirements and measurement gaps are considered in setup.",
      "growth",
      "digital-marketing",
    ],
    [
      "Answer Engine Optimisation (AEO)",
      "Make your expertise easier to understand through clear, well-structured answers to real customer questions.",
      "Question-led content, factual review, logical headings, relevant structured data and source clarity. Search or AI-answer inclusion cannot be guaranteed.",
      "spark",
      "ai-workflow-automation",
    ],
    [
      "E-commerce Marketing",
      "Connect product discovery, persuasive product information and a smoother buying journey.",
      "Product and category content review, shopping-campaign planning where appropriate, audience segmentation and purchase-funnel measurement.",
      "phone",
      "mobile-app-development",
    ],
    [
      "Creative Campaign Assets",
      "Give campaigns a consistent visual identity across their ads, landing pages and supporting content.",
      "Creative concepts, static ad designs, social graphics, image selection and platform-ready variations, with deliverables and usage agreed in advance.",
      "design",
      "ui-ux-product-design",
    ],
  ],
  "frontend-development": [
    [
      "Business Website Development",
      "Present your business through a clear, responsive website that helps visitors explore services and make an inquiry.",
      "Page layouts, navigation, reusable components, inquiry forms and integration with your approved content and assets.",
      "code",
      "overview",
    ],
    [
      "React Web Applications",
      "Build interactive browser applications for tasks that go beyond a traditional information website.",
      "Application screens, reusable components, state handling, routing and API connections with loading and error feedback.",
      "code",
      "frontend-development",
    ],
    [
      "Responsive & Mobile-first Interfaces",
      "Keep the experience comfortable across phones, tablets and desktop screens.",
      "Responsive layouts, navigation behaviour, touch-friendly controls, flexible images and checks at agreed screen sizes.",
      "phone",
      "mobile-app-development",
    ],
    [
      "Design-to-code Implementation",
      "Turn approved designs into production interfaces while keeping the visual details consistent.",
      "Typography, spacing, component states, responsive rules and a review of the implementation against the approved design.",
      "design",
      "ui-ux-product-design",
    ],
    [
      "E-commerce Storefronts",
      "Make product discovery and shopping easier with a frontend tailored to your catalogue and buying journey.",
      "Category pages, product layouts, search and filtering, cart interfaces and integration with the chosen commerce backend.",
      "phone",
      "mobile-app-development",
    ],
    [
      "Dashboards & Customer Portals",
      "Help customers or staff find important information and complete frequent tasks in one place.",
      "Data views, tables, filters, charts, account screens and interfaces that reflect the backend’s role permissions.",
      "server",
      "digital-marketing",
    ],
    [
      "CMS & Content-driven Websites",
      "Give your team practical control over the content they need to update regularly.",
      "CMS-connected pages, reusable sections, media handling and interfaces for published content, previews and dynamic routes.",
      "code",
      "overview",
    ],
    [
      "Performance & Accessibility Improvements",
      "Remove avoidable friction from an existing website or application.",
      "Asset and rendering review, image optimisation, keyboard navigation, labels, focus states and prioritised improvements within the agreed scope.",
      "growth",
      "frontend-development",
    ],
    [
      "Frontend Maintenance & Modernisation",
      "Improve an existing interface without treating every change as a complete rebuild.",
      "Component cleanup, dependency review, bug fixes, responsive refinements and staged replacement of agreed legacy features.",
      "shield",
      "backend-development",
    ],
  ],
  "backend-development": [
    [
      "REST API Development",
      "Connect websites, mobile apps and partner systems to a consistent set of business operations.",
      "Endpoint design, validation, authentication, error responses, pagination and documentation for the agreed integrations.",
      "code",
      "backend-development",
    ],
    [
      "Database Design & Migration",
      "Organise business information so relationships and updates remain predictable.",
      "Data modelling, constraints, indexes, migration planning and transaction boundaries, with checks for the records being moved.",
      "server",
      "cloud-api-devops",
    ],
    [
      "Authentication & Role Management",
      "Give each user the access required for their responsibilities.",
      "Account flows, password handling, protected sessions, role-based permissions and validation of privileged actions.",
      "shield",
      "cybersecurity",
    ],
    [
      "Admin Panels & CMS Backends",
      "Give your team a central place to manage content and daily operations.",
      "Content models, administrative APIs, media records, draft and publish states, and access rules tailored to the workflow.",
      "server",
      "overview",
    ],
    [
      "Payments & Subscription Integrations",
      "Connect your product to an agreed payment provider while keeping payment status consistent with business records.",
      "Checkout integration, provider webhooks, transaction-status handling and subscription lifecycle events where required. Provider charges are separate.",
      "shield",
      "backend-development",
    ],
    [
      "CRM & Third-party Integrations",
      "Reduce duplicate entry by connecting tools already used across the business.",
      "API and webhook connections, field mapping, permission checks, retry rules and a plan for handling failed synchronisation.",
      "spark",
      "ai-workflow-automation",
    ],
    [
      "Background Jobs & Notifications",
      "Move time-consuming work out of the immediate request flow and keep users informed.",
      "Scheduled tasks, queues where appropriate, email or notification triggers, retries and operational visibility for agreed jobs.",
      "cloud",
      "cloud-api-devops",
    ],
    [
      "Reporting & Business Workflows",
      "Translate repeated business steps into clear, controlled application behaviour.",
      "Status transitions, approval flows, reports, exports and rules that keep important updates consistent.",
      "growth",
      "digital-marketing",
    ],
    [
      "Backend Review & Optimisation",
      "Improve the behaviour of an existing service based on evidence from its actual workload.",
      "Query and endpoint review, selected bottleneck investigation, input-validation fixes and verification of agreed changes.",
      "server",
      "backend-development",
    ],
  ],
  "mobile-app-development": [
    [
      "Android App Development",
      "Create an Android experience around your audience, devices and core customer journeys.",
      "Screen implementation, platform permissions, backend connections and testing on the agreed Android device range.",
      "phone",
      "mobile-app-development",
    ],
    [
      "iOS App Development",
      "Bring your service to iPhone users with an experience shaped for the platform.",
      "Application flows, device-feature integration, permissions, testing and release preparation for the agreed iOS versions.",
      "phone",
      "mobile-app-development",
    ],
    [
      "Cross-platform App Development",
      "Evaluate a shared application approach when the project needs to support both major mobile platforms.",
      "Shared UI and business logic where suitable, platform-specific adjustments and a plan for maintaining the two releases.",
      "code",
      "overview",
    ],
    [
      "Mobile UI/UX & Prototyping",
      "Test the structure of the app before committing to a full implementation.",
      "User journeys, wireframes, interactive prototypes, component states and feedback-led refinements.",
      "design",
      "ui-ux-product-design",
    ],
    [
      "Booking & Service Apps",
      "Let customers find a service, request a booking and keep track of updates.",
      "Service listings, availability integration, booking flows, account history and relevant notifications.",
      "phone",
      "mobile-app-development",
    ],
    [
      "Commerce & Customer Apps",
      "Support product discovery and customer relationships through a focused mobile channel.",
      "Catalogue views, search, account screens, cart or checkout connections and order-status integration as agreed.",
      "growth",
      "digital-marketing",
    ],
    [
      "Push Notifications & API Integration",
      "Keep the app connected to useful information and timely updates.",
      "Authenticated APIs, notification preferences, event triggers, permission handling and clear connection-failure states.",
      "spark",
      "backend-development",
    ],
    [
      "Offline & Device Features",
      "Support selected tasks when users are away from a reliable connection or need a device capability.",
      "Offline data capture, synchronisation rules, camera or location features where required, and explicit permission flows.",
      "cloud",
      "mobile-app-development",
    ],
    [
      "Testing, Release & Maintenance",
      "Prepare the application for distribution and continued improvement after launch.",
      "Agreed device testing, defect resolution, build preparation, submission support and a separately scoped maintenance plan. Store approval is controlled by the platform.",
      "shield",
      "frontend-development",
    ],
  ],
  "ai-workflow-automation": [
    [
      "Business Workflow Automation",
      "Remove repeated manual steps from a clearly defined process.",
      "Workflow mapping, triggers, conditions, connected actions and exception handling, with rules-based automation used where appropriate.",
      "spark",
      "ai-workflow-automation",
    ],
    [
      "AI Knowledge Assistants",
      "Help a defined audience find information in approved business sources.",
      "Source selection, access-aware retrieval, response guidance, evaluation examples and human escalation paths.",
      "spark",
      "overview",
    ],
    [
      "Customer-support Assistants",
      "Assist with recurring questions while keeping complex or sensitive conversations with the team.",
      "Approved answer sources, conversation flows, lead or support intake and handoff rules for situations the assistant should not handle.",
      "phone",
      "mobile-app-development",
    ],
    [
      "Document Processing Assistance",
      "Organise selected information from documents for a person or downstream workflow to review.",
      "Document intake, extraction or summarisation, validation rules and a review step before important records are updated.",
      "code",
      "backend-development",
    ],
    [
      "Lead & CRM Automation",
      "Make inquiry handling more consistent across forms, inboxes and business tools.",
      "Lead capture, field mapping, duplicate checks, routing rules and follow-up tasks agreed with your team.",
      "growth",
      "digital-marketing",
    ],
    [
      "Reporting & Internal Assistants",
      "Reduce the effort involved in collecting information for recurring internal work.",
      "Approved data connections, report preparation, summaries and reviewable outputs, with ownership of final decisions remaining clear.",
      "server",
      "digital-marketing",
    ],
    [
      "Tool & API Integrations",
      "Connect an automation to the systems it needs without giving it unnecessary access.",
      "Scoped credentials, API connections, validation, retry rules and logs for the actions performed.",
      "cloud",
      "cloud-api-devops",
    ],
    [
      "AI Evaluation & Human Review",
      "Check whether an assistant is useful enough for its intended task before wider deployment.",
      "Representative test cases, quality criteria, failure examples, approval steps and monitoring of operating costs and behaviour.",
      "shield",
      "cybersecurity",
    ],
  ],
  "ui-ux-product-design": [
    [
      "UX Discovery & Experience Review",
      "Build a clearer picture of the people, goals and constraints behind the product.",
      "Stakeholder discussions, existing-experience review, available user evidence and prioritised opportunities for improvement.",
      "design",
      "ai-workflow-automation",
    ],
    [
      "Information Architecture & User Flows",
      "Organise pages and actions so people can understand where they are and what to do next.",
      "Content hierarchy, navigation planning, page relationships and key task flows.",
      "design",
      "ui-ux-product-design",
    ],
    [
      "Wireframes & Interactive Prototypes",
      "Make ideas tangible before visual polish or development becomes the focus.",
      "Structural screen layouts, linked journeys, interaction exploration and review-ready prototypes.",
      "phone",
      "ui-ux-product-design",
    ],
    [
      "Website & Landing-page Design",
      "Create a visual experience that connects the brand, message and intended customer action.",
      "Page compositions, typography, image direction, responsive designs and clear calls to action.",
      "growth",
      "overview",
    ],
    [
      "Mobile App Interface Design",
      "Shape a focused experience for smaller screens and frequent everyday interactions.",
      "Onboarding, navigation, touch targets, screen states and platform-aware interaction details.",
      "phone",
      "mobile-app-development",
    ],
    [
      "Dashboard & SaaS Product Design",
      "Help users work with dense information without losing sight of their main tasks.",
      "Dashboard hierarchy, data views, filters, tables, empty states and role-specific journeys.",
      "server",
      "digital-marketing",
    ],
    [
      "Design Systems & Component Libraries",
      "Create shared patterns that make new screens easier to design and build consistently.",
      "Colour and typography rules, reusable components, interaction states and responsive usage guidance.",
      "code",
      "frontend-development",
    ],
    [
      "Usability Review & Developer Handoff",
      "Turn design decisions into a buildable specification and identify areas that need refinement.",
      "Review tasks, feedback synthesis, component specifications, asset preparation and implementation notes.",
      "shield",
      "ui-ux-product-design",
    ],
  ],
  "cloud-api-devops": [
    [
      "Cloud & Hosting Architecture",
      "Choose a practical operating environment for the application and the team maintaining it.",
      "Dependency mapping, workload review, provider selection, environment structure and a cost-aware deployment plan.",
      "cloud",
      "cloud-api-devops",
    ],
    [
      "Application Deployment",
      "Move an application from a working build to a configured live service.",
      "Build and start configuration, environment variables, domains, certificates and deployment verification.",
      "code",
      "overview",
    ],
    [
      "CI/CD Delivery Pipelines",
      "Make releases repeatable and easier to trace back to a specific change.",
      "Repository integration, automated checks, build steps, environment-specific releases and agreed rollback procedures.",
      "spark",
      "backend-development",
    ],
    [
      "Container & Environment Setup",
      "Keep application dependencies and runtime configuration easier to reproduce.",
      "Containerisation where suitable, runtime configuration, local-to-production considerations and environment documentation.",
      "server",
      "cloud-api-devops",
    ],
    [
      "Database Hosting & Backups",
      "Plan how important application records will be hosted, backed up and restored.",
      "Database provisioning, connection configuration, access limits, backup schedules and agreed recovery validation.",
      "server",
      "cloud-api-devops",
    ],
    [
      "Monitoring, Logs & Alerts",
      "Give the operating team useful signals when application behaviour changes.",
      "Health checks, logs, selected metrics, alert thresholds and an agreed ownership and response process.",
      "growth",
      "digital-marketing",
    ],
    [
      "Cloud Migration & Scaling Review",
      "Evaluate how the current environment can support changing needs.",
      "Service inventory, migration stages, bottleneck review, capacity considerations and a plan to verify the transition.",
      "cloud",
      "overview",
    ],
    [
      "Access, Secrets & Operational Handover",
      "Make production responsibilities and sensitive configuration clear to the people who operate the system.",
      "Access roles, secret handling, deployment notes, recovery guidance and separately agreed ongoing support.",
      "shield",
      "cybersecurity",
    ],
  ],
  cybersecurity: [
    [
      "Web Application Security Review",
      "Review selected application behaviours within an explicitly agreed and authorised scope.",
      "Authentication, session, input-validation and configuration checks with reproducible observations and prioritised findings.",
      "shield",
      "cybersecurity",
    ],
    [
      "API Security Review",
      "Examine how application interfaces accept requests and protect access to business data.",
      "Endpoint authorisation, validation, error handling and selected abuse controls within the defined testing boundaries.",
      "code",
      "backend-development",
    ],
    [
      "Authentication & Access Hardening",
      "Reduce unnecessary access and strengthen important account workflows.",
      "Role permissions, privileged actions, session handling and account lifecycle review, followed by agreed improvements.",
      "shield",
      "cybersecurity",
    ],
    [
      "Cloud Configuration Review",
      "Check selected deployment settings that affect the exposure of the application and its data.",
      "Service access, environment configuration, secret storage and relevant provider settings covered by the review scope.",
      "cloud",
      "cloud-api-devops",
    ],
    [
      "Dependency & Code Review",
      "Find and address selected risks in the components and code paths the application relies on.",
      "Dependency checks, targeted source review, prioritised remediation and verification after changes.",
      "code",
      "frontend-development",
    ],
    [
      "Sensitive-data Handling",
      "Understand where sensitive information enters, moves through and leaves the application.",
      "Data-flow review, access restrictions, logging considerations and retention decisions agreed with the system owner.",
      "server",
      "backend-development",
    ],
    [
      "Remediation & Retesting",
      "Translate findings into practical fixes and evidence that the affected behaviour has improved.",
      "A prioritised action plan, agreed code or configuration changes, retesting and documentation of remaining work.",
      "growth",
      "cybersecurity",
    ],
    [
      "Security Readiness & Handover",
      "Give the owner a clearer picture of the reviewed system and the actions that still need attention.",
      "Findings and verification notes, operational responsibilities and recommended next steps. This work is not a formal compliance certification or a guarantee of complete security.",
      "shield",
      "overview",
    ],
  ],
};

export function addOfferingCatalog(page, stableId) {
  if (!page.path?.startsWith("/services/")) return false;
  const slug = page.path.split("/")[2];
  const offerings = serviceOfferings[slug];
  if (!offerings) return false;
  const id = stableId(`${slug}-offering-catalog-v1`);
  if (page.blocks.some((b) => b.id === id || b.anchor === "included-services"))
    return false;
  const block = {
    id,
    type: "services",
    anchor: "included-services",
    eyebrow: "EXPLORE OUR SERVICES",
    heading:
      slug === "digital-marketing"
        ? "Digital marketing services, from discovery to conversion."
        : `${page.title}: explore the services we offer.`,
    body: "Explore each service below and choose what fits your goals. Services can be scoped individually or combined into a coordinated project; deliverables, timeline and fees are agreed before work begins.",
    image: "",
    alt: "",
    buttonLabel: "Discuss your service requirements",
    href: "#contact",
    items: offerings.map(([title, summary, included, icon, photo]) => ({
      title,
      text: `${summary}\n\nIncludes: ${included}`,
      icon,
      image: photos[photo].image,
      alt: photos[photo].alt,
      href: "#contact",
    })),
  };
  const position = page.blocks.findIndex(
    (b) => b.anchor === "service-approach",
  );
  page.blocks.splice(position >= 0 ? position + 1 : 1, 0, block);
  return true;
}

export async function migrateOfferingCatalogs(db, stableId) {
  await db.transaction(async (q) => {
    const marker = await q.query(
      "INSERT INTO cms_migrations (id) VALUES ($1) ON CONFLICT(id) DO NOTHING RETURNING id",
      ["service-offering-catalog-v1"],
    );
    if (!marker.length) return;
    const rows = await q.query(
      "SELECT id,draft,published FROM documents WHERE kind='page'",
    );
    for (const row of rows) {
      const next = { ...row };
      let changed = false;
      for (const field of ["draft", "published"]) {
        if (!row[field]) continue;
        const page = JSON.parse(row[field]);
        if (addOfferingCatalog(page, stableId)) {
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

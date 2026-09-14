export const serviceCatalog = [
  {
    slug: "frontend-development",
    title: "Frontend Development",
    icon: "code",
    image: "portfolio-floating-sites.png",
    intro: "Turn your first impression into a lasting connection.",
    body: "Fast, accessible websites and web interfaces that make your business easy to understand and your next customer action easy to take.",
    deliverables: [
      [
        "Responsive websites",
        "Layouts that adapt to phones, tablets and large screens, with clear navigation and readable content.",
      ],
      [
        "React applications",
        "Reusable components, thoughtful loading states and interactive features built around real user journeys.",
      ],
      [
        "Performance & accessibility",
        "Image optimisation, keyboard navigation and practical checks for a more inclusive experience.",
      ],
    ],
    fit: "Business websites, customer portals, landing pages and products that need a clearer, faster interface.",
  },
  {
    slug: "backend-development",
    title: "Backend Development",
    icon: "server",
    image: "software-laptop-3d.png",
    intro: "A strong foundation for everything your business does online.",
    body: "Connect your website, data and daily operations through reliable APIs, secure account access and purpose-built business tools.",
    deliverables: [
      [
        "APIs & integrations",
        "Connect payments, CRM tools and external services through documented interfaces and validated data flows.",
      ],
      [
        "Databases & business logic",
        "Design structured data models, migrations and workflows that reflect how your organisation operates.",
      ],
      [
        "Admin panels & access",
        "Manage content and operations with role-based permissions, protected sessions and clear administrative controls.",
      ],
    ],
    fit: "Businesses that need a CMS, operational dashboard, customer account system or connected application.",
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    icon: "phone",
    image: "hero-orbit.png",
    intro: "Put your business in your customers’ hands.",
    body: "Useful mobile experiences built around the moments that matter: discovering a service, making a booking and staying connected.",
    deliverables: [
      [
        "App experience design",
        "Map key user journeys and prototype screens before implementation begins.",
      ],
      [
        "Connected app features",
        "Build account access, bookings, notifications and data synchronisation around your agreed requirements.",
      ],
      [
        "Release preparation",
        "Test on agreed devices, prepare release assets and support the submission process for relevant app stores.",
      ],
    ],
    fit: "Customer-facing services, booking businesses and teams that need convenient access while on the move.",
  },
  {
    slug: "ai-workflow-automation",
    title: "AI & Workflow Automation",
    icon: "spark",
    image: "software-laptop-3d.png",
    intro: "Less repetitive work. More room for meaningful work.",
    body: "Connect everyday tools and introduce practical AI assistance where it can reduce manual effort, with human review for important decisions.",
    deliverables: [
      [
        "Workflow discovery",
        "Identify repetitive tasks, map inputs and outputs, and select automation opportunities with clear success criteria.",
      ],
      [
        "Assistants & integrations",
        "Build knowledge assistants, lead-routing flows and connected internal tools using your approved sources.",
      ],
      [
        "Controls & monitoring",
        "Add review steps, error handling and activity records so your team can understand and manage each workflow.",
      ],
    ],
    fit: "Teams handling repeated support questions, document processing, lead intake or manual data transfers.",
  },
  {
    slug: "digital-marketing",
    title: "SEO, PPC & Digital Marketing",
    icon: "growth",
    image: "portfolio-floating-sites.png",
    intro: "Help the right people discover your business.",
    body: "Bring content, search visibility and paid campaigns together around a clear audience and meaningful conversion goals.",
    deliverables: [
      [
        "Search & content foundations",
        "Review site structure, search intent and content gaps, then plan useful pages and technical improvements.",
      ],
      [
        "Campaigns & landing pages",
        "Align paid campaign messaging with focused landing pages and measurable customer actions.",
      ],
      [
        "Measurement & iteration",
        "Set up agreed tracking, review results and refine activity based on evidence. Outcomes depend on market, budget and execution.",
      ],
    ],
    fit: "Businesses ready to improve online visibility, test acquisition channels and make marketing decisions with better data.",
  },
  {
    slug: "ui-ux-product-design",
    title: "UI/UX & Product Design",
    icon: "design",
    image: "hero-orbit.png",
    intro: "Make complex products feel beautifully simple.",
    body: "Create a visual language and user experience that connect your brand with the needs of the people using your product.",
    deliverables: [
      [
        "Discovery & user flows",
        "Clarify audience needs, organise information and map the most important paths through the product.",
      ],
      [
        "Wireframes & prototypes",
        "Explore layouts and interactive journeys early, before investing in a full build.",
      ],
      [
        "Design systems & handoff",
        "Define reusable components, responsive behaviour and implementation notes for consistent delivery.",
      ],
    ],
    fit: "New digital products, website redesigns and growing teams that need a more consistent user experience.",
  },
  {
    slug: "cloud-api-devops",
    title: "Cloud, API & DevOps",
    icon: "cloud",
    image: "software-laptop-3d.png",
    intro: "From a working build to a dependable live product.",
    body: "Plan deployment, configuration and operational visibility so your application is easier to release, maintain and grow.",
    deliverables: [
      [
        "Hosting & architecture",
        "Choose a practical infrastructure approach based on your traffic, budget and operational needs.",
      ],
      [
        "Delivery pipelines",
        "Create repeatable builds and releases with environment separation and checks appropriate to the application.",
      ],
      [
        "Monitoring & recovery",
        "Plan logs, alerts, backups and recovery procedures with responsibilities and support scope agreed in advance.",
      ],
    ],
    fit: "Applications preparing for launch, teams improving their release process and businesses consolidating hosting.",
  },
  {
    slug: "cybersecurity",
    title: "Cybersecurity",
    icon: "shield",
    image: "portfolio-floating-sites.png",
    intro: "Build confidence into your digital foundations.",
    body: "Reduce avoidable application risks through secure design, focused reviews and practical improvements to access and data handling.",
    deliverables: [
      [
        "Application review",
        "Review agreed components for common weaknesses in authentication, validation and configuration.",
      ],
      [
        "Access & data protection",
        "Improve role permissions, session handling, secret management and sensitive data workflows.",
      ],
      [
        "Remediation planning",
        "Prioritise findings, implement agreed fixes and document follow-up actions. Review scope is agreed before work begins.",
      ],
    ],
    fit: "Businesses launching a product, handling customer information or strengthening an existing application.",
  },
];

export function serviceForTitle(title) {
  return serviceCatalog.find((service) =>
    title.toLowerCase().includes(service.title.toLowerCase()),
  );
}

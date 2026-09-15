import { schemas } from "../cms/shared/content.js";
export const blogArticles = [
  {
    slug: "ai-assistants-for-business",
    category: "AI & AUTOMATION",
    title: "AI assistants for business: start with one useful workflow",
    image: "/assets/blog-ai-assistants.webp",
    alt: "Illustrative image of a professional reviewing a support assistant at a desk",
    summary:
      "A practical way to plan an assistant that helps customers, uses your business information and knows when to involve a person.",
    sections: [
      [
        "Start with a specific customer task",
        "A useful assistant starts with a clear job. For a service business, that could be helping visitors compare services and prepare an inquiry. For a product business, it might be explaining an installation guide. Decide what a successful conversation should help the visitor do before choosing a model or designing a chat window.\n\nWrite down three things the assistant should handle and three things it must hand over. For example, it may explain published service options, but a team member should confirm a custom price, contractual commitment or unusual delivery deadline.",
      ],
      [
        "Give it a reliable knowledge source",
        "Collect the material that customers actually need: service descriptions, approved policies, product instructions and frequently asked questions. Assign someone to keep that material current. When a business detail changes, update the source rather than relying on the assistant to guess.\n\nKeep private account information out of a general website knowledge collection. A public service guide and an authenticated customer account tool have different access requirements and should be designed accordingly.",
      ],
      [
        "Make uncertainty part of the experience",
        "Generative AI can produce confident statements that are incorrect. NIST identifies this risk as confabulation. A natural tone does not prove that an answer is accurate. Ask the assistant to distinguish published business facts from general guidance, avoid unsupported claims and say when it cannot establish an answer.\n\nGive visitors a clear route to a person. A useful handover message might say: “I can explain the usual process, but the team needs to confirm this requirement.” The interface should identify the assistant as automated rather than pretending to be a human employee.",
      ],
      [
        "Pilot with realistic conversations",
        "Prepare example conversations before launch. Include short questions, spelling mistakes, follow-up questions, requests outside scope and questions whose answers are missing. Review whether the assistant asks a helpful clarification instead of filling gaps with invented details.\n\nFor a first pilot, we suggest tracking unanswered questions, helpful handovers and whether visitors can find the next step. Use those observations to improve the source content and interface. Keep the review focused on the task you set out to support, rather than adding more capabilities simply because the model can respond.",
      ],
      [
        "A simple brief for your first assistant",
        "Describe the intended audience, the one task to support, the approved knowledge sources, the topics requiring human review and the person responsible for maintenance. Then define how visitors can contact the team if the assistant is unavailable.\n\nThis small brief makes it easier to compare implementation options and discuss realistic scope. It also keeps the project centered on a useful customer experience rather than a promise that a chatbot can answer everything.",
      ],
    ],
    sourceTitle: "NIST: Generative AI Risk Management Profile",
    source: "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf",
    service: "/services/ai-workflow-automation",
  },
  {
    slug: "api-first-digital-products",
    category: "WEB DEVELOPMENT",
    title: "Why API-first development makes digital products easier to grow",
    image: "/assets/blog-api-first.webp",
    alt: "Illustrative developer workstation with connected laptop, tablet and mobile interfaces",
    summary:
      "Plan the connection between your website, app and business systems before the interface becomes difficult to change.",
    sections: [
      [
        "Begin with the business action",
        "Imagine a business that accepts consultation requests on its website and later wants the same feature in a mobile app. If the rules live only inside one interface, the second interface may require duplicate work. An API-first approach begins by describing the shared operation: which information is needed, who may submit it and what result is returned.\n\nThis is an approach to designing a product, not a requirement to split every feature into a separate service. A small application can still have a clear API and a straightforward deployment.",
      ],
      [
        "Agree on a contract before building screens",
        "An API contract describes the requests and responses that two parts of a system exchange. For a booking request, a team might agree on the service, preferred time, customer details, validation errors and confirmation status. Frontend and backend developers can then work from the same expectations.\n\nMicrosoft’s API design guidance emphasizes standard HTTP conventions, understandable resource names and interfaces that let clients evolve without depending on internal implementation details. These practices help make a contract easier for another team to understand.",
      ],
      [
        "Design the unhappy paths",
        "A successful response is only part of the workflow. What happens if the requested time is unavailable, a required field is missing or a network connection drops? Decide which errors the API returns and what the interface should tell the visitor.\n\nFor example, “Your request has been received” should mean that the record was actually saved. It should not imply that an appointment is confirmed if a team member still needs to review it. Defining these states early helps keep the website, app and admin panel consistent.",
      ],
      [
        "Keep access rules behind the interface",
        "A hidden button is not an access-control system. The backend must decide whether a caller can perform an operation and see the associated information. Think separately about public actions, customer account actions and staff administration.\n\nFor a project brief, list the information each group needs and the actions each group can perform. Use that list during implementation and review. A customer-facing response should contain what the customer needs for the task, not an unrestricted copy of an internal database record.",
      ],
      [
        "Choose a scope that can be maintained",
        "Before introducing a new integration, ask who will monitor it, how failures will be handled and what happens when either side changes. A documented API alone does not guarantee reliability or remove the need for maintenance.\n\nWe suggest starting with one complete workflow across the public interface, backend and admin panel. Review it with the people who will use and maintain it. Once that flow is clear, expanding to another interface or integration becomes a more informed decision.",
      ],
    ],
    sourceTitle: "Microsoft: Web API design best practices",
    source:
      "https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design",
    service: "/services/backend-development",
  },
  {
    slug: "everyday-website-security",
    category: "CYBERSECURITY",
    title: "Website security starts with everyday habits",
    image: "/assets/blog-website-security.webp",
    alt: "Illustrative security engineer checking a laptop beside network equipment",
    summary:
      "A practical starting point for thinking about staff access, protected actions and ongoing responsibility for your website.",
    sections: [
      [
        "Start with the people and information involved",
        "Before choosing security tools, describe what your website holds and who uses it. A public brochure site, a booking portal and an internal operations dashboard expose different information and actions. List the records that would cause harm if they were disclosed or changed without permission.\n\nThen map the ordinary work: who publishes content, who reviews customer inquiries and who manages staff accounts. A clear picture of those responsibilities makes it easier to decide where checks are needed.",
      ],
      [
        "Separate identity from permission",
        "Signing in establishes an identity; authorization determines what that identity is allowed to do. OWASP recommends denying access by default, granting only the permissions needed and checking permissions on every request. A visitor should not gain access to a record simply by changing an identifier in a URL.\n\nConsider a content team: an editor may prepare a draft while an administrator controls publishing and staff access. Those distinctions should be enforced on the server, not only by hiding controls in the dashboard.",
      ],
      [
        "Treat launch as a handover, not a finish line",
        "Choose an owner for maintenance before the site goes live. In your handover, record where the source code and deployment settings are managed, who can change them and how the team will respond if something stops working. Avoid leaving important knowledge with only one person.\n\nWe suggest a short recurring review of staff access, pending maintenance and changes to the website’s purpose. When a public page becomes a customer portal, revisit the original assumptions rather than treating it as only a design update.",
      ],
      [
        "Practice a few concrete access checks",
        "Use test accounts with different roles to check important workflows. Can an editor perform an administrator-only action? Can one customer request another customer’s record? Does signing out prevent further use of the session? Record expected outcomes so a later change can be checked against them.\n\nThese focused checks are examples, not a complete security assessment. Their value is that they turn a broad statement such as “the admin is secure” into specific behavior that the team can inspect.",
      ],
      [
        "Ask for clear scope and honest limits",
        "A security review should explain what was examined, what was found and what remains outside scope. A badge, a plugin or a successful test does not establish that every possible attack has been prevented.\n\nFor your next website project, ask for an access model, a maintenance owner, a list of tested workflows and a plan for handling reported problems. These deliverables make security a practical part of operating the product and give future developers a clearer starting point.",
      ],
    ],
    sourceTitle: "OWASP: Authorization Cheat Sheet",
    source:
      "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html",
    service: "/services/cybersecurity",
  },
];
const item = (title, text, href = "", image = "", alt = "") => ({
  title,
  text,
  href,
  image,
  alt,
});
export function blogBlock(id, type, heading, body = "", extra = {}) {
  return {
    id,
    type,
    anchor: "",
    eyebrow: "",
    heading,
    body,
    image: "",
    alt: "",
    buttonLabel: "",
    href: "",
    items: [],
    ...extra,
  };
}
export function blogListing(stableId) {
  return blogBlock(
    stableId("blog-home-cards"),
    "updates",
    "Ideas for what’s next.",
    "Practical perspectives on building useful, connected and secure digital products.",
    {
      anchor: "updates",
      eyebrow: "TECH UPDATES",
      buttonLabel: "View all articles",
      href: "/tech-updates",
      items: blogArticles.map((a) =>
        item(a.title, a.summary, "/blog/" + a.slug, a.image, a.alt),
      ),
    },
  );
}
export function blogPages(stableId) {
  const pages = blogArticles.map((a) => {
    const path = "/blog/" + a.slug;
    return [
      "blog-" + a.slug,
      "page",
      {
        schemaVersion: 1,
        title: a.title,
        path,
        seo: {
          title: {
            "ai-assistants-for-business":
              "AI Assistants for Business | On Zen On",
            "api-first-digital-products":
              "API-First Development for Growing Products | On Zen On",
            "everyday-website-security":
              "Everyday Website Security | On Zen On",
          }[a.slug],
          description: a.summary,
          canonical: path,
          ogImage: a.image,
          noindex: false,
        },
        blocks: [
          blogBlock(stableId(a.slug + "-hero"), "hero", a.title, a.summary, {
            eyebrow: a.category + " · ON ZEN ON EDITORIAL",
            image: a.image,
            alt: a.alt,
          }),
          ...a.sections.map(([heading, body], i) =>
            blogBlock(stableId(a.slug + "-" + i), "about", heading, body),
          ),
          blogBlock(
            stableId(a.slug + "-source"),
            "about",
            "Further reading",
            "The guidance linked below provides background for this article. Images are illustrative.",
            { buttonLabel: a.sourceTitle, href: a.source },
          ),
          blogBlock(
            stableId(a.slug + "-cta"),
            "cta",
            "Turn the idea into a practical next step.",
            "Explore the related service or tell us about your project.",
            { buttonLabel: "Explore related service", href: a.service },
          ),
          {
            ...blogListing(stableId),
            id: stableId(a.slug + "-related"),
            heading: "Keep exploring",
            items: blogArticles
              .filter((b) => b.slug !== a.slug)
              .map((b) =>
                item(b.title, b.summary, "/blog/" + b.slug, b.image, b.alt),
              ),
          },
        ],
      },
      "page:" + path,
    ];
  });
  pages.push([
    "tech-updates",
    "page",
    {
      schemaVersion: 1,
      title: "Tech Updates",
      path: "/tech-updates",
      seo: {
        title: "Tech Updates & Technology Insights | On Zen On",
        description:
          "Explore practical articles on AI assistants, API-first development and website security.",
        canonical: "/tech-updates",
        ogImage: blogArticles[0].image,
        noindex: false,
      },
      blocks: [
        blogBlock(
          stableId("tech-updates-hero"),
          "hero",
          "Technology, with a practical point of view.",
          "Ideas to help you ask better questions and plan your next digital project.",
          { eyebrow: "TECH UPDATES" },
        ),
        blogListing(stableId),
      ],
    },
    "page:/tech-updates",
  ]);
  return pages;
}
export async function migrateBlogs(db, stableId) {
  await db.transaction(async (q) => {
    const marker = await q.query(
      "INSERT INTO cms_migrations (id) VALUES ($1) ON CONFLICT(id) DO NOTHING RETURNING id",
      ["tech-blog-launch-v1"],
    );
    if (!marker.length) return;
    for (const [name, kind, data, key] of blogPages(stableId)) {
      const body = JSON.stringify(schemas.page.parse(data));
      await q.query(
        "INSERT INTO documents (id,kind,draft,published,public_key,updated) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT(id) DO NOTHING",
        [stableId(name), kind, body, body, key, Date.now()],
      );
    }
    for (const row of await q.query(
      "SELECT id,kind,draft,published FROM documents WHERE kind IN ('page','menu')",
    )) {
      const next = { ...row };
      let changed = false;
      for (const field of ["draft", "published"]) {
        if (!row[field]) continue;
        const data = JSON.parse(row[field]);
        let touched = false;
        if (row.kind === "page" && data.path === "/") {
          const index = data.blocks.findIndex((b) => b.template === "updates");
          if (index >= 0) {
            data.blocks[index] = blogListing(stableId);
            touched = true;
          } else if (!data.blocks.some((b) => b.anchor === "updates")) {
            data.blocks.push(blogListing(stableId));
            touched = true;
          }
        }
        if (row.kind === "menu")
          for (const it of data.items) {
            if (
              /^(tech updates|blog)$/i.test(it.label) &&
              ["/#updates", "#updates", "/#contact"].includes(it.href)
            ) {
              it.href = "/tech-updates";
              touched = true;
            }
          }
        if (touched) {
          next[field] = JSON.stringify(schemas[row.kind].parse(data));
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

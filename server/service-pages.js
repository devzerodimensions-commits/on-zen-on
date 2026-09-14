import { serviceCatalog } from "../shared/services.js";

export function servicePages(stableId) {
  return serviceCatalog.map((service) => {
    const block = (key, type, heading, body, items = [], extra = {}) => ({
      id: stableId(`${service.slug}-${key}`),
      type,
      anchor: key,
      eyebrow: "",
      heading,
      body,
      buttonLabel: "",
      href: "",
      image: "",
      alt: "",
      items: items.map(([title, text]) => ({
        title,
        text,
        href: "",
        image: "",
        alt: "",
      })),
      ...extra,
    });
    const path = `/services/${service.slug}`;
    const data = {
      schemaVersion: 1,
      title: service.title,
      path,
      seo: {
        title: `${service.title} | On Zen On`,
        description: service.body,
        canonical: path,
        ogImage: `/assets/${service.image}`,
        noindex: false,
      },
      blocks: [
        block("overview", "hero", service.intro, service.body, [], {
          eyebrow: service.title,
          image: `/assets/${service.image}`,
          alt: `${service.title} digital product illustration`,
          buttonLabel: "Discuss your project",
          href: "#contact",
        }),
        block(
          "deliverables",
          "features",
          "What we can build together",
          "A focused scope, shaped around your business. Final deliverables are agreed during discovery.",
          service.deliverables,
          { eyebrow: "WHAT’S INCLUDED" },
        ),
        block(
          "right-fit",
          "about",
          "Built around your next step",
          service.fit,
          [],
          {
            eyebrow: "IS THIS FOR YOU?",
            buttonLabel: "Explore all services",
            href: "/services",
          },
        ),
        block(
          "process",
          "process",
          "Clarity from the first conversation",
          "A collaborative process with review points along the way.",
          [
            [
              "Discover",
              "Understand your goals, current systems and priorities.",
            ],
            [
              "Define",
              "Agree the scope, deliverables, timeline and responsibilities.",
            ],
            ["Create", "Design and implement in stages, with your feedback."],
            [
              "Deliver",
              "Validate the agreed work, hand it over and plan next steps.",
            ],
          ],
          { eyebrow: "HOW WE WORK" },
        ),
        block(
          "questions",
          "faq",
          "A few things you may be wondering",
          "",
          [
            [
              "How long does a project take?",
              "Timing depends on the scope, integrations and review process. We outline milestones after an initial discovery conversation.",
            ],
            [
              "Can you work with our existing website or tools?",
              "Yes. We first review the current setup and agree what can be reused, improved or integrated.",
            ],
            [
              "What happens after delivery?",
              "We document the handover and discuss any ongoing maintenance or improvement needs. Support scope and fees are agreed separately.",
            ],
          ],
          { eyebrow: "GOOD TO KNOW" },
        ),
        block(
          "contact",
          "contact",
          `Let’s talk about ${service.title.toLowerCase()}.`,
          "Tell us about your goals, your existing setup and what you would like to improve.",
          [],
          { eyebrow: "YOUR NEXT CHAPTER" },
        ),
      ],
    };
    return [`service-${service.slug}`, "page", data, `page:${path}`];
  });
}

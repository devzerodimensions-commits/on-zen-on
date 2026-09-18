import { blankBlock } from "./content.js";

/* Adding a section used to drop an empty box called "New section" onto the
   page, leaving the editor to invent a heading, a body and every card from
   nothing. Each type now arrives already built, with wording of the right
   shape and the right number of cards, so the job is renaming rather than
   composing. The words are deliberately generic: they are a starting point to
   replace, not claims about the business. */
const starters = {
  hero: {
    eyebrow: "A SHORT LABEL",
    heading: "Say what you do, in one line.",
    body: "Two or three sentences explaining who this is for and what they get. Keep it about the reader, not about you.",
    buttonLabel: "Start here",
    href: "/contact",
  },
  about: {
    eyebrow: "ABOUT THIS",
    heading: "Explain it properly.",
    body: "A paragraph of background: what this is, why it exists and what it means for the reader.\n\nA second paragraph for the detail that would not fit above.",
  },
  services: {
    eyebrow: "WHAT WE OFFER",
    heading: "Our services",
    body: "One line introducing the list below.",
    items: [
      [
        "First service",
        "One or two sentences on what this is and who it suits.",
      ],
      [
        "Second service",
        "One or two sentences on what this is and who it suits.",
      ],
      [
        "Third service",
        "One or two sentences on what this is and who it suits.",
      ],
      [
        "Fourth service",
        "One or two sentences on what this is and who it suits.",
      ],
    ],
  },
  industries: {
    eyebrow: "WHO WE WORK WITH",
    heading: "Industries we serve",
    body: "A line about how you adapt to each sector.",
    items: [
      ["E-commerce", "What this sector usually needs from you first."],
      ["Healthcare", "What this sector usually needs from you first."],
      ["Education", "What this sector usually needs from you first."],
      ["Real estate", "What this sector usually needs from you first."],
      ["Finance", "What this sector usually needs from you first."],
      ["Manufacturing", "What this sector usually needs from you first."],
    ],
  },
  technology: {
    eyebrow: "WHAT WE BUILD WITH",
    heading: "Technology we use",
    body: "A line about why these choices suit the work.",
    items: [
      ["Category one", "The tools you use here and what they are for."],
      ["Category two", "The tools you use here and what they are for."],
      ["Category three", "The tools you use here and what they are for."],
      ["Category four", "The tools you use here and what they are for."],
    ],
  },
  features: {
    eyebrow: "WHAT YOU GET",
    heading: "Included as standard",
    body: "A line framing the list below.",
    items: [
      ["First benefit", "What it means for the reader, in plain words."],
      ["Second benefit", "What it means for the reader, in plain words."],
      ["Third benefit", "What it means for the reader, in plain words."],
      ["Fourth benefit", "What it means for the reader, in plain words."],
    ],
  },
  process: {
    eyebrow: "HOW IT WORKS",
    heading: "How we work",
    body: "A line about what makes the process predictable.",
    items: [
      ["Understand", "What happens at this stage and what the client sees."],
      ["Plan", "What happens at this stage and what the client sees."],
      ["Build", "What happens at this stage and what the client sees."],
      ["Launch", "What happens at this stage and what the client sees."],
    ],
  },
  updates: {
    eyebrow: "LATEST",
    heading: "Ideas and updates",
    body: "Your published articles appear here automatically.",
  },
  gallery: {
    eyebrow: "GALLERY",
    heading: "A look at the work",
    body: "A line introducing the pictures.",
    items: [
      ["Caption one", "A short description of this picture."],
      ["Caption two", "A short description of this picture."],
      ["Caption three", "A short description of this picture."],
    ],
  },
  faq: {
    eyebrow: "QUESTIONS",
    heading: "Frequently asked questions",
    body: "",
    items: [
      [
        "What does this cost?",
        "Answer the question directly. If it depends, say what it depends on.",
      ],
      [
        "How long does it take?",
        "Answer the question directly. If it depends, say what it depends on.",
      ],
      [
        "What do you need from me?",
        "Answer the question directly, and say what happens if they do not have it yet.",
      ],
      [
        "What happens after we start?",
        "Answer the question directly, so nobody has to ask it twice.",
      ],
    ],
  },
  testimonials: {
    eyebrow: "WHAT CLIENTS SAY",
    heading: "In their words",
    body: "Use real quotes from real customers, with their permission.",
    items: [
      [
        "Customer name, Company",
        "Paste exactly what the customer said. Do not write it for them.",
      ],
      [
        "Customer name, Company",
        "Paste exactly what the customer said. Do not write it for them.",
      ],
    ],
  },
  casestudies: {
    eyebrow: "SELECTED WORK",
    heading: "Recent projects",
    body: "Real projects only. Ask the client before naming them.",
    items: [
      [
        "Project name",
        "What the client needed, what you built and what changed for them afterwards.",
      ],
      [
        "Project name",
        "What the client needed, what you built and what changed for them afterwards.",
      ],
      [
        "Project name",
        "What the client needed, what you built and what changed for them afterwards.",
      ],
    ],
  },
  cta: {
    eyebrow: "",
    heading: "Ready to talk?",
    body: "One or two lines telling the reader exactly what happens if they press the button.",
    buttonLabel: "Get in touch",
    href: "/contact",
  },
  contact: {
    eyebrow: "GET IN TOUCH",
    heading: "Send us a message",
    body: "Tell the reader what to include so your first reply can be useful. The form is added below automatically.",
  },
};

/* A new section, already filled in for its type. */
export function starterBlock(type) {
  const base = blankBlock(type);
  const starter = starters[type];
  if (!starter) return base;
  const { items = [], ...fields } = starter;
  return {
    ...base,
    ...fields,
    items: items.map(([title, text]) => ({
      title,
      text,
      href: "",
      image: "",
      alt: "",
    })),
  };
}

export const startedTypes = Object.keys(starters);

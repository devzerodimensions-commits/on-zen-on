import { z } from "zod";
export const experienceDefaults = {
  chatEnabled: true,
  chatTitle: "On Zen On helper",
  chatLauncher: "Chat with us",
  chatGreeting:
    "Hello! I can help you explore On Zen On services or start an inquiry. What would you like to know?",
  pricingAnswer:
    "We prepare a quote after reviewing your scope. Share the features you need, existing systems, integrations and target launch date. The team will confirm pricing; this guide cannot issue a binding quote.",
  timelineAnswer:
    "Your schedule depends on the agreed features, integrations, content and review rounds. Share your launch target in the portal so the team can confirm a realistic plan.",
  contactAnswer:
    "The self-service portal helps you send a project request and review its status. For a conversation with the team, include your preferred contact time. I am an automated guide, not a live agent.",
  customAnswers: [],
  portalEnabled: true,
  portalTitle: "Let’s move your project forward.",
  portalIntro:
    "Explore services, send a project request and check its progress in one place.",
  portalClosedMessage:
    "New requests are temporarily closed. You can still track an existing request below.",
  portalServices: [
    "Software engineering",
    "Digital marketing",
    "AI & automation",
    "Secure experience design",
  ],
  bookingEnabled: true,
  bookingLeadHours: 1,
  bookingMaxDays: 180,
  darkModeEnabled: true,
  defaultTheme: "light",
  motionEnabled: true,
  introEnabled: true,
  introTagline: "CREATION MEETS GROWTH",
};
export const experienceSchema = z
  .object({
    chatEnabled: z.boolean(),
    chatTitle: z.string().trim().min(1).max(80),
    chatLauncher: z.string().trim().min(1).max(40),
    chatGreeting: z.string().trim().min(1).max(1000),
    pricingAnswer: z.string().trim().min(1).max(3000),
    timelineAnswer: z.string().trim().min(1).max(3000),
    contactAnswer: z.string().trim().min(1).max(3000),
    customAnswers: z
      .array(
        z
          .object({
            question: z.string().trim().min(1).max(200),
            answer: z.string().trim().min(1).max(3000),
          })
          .strict(),
      )
      .max(50),
    portalEnabled: z.boolean(),
    portalTitle: z.string().trim().min(1).max(150),
    portalIntro: z.string().max(1000),
    portalClosedMessage: z.string().trim().min(1).max(1000),
    portalServices: z.array(z.string().trim().min(1).max(150)).min(1).max(30),
    bookingEnabled: z.boolean(),
    bookingLeadHours: z.number().int().min(1).max(168),
    bookingMaxDays: z.number().int().min(8).max(365),
    darkModeEnabled: z.boolean(),
    defaultTheme: z.enum(["light", "dark"]),
    motionEnabled: z.boolean(),
    introEnabled: z.boolean(),
    introTagline: z.string().max(150),
  })
  .strict();

import { readFile, writeFile } from "node:fs/promises";

const photos = [
  [
    "frontend-development",
    "laptop-screen-displaying-colorful-code-8qEB0fTe9Vw",
    "Laptop displaying a code editor in a real development workspace",
  ],
  [
    "backend-development",
    "a-computer-screen-with-a-bunch-of-code-on-it-ieic5Tq8YMk",
    "Close-up of programming code on a computer screen",
  ],
  [
    "ai-workflow-automation",
    "team-collaborating-around-a-computer-in-an-office-UikYLDQj9_I",
    "Colleagues collaborating around a computer in an office",
  ],
  [
    "digital-marketing",
    "black-and-silver-laptop-computer-tR0jvlsmCuQ",
    "A laptop displaying performance analytics",
  ],
  [
    "ui-ux-product-design",
    "a-person-writing-on-a-piece-of-paper-next-to-a-keyboard-ml1IgjV8OvY",
    "Hands sketching website wireframes beside a keyboard",
  ],
  [
    "cloud-api-devops",
    "black-imgix-server-system-pgdaAwf6IJg",
    "Server racks in a data centre",
  ],
  [
    "cybersecurity",
    "a-bunch-of-blue-wires-connected-to-each-other-PSpf_XgOM5w",
    "Network cables connected to server equipment",
  ],
  [
    "overview",
    "people-collaborating-on-workspace-wireframe-sketches--ySLeov8m_8",
    "People collaborating on wireframe sketches in a workspace",
  ],
];
const manifest = JSON.parse(await readFile("shared/service-photos.json", "utf8"));
for (const [slug, source, alt] of photos) {
  const page = `https://unsplash.com/photos/${source}`;
  const response = await fetch(page);
  if (!response.ok) throw Error(`Source unavailable: ${page}`);
  const html = await response.text();
  if (!html.includes("Unsplash License"))
    throw Error(`Check image license: ${page}`);
  const raw = html.match(
    /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/,
  )?.[1];
  if (!raw) throw Error(`Missing image: ${page}`);
  const url = new URL(raw.replaceAll("&amp;", "&"));
  if (url.hostname !== "images.unsplash.com")
    throw Error("Unexpected image host");
  url.search = "fm=jpg&w=1400&q=85&fit=max";
  const image = await fetch(url);
  if (!image.ok || !image.headers.get("content-type")?.startsWith("image/"))
    throw Error(`Download failed: ${slug}`);
  const file = `service-photo-${slug}.jpg`;
  const bytes = Buffer.from(await image.arrayBuffer());
  await writeFile(`public/assets/${file}`, bytes);
  manifest[slug] = {
    image: `/assets/${file}`,
    alt,
    source: page,
    license: "https://unsplash.com/license",
  };
  console.log(`${slug}: ${Math.round(bytes.length / 1024)} KB`);
}
await writeFile(
  "shared/service-photos.json",
  JSON.stringify(manifest, null, 2) + "\n",
);

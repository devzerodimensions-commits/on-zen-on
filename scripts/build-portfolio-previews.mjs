import { writeFile } from "node:fs/promises";
import { portfolioProjects } from "../shared/portfolio-projects.js";
const escape = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
const text = (x, y, s, size = 18, color = "#24313a", weight = 400) =>
  `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-weight="${weight}" font-family="Arial,sans-serif">${escape(s)}</text>`;
const rect = (x, y, w, h, c, r = 0) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}"/>`;
for (const [
  id,
  name,
  type,
  tag,
  desc,
  ink,
  bg,
  cta,
  headline,
] of portfolioProjects) {
  let ui = rect(0, 0, 1200, 820, bg);
  if (type === "Website") {
    ui +=
      rect(70, 65, 1060, 690, "#fff", 18) +
      rect(70, 65, 1060, 38, "#f6f6f4", 18);
    for (let i = 0; i < 3; i++)
      ui += `<circle cx="${94 + i * 17}" cy="84" r="4" fill="${ink}" opacity=".4"/>`;
    ui +=
      text(110, 153, name.toUpperCase(), 23, ink, 700) +
      text(720, 150, "Discover    Our story    Contact", 15) +
      rect(1000, 125, 88, 38, ink, 4) +
      text(1015, 149, "Explore", 14, "white");
    ui +=
      text(116, 255, type.toUpperCase() + " / DESIGN CONCEPT", 12, ink, 700) +
      text(116, 330, headline.split(". ")[0] + ".", 40, ink, 700) +
      text(116, 372, tag, 20) +
      rect(116, 420, 205, 48, ink, 4) +
      text(134, 450, cta, 12, "white", 700);
    if (id === "atelier")
      ui +=
        rect(685, 201, 395, 365, bg, 180) +
        rect(750, 389, 266, 91, ink, 22) +
        rect(771, 325, 224, 107, "#b79a80", 30) +
        rect(736, 375, 44, 100, "#9c7c63", 17) +
        rect(988, 375, 44, 100, "#9c7c63", 17) +
        rect(773, 477, 12, 40, ink) +
        rect(985, 477, 12, 40, ink);
    else if (id === "verdant")
      ui +=
        rect(685, 200, 395, 365, bg, 20) +
        `<path d="M685 450L800 240L910 442L1020 290L1080 425V565H685Z" fill="${ink}" opacity=".7"/>` +
        rect(793, 397, 168, 125, "#c4ac83") +
        `<path d="M775 400L877 326L979 400Z" fill="#263c35"/>` +
        rect(820, 431, 45, 66, "#425c52") +
        rect(886, 431, 45, 66, "#e8d8b3");
    else
      ui +=
        rect(685, 200, 395, 365, bg, 8) +
        rect(730, 255, 275, 251, "#b5bac5") +
        rect(801, 202, 180, 304, ink) +
        rect(821, 229, 138, 157, "#b8c4d3") +
        rect(710, 466, 343, 40, "#8391a7") +
        rect(858, 412, 77, 94, "#1b273b");
    for (let i = 0; i < 3; i++)
      ui +=
        rect(116 + i * 326, 610, 300, 95, bg, 8) +
        text(
          137 + i * 326,
          648,
          ["Thoughtful details", "Made for everyday", "Explore the collection"][
            i
          ],
          17,
          ink,
          700,
        ) +
        text(137 + i * 326, 678, "Discover more  →", 14, ink);
  } else if (type === "Application") {
    ui +=
      text(80, 135, name, 43, ink, 700) +
      text(80, 181, tag, 21, ink) +
      text(80, 720, "MOBILE EXPERIENCE / CONCEPT", 16, ink, 700);
    for (let i = 0; i < 3; i++) {
      let x = 155 + i * 302,
        y = i === 1 ? 205 : 265;
      ui +=
        rect(x, y, 254, 470, "#20272c", 35) +
        rect(x + 9, y + 9, 236, 452, "#fff", 28) +
        rect(x + 82, y + 18, 89, 19, "#20272c", 12) +
        text(
          x + 27,
          y + 70,
          i === 0 ? "Hello, Alex" : i === 1 ? "Discover" : "Your activity",
          22,
          ink,
          700,
        );
      ui +=
        rect(x + 24, y + 93, 206, 126, bg, 17) +
        text(
          x + 39,
          y + 121,
          ["YOUR DAILY VIEW", "PICKED FOR YOU", "THIS WEEK"][i],
          10,
          ink,
          700,
        );
      if (id === "pulse")
        ui +=
          `<circle cx="${x + 127}" cy="${y + 170}" r="31" fill="none" stroke="${ink}" stroke-width="10" stroke-dasharray="145 50"/>` +
          text(x + 109, y + 175, "72%", 14, ink, 700);
      else if (id === "table")
        ui += `<circle cx="${x + 127}" cy="${y + 172}" r="34" fill="#fff"/><circle cx="${x + 127}" cy="${y + 172}" r="24" fill="#d99b49"/><circle cx="${x + 117}" cy="${y + 165}" r="9" fill="#418254"/><circle cx="${x + 140}" cy="${y + 182}" r="7" fill="#bf4f3a"/>`;
      else
        ui += `<path d="M${x + 37} ${y + 202}l48 -51l38 25l46 -45l47 71Z" fill="${ink}" opacity=".65"/>`;
      for (let j = 0; j < 3; j++)
        ui +=
          rect(x + 25, y + 240 + j * 57, 204, 46, bg, 9) +
          text(
            x + 38,
            y + 269 + j * 57,
            ["Your favourites", "Recently explored", "Saved for later"][j],
            13,
            ink,
          );
      ui +=
        rect(x + 25, y + 415, 204, 26, ink, 10) +
        text(x + 63, y + 433, "Home    Explore    Profile", 10, "white");
    }
  } else {
    ui +=
      rect(60, 85, 1080, 650, "#fff", 16) +
      rect(60, 85, 192, 650, ink, 16) +
      text(84, 135, name, 24, "white", 700);
    for (let i = 0; i < 5; i++)
      ui += text(
        87,
        210 + i * 57,
        ["Overview", "Workspace", "Reports", "Team", "Settings"][i],
        16,
        "#fff",
      );
    ui +=
      text(286, 142, "Overview", 27, ink, 700) +
      text(910, 142, "Demo workspace", 14, ink);
    for (let i = 0; i < 3; i++)
      ui +=
        rect(286 + i * 270, 179, 251, 116, bg, 10) +
        text(
          306 + i * 270,
          211,
          ["Active items", "Completed", "In progress"][i],
          14,
          ink,
        ) +
        text(306 + i * 270, 258, ["128", "86", "42"][i], 34, ink, 700);
    ui +=
      rect(286, 319, 521, 212, bg, 10) +
      text(308, 351, "Weekly overview · Sample data", 16, ink, 700);
    for (let i = 0; i < 10; i++)
      ui += rect(
        314 + i * 46,
        497 - ((i * 31 + 35) % 120),
        24,
        (i * 31 + 35) % 120,
        ink,
        4,
      );
    ui +=
      rect(828, 319, 267, 212, bg, 10) +
      text(849, 351, "Activity", 17, ink, 700);
    for (let i = 0; i < 3; i++)
      ui += text(
        849,
        397 + i * 39,
        ["New workspace created", "Review scheduled", "Milestone updated"][i],
        13,
        ink,
      );
    for (let i = 0; i < 3; i++)
      ui +=
        rect(286, 555 + i * 47, 810, 36, i % 2 ? "#fff" : bg, 5) +
        text(
          303,
          579 + i * 47,
          ["Discovery and planning", "Design review", "Delivery preparation"][
            i
          ],
          14,
          ink,
        ) +
        text(
          917,
          579 + i * 47,
          ["In progress", "Ready", "Scheduled"][i],
          13,
          ink,
        );
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="820" viewBox="0 0 1200 820" role="img"><title>${escape(name)} original interface concept</title>${ui}</svg>`;
  await writeFile(`public/assets/portfolio-${id}.svg`, svg);
}

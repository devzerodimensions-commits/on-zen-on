import React, { useState } from "react";
import { sectionNames } from "./PageStarter.jsx";
import { sectionTypes } from "../shared/content.js";
import { templateManifest } from "../../shared/templates.js";

/* Plain-language explanation of every section, so an editor can choose one
   without knowing what a "block" or a "template" is. */
const sectionHelp = {
  hero: "Large banner at the top of the page: headline, short text, a button and a picture.",
  about:
    "A block of text beside a picture. Good for your story or an explanation.",
  services:
    "A row of cards, each with a title, a short description and a link.",
  industries: "Cards showing the industries or customer types you work with.",
  technology: "A list of the tools, platforms or technologies you use.",
  features:
    "Cards that list what is included, or the benefits a customer gets.",
  process: "Numbered steps that explain how you work, one card per step.",
  updates: "Cards that link to your blog posts or news articles.",
  gallery: "A set of pictures with short captions.",
  faq: "Questions with answers that open and close when clicked.",
  testimonials: "Quotes from your customers, one card each.",
  cta: "A short, bold invitation with one button. Use it to push visitors to act.",
  contact: "A message form. Anything a visitor sends arrives in Inquiries.",
};

const shapes = {
  hero: ["bar wide", "bar", "bar short", "chip"],
  about: ["bar", "bar wide", "bar short"],
  services: ["grid", "grid", "grid", "grid"],
  industries: ["grid", "grid", "grid"],
  technology: ["bar short", "bar short", "bar short"],
  features: ["grid", "grid", "grid", "grid"],
  process: ["row", "row", "row"],
  updates: ["grid", "grid", "grid"],
  gallery: ["grid", "grid", "grid", "grid"],
  faq: ["row", "row", "row"],
  testimonials: ["grid", "grid"],
  cta: ["bar", "chip"],
  contact: ["bar", "row", "row", "chip"],
};

function Thumb({ type }) {
  return (
    <span className="picker-thumb" aria-hidden="true">
      {(shapes[type] || ["bar", "bar short"]).map((shape, i) => (
        <i className={shape} key={i} />
      ))}
    </span>
  );
}

export function SectionPicker({ onPick, onCancel, usedTemplates, sections }) {
  const [group, setGroup] = useState("basic");
  const branded = Object.entries(templateManifest).filter(
    ([key]) => !key.startsWith("site-") && !usedTemplates.includes(key),
  );
  return (
    <div className="starter-overlay" onClick={onCancel}>
      <div
        className="picker-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="picker-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="row">
          <div>
            <h2 id="picker-title">Add a section to this page</h2>
            <p>
              Choose what you want to add. You can edit everything afterwards.
            </p>
          </div>
          <button type="button" onClick={onCancel}>
            Close
          </button>
        </div>
        <div className="picker-tabs">
          {[
            ["basic", `Standard sections (${sectionTypes.length})`],
            ["branded", `Branded designs (${branded.length})`],
            ["shared", `Shared sections (${sections.length})`],
          ].map(([key, text]) => (
            <button
              type="button"
              key={key}
              className={group === key ? "active" : ""}
              onClick={() => setGroup(key)}
            >
              {text}
            </button>
          ))}
        </div>
        <div className="picker-grid">
          {group === "basic" &&
            sectionTypes.map((type) => (
              <button
                type="button"
                key={type}
                className="picker-card"
                onClick={() => onPick({ kind: "basic", type })}
              >
                <Thumb type={type} />
                <strong>{sectionNames[type]}</strong>
                <small>{sectionHelp[type]}</small>
              </button>
            ))}
          {group === "branded" &&
            branded.map(([key, template]) => (
              <button
                type="button"
                key={key}
                className="picker-card"
                onClick={() => onPick({ kind: "branded", template: key })}
              >
                <Thumb type="services" />
                <strong>{template.label}</strong>
                <small>
                  The original On Zen On design for this section. You change the
                  words and pictures; the layout stays the same.
                </small>
              </button>
            ))}
          {group === "branded" && !branded.length && (
            <p className="empty">
              Every branded design is already on this page. Each one can be used
              once per page.
            </p>
          )}
          {group === "shared" &&
            sections.map((doc) => (
              <button
                type="button"
                key={doc.id}
                className="picker-card"
                onClick={() => onPick({ kind: "shared", sectionId: doc.id })}
              >
                <Thumb type="about" />
                <strong>
                  {doc.draft.heading ||
                    templateManifest[doc.draft.template]?.label ||
                    "Shared section"}
                </strong>
                <small>
                  {doc.published
                    ? "Edit it once in Reusable sections and every page that uses it updates."
                    : "Not published yet — publish this shared section before publishing the page."}
                </small>
              </button>
            ))}
          {group === "shared" && !sections.length && (
            <p className="empty">
              You have no shared sections yet. Create one under Reusable
              sections to use the same content on several pages.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

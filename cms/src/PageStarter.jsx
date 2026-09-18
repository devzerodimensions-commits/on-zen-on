import React, { useState } from "react";
import { blankBlock } from "../shared/content.js";
export const sectionNames = {
  hero: "Welcome banner",
  about: "Text and image",
  services: "Service cards",
  industries: "Industry cards",
  technology: "Technology list",
  features: "Features and benefits",
  process: "Step-by-step process",
  updates: "Blog / news cards",
  gallery: "Image gallery",
  faq: "Questions and answers",
  testimonials: "Customer reviews",
  casestudies: "Case studies",
  cta: "Call-to-action",
  contact: "Inquiry form",
};
export function PageStarter({ onCreate, onCancel, busy }) {
  const [title, T] = useState(""),
    [path, P] = useState(""),
    [layout, L] = useState("service");
  return (
    <div className="starter-overlay">
      <div
        className="starter-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="starter-title"
      >
        <h2 id="starter-title">Create a new page</h2>
        <p>
          Choose a starting layout, then edit each section. Your new page stays
          private until you publish.
        </p>
        <label className="field">
          Page name
          <input
            autoFocus
            value={title}
            onChange={(e) => {
              T(e.target.value);
              P(
                "/" +
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, ""),
              );
            }}
            placeholder="For example: Website maintenance"
            maxLength={100}
          />
        </label>
        <label className="field">
          Website address
          <input
            value={path}
            onChange={(e) => P(e.target.value)}
            placeholder="/website-maintenance"
          />
          <small>
            Use lowercase words separated by hyphens. You can change this later.
          </small>
        </label>
        <label className="field">
          Starting layout
          <select value={layout} onChange={(e) => L(e.target.value)}>
            <option value="service">
              Service page — banner, benefits, process, FAQs, inquiry
            </option>
            <option value="about">
              About page — introduction, story, team, contact
            </option>
            <option value="article">
              Article — title, content, related links
            </option>
            <option value="blank">Simple page — one text section</option>
          </select>
        </label>
        <div className="row">
          <button disabled={busy} onClick={onCancel}>
            Cancel
          </button>
          <button
            className="primary"
            disabled={
              busy ||
              !title.trim() ||
              !/^\/[a-z0-9]+(?:[\/-][a-z0-9]+)*$/.test(path)
            }
            onClick={() => {
              const types = {
                service: ["hero", "features", "process", "faq", "contact"],
                about: ["hero", "about", "features", "contact"],
                article: ["hero", "about", "cta"],
                blank: ["about"],
              }[layout];
              onCreate({
                schemaVersion: 1,
                title: title.trim(),
                path,
                seo: {
                  title: title.trim().slice(0, 70),
                  description: "",
                  canonical: "",
                  ogImage: "",
                  noindex: false,
                },
                blocks: types.map((type, i) => ({
                  ...blankBlock(type),
                  anchor: type + "-" + (i + 1),
                  heading: i === 0 ? title.trim() : sectionNames[type],
                })),
              });
            }}
          >
            {busy ? "Creating…" : "Create draft page"}
          </button>
        </div>
      </div>
    </div>
  );
}

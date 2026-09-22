import React from "react";
import { useExperience } from "./ExperienceContext.jsx";
import "./service-marquee.css";

export function ServiceMarquee({ fields, tone = "" }) {
  const { motionEnabled } = useExperience();
  const labels = [
    ...new Set(
      [1, 2, 3, 4, 5].map((n) => fields[`text_${n}`]?.trim()).filter(Boolean),
    ),
  ];
  if (!labels.length) return null;
  return (
    <section
      className={`ticker service-marquee${tone}`}
      aria-label="Service highlights"
      data-paused={!motionEnabled}
    >
      <div className="marquee-toolbar">
        <span className="marquee-caption">
          ONE TEAM. CONNECTED POSSIBILITIES.
        </span>
      </div>
      <div className="marquee-window">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div
              className="marquee-group"
              key={copy}
              aria-hidden={copy ? true : undefined}
            >
              {labels.map((label, i) => (
                <span className="marquee-item" key={label}>
                  <span className="marquee-symbol" aria-hidden="true">
                    {["↗", "✦", "⌘", "◇"][i % 4]}
                  </span>
                  {label}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { themeDefaults, fonts } from "../../shared/theme.js";
export function ThemeEditor({ value, onChange }) {
  const t = { ...themeDefaults, ...value };
  const set = (k, v) => onChange({ ...t, [k]: v });
  return (
    <section className="theme-editor">
      <h2>Website appearance</h2>
      <p>
        Choose fonts, brand colors, spacing, buttons, and logo sizes. These
        settings apply to the public website after you publish.
      </p>
      <label className="check">
        <input
          type="checkbox"
          checked={t.enabled}
          onChange={(e) => set("enabled", e.target.checked)}
        />
        Use custom theme settings
      </label>
      <p className="note">
        Leave this off to keep the current website design. Dark mode keeps its
        own accessible background colors.
      </p>
      <div className="theme-layout">
        <div>
          <details open>
            <summary>Typography — fonts and text sizes</summary>
            <label className="field">
              Font family
              <select
                value={t.font}
                onChange={(e) => set("font", e.target.value)}
              >
                {[
                  ["system", "Modern sans serif"],
                  ["humanist", "Friendly sans serif"],
                  ["serif", "Classic serif"],
                  ["mono", "Monospace"],
                ].map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            {[
              ["bodySize", "Paragraph size", 14, 22, 1, "px"],
              ["headingSize", "Section heading size", 28, 72, 1, "px"],
              ["lineHeight", "Line spacing", 1.3, 2, 0.1, ""],
            ].map(([k, l, min, max, step, unit]) => (
              <label className="field" key={k}>
                {l}: {t[k]}
                {unit}
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={t[k]}
                  onChange={(e) => set(k, Number(e.target.value))}
                />
              </label>
            ))}
          </details>
          <details>
            <summary>Brand colors</summary>
            <p>
              Choose readable combinations. Check buttons and text in the
              preview before publishing.
            </p>
            <div className="two">
              {[
                ["primary", "Primary / buttons"],
                ["secondary", "Secondary / service hero"],
                ["accent", "Accent / highlights"],
                ["background", "Page background"],
                ["text", "Main text"],
                ["buttonText", "Button text"],
              ].map(([k, l]) => (
                <label className="field" key={k}>
                  {l}
                  <input
                    type="color"
                    value={t[k]}
                    onChange={(e) => set(k, e.target.value)}
                  />
                  <small>{t[k]}</small>
                </label>
              ))}
            </div>
          </details>
          <details>
            <summary>Layout, buttons and logo</summary>
            {[
              ["radius", "Rounded corners", 0, 32],
              ["sectionSpacing", "Space between sections", 32, 120],
              ["logoSize", "Desktop logo size", 80, 200],
              ["mobileLogoSize", "Mobile logo size", 64, 128],
            ].map(([k, l, min, max]) => (
              <label className="field" key={k}>
                {l}: {t[k]}px
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={t[k]}
                  onChange={(e) => set(k, Number(e.target.value))}
                />
              </label>
            ))}
          </details>
          <button type="button" onClick={() => onChange({ ...themeDefaults })}>
            Restore original design
          </button>
        </div>
        <div
          className="theme-sample"
          style={{
            fontFamily: fonts[t.font],
            background: t.background,
            color: t.text,
            borderRadius: t.radius,
          }}
        >
          <small>STYLE PREVIEW · EXAMPLE CONTENT</small>
          <h3
            style={{
              fontFamily: fonts[t.font],
              fontSize: Math.min(t.headingSize, 40),
              color: t.text,
            }}
          >
            Your next big idea.
          </h3>
          <p
            style={{
              fontFamily: fonts[t.font],
              fontSize: t.bodySize,
              lineHeight: t.lineHeight,
              color: t.text,
            }}
          >
            See how your font and colors work together. Your page content stays
            unchanged.
          </p>
          <span
            style={{
              display: "inline-block",
              padding: "14px 22px",
              background: t.primary,
              color: t.buttonText,
              borderRadius: t.radius,
            }}
          >
            Let’s create together ↗
          </span>
          <p style={{ color: t.secondary }}>Secondary color</p>
          <span style={{ background: t.accent, padding: 8, color: t.text }}>
            Accent color
          </span>
          <p>
            <small>
              This sample previews the controls. Publish to apply them across
              the website.
            </small>
          </p>
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  themeDefaults,
  themeCss,
  fontCatalog,
  fontKeys,
  colorPresets,
  contrastRatio,
} from "../../shared/theme.js";

const devices = {
  desktop: { label: "Computer", width: "100%", icon: "🖥" },
  tablet: { label: "Tablet", width: "820px", icon: "▭" },
  mobile: { label: "Mobile", width: "390px", icon: "▯" },
};

const tabs = [
  ["presets", "Ready themes"],
  ["text", "Text & fonts"],
  ["colors", "Colours"],
  ["buttons", "Buttons"],
  ["layout", "Spacing & shape"],
  ["logo", "Logo size"],
];

function Slider({
  label,
  hint,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "px",
}) {
  return (
    <label className="studio-field">
      <span className="studio-label">
        {label}
        <b>
          {value}
          {unit}
        </b>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint && <small>{hint}</small>}
    </label>
  );
}

function Choice({ label, hint, value, onChange, options }) {
  return (
    <div className="studio-field">
      <span className="studio-label">{label}</span>
      <div className="studio-choices">
        {options.map(([key, text]) => (
          <button
            type="button"
            key={key}
            className={value === key ? "chosen" : ""}
            onClick={() => onChange(key)}
          >
            {text}
          </button>
        ))}
      </div>
      {hint && <small>{hint}</small>}
    </div>
  );
}

function Swatch({ label, hint, value, onChange, allowEmpty, fallback }) {
  return (
    <label className="studio-swatch">
      <input
        type="color"
        value={value || fallback || "#000000"}
        onChange={(e) => onChange(e.target.value)}
      />
      <span>
        <b>{label}</b>
        <small>{value || `Same as ${hint || "main colour"}`}</small>
      </span>
      {allowEmpty && value && (
        <button type="button" onClick={() => onChange("")}>
          Reset
        </button>
      )}
    </label>
  );
}

export function ThemeStudio({
  value,
  onChange,
  pages = [],
  busy,
  dirty,
  onSave,
  onPublish,
  canPublish,
}) {
  const t = useMemo(() => ({ ...themeDefaults, ...value }), [value]);
  const set = (key, next) => onChange({ ...t, [key]: next });
  const [tab, setTab] = useState("presets");
  const [device, setDevice] = useState("desktop");
  const [path, setPath] = useState("/");
  const frame = useRef(null);
  const [ready, setReady] = useState(0);

  /* Push every change straight into the real website running in the preview. */
  useEffect(() => {
    const target = frame.current?.contentWindow;
    if (!target) return;
    const id = setTimeout(() => {
      target.postMessage(
        { type: "oz-theme-preview", css: t.enabled ? themeCss(t) : "" },
        window.location.origin,
      );
    }, 60);
    return () => clearTimeout(id);
  }, [t, ready, path]);

  useEffect(() => {
    const listen = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "oz-preview-ready") setReady((n) => n + 1);
    };
    window.addEventListener("message", listen);
    return () => window.removeEventListener("message", listen);
  }, []);

  const applyPreset = (key) => {
    onChange({ ...t, ...colorPresets[key].colors, preset: key, enabled: true });
  };

  const warnings = [];
  if (t.enabled) {
    if (
      t.buttonStyle !== "outline" &&
      contrastRatio(t.buttonText, t.primary) < 4.5
    )
      warnings.push(
        "Button text is hard to read on the button colour. Choose a lighter or darker button text colour.",
      );
    if (contrastRatio(t.text, t.background) < 4.5)
      warnings.push(
        "Main text is hard to read on the page background. Make the text darker or the background lighter.",
      );
    if (contrastRatio(t.headerText, t.headerBackground) < 4.5)
      warnings.push("Menu text is hard to read on the header background.");
    if (contrastRatio(t.footerTextColor, t.footerBackground) < 4.5)
      warnings.push("Footer text is hard to read on the footer background.");
  }

  return (
    <div className="studio">
      <div className="studio-bar">
        <label className="studio-switch">
          <input
            type="checkbox"
            checked={t.enabled}
            onChange={(e) => set("enabled", e.target.checked)}
          />
          <span>
            {t.enabled ? "Custom design is ON" : "Custom design is OFF"}
          </span>
        </label>
        <small>
          {t.enabled
            ? "Your choices below replace the original colours and fonts."
            : "The website keeps its original design until you switch this on."}
        </small>
        <div className="spacer" />
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            if (
              window.confirm(
                "Put every appearance setting back to the original design?",
              )
            )
              onChange({ ...themeDefaults });
          }}
        >
          Undo all changes
        </button>
        <button
          type="button"
          className="ghost"
          disabled={busy || !dirty}
          onClick={onSave}
        >
          {dirty ? "Save changes" : "Saved"}
        </button>
        <button
          type="button"
          className="primary"
          disabled={busy || !canPublish}
          title={
            canPublish
              ? "Put this design live"
              : "Only administrators can publish"
          }
          onClick={onPublish}
        >
          Publish design ↗
        </button>
      </div>

      {warnings.length > 0 && (
        <div className="studio-warning" role="status">
          <strong>Please check these before publishing</strong>
          <ul>
            {warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="studio-body">
        <div className="studio-panel">
          <div className="studio-tabs">
            {tabs.map(([key, text]) => (
              <button
                type="button"
                key={key}
                className={tab === key ? "active" : ""}
                onClick={() => setTab(key)}
              >
                {text}
              </button>
            ))}
          </div>

          {tab === "presets" && (
            <div className="studio-section">
              <h3>Pick a ready-made colour theme</h3>
              <p>
                One click changes every colour on the website. You can still
                adjust anything afterwards in the Colours tab.
              </p>
              <div className="preset-grid">
                {Object.entries(colorPresets).map(([key, preset]) => (
                  <button
                    type="button"
                    key={key}
                    className={t.preset === key ? "preset chosen" : "preset"}
                    onClick={() => applyPreset(key)}
                  >
                    <span className="preset-bars">
                      {["primary", "secondary", "accent", "background"].map(
                        (c) => (
                          <i key={c} style={{ background: preset.colors[c] }} />
                        ),
                      )}
                    </span>
                    <strong>{preset.label}</strong>
                    <small>{preset.hint}</small>
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab === "text" && (
            <div className="studio-section">
              <h3>Fonts</h3>
              <label className="studio-field">
                <span className="studio-label">Font for all text</span>
                <select
                  value={t.font}
                  onChange={(e) => set("font", e.target.value)}
                >
                  {fontKeys.map((key) => (
                    <option key={key} value={key}>
                      {fontCatalog[key].label}
                    </option>
                  ))}
                </select>
                <small
                  style={{
                    fontFamily: fontCatalog[t.font].stack,
                    fontSize: 16,
                  }}
                >
                  The quick brown fox jumps over the lazy dog 0123
                </small>
              </label>
              <label className="studio-field">
                <span className="studio-label">Font for headings</span>
                <select
                  value={t.headingFont}
                  onChange={(e) => set("headingFont", e.target.value)}
                >
                  <option value="">Same as the text font</option>
                  {fontKeys.map((key) => (
                    <option key={key} value={key}>
                      {fontCatalog[key].label}
                    </option>
                  ))}
                </select>
                <small
                  style={{
                    fontFamily: fontCatalog[t.headingFont || t.font].stack,
                    fontSize: 20,
                    fontWeight: 800,
                  }}
                >
                  Your heading looks like this
                </small>
              </label>

              <h3>Text sizes</h3>
              <Slider
                label="Normal paragraph text"
                hint="Used for all body text on the website."
                value={t.bodySize}
                min={13}
                max={24}
                onChange={(v) => set("bodySize", v)}
              />
              <Slider
                label="Big headings"
                hint="Section titles and the banner headline."
                value={t.headingSize}
                min={24}
                max={84}
                onChange={(v) => set("headingSize", v)}
              />
              <Slider
                label="Small headings"
                hint="Card titles, for example on service cards."
                value={t.h3Size}
                min={14}
                max={48}
                onChange={(v) => set("h3Size", v)}
              />
              <Slider
                label="Small print"
                hint="Captions, labels and notes."
                value={t.smallSize}
                min={10}
                max={20}
                onChange={(v) => set("smallSize", v)}
              />
              <Slider
                label="Space between lines"
                hint="Higher numbers make paragraphs easier to read."
                value={t.lineHeight}
                min={1.2}
                max={2.2}
                step={0.05}
                unit=""
                onChange={(v) => set("lineHeight", v)}
              />
              <Slider
                label="Heading thickness"
                hint="300 is light, 900 is very bold."
                value={t.headingWeight}
                min={300}
                max={900}
                step={100}
                unit=""
                onChange={(v) => set("headingWeight", v)}
              />
              <Slider
                label="Letter spacing in headings"
                value={t.letterSpacing}
                min={-2}
                max={4}
                step={0.5}
                unit=""
                onChange={(v) => set("letterSpacing", v)}
              />
              <Choice
                label="Heading capitals"
                value={t.headingCase}
                onChange={(v) => set("headingCase", v)}
                options={[
                  ["none", "As typed"],
                  ["capitalize", "First Letter Capital"],
                  ["uppercase", "ALL CAPITALS"],
                ]}
              />
            </div>
          )}

          {tab === "colors" && (
            <div className="studio-section">
              <h3>Main colours</h3>
              <Swatch
                label="Main brand colour (buttons, banner)"
                value={t.primary}
                onChange={(v) => set("primary", v)}
              />
              <Swatch
                label="Second colour (service banners)"
                value={t.secondary}
                onChange={(v) => set("secondary", v)}
              />
              <Swatch
                label="Highlight colour"
                value={t.accent}
                onChange={(v) => set("accent", v)}
              />
              <h3>Page colours</h3>
              <Swatch
                label="Page background"
                value={t.background}
                onChange={(v) => set("background", v)}
              />
              <Swatch
                label="Card background"
                value={t.surface}
                onChange={(v) => set("surface", v)}
              />
              <Swatch
                label="Main text"
                value={t.text}
                onChange={(v) => set("text", v)}
              />
              <Swatch
                label="Lighter text (descriptions)"
                value={t.muted}
                onChange={(v) => set("muted", v)}
              />
              <Swatch
                label="Link colour"
                hint="the main brand colour"
                allowEmpty
                fallback={t.primary}
                value={t.linkColor}
                onChange={(v) => set("linkColor", v)}
              />
              <h3>Header and footer</h3>
              <Swatch
                label="Header background"
                value={t.headerBackground}
                onChange={(v) => set("headerBackground", v)}
              />
              <Swatch
                label="Header menu text"
                value={t.headerText}
                onChange={(v) => set("headerText", v)}
              />
              <Swatch
                label="Footer background"
                value={t.footerBackground}
                onChange={(v) => set("footerBackground", v)}
              />
              <Swatch
                label="Footer text"
                value={t.footerTextColor}
                onChange={(v) => set("footerTextColor", v)}
              />
            </div>
          )}

          {tab === "buttons" && (
            <div className="studio-section">
              <h3>Button style</h3>
              <Choice
                label="Shape and fill"
                value={t.buttonStyle}
                onChange={(v) => set("buttonStyle", v)}
                options={[
                  ["solid", "Filled"],
                  ["outline", "Outline only"],
                  ["pill", "Filled, fully rounded"],
                ]}
              />
              <Choice
                label="Button size"
                value={t.buttonSize}
                onChange={(v) => set("buttonSize", v)}
                options={[
                  ["small", "Small"],
                  ["medium", "Medium"],
                  ["large", "Large"],
                ]}
              />
              {t.buttonStyle !== "pill" && (
                <Slider
                  label="Rounded corners"
                  value={t.buttonRadius}
                  min={0}
                  max={40}
                  onChange={(v) => set("buttonRadius", v)}
                />
              )}
              <label className="studio-check">
                <input
                  type="checkbox"
                  checked={t.buttonShadow}
                  onChange={(e) => set("buttonShadow", e.target.checked)}
                />
                Show a shadow behind buttons
              </label>
              <Swatch
                label="Button text colour"
                value={t.buttonText}
                onChange={(v) => set("buttonText", v)}
              />
            </div>
          )}

          {tab === "layout" && (
            <div className="studio-section">
              <h3>Spacing and shape</h3>
              <Slider
                label="Space above and below sections"
                hint="Larger values give the page more breathing room."
                value={t.sectionSpacing}
                min={24}
                max={160}
                onChange={(v) => set("sectionSpacing", v)}
              />
              <Slider
                label="Maximum content width"
                hint="How wide text and cards can grow on large screens."
                value={t.contentWidth}
                min={960}
                max={1800}
                step={20}
                onChange={(v) => set("contentWidth", v)}
              />
              <Slider
                label="Rounded corners on cards"
                value={t.radius}
                min={0}
                max={40}
                onChange={(v) => set("radius", v)}
              />
              <Choice
                label="Card shadow"
                value={t.cardShadow}
                onChange={(v) => set("cardShadow", v)}
                options={[
                  ["none", "Flat"],
                  ["soft", "Soft"],
                  ["strong", "Strong"],
                ]}
              />
            </div>
          )}

          {tab === "logo" && (
            <div className="studio-section">
              <h3>Logo size</h3>
              <p>
                Change the logo image itself in{" "}
                <strong>Header &amp; footer</strong>. These settings only
                control how large it appears.
              </p>
              <Slider
                label="Logo on computers"
                value={t.logoSize}
                min={60}
                max={240}
                onChange={(v) => set("logoSize", v)}
              />
              <Slider
                label="Logo on mobile phones"
                value={t.mobileLogoSize}
                min={48}
                max={160}
                onChange={(v) => set("mobileLogoSize", v)}
              />
            </div>
          )}
        </div>

        <div className="studio-preview">
          <div className="studio-preview-bar">
            <div className="studio-devices">
              {Object.entries(devices).map(([key, d]) => (
                <button
                  type="button"
                  key={key}
                  className={device === key ? "chosen" : ""}
                  onClick={() => setDevice(key)}
                >
                  {d.icon} {d.label}
                </button>
              ))}
            </div>
            <select value={path} onChange={(e) => setPath(e.target.value)}>
              <option value="/">Home page</option>
              {pages
                .filter((p) => p !== "/")
                .map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
            </select>
          </div>
          <div className="studio-stage">
            <iframe
              ref={frame}
              key={path}
              title="Live website preview"
              src={path}
              style={{ width: devices[device].width }}
              onLoad={() => setReady((n) => n + 1)}
            />
          </div>
          <small className="studio-note">
            This is your real website. Changes here are only visible to you
            until you select <strong>Publish design</strong>.
          </small>
        </div>
      </div>
    </div>
  );
}

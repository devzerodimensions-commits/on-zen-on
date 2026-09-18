import { ThemeStudio } from "./ThemeStudio.jsx";
import "./studio.css";
import { PageStarter, sectionNames } from "./PageStarter.jsx";
import { SectionPicker } from "./SectionPicker.jsx";
import { MediaLibrary } from "./MediaLibrary.jsx";
import { PageBuilder } from "./PageBuilder.jsx";
import "./editor-guide.css";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { blankBlock, sectionTypes } from "../shared/content.js";
import { starterBlock } from "../shared/starters.js";
import {
  sectionStyleDefaults,
  sectionStyleOptions,
  sectionTypeDefaults,
} from "../../shared/section-style.js";
import { fontCatalog, fontKeys, contrastRatio } from "../../shared/theme.js";
import { templateDefaults, templateManifest } from "../../shared/templates.js";
import { Management } from "./Management.jsx";
import { Requests } from "./Requests.jsx";
import { ExperienceSettings } from "./ExperienceSettings.jsx";
import { PasswordField } from "./PasswordField.jsx";
import "./style.css";
import { MediaSelect as ImagePicker } from "./MediaSelect.jsx";
let csrf = "";
async function api(path, method = "GET", body) {
  const form = body instanceof FormData;
  const r = await fetch(`/api/cms${path}`, {
    method,
    headers: {
      ...(!form && body ? { "Content-Type": "application/json" } : {}),
      ...(method !== "GET" ? { "X-CSRF-Token": csrf } : {}),
    },
    ...(body ? { body: form ? body : JSON.stringify(body) } : {}),
  });
  const data = await r.json();
  if (!r.ok) throw Error(data.error || "Request failed");
  return data;
}
const label = (doc) =>
  doc.draft.title ||
  doc.draft.name ||
  doc.draft.heading ||
  doc.draft.siteName ||
  templateManifest[doc.draft.template]?.label;
const defaults = (kind) =>
  kind === "page"
    ? {
        schemaVersion: 1,
        title: "Untitled page",
        path: "/new-page",
        seo: {
          title: "",
          description: "",
          canonical: "",
          ogImage: "",
          noindex: false,
        },
        blocks: [blankBlock()],
      }
    : kind === "section"
      ? blankBlock("cta")
      : kind === "menu"
        ? { name: "Main navigation", location: "header", items: [] }
        : {
            siteName: "On Zen On",
            tagline: "Creation meets growth.",
            footerText: "",
            email: "hello@onzenon.com",
            phone: "",
          };
const navItems = [
  { name: "Overview", icon: "◈", hint: "Start here" },
  { name: "Pages", icon: "▤", hint: "Text, images and sections" },
  { name: "Appearance", icon: "✻", hint: "Fonts, colours and theme" },
  {
    name: "Reusable sections",
    icon: "▦",
    hint: "Header, footer, shared blocks",
  },
  { name: "Menus", icon: "☷", hint: "Website navigation links" },
  { name: "Media library", icon: "▧", hint: "Your pictures" },
  { name: "Site settings", icon: "⚙", hint: "Business name, email, phone" },
  {
    name: "Inquiries",
    icon: "✉",
    hint: "Messages from visitors",
    adminOnly: true,
  },
  {
    name: "Requests",
    icon: "☎",
    hint: "Service and appointment requests",
    adminOnly: true,
  },
  {
    name: "Users",
    icon: "♙",
    hint: "Who can edit the website",
    adminOnly: true,
  },
];
function Field({ label, value, onChange, area = false, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      {area ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          {...props}
        />
      ) : (
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          {...props}
        />
      )}
    </label>
  );
}
function MediaSelect(props) {
  return (
    <ImagePicker {...props} upload={(data) => api("/media", "POST", data)} />
  );
}
/* A colour with a live reading of how it will look against the section behind
   it. The reading is advice, not a veto: the colour chosen is the colour used. */
function ColourField({ label, field, block, set, against }) {
  const value = block[field] ?? "";
  const ratio = value && against ? contrastRatio(value, against) : null;
  return (
    <div className="type-colour">
      <span className="type-colour-label">{label}</span>
      <input
        type="color"
        value={value || against || "#000000"}
        onChange={(e) => set(field, e.target.value)}
      />
      <div>
        <small>{value || "Automatic"}</small>
        {ratio !== null && (
          <small className={ratio < 4.5 ? "type-warn" : "type-ok"}>
            {ratio < 3
              ? `${ratio}:1 — very hard to read`
              : ratio < 4.5
                ? `${ratio}:1 — hard to read at small sizes`
                : `${ratio}:1 — reads well`}
          </small>
        )}
      </div>
      {value && (
        <button type="button" onClick={() => set(field, "")}>
          Automatic
        </button>
      )}
    </div>
  );
}

function NumberField({ label, field, block, set, min, max, step = 1, unit }) {
  const value = block[field] ?? sectionTypeDefaults[field];
  return (
    <label className="field">
      <span>
        {label}
        {value ? ` — ${value}${unit || ""}` : " — automatic"}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => set(field, Number(e.target.value))}
      />
      {Boolean(value) && (
        <button type="button" onClick={() => set(field, 0)}>
          Back to automatic
        </button>
      )}
    </label>
  );
}

function PickField({ label, field, block, set, options }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select
        value={block[field] ?? ""}
        onChange={(e) => set(field, e.target.value)}
      >
        {options.map(([key, text]) => (
          <option key={key} value={key}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}

/* Typography and colour for one section. Anything left on automatic follows
   the published theme, so a section nobody has touched keeps doing so. */
function SectionTypography({ block, set }) {
  return (
    <>
      <h4 className="type-group">Typography</h4>
      <PickField
        label="Font family"
        field="fontFamily"
        block={block}
        set={set}
        options={[
          ["", "Follow the theme"],
          ...fontKeys.map((key) => [key, fontCatalog[key].label]),
        ]}
      />
      <div className="two">
        <NumberField
          label="Heading size"
          field="headingSize"
          block={block}
          set={set}
          min={0}
          max={140}
          unit="px"
        />
        <NumberField
          label="Heading weight"
          field="fontWeight"
          block={block}
          set={set}
          min={0}
          max={900}
          step={100}
        />
      </div>
      <div className="two">
        <PickField
          label="Capitals"
          field="textTransform"
          block={block}
          set={set}
          options={[
            ["", "Automatic"],
            ["none", "As typed"],
            ["capitalize", "First Letter Capital"],
            ["uppercase", "ALL CAPITALS"],
            ["lowercase", "all lowercase"],
          ]}
        />
        <PickField
          label="Style"
          field="fontStyle"
          block={block}
          set={set}
          options={[
            ["", "Automatic"],
            ["normal", "Normal"],
            ["italic", "Italic"],
          ]}
        />
      </div>
      <PickField
        label="Underline"
        field="textDecoration"
        block={block}
        set={set}
        options={[
          ["", "Automatic"],
          ["none", "No underline"],
          ["underline", "Underlined"],
        ]}
      />
      <div className="two">
        <NumberField
          label="Line height"
          field="lineHeight"
          block={block}
          set={set}
          min={0}
          max={2.6}
          step={0.02}
        />
        <NumberField
          label="Letter spacing"
          field="letterSpacing"
          block={block}
          set={set}
          min={-5}
          max={20}
          step={0.1}
          unit="px"
        />
      </div>
      <NumberField
        label="Word spacing"
        field="wordSpacing"
        block={block}
        set={set}
        min={-5}
        max={40}
        step={0.5}
        unit="px"
      />
    </>
  );
}

function StyleChoice({ label, hint, field, block, set }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select
        value={block[field] ?? sectionStyleDefaults[field]}
        onChange={(e) => set(field, e.target.value)}
      >
        {sectionStyleOptions[field].map(([key, text]) => (
          <option key={key} value={key}>
            {text}
          </option>
        ))}
      </select>
      {hint && <small>{hint}</small>}
    </label>
  );
}

/* Style and Advanced for one section. Every control offers a choice between
   designed outcomes rather than a free value, so restyling a section cannot
   produce a page that overlaps, disappears or cannot be read. */
/* Roughly what the section sits on, so the contrast reading means something.
   The exact shade comes from the published theme; these are close enough to
   tell an editor whether a colour will read. */
const toneBehind = {
  default: "#f7f7f3",
  white: "#ffffff",
  tint: "#f2f2fb",
  brand: "#17218c",
  dark: "#0b1226",
  accent: "#f0b52a",
};
function SectionStyle({ block, set, advanced }) {
  const behind = toneBehind[block.tone || "default"];
  const choice = (label, field, hint) => (
    <StyleChoice
      label={label}
      hint={hint}
      field={field}
      block={block}
      set={set}
    />
  );
  return advanced ? (
    <div className="two">
      {choice(
        "Space above and below",
        "spacing",
        "How much room this section has around its content.",
      )}
      {choice(
        "Show this section on",
        "hideOn",
        "Hide a section on phones or on computers without deleting it.",
      )}
    </div>
  ) : (
    <>
      {choice(
        "Section colour",
        "tone",
        "Colours this one section only. The text colour is chosen for you so it always stays readable, whichever colour theme you publish.",
      )}
      <div className="two">
        {choice("Text alignment", "align")}
        {choice("Heading size", "headingScale")}
      </div>
      <h4 className="type-group">Colour</h4>
      <ColourField
        label="Heading colour"
        field="headingColor"
        block={block}
        set={set}
        against={behind}
      />
      <ColourField
        label="Text colour"
        field="textColor"
        block={block}
        set={set}
        against={behind}
      />
      <SectionTypography block={block} set={set} />
    </>
  );
}

function SectionTabs({ pane, setPane }) {
  return (
    <div className="section-tabs">
      {["Content", "Style", "Advanced"].map((name) => (
        <button
          type="button"
          key={name}
          className={pane === name ? "active" : ""}
          onClick={() => setPane(name)}
        >
          {name}
        </button>
      ))}
    </div>
  );
}

function BlockEditor({ block, onChange, media, sections }) {
  const set = (k, v) => onChange({ ...block, [k]: v });
  const [pane, setPane] = useState("Content");
  const tabs = <SectionTabs pane={pane} setPane={setPane} />;
  const styling =
    pane === "Style" ? (
      <SectionStyle block={block} set={set} />
    ) : pane === "Advanced" ? (
      <SectionStyle block={block} set={set} advanced />
    ) : null;
  if (block.type === "template")
    return (
      <>
        {tabs}
        {styling}
        {pane === "Content" && (
          <p className="note">
            Original {templateManifest[block.template].label} layout. Edit the
            content below; the design stays consistent.
          </p>
        )}
        {pane === "Content" &&
          [
            ["text", "Text content"],
            ["image", "Images"],
            ["link", "Buttons and links"],
          ].map(([kind, title]) => {
            const fields = Object.entries(
              templateManifest[block.template].fields,
            ).filter(([, field]) => field.kind === kind);
            return fields.length ? (
              <details
                className="template-group"
                key={kind}
                open={kind === "text"}
              >
                <summary>
                  {title} <small>({fields.length})</small>
                </summary>
                {fields.map(([key, field], i) =>
                  kind === "image" ? (
                    <MediaSelect
                      key={key}
                      label={"Image " + (i + 1) + " — " + field.label}
                      value={block.fields[key]}
                      media={media}
                      onChange={(v) =>
                        set("fields", { ...block.fields, [key]: v })
                      }
                    />
                  ) : (
                    <Field
                      key={key}
                      label={
                        kind === "link"
                          ? "Link " + (i + 1) + " — destination"
                          : field.label
                      }
                      value={block.fields[key]}
                      area={kind === "text" && block.fields[key].length > 80}
                      onChange={(v) =>
                        set("fields", { ...block.fields, [key]: v })
                      }
                    />
                  ),
                )}
              </details>
            ) : null;
          })}
      </>
    );
  if (block.type === "shared")
    return (
      <label className="field">
        <span>Published reusable section</span>
        <select
          value={block.sectionId}
          onChange={(e) => set("sectionId", e.target.value)}
        >
          <option value="">Select a section</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {label(s)}
              {s.published ? "" : " (not published)"}
            </option>
          ))}
        </select>
        <small>
          Uses the section’s published version when this page is previewed or
          published.
        </small>
      </label>
    );
  if (pane !== "Content")
    return (
      <>
        {tabs}
        {styling}
      </>
    );
  return (
    <>
      {tabs}
      <div className="two">
        <label className="field">
          <span>Section type</span>
          <select
            value={block.type}
            onChange={(e) => set("type", e.target.value)}
          >
            {sectionTypes.map((t) => (
              <option key={t} value={t}>
                {sectionNames[t]}
              </option>
            ))}
          </select>
        </label>
        <Field
          label="Section link name (optional)"
          value={block.anchor}
          onChange={(v) => set("anchor", v)}
          placeholder="e.g. services"
        />
      </div>
      <Field
        label="Small heading above the title"
        value={block.eyebrow}
        onChange={(v) => set("eyebrow", v)}
      />
      <Field
        label="Heading"
        value={block.heading}
        onChange={(v) => set("heading", v)}
      />
      <Field
        label="Main content"
        area
        value={block.body}
        onChange={(v) => set("body", v)}
      />
      <div className="two">
        <Field
          label="Button label"
          value={block.buttonLabel}
          onChange={(v) => set("buttonLabel", v)}
        />
        <Field
          label="Button link"
          value={block.href}
          onChange={(v) => set("href", v)}
          placeholder="/#contact"
        />
      </div>
      <div className="two">
        <MediaSelect
          value={block.image}
          onChange={(v, alt) =>
            onChange({ ...block, image: v, ...(alt ? { alt } : {}) })
          }
          media={media}
        />
        <Field
          label="Image alternative text"
          value={block.alt}
          onChange={(v) => set("alt", v)}
        />
      </div>
      <div className="itemlist">
        {block.type === "hero" && (
          <div className="two">
            <Field
              label="Image caption"
              value={block.imageCaption ?? "Thoughtfully designed."}
              onChange={(v) => set("imageCaption", v)}
            />
            <Field
              label="Image caption emphasis"
              value={block.imageCaptionStrong ?? "Built for what’s next."}
              onChange={(v) => set("imageCaptionStrong", v)}
            />
          </div>
        )}
        <Field
          label="Card button text"
          value={
            block.cardLinkLabel ??
            (block.anchor === "included-services"
              ? "Discuss this service"
              : "Explore service")
          }
          onChange={(v) => set("cardLinkLabel", v)}
        />
        <div className="row">
          <h4>Content cards</h4>
          <button
            onClick={() =>
              set("items", [
                ...block.items,
                { title: "New item", text: "", href: "", image: "", alt: "" },
              ])
            }
          >
            + Add card
          </button>
        </div>
        <small>
          Use for services, FAQs (question/title and answer/text), testimonials,
          gallery captions and other repeating content.
        </small>
        {block.items.map((item, i) => (
          <div className="item" key={i}>
            <div className="row">
              <strong>Card {i + 1}</strong>
              <div>
                <button
                  disabled={!i}
                  onClick={() => {
                    const a = [...block.items];
                    [a[i - 1], a[i]] = [a[i], a[i - 1]];
                    set("items", a);
                  }}
                >
                  ↑
                </button>
                <button
                  aria-label={`Remove card ${i + 1}`}
                  onClick={() =>
                    set(
                      "items",
                      block.items.filter((_, j) => j !== i),
                    )
                  }
                >
                  Remove
                </button>
              </div>
            </div>
            {["title", "text", "href", "alt"].map((k) => (
              <Field
                key={k}
                label={
                  {
                    alt: "Describe this image",
                    title: "Card title",
                    text: "Card description",
                    href: "Link to page",
                  }[k]
                }
                area={k === "text"}
                value={item[k]}
                onChange={(v) =>
                  set(
                    "items",
                    block.items.map((it, j) =>
                      j === i ? { ...it, [k]: v } : it,
                    ),
                  )
                }
              />
            ))}
            <label className="field">
              <span>Card icon</span>
              <select
                value={item.icon || ""}
                onChange={(e) =>
                  set(
                    "items",
                    block.items.map((it, j) => {
                      if (j !== i) return it;
                      const next = { ...it };
                      if (e.target.value) next.icon = e.target.value;
                      else delete next.icon;
                      return next;
                    }),
                  )
                }
              >
                <option value="">Automatic</option>
                {[
                  "code",
                  "server",
                  "phone",
                  "spark",
                  "growth",
                  "design",
                  "cloud",
                  "shield",
                ].map((icon) => (
                  <option key={icon} value={icon}>
                    {icon[0].toUpperCase() + icon.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <MediaSelect
              value={item.image}
              media={media}
              onChange={(v, alt) =>
                set(
                  "items",
                  block.items.map((it, j) =>
                    j === i ? { ...it, image: v, ...(alt ? { alt } : {}) } : it,
                  ),
                )
              }
            />
          </div>
        ))}
      </div>
      {block.type === "contact" && (
        <p className="note">
          Visitors can send you an inquiry from this section. Messages appear in
          Inquiries. The form is added automatically.
        </p>
      )}
    </>
  );
}
function App() {
  const [user, U] = useState(null),
    [ready, R] = useState(false),
    [docs, D] = useState([]),
    [media, M] = useState([]),
    [view, V] = useState("Overview"),
    [selected, S] = useState(null),
    [draft, F] = useState(null),
    [tab, T] = useState("Content"),
    [message, E] = useState(""),
    [busy, B] = useState(false),
    [preview, P] = useState(null),
    [history, H] = useState([]),
    [search, Q] = useState(""),
    [starter, SetStarter] = useState(false),
    [picker, SetPicker] = useState(false),
    [spot, SetSpot] = useState("");
  useEffect(() => {
    const added = (e) =>
      M((current) => [
        e.detail,
        ...current.filter((m) => m.id !== e.detail.id),
      ]);
    window.addEventListener("cms-media-uploaded", added);
    return () => window.removeEventListener("cms-media-uploaded", added);
  }, []);
  const dirty =
    selected && JSON.stringify(draft) !== JSON.stringify(selected.draft);
  const load = async () => {
    const [a, b] = await Promise.all([api("/documents"), api("/media")]);
    D(a);
    M(b);
  };
  useEffect(() => {
    api("/me")
      .then(async (u) => {
        csrf = u.csrf;
        U(u);
        await load();
      })
      .catch(() => {})
      .finally(() => R(true));
  }, []);
  /* Appearance is a friendly front door onto the site-settings document, so the
     editor never has to know where the theme values are stored. */
  useEffect(() => {
    if (view !== "Appearance" || selected) return;
    const settings = docs.find((d) => d.kind === "settings");
    if (!settings) return;
    S(settings);
    F(structuredClone(settings.draft));
  }, [view, selected, docs]);
  useEffect(() => {
    const fn = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", fn);
    return () => window.removeEventListener("beforeunload", fn);
  }, [dirty]);
  const run = async (fn) => {
    if (busy) return;
    B(true);
    E("");
    try {
      await fn();
    } catch (e) {
      E(e.message);
    } finally {
      B(false);
    }
  };
  const choose = (d) => {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    S(d);
    F(d ? structuredClone(d.draft) : null);
    SetSpot("");
    T(d?.kind === "page" ? "Builder" : "Content");
    P(null);
    H([]);
    E("");
  };
  const update = (d) => {
    S(d);
    F(structuredClone(d.draft));
    D((a) => [d, ...a.filter((x) => x.id !== d.id)]);
  };
  const create = (kind, pageData) => {
    if (kind === "page" && !pageData) {
      SetStarter(true);
      return;
    }
    return run(async () => {
      if (dirty && !window.confirm("Discard unsaved changes?")) return;
      const d = await api("/documents", "POST", {
        kind,
        data: pageData || defaults(kind),
      });
      update(d);
      SetStarter(false);
      T("Content");
      V(
        kind === "page"
          ? "Pages"
          : kind === "section"
            ? "Reusable sections"
            : kind === "menu"
              ? "Menus"
              : "Site settings",
      );
    });
  };
  const save = async () => {
    const d = await api(`/documents/${selected.id}`, "PUT", {
      version: selected.version,
      data: draft,
    });
    update(d);
    return d;
  };
  const change = (k, v) => F((d) => ({ ...d, [k]: v }));
  const publish = () =>
    run(async () => {
      const d = dirty ? await save() : selected;
      update(
        await api(`/documents/${d.id}/publish`, "POST", { version: d.version }),
      );
      E("Published successfully.");
    });
  if (!ready) return <div className="loading">Opening content studio…</div>;
  if (!user)
    return (
      <main className="login">
        <div className="login-brand">
          <img
            className="official-logo"
            src="/assets/on-zen-on-official-logo.png"
            alt="On Zen On Private Limited"
          />
          <p>ON ZEN ON / CONTENT STUDIO</p>
          <h1>
            Your next page.
            <br />
            <em>Always in your hands.</em>
          </h1>
          <p>One space for your pages, content and digital presence.</p>
          <a href="/" target="_blank" rel="noreferrer">
            Visit public website ↗
          </a>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            run(async () => {
              const u = await api("/login", "POST", Object.fromEntries(f));
              csrf = u.csrf;
              U(u);
              await load();
            });
          }}
        >
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Sign in to your studio</h2>
          <p>Use your administrator or editor account.</p>
          <label className="field">
            <span>Email address</span>
            <input name="email" type="email" autoComplete="username" required />
          </label>
          <PasswordField
            name="password"
            autoComplete="current-password"
            required
          />
          <button className="primary" disabled={busy}>
            Sign in →
          </button>
          {message && <p role="alert">{message}</p>}
          <small>
            First setup? Create an account using the instructions in README.md.
            No default password is enabled.
          </small>
        </form>
      </main>
    );
  const kinds = {
    Pages: "page",
    "Reusable sections": "section",
    Menus: "menu",
    "Site settings": "settings",
  };
  const visible = docs.filter(
    (d) =>
      d.kind === kinds[view] &&
      label(d).toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="app">
      {starter && (
        <PageStarter
          busy={busy}
          onCancel={() => SetStarter(false)}
          onCreate={(data) => create("page", data)}
        />
      )}
      {picker && draft?.blocks && (
        <SectionPicker
          usedTemplates={draft.blocks
            .filter((b) => b.type === "template")
            .map((b) => b.template)}
          sections={docs.filter((d) => d.kind === "section")}
          onCancel={() => SetPicker(false)}
          onPick={(choice) => {
            const added =
              choice.kind === "basic"
                ? starterBlock(choice.type)
                : choice.kind === "branded"
                  ? {
                      ...structuredClone(templateDefaults[choice.template]),
                      id: crypto.randomUUID(),
                      hidden: false,
                    }
                  : {
                      id: crypto.randomUUID(),
                      type: "shared",
                      hidden: false,
                      sectionId: choice.sectionId,
                    };
            change("blocks", [...draft.blocks, added]);
            SetSpot(added.id);
            SetPicker(false);
            E(
              "Section added at the bottom of the page. Open it to add your content.",
            );
          }}
        />
      )}
      <aside>
        <a className="brand" href="/admin/">
          <img
            className="sidebar-logo"
            src="/assets/on-zen-on-official-logo.png"
            alt="On Zen On"
          />
          <span>WEBSITE ADMIN</span>
        </a>
        <div className="workspace">
          <i /> Website workspace<small>on-zen-on.onrender.com</small>
        </div>
        <nav>
          {navItems
            .filter((item) => !item.adminOnly || user.role === "admin")
            .map((item) => (
              <button
                className={view === item.name ? "active" : ""}
                key={item.name}
                onClick={() => {
                  if (dirty && !window.confirm("Discard unsaved changes?"))
                    return;
                  V(item.name);
                  S(null);
                  F(null);
                  P(null);
                  Q("");
                  E("");
                }}
              >
                <span>{item.icon}</span>
                <b>
                  {item.name}
                  <small>{item.hint}</small>
                </b>
              </button>
            ))}
        </nav>
        <div className="aside-bottom">
          <a href="/" target="_blank" rel="noreferrer">
            Open public website ↗
          </a>
          <hr />
          <strong>{user.email}</strong>
          <small>{user.role}</small>
          <button
            onClick={() =>
              run(async () => {
                if (
                  dirty &&
                  !window.confirm("Discard unsaved changes and sign out?")
                )
                  return;
                await api("/logout", "POST");
                U(null);
                S(null);
                F(null);
              })
            }
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="main">
        <header>
          <span>
            Workspace <b>/</b> {view}
            {selected && (
              <>
                {" "}
                <b>/</b> {label(selected)}
              </>
            )}
          </span>
          <span className="secure">● Secure session</span>
        </header>
        <div className="content">
          <div className="heading">
            <div>
              <p className="eyebrow">YOUR WEBSITE, CONNECTED</p>
              <h1>
                {view === "Appearance"
                  ? "Appearance"
                  : selected
                    ? draft.title ||
                      draft.name ||
                      draft.heading ||
                      draft.siteName ||
                      templateManifest[draft.template]?.label
                    : view === "Overview"
                      ? "A little clarity. A lot of possibility."
                      : view}
              </h1>
              <p>
                {view === "Appearance"
                  ? "Choose your fonts, colours and spacing, and watch the website change as you do."
                  : selected
                    ? "Shape your content. Your public design stays in place."
                    : "Manage what’s next for On Zen On."}
              </p>
            </div>
            {kinds[view] && !selected && (
              <button
                className="primary"
                disabled={busy}
                onClick={() => create(kinds[view])}
              >
                + Create {kinds[view]}
              </button>
            )}
          </div>
          {message && (
            <div className="notice" role="status">
              {message}
            </div>
          )}
          {view === "Overview" && !selected && (
            <div className="quick-start">
              <h2>What would you like to change?</h2>
              <div>
                {[
                  [
                    "Edit website pages",
                    "Pages",
                    "Change text, images and sections",
                  ],
                  [
                    "Change fonts & colours",
                    "Appearance",
                    "Ready themes, fonts, colours and logo size",
                  ],
                  [
                    "Manage pictures",
                    "Media library",
                    "Upload and reuse your images",
                  ],
                  [
                    "Edit header & footer",
                    "Reusable sections",
                    "Logo, shared content and footer details",
                  ],
                  [
                    "Manage navigation",
                    "Menus",
                    "Add page links to your website menus",
                  ],
                ].map(([title, destination, hint]) => (
                  <button
                    key={title}
                    onClick={() => {
                      V(destination);
                      S(null);
                      Q("");
                    }}
                  >
                    <strong>{title} ↗</strong>
                    <span>{hint}</span>
                  </button>
                ))}
              </div>
              <p>
                Changes are private until you select Publish. Saved drafts can
                be previewed before going live.
              </p>
            </div>
          )}
          {view === "Overview" && !selected && (
            <>
              <div className="stats">
                {[
                  ["Total pages", docs.filter((d) => d.kind === "page").length],
                  [
                    "Published pages",
                    docs.filter((d) => d.kind === "page" && d.published).length,
                  ],
                  [
                    "Draft only",
                    docs.filter((d) => d.kind === "page" && !d.published)
                      .length,
                  ],
                  ["Media assets", media.length],
                ].map(([name, n]) => (
                  <div key={name}>
                    <span>{name}</span>
                    <strong>{n}</strong>
                  </div>
                ))}
              </div>
              <div className="welcome">
                <div>
                  <span className="eyebrow">BUILT FOR WHAT’S NEXT</span>
                  <h2>
                    Great content starts
                    <br />
                    with a clear canvas.
                  </h2>
                  <p>
                    Build a page from familiar sections, refine your message,
                    <br />
                    then publish when it’s ready.
                  </p>
                  <button
                    className="primary"
                    disabled={busy}
                    onClick={() => create("page")}
                  >
                    Create your next page ↗
                  </button>
                </div>
                <div className="abstract">
                  <span>01 / CREATE</span>
                  <div>
                    Creation
                    <br />
                    <em>meets growth.</em>
                  </div>
                  <span>YOUR CONTENT. YOUR CALL.</span>
                </div>
              </div>
              <div className="row">
                <h2>Recently updated</h2>
                <span>{docs.length} content entries</span>
              </div>
              {docs.length ? (
                <div className="table">
                  {docs.slice(0, 6).map((d) => (
                    <button
                      key={d.id}
                      className="table-row"
                      onClick={() => {
                        V(Object.keys(kinds).find((k) => kinds[k] === d.kind));
                        choose(d);
                      }}
                    >
                      <strong>
                        {label(d)}
                        <small>{d.kind}</small>
                      </strong>
                      <span className={d.published ? "badge live" : "badge"}>
                        {d.published ? "Published" : "Draft"}
                      </span>
                      <span>
                        {new Date(Number(d.updated)).toLocaleDateString()} →
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="empty">
                  No content yet. Create your first page, or follow the
                  migration guide to import the current homepage as a draft.
                </div>
              )}
              <p className="note">
                Your website is connected. Saved drafts stay private until an
                administrator publishes them.
              </p>
            </>
          )}
          {kinds[view] && !selected && (
            <>
              <Field
                label="Search content"
                value={search}
                onChange={Q}
                placeholder="Search by title…"
              />
              <div className="table">
                {visible.map((d) => (
                  <button
                    className="table-row"
                    key={d.id}
                    onClick={() => choose(d)}
                  >
                    <strong>
                      {label(d)}
                      <small>
                        {d.draft.path || d.draft.location || d.kind}
                      </small>
                    </strong>
                    <span className={d.published ? "badge live" : "badge"}>
                      {d.published ? "Published" : "Draft"}
                    </span>
                    <span>Version {d.version} →</span>
                  </button>
                ))}
              </div>
              {!visible.length && (
                <div className="empty">
                  No entries found. Create a {kinds[view]} to get started.
                </div>
              )}
            </>
          )}
          {view === "Appearance" &&
            !docs.some((d) => d.kind === "settings") && (
              <div className="empty">
                Website settings have not been created yet. Create them under
                Site settings first, then return here to choose your fonts and
                colours.
              </div>
            )}
          {selected && view === "Appearance" && (
            <ThemeStudio
              value={draft.theme}
              onChange={(v) => change("theme", v)}
              busy={busy}
              dirty={dirty}
              canPublish={user.role === "admin"}
              pages={docs
                .filter((d) => d.kind === "page" && d.published)
                .map((d) => d.published.path)}
              onSave={() =>
                run(async () => {
                  await save();
                  E(
                    "Design saved. Select Publish design to put it on the website.",
                  );
                })
              }
              onPublish={publish}
            />
          )}
          {selected && view !== "Appearance" && (
            <>
              <div className="toolbar">
                <button onClick={() => choose(null)}>← All entries</button>
                <span className="badge">
                  {dirty
                    ? "Unsaved changes"
                    : selected.published
                      ? "Published version available"
                      : "Draft only"}
                </span>
                <div className="spacer" />
                <button
                  disabled={busy}
                  onClick={() =>
                    run(async () => {
                      await save();
                      E("Draft saved.");
                    })
                  }
                >
                  Save draft
                </button>
                {selected.kind === "page" && (
                  <button
                    disabled={busy}
                    onClick={() =>
                      run(async () => {
                        const d = dirty ? await save() : selected;
                        await api(`/documents/${d.id}/preview`);
                        P({ documentId: d.id });
                      })
                    }
                  >
                    Preview
                  </button>
                )}
                <button
                  className="primary"
                  disabled={busy || user.role !== "admin"}
                  title={
                    user.role === "admin"
                      ? "Publish saved content"
                      : "Only administrators can publish"
                  }
                  onClick={publish}
                >
                  Publish ↗
                </button>
                {selected.published && user.role === "admin" && (
                  <button
                    disabled={busy}
                    onClick={() =>
                      run(async () => {
                        if (
                          !window.confirm(
                            "Remove this entry from the public API? Existing published pages retain snapshots of reusable sections.",
                          )
                        )
                          return;
                        const d = await api(
                          `/documents/${selected.id}/unpublish`,
                          "POST",
                          { version: selected.version },
                        );
                        S(d);
                        D((a) => a.map((x) => (x.id === d.id ? d : x)));
                        E("Unpublished.");
                      })
                    }
                  >
                    Unpublish
                  </button>
                )}
              </div>
              <div className="tabs">
                {[
                  ...(selected.kind === "page" ? ["Builder"] : []),
                  "Content",
                  ...(selected.kind === "page" ? ["SEO"] : []),
                  "History",
                ].map((t) => (
                  <button
                    className={tab === t ? "active" : ""}
                    key={t}
                    onClick={() =>
                      run(async () => {
                        T(t);
                        if (t === "History")
                          H(await api(`/documents/${selected.id}/revisions`));
                      })
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
              <fieldset className="edit-lock" disabled={busy}>
                {tab === "Builder" ? (
                  <PageBuilder
                    documentId={selected.id}
                    draft={draft}
                    selected={spot}
                    onSelect={SetSpot}
                    onChange={(blocks) => change("blocks", blocks)}
                    onAddSection={() => SetPicker(true)}
                    busy={busy}
                    dirty={dirty}
                    canPublish={user.role === "admin"}
                    onSave={() =>
                      run(async () => {
                        await save();
                        E("Page saved. Select Publish page to put it online.");
                      })
                    }
                    onPublish={publish}
                  >
                    {draft.blocks.some((b) => b.id === spot) && (
                      <BlockEditor
                        block={draft.blocks.find((b) => b.id === spot)}
                        media={media}
                        sections={docs.filter((d) => d.kind === "section")}
                        onChange={(value) =>
                          change(
                            "blocks",
                            draft.blocks.map((b) =>
                              b.id === spot ? value : b,
                            ),
                          )
                        }
                      />
                    )}
                  </PageBuilder>
                ) : tab === "History" ? (
                  <div className="panel">
                    <h2>Revision history</h2>
                    <p>
                      Restoring creates a new draft. Publish separately to
                      update the public version.
                    </p>
                    {history.map((h) => (
                      <div className="row revision" key={h.id}>
                        <span>
                          <strong>{h.action}</strong> ·{" "}
                          {new Date(Number(h.created)).toLocaleString()}
                        </span>
                        <button
                          disabled={busy}
                          onClick={() =>
                            run(async () => {
                              if (
                                dirty &&
                                !window.confirm(
                                  "Replace unsaved edits with this revision?",
                                )
                              )
                                return;
                              update(
                                await api(
                                  `/documents/${selected.id}/restore/${h.id}`,
                                  "POST",
                                  { version: selected.version },
                                ),
                              );
                              T("Content");
                              E("Revision restored as a draft.");
                            })
                          }
                        >
                          Restore draft
                        </button>
                      </div>
                    ))}
                  </div>
                ) : tab === "SEO" ? (
                  <div className="panel">
                    <h2>Search & sharing</h2>
                    <Field
                      label={`Search title (${draft.seo.title.length}/70)`}
                      value={draft.seo.title}
                      maxLength={70}
                      onChange={(v) =>
                        change("seo", { ...draft.seo, title: v })
                      }
                    />
                    <Field
                      label={`Meta description (${draft.seo.description.length}/170)`}
                      area
                      value={draft.seo.description}
                      maxLength={170}
                      onChange={(v) =>
                        change("seo", { ...draft.seo, description: v })
                      }
                    />
                    <Field
                      label="Canonical URL (optional)"
                      value={draft.seo.canonical}
                      onChange={(v) =>
                        change("seo", { ...draft.seo, canonical: v })
                      }
                    />
                    <MediaSelect
                      label="Social sharing image"
                      value={draft.seo.ogImage}
                      media={media}
                      onChange={(v) =>
                        change("seo", { ...draft.seo, ogImage: v })
                      }
                    />
                    <label className="check">
                      <input
                        type="checkbox"
                        checked={draft.seo.noindex}
                        onChange={(e) =>
                          change("seo", {
                            ...draft.seo,
                            noindex: e.target.checked,
                          })
                        }
                      />
                      Hide this page from search engines
                    </label>
                    <div className="search-preview">
                      <small>on-zen-on.onrender.com{draft.path}</small>
                      <h3>{draft.seo.title || draft.title}</h3>
                      <p>
                        {draft.seo.description ||
                          "Add a description for search results."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="panel">
                    {selected.kind === "page" && (
                      <>
                        <div className="editor-steps">
                          <strong>1. Edit your sections</strong>
                          <span>2. Save draft</span>
                          <span>3. Preview</span>
                          <span>4. Publish</span>
                        </div>
                        <p className="note">
                          Open a section below to change its text, images, and
                          links. Move sections up or down to change their order.
                          Add the published page to Menus so visitors can find
                          it.
                        </p>
                        <div className="two">
                          <Field
                            label="Page title"
                            value={draft.title}
                            onChange={(v) => change("title", v)}
                          />
                          <Field
                            label="Website address"
                            value={draft.path}
                            onChange={(v) => change("path", v)}
                            placeholder="/services/web-development"
                          />
                        </div>
                        <div className="row">
                          <h2>
                            Page sections <small>{draft.blocks.length}</small>
                          </h2>
                          <button
                            className="primary"
                            onClick={() => SetPicker(true)}
                          >
                            + Add a section
                          </button>
                        </div>
                        {draft.blocks.map((b, i) => (
                          <details
                            className={b.hidden ? "block is-hidden" : "block"}
                            key={b.id}
                            open={draft.blocks.length === 1 ? true : undefined}
                          >
                            <summary>
                              <span className="block-number">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <strong>
                                {b.heading ||
                                  templateManifest[b.template]?.label ||
                                  "Reusable section"}
                              </strong>
                              <span>
                                {sectionNames[b.type] ||
                                  (b.type === "template"
                                    ? "Original design"
                                    : "Reusable section")}
                              </span>
                              {b.hidden && (
                                <span className="badge hidden-badge">
                                  Hidden from visitors
                                </span>
                              )}
                              <span className="block-open">Open to edit ▾</span>
                            </summary>
                            <div className="block-body">
                              <div className="row">
                                <span>Section controls</span>
                                <div className="section-controls">
                                  <button
                                    disabled={!i}
                                    title="Move this section higher up the page"
                                    onClick={() => {
                                      const a = [...draft.blocks];
                                      [a[i - 1], a[i]] = [a[i], a[i - 1]];
                                      change("blocks", a);
                                    }}
                                  >
                                    ↑ Move up
                                  </button>
                                  <button
                                    disabled={i === draft.blocks.length - 1}
                                    title="Move this section further down the page"
                                    onClick={() => {
                                      const a = [...draft.blocks];
                                      [a[i + 1], a[i]] = [a[i], a[i + 1]];
                                      change("blocks", a);
                                    }}
                                  >
                                    ↓ Move down
                                  </button>
                                  <button
                                    title="Make an identical copy of this section"
                                    onClick={() => {
                                      const copy = {
                                        ...structuredClone(b),
                                        id: crypto.randomUUID(),
                                      };
                                      if (copy.anchor) copy.anchor = "";
                                      /* Each branded layout may appear only once per page. */
                                      if (copy.type === "template") {
                                        E(
                                          "Branded sections can be used once on a page. Add it to another page instead.",
                                        );
                                        return;
                                      }
                                      const a = [...draft.blocks];
                                      a.splice(i + 1, 0, copy);
                                      change("blocks", a);
                                    }}
                                  >
                                    ⧉ Make a copy
                                  </button>
                                  <button
                                    className={b.hidden ? "warn" : ""}
                                    title={
                                      b.hidden
                                        ? "Show this section on the website again"
                                        : "Keep this section but hide it from visitors"
                                    }
                                    onClick={() =>
                                      change(
                                        "blocks",
                                        draft.blocks.map((x, j) =>
                                          i === j
                                            ? { ...x, hidden: !x.hidden }
                                            : x,
                                        ),
                                      )
                                    }
                                  >
                                    {b.hidden ? "◉ Show again" : "◌ Hide"}
                                  </button>
                                  <button
                                    className="danger"
                                    title="Delete this section from the page"
                                    onClick={() => {
                                      if (
                                        !window.confirm(
                                          "Delete this section? Use Hide instead if you may want it back later.",
                                        )
                                      )
                                        return;
                                      change(
                                        "blocks",
                                        draft.blocks.filter((_, j) => j !== i),
                                      );
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                              <BlockEditor
                                block={b}
                                media={media}
                                sections={docs.filter(
                                  (d) => d.kind === "section",
                                )}
                                onChange={(v) =>
                                  change(
                                    "blocks",
                                    draft.blocks.map((x, j) =>
                                      i === j ? v : x,
                                    ),
                                  )
                                }
                              />
                            </div>
                          </details>
                        ))}
                      </>
                    )}
                    {selected.kind === "section" && (
                      <BlockEditor
                        block={draft}
                        media={media}
                        sections={[]}
                        onChange={F}
                      />
                    )}
                    {selected.kind === "menu" && (
                      <>
                        <div className="two">
                          <Field
                            label="Menu name"
                            value={draft.name}
                            onChange={(v) => change("name", v)}
                          />
                          <label className="field">
                            <span>Location</span>
                            <select
                              value={draft.location}
                              onChange={(e) =>
                                change("location", e.target.value)
                              }
                            >
                              {["header", "footer", "services"].map((x) => (
                                <option key={x}>{x}</option>
                              ))}
                            </select>
                          </label>
                        </div>
                        <button
                          onClick={() =>
                            change("items", [
                              ...draft.items,
                              {
                                id: crypto.randomUUID(),
                                label: "New link",
                                href: "/",
                                newTab: false,
                              },
                            ])
                          }
                        >
                          + Add link
                        </button>
                        {draft.items.map((it, i) => (
                          <div className="item" key={it.id}>
                            <div className="two">
                              <Field
                                label="Link label"
                                value={it.label}
                                onChange={(v) =>
                                  change(
                                    "items",
                                    draft.items.map((x, j) =>
                                      i === j ? { ...x, label: v } : x,
                                    ),
                                  )
                                }
                              />
                              <Field
                                label="Destination"
                                value={it.href}
                                onChange={(v) =>
                                  change(
                                    "items",
                                    draft.items.map((x, j) =>
                                      i === j ? { ...x, href: v } : x,
                                    ),
                                  )
                                }
                              />
                            </div>
                            <label className="check">
                              <input
                                type="checkbox"
                                checked={it.newTab}
                                onChange={(e) =>
                                  change(
                                    "items",
                                    draft.items.map((x, j) =>
                                      i === j
                                        ? { ...x, newTab: e.target.checked }
                                        : x,
                                    ),
                                  )
                                }
                              />
                              Open in a new tab
                            </label>
                            <button
                              disabled={!i}
                              onClick={() => {
                                const a = [...draft.items];
                                [a[i - 1], a[i]] = [a[i], a[i - 1]];
                                change("items", a);
                              }}
                            >
                              ↑ Move up
                            </button>
                            <button
                              onClick={() =>
                                change(
                                  "items",
                                  draft.items.filter((_, j) => j !== i),
                                )
                              }
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </>
                    )}
                    {selected.kind === "settings" &&
                      Object.keys(draft)
                        .filter((k) => !["experience", "theme"].includes(k))
                        .map((k) => (
                          <Field
                            label={k.replace(/([A-Z])/g, " $1")}
                            key={k}
                            value={draft[k]}
                            area={["addresses", "footerText"].includes(k)}
                            onChange={(v) => change(k, v)}
                          />
                        ))}
                    {selected.kind === "settings" && (
                      <div className="panel-pointer">
                        <h2>Fonts, colours and theme</h2>
                        <p>
                          Everything about how the website looks now lives in
                          Appearance, with a live preview beside the controls.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            V("Appearance");
                            T("Content");
                          }}
                        >
                          Open Appearance ↗
                        </button>
                      </div>
                    )}
                    {selected.kind === "settings" && (
                      <ExperienceSettings
                        value={draft.experience}
                        onChange={(v) => change("experience", v)}
                      />
                    )}
                  </div>
                )}
              </fieldset>
            </>
          )}
          {["Inquiries", "Users"].includes(view) && (
            <Management view={view} api={api} run={run} />
          )}
          {view === "Requests" && <Requests api={api} run={run} />}
          {view === "Media library" && (
            <MediaLibrary
              media={media}
              api={api}
              run={run}
              reload={load}
              canDelete={user.role === "admin"}
              notify={E}
            />
          )}
          {preview && (
            <div
              className="modal"
              role="dialog"
              aria-modal="true"
              aria-label="Content preview"
            >
              <div>
                <div className="row">
                  <h2>Content preview</h2>
                  <button onClick={() => P(null)}>Close</button>
                </div>
                <p>
                  Preview of the saved draft in your website design. Inquiry
                  forms are disabled in preview.
                </p>
                <iframe
                  className="site-preview"
                  title="Website draft preview"
                  src={`/_preview/${preview.documentId}`}
                />
              </div>
            </div>
          )}
        </div>
        <footer className="studio-footer">
          ON ZEN ON <span>Creation meets growth.</span>
          <small>Content studio / v0.1</small>
        </footer>
      </main>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);

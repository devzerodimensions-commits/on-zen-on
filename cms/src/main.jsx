import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { blankBlock, sectionTypes } from "../shared/content.js";
import { templateDefaults, templateManifest } from "../../shared/templates.js";
import { Management } from "./Management.jsx";
import { PasswordField } from "./PasswordField.jsx";
import "./style.css";
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
function MediaSelect({ label = "Image", value, onChange, media }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value || ""} onChange={(e) => onChange(e.target.value)}>
        <option value="">No image</option>
        {[
          "on-zen-on-official-logo.png",
          "software-laptop-3d.png",
          "portfolio-floating-sites.png",
        ].map((file) => (
          <option key={file} value={`/assets/${file}`}>
            {file}
          </option>
        ))}
        {media.map((m) => (
          <option key={m.id} value={m.url}>
            {m.alt} · {m.original_name}
          </option>
        ))}
      </select>
    </label>
  );
}
function BlockEditor({ block, onChange, media, sections }) {
  const set = (k, v) => onChange({ ...block, [k]: v });
  if (block.type === "template")
    return (
      <>
        <p className="note">
          Original {templateManifest[block.template].label} layout. Edit the
          content below; the design stays consistent.
        </p>
        {Object.entries(templateManifest[block.template].fields).map(
          ([key, field]) =>
            field.kind === "image" ? (
              <MediaSelect
                key={key}
                label={field.label}
                value={block.fields[key]}
                media={media}
                onChange={(v) => set("fields", { ...block.fields, [key]: v })}
              />
            ) : (
              <Field
                key={key}
                label={field.label}
                value={block.fields[key]}
                area={field.kind === "text" && block.fields[key].length > 80}
                onChange={(v) => set("fields", { ...block.fields, [key]: v })}
              />
            ),
        )}
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
  return (
    <>
      <div className="two">
        <label className="field">
          <span>Section type</span>
          <select
            value={block.type}
            onChange={(e) => set("type", e.target.value)}
          >
            {sectionTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <Field
          label="Anchor ID"
          value={block.anchor}
          onChange={(v) => set("anchor", v)}
          placeholder="e.g. services"
        />
      </div>
      <Field
        label="Eyebrow"
        value={block.eyebrow}
        onChange={(v) => set("eyebrow", v)}
      />
      <Field
        label="Heading"
        value={block.heading}
        onChange={(v) => set("heading", v)}
      />
      <Field
        label="Body"
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
          onChange={(v) => set("image", v)}
          media={media}
        />
        <Field
          label="Image alternative text"
          value={block.alt}
          onChange={(v) => set("alt", v)}
        />
      </div>
      <div className="itemlist">
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
                label={k === "alt" ? "Image alternative text" : k}
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
            <MediaSelect
              value={item.image}
              media={media}
              onChange={(v) =>
                set(
                  "items",
                  block.items.map((it, j) =>
                    j === i ? { ...it, image: v } : it,
                  ),
                )
              }
            />
          </div>
        ))}
      </div>
      {block.type === "contact" && (
        <p className="note">
          Contact content is editable here. The public component must retain the
          existing inquiry form and its server-side validation.
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
    [search, Q] = useState("");
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
    T("Content");
    P(null);
    H([]);
    E("");
  };
  const update = (d) => {
    S(d);
    F(structuredClone(d.draft));
    D((a) => [d, ...a.filter((x) => x.id !== d.id)]);
  };
  const create = (kind) =>
    run(async () => {
      if (dirty && !window.confirm("Discard unsaved changes?")) return;
      const d = await api("/documents", "POST", { kind, data: defaults(kind) });
      update(d);
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
          <PasswordField name="password" autoComplete="current-password" required />
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
          {[
            "Overview",
            "Pages",
            "Reusable sections",
            "Menus",
            "Media library",
            "Site settings",
            ...(user.role === "admin" ? ["Inquiries", "Users"] : []),
          ].map((v, i) => (
            <button
              className={view === v ? "active" : ""}
              key={v}
              onClick={() => {
                if (dirty && !window.confirm("Discard unsaved changes?"))
                  return;
                V(v);
                S(null);
                F(null);
                P(null);
                Q("");
                E("");
              }}
            >
              <span>{["◈", "▤", "▦", "☷", "▧", "⚙", "✉", "♙"][i]}</span>
              {v}
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
                {selected
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
                {selected
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
          {selected && (
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
                {tab === "History" ? (
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
                        <div className="two">
                          <Field
                            label="Page title"
                            value={draft.title}
                            onChange={(v) => change("title", v)}
                          />
                          <Field
                            label="Page path"
                            value={draft.path}
                            onChange={(v) => change("path", v)}
                            placeholder="/services/web-development"
                          />
                        </div>
                        <div className="row">
                          <h2>
                            Page sections <small>{draft.blocks.length}</small>
                          </h2>
                          <div>
                            <button
                              onClick={() =>
                                change("blocks", [
                                  ...draft.blocks,
                                  blankBlock("about"),
                                ])
                              }
                            >
                              + Section
                            </button>
                            <select
                              aria-label="Add an original layout"
                              value=""
                              onChange={(e) => {
                                if (e.target.value)
                                  change("blocks", [
                                    ...draft.blocks,
                                    {
                                      ...structuredClone(
                                        templateDefaults[e.target.value],
                                      ),
                                      id: crypto.randomUUID(),
                                    },
                                  ]);
                              }}
                            >
                              <option value="">+ Original layout</option>
                              {Object.entries(templateManifest)
                                .filter(([key]) => !key.startsWith("site-"))
                                .map(([key, t]) => (
                                  <option key={key} value={key}>
                                    {t.label}
                                  </option>
                                ))}
                            </select>
                            <button
                              onClick={() =>
                                change("blocks", [
                                  ...draft.blocks,
                                  {
                                    id: crypto.randomUUID(),
                                    type: "shared",
                                    sectionId:
                                      docs.find((d) => d.kind === "section")
                                        ?.id || "",
                                  },
                                ])
                              }
                            >
                              + Reusable
                            </button>
                          </div>
                        </div>
                        {draft.blocks.map((b, i) => (
                          <details
                            className="block"
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
                              <span>{b.type}</span>
                            </summary>
                            <div className="block-body">
                              <div className="row">
                                <span>Section controls</span>
                                <div>
                                  <button
                                    disabled={!i}
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
                                    onClick={() => {
                                      const a = [...draft.blocks];
                                      [a[i + 1], a[i]] = [a[i], a[i + 1]];
                                      change("blocks", a);
                                    }}
                                  >
                                    ↓ Move down
                                  </button>
                                  <button
                                    onClick={() =>
                                      change(
                                        "blocks",
                                        draft.blocks.filter((_, j) => j !== i),
                                      )
                                    }
                                  >
                                    Remove
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
                      Object.keys(draft).map((k) => (
                        <Field
                          label={k.replace(/([A-Z])/g, " $1")}
                          key={k}
                          value={draft[k]}
                          area={["addresses", "footerText"].includes(k)}
                          onChange={(v) => change(k, v)}
                        />
                      ))}
                  </div>
                )}
              </fieldset>
            </>
          )}
          {["Inquiries", "Users"].includes(view) && (
            <Management view={view} api={api} run={run} />
          )}
          {view === "Media library" && (
            <>
              <form
                className="panel upload"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const data = new FormData(form);
                  run(async () => {
                    await api("/media", "POST", data);
                    await load();
                    form.reset();
                    E(
                      "Image uploaded. It is available in section and SEO image selectors.",
                    );
                  });
                }}
              >
                <h2>Add an image</h2>
                <p>
                  Public website assets only. PNG, JPEG or WebP · up to 8 MB.
                  Images are resized and converted to WebP.
                </p>
                <div className="two">
                  <label className="field">
                    <span>Choose image</span>
                    <input
                      name="file"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      required
                    />
                  </label>
                  <label className="field">
                    <span>Alternative text</span>
                    <input
                      name="alt"
                      required
                      maxLength={250}
                      placeholder="Describe the image"
                    />
                  </label>
                </div>
                <button className="primary" disabled={busy}>
                  Upload image ↗
                </button>
              </form>
              <div className="media-grid">
                {media.map((m) => (
                  <article key={m.id}>
                    <img src={m.url} alt={m.alt} />
                    <div>
                      <strong>{m.alt}</strong>
                      <small>
                        {m.width} × {m.height} · WebP
                      </small>
                      <small>{m.url}</small>
                    </div>
                  </article>
                ))}
              </div>
              {!media.length && (
                <div className="empty">
                  Your media library is ready for its first image.
                </div>
              )}
            </>
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

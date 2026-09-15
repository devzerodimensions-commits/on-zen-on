import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { OriginalTemplate } from "./OriginalTemplates.jsx";
import { ServicesPage } from "./ServicesPage.jsx";
import { templateDefaults } from "../shared/templates.js";
import "./styles.css";
import "./tech-theme.css";
import "./growth-layout.css";
import "./golden-sections.css";
import "./balanced-brand.css";
import "./stack-showcase.css";
import "./showcase.css";
import "./dynamic.css";
import "./homepage-logo.css";
import { BrandIntro } from "./BrandIntro.jsx";
import { ServiceChat } from "./ServiceChat.jsx";
function GenericBlock({ content: b, submit, formState }) {
  return (
    <section
      id={b.anchor || undefined}
      className={`section cms-section cms-${b.type}`}
    >
      <p className="eyebrow">{b.eyebrow}</p>
      {b.type === "hero" ? <h1>{b.heading}</h1> : <h2>{b.heading}</h2>}
      <p className="cms-body">{b.body}</p>
      {b.image && <img className="cms-image" src={b.image} alt={b.alt} />}
      {b.items.length > 0 && (
        <div className={b.type === "faq" ? "cms-faq" : "service-grid"}>
          {b.items.map((it, i) =>
            b.type === "faq" ? (
              <details key={i}>
                <summary>{it.title}</summary>
                <p>{it.text}</p>
              </details>
            ) : (
              <article className="service-card" key={i}>
                {it.image && (
                  <img className="cms-image" src={it.image} alt={it.alt} />
                )}
                <h3>{it.title}</h3>
                <p>{it.text}</p>
                {it.href && <a href={it.href}>Learn more ↗</a>}
              </article>
            ),
          )}
        </div>
      )}
      {b.buttonLabel && b.href && (
        <a className="button" href={b.href}>
          {b.buttonLabel} ↗
        </a>
      )}
      {b.type === "contact" && (
        <form className="cms-contact-form" onSubmit={submit}>
          <label>
            Name
            <input name="name" required maxLength={150} />
          </label>
          <label>
            Email
            <input name="email" type="email" required maxLength={254} />
          </label>
          <label>
            Message
            <textarea name="message" required maxLength={10000} />
          </label>
          <button className="button">Send inquiry ↗</button>
          <p role="status">{formState}</p>
        </form>
      )}
    </section>
  );
}
function App() {
  const [page, P] = useState(null),
    [site, S] = useState(null),
    [error, E] = useState(""),
    [menu, M] = useState(false),
    [formState, F] = useState("");
  const previewId = location.pathname.startsWith("/_preview/")
    ? location.pathname.split("/")[2]
    : null;
  useEffect(() => {
    const controller = new AbortController();
    const get = async (url) => {
      const r = await fetch(url, { signal: controller.signal });
      if (!r.ok)
        throw Error(
          r.status === 401
            ? "Please sign in to the admin to preview this draft."
            : r.status === 404
              ? "This page is not available."
              : "The website is temporarily unavailable. Please refresh.",
        );
      return r.json();
    };
    Promise.all([
      get(
        previewId
          ? `/api/cms/documents/${previewId}/preview`
          : `/api/public/page?path=${encodeURIComponent(location.pathname)}`,
      ),
      get("/api/public/site"),
    ])
      .then(([p, s]) => {
        P(p);
        S(s);
      })
      .catch((e) => {
        if (e.name !== "AbortError") E(e.message);
      });
    return () => controller.abort();
  }, [previewId]);
  useEffect(() => {
    if (page && location.hash) {
      const el = document.getElementById(
        decodeURIComponent(location.hash.slice(1)),
      );
      el?.scrollIntoView();
    }
  }, [page]);
  const submit = async (e) => {
    e.preventDefault();
    if (previewId) {
      F("Preview only — inquiries are not sent.");
      return;
    }
    const form = e.currentTarget;
    F("Sending…");
    try {
      const r = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!r.ok) throw Error();
      form.reset();
      F("Thanks—your inquiry has been received.");
    } catch {
      F("Your inquiry could not be sent. Please try again shortly.");
    }
  };
  if (error)
    return (
      <main className="cms-status">
        <img src="/assets/on-zen-on-official-logo.png" alt="On Zen On" />
        <h1>{error}</h1>
        <a href="/">Return home</a>
      </main>
    );
  if (!page || !site)
    return (
      <main className="cms-status" aria-busy="true">
        <img src="/assets/on-zen-on-official-logo.png" alt="On Zen On" />
        <p>Loading…</p>
      </main>
    );
  const props = { menu, setMenu: M, menus: site.menus, submit, formState };
  const header =
    site.layouts.find((x) => x.template === "site-header") ||
    templateDefaults["site-header"];
  const footer = structuredClone(
    site.layouts.find((x) => x.template === "site-footer") ||
      templateDefaults["site-footer"],
  );
  if (site.settings) {
    const old = templateDefaults["site-footer"].fields;
    for (const key of Object.keys(footer.fields)) {
      if (old[key].includes("On Zen On Private Limited. All rights reserved."))
        footer.fields[key] = ` ${site.settings.siteName}. All rights reserved.`;
      if (old[key] === "+91 00000 00000")
        footer.fields[key] = site.settings.phone;
      if (old[key] === "tel:+910000000000")
        footer.fields[key] =
          `tel:${site.settings.phone.replace(/[^+0-9]/g, "")}`;
      if (old[key] === "Creation meets growth.")
        footer.fields[key] = site.settings.tagline;
      if (
        old[key] ===
        "We create secure digital products, intelligent automation and growth-focused marketing for businesses ready to move forward."
      )
        footer.fields[key] = site.settings.footerText;
      if (old[key] === "hello@onzenon.com")
        footer.fields[key] = site.settings.email;
      if (old[key] === "mailto:hello@onzenon.com")
        footer.fields[key] = `mailto:${site.settings.email}`;
    }
  }
  return (
    <div className={page.path === "/" ? "homepage" : undefined}>
      {!previewId && <BrandIntro logo={header.fields.image_4} />}
      <OriginalTemplate content={header} {...props} />
      <main id="home">
        {page.path === "/services" || page.path.startsWith("/services/") ? (
          <ServicesPage
            page={page}
            submit={submit}
            formState={formState}
            renderFallback={(b) => (
              <OriginalTemplate key={b.id} content={b} {...props} />
            )}
          />
        ) : (
          page.blocks.map((b) =>
            b.type === "template" ? (
              <OriginalTemplate key={b.id} content={b} {...props} />
            ) : (
              <GenericBlock key={b.id} content={b} {...props} />
            ),
          )
        )}
      </main>
      <OriginalTemplate content={footer} {...props} />
      {!previewId && <ServiceChat page={page} />}
    </div>
  );
}
if (location.hash.startsWith("#/admin")) location.replace("/admin/");
else createRoot(document.getElementById("root")).render(<App />);

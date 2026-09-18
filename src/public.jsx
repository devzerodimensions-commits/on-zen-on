import { ServiceIcon } from "./ServiceIcon.jsx";
import { PortfolioGallery } from "./PortfolioGallery.jsx";
import "./inner-pages.css";
import { SectionMotion } from "./SectionMotion.jsx";
import { PublishedTheme } from "./PublishedTheme.jsx";
import { InquiryForm, ThankYou } from "./InquiryForm.jsx";
import React, { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { OriginalTemplate } from "./OriginalTemplates.jsx";
import { ServicesPage } from "./ServicesPage.jsx";
import { BlogPage, BlogCards } from "./BlogPage.jsx";
import { templateDefaults } from "../shared/templates.js";
import { sectionClasses, pageCustomCss } from "../shared/section-style.js";
import "./styles.css";
import "./tech-theme.css";
import "./growth-layout.css";
import "./golden-sections.css";
import "./balanced-brand.css";
import "./stack-showcase.css";
import "./showcase.css";
import "./dynamic.css";
import "./homepage-logo.css";
import "./cms-layout.css";
import { BrandIntro } from "./BrandIntro.jsx";
import { ServiceChat } from "./ServiceChat.jsx";
import { ExperienceTools } from "./ExperienceTools.jsx";
import { Portal } from "./Portal.jsx";
import { ExperienceProvider } from "./ExperienceContext.jsx";
function GenericBlock({ content: b, submit, formState, portfolio }) {
  if (b.type === "updates") return <BlogCards block={b} />;
  return (
    <section
      id={b.anchor || undefined}
      className={`section cms-section cms-${b.type}${sectionClasses(b)}`}
    >
      <p className="eyebrow">
        <span className="section-symbol" aria-hidden="true">
          <ServiceIcon
            name={
              b.type === "contact"
                ? "phone"
                : b.type === "process"
                  ? "growth"
                  : "spark"
            }
          />
        </span>
        {b.eyebrow}
      </p>
      {b.type === "hero" ? <h1>{b.heading}</h1> : <h2>{b.heading}</h2>}
      <p className="cms-body">{b.body}</p>
      {b.image && <img className="cms-image" src={b.image} alt={b.alt} />}
      {b.items.length > 0 && b.type === "testimonials" && (
        <div className="cms-quotes">
          {b.items.map((it, i) => (
            <figure key={i}>
              <blockquote>{it.text}</blockquote>
              <figcaption>
                {it.image && <img src={it.image} alt={it.alt} loading="lazy" />}
                <cite>{it.title}</cite>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      {b.items.length > 0 && b.type === "casestudies" && portfolio && (
        <PortfolioGallery items={b.items} />
      )}
      {b.items.length > 0 && b.type === "casestudies" && !portfolio && (
        <div className="cms-cases">
          {b.items.map((it, i) => (
            <article key={i}>
              {it.image && <img src={it.image} alt={it.alt} loading="lazy" />}
              <div>
                <h3>{it.title}</h3>
                <p>{it.text}</p>
                {it.href && (
                  <a href={it.href}>
                    {b.cardLinkLabel || "Read the full story"} ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
      {b.items.length > 0 &&
        !["testimonials", "casestudies"].includes(b.type) && (
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
                  <span className="inner-card-icon" aria-hidden="true">
                    <ServiceIcon name={it.icon || "spark"} />
                  </span>
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
        <InquiryForm submit={submit} formState={formState} />
      )}
    </section>
  );
}
function App() {
  const sending = useRef(false);
  const [page, P] = useState(null),
    [site, S] = useState(null),
    [error, E] = useState(""),
    [menu, M] = useState(false),
    [formState, F] = useState(""),
    [builder, B] = useState(false),
    [active, A] = useState("");
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
  /* The admin page builder shows this page in an iframe. It sends the draft as
     it is typed, and this page reports back which section was clicked, so the
     editor can point at the website itself instead of a list of form fields. */
  useEffect(() => {
    if (window.parent === window) return;
    const listen = (event) => {
      if (event.origin !== window.location.origin) return;
      const message = event.data || {};
      if (message.type === "oz-builder-init") B(true);
      if (message.type === "oz-page-preview" && message.page) {
        B(true);
        P(message.page);
      }
      if (message.type === "oz-builder-select") A(message.id || "");
    };
    window.addEventListener("message", listen);
    window.parent.postMessage(
      { type: "oz-preview-ready" },
      window.location.origin,
    );
    return () => window.removeEventListener("message", listen);
  }, []);
  /* Sections are matched to the elements they rendered by position, which keeps
     the original markup untouched — no wrapper elements, no changed CSS. */
  useEffect(() => {
    if (!builder || !page) return;
    const nodes = document.querySelectorAll("main > *");
    const visible = page.blocks.filter((b) => !b.hidden);
    nodes.forEach((node) => {
      node.removeAttribute("data-oz-block");
      node.classList.remove("oz-active");
    });
    visible.forEach((block, i) => {
      if (!nodes[i]) return;
      nodes[i].setAttribute("data-oz-block", block.id);
      if (block.id === active) nodes[i].classList.add("oz-active");
    });
  }, [builder, page, active]);
  useEffect(() => {
    if (!builder) return;
    const onClick = (event) => {
      const element = event.target.closest("[data-oz-block]");
      event.preventDefault();
      event.stopPropagation();
      if (element)
        window.parent.postMessage(
          {
            type: "oz-block-click",
            id: element.getAttribute("data-oz-block"),
          },
          window.location.origin,
        );
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [builder]);
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
    if (sending.current) return;
    sending.current = true;
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    F("Sending…");
    try {
      const r = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await r.json().catch(() => ({}));
      if (!r.ok || !result.ok)
        throw Error(
          result.error ||
            (r.status === 429
              ? "Too many attempts. Please try again in 15 minutes."
              : "Your inquiry could not be sent. Please try again shortly."),
        );
      try {
        sessionStorage.setItem("inquiry-received", "yes");
      } catch {}
      location.assign("/thank-you");
    } catch (err) {
      F(
        err.message ||
          "Your inquiry could not be sent. Please try again shortly.",
      );
    } finally {
      sending.current = false;
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
  /* Inside the admin's appearance preview, skip the entrance animation and the
     chat bubble so the editor sees the page itself. */
  const framed = window.parent !== window;
  /* Sections switched off in the admin stay in the draft but never reach visitors. */
  const shown = { ...page, blocks: page.blocks.filter((b) => !b.hidden) };
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
  /* Typography and colour set on individual sections, scoped to each one. */
  const custom = pageCustomCss(shown.blocks);
  return (
    <div className={page.path === "/" ? "homepage" : "inner-pages"}>
      {custom && <style>{custom}</style>}
      {builder && (
        <style>{`
[data-oz-block]{cursor:pointer}
[data-oz-block]:hover{outline:3px dashed #2555f5;outline-offset:-3px}
[data-oz-block].oz-active{outline:3px solid #2555f5;outline-offset:-3px}
[data-oz-block].oz-active:after{content:"Editing this section";position:absolute;margin:6px 0 0 6px;background:#2555f5;color:#fff;font:600 11px/1 system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;padding:6px 9px;border-radius:5px;z-index:9}
[data-oz-block]{position:relative}
`}</style>
      )}
      {!previewId && !framed && <BrandIntro logo={header.fields.image_4} />}
      <OriginalTemplate content={header} {...props} />
      {!previewId && !framed && <ExperienceTools />}
      <main id="home">
        {page.path === "/tech-updates" || page.path.startsWith("/blog/") ? (
          <BlogPage page={shown} />
        ) : page.path === "/services" || page.path.startsWith("/services/") ? (
          <ServicesPage
            page={shown}
            submit={submit}
            formState={formState}
            renderFallback={(b) => (
              <OriginalTemplate key={b.id} content={b} {...props} />
            )}
          />
        ) : (
          shown.blocks.map((b) =>
            b.type === "template" ? (
              <OriginalTemplate key={b.id} content={b} {...props} />
            ) : (
              <GenericBlock
                key={b.id}
                content={b}
                portfolio={page.path === "/portfolio"}
                {...props}
              />
            ),
          )
        )}
      </main>
      <OriginalTemplate content={footer} {...props} />
      {!previewId && !framed && <ServiceChat page={page} />}
    </div>
  );
}
if (location.hash.startsWith("#/admin")) location.replace("/admin/");
else
  createRoot(document.getElementById("root")).render(
    <ExperienceProvider>
      <PublishedTheme />
      <SectionMotion />
      {location.pathname === "/thank-you" ? (
        <ThankYou />
      ) : location.pathname === "/portal" ? (
        <Portal />
      ) : (
        <App />
      )}
    </ExperienceProvider>,
  );

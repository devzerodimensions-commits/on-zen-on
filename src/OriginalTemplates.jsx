import { InquiryForm } from "./InquiryForm.jsx";
// Extracted from the original website. Original classes, layout and decorative elements are preserved.
import React from "react";
import { menuDefaults } from "../shared/templates.js";
function menuLinks(location, menus) {
  return (
    menus?.find((m) => m.location === location)?.items || menuDefaults[location]
  ).map((it) => (
    <a
      key={it.id}
      href={it.href}
      target={it.newTab ? "_blank" : undefined}
      rel={it.newTab ? "noopener noreferrer" : undefined}
    >
      {it.label}
    </a>
  ));
}
export function OriginalTemplate({
  content,
  menu,
  setMenu,
  menus,
  submit,
  formState,
}) {
  /* A branded section can be recoloured from the admin like any other. */
  const tone = sectionClasses(content);
  switch (content.template) {
    case "hero":
      return (
        <section className={"hero" + tone}>
          <div className="hero-copy">
            <p className="eyebrow">
              {content.fields["text_1"]}
              <i />
            </p>
            <div className="signal">
              <span />
              {content.fields["text_2"]}
            </div>
            <h1>
              {content.fields["text_3"]}
              <br />
              {content.fields["text_4"]}
              <em>{content.fields["text_5"]}</em>
              <br />
              {content.fields["text_6"]}
            </h1>
            <p className="hero-text">{content.fields["text_7"]}</p>
            <div className="hero-actions">
              <a className="button" href={content.fields["link_8"]}>
                {content.fields["text_9"]}
                <b>↗</b>
              </a>
              <a className="text-link" href={content.fields["link_10"]}>
                {content.fields["text_11"]}
                <span>↓</span>
              </a>
            </div>
            <div className="proof">
              <div>
                <strong>{content.fields["text_12"]}</strong>
                <span>{content.fields["text_13"]}</span>
              </div>
              <div>
                <strong>{content.fields["text_14"]}</strong>
                <span>{content.fields["text_15"]}</span>
              </div>
              <div>
                <strong>{content.fields["text_16"]}</strong>
                <span>{content.fields["text_17"]}</span>
              </div>
            </div>
          </div>
          <div className="hero-art" aria-label="3D software platform visual">
            <div className="tech-grid" />
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <img
              src={content.fields["image_18"]}
              alt={content.fields["text_19"]}
            />
            <div className="floating-card card-one">
              <span>{content.fields["text_20"]}</span>
              <strong>{content.fields["text_21"]}</strong>
              <i>✦</i>
            </div>
            <div className="floating-card card-two">
              <span>{content.fields["text_22"]}</span>
              <strong>{content.fields["text_23"]}</strong>
              <i>●</i>
            </div>
            <div className="axis">
              <span>{content.fields["text_24"]}</span>
              <i />
              <span>{content.fields["text_25"]}</span>
            </div>
          </div>
        </section>
      );
    case "ticker":
      return (
        <section className={"ticker" + tone} aria-label="Service highlights">
          <div>
            {content.fields["text_1"]}
            <b>✦</b>
            {content.fields["text_2"]}
            <b>✦</b>
            {content.fields["text_3"]}
            <b>✦</b>
            {content.fields["text_4"]}
            <b>✦</b>
            {content.fields["text_5"]}
            <b>✦</b>
          </div>
        </section>
      );
    case "trust":
      return (
        <section className={"trust-bar" + tone}>
          <p>{content.fields["text_1"]}</p>
          <div>
            <span>{content.fields["text_2"]}</span>
            <span>{content.fields["text_3"]}</span>
            <span>{content.fields["text_4"]}</span>
            <span>{content.fields["text_5"]}</span>
            <span>{content.fields["text_6"]}</span>
          </div>
        </section>
      );
    case "about":
      return (
        <section className={"intro section" + tone} id="about">
          <p className="eyebrow">
            {content.fields["text_1"]}
            <i />
          </p>
          <div className="split">
            <h2>
              {content.fields["text_2"]}
              <em>{content.fields["text_3"]}</em>
            </h2>
            <div>
              <p>{content.fields["text_4"]}</p>
              <a className="text-link" href={content.fields["link_5"]}>
                {content.fields["text_6"]}
                <span>↗</span>
              </a>
            </div>
          </div>
          <div className="system-pills">
            <span>{content.fields["text_7"]}</span>
            <span>{content.fields["text_8"]}</span>
            <span>{content.fields["text_9"]}</span>
            <span>{content.fields["text_10"]}</span>
            <span>{content.fields["text_11"]}</span>
          </div>
        </section>
      );
    case "services":
      return (
        <section className={"services section" + tone} id="services">
          <div className="section-head">
            <div>
              <p className="eyebrow">
                {content.fields["text_1"]}
                <i />
              </p>
              <h2>
                {content.fields["text_2"]}
                <br />
                {content.fields["text_3"]}
              </h2>
            </div>
            <p>{content.fields["text_4"]}</p>
          </div>
          <div className="service-grid">
            <article className="service-card">
              <span>{content.fields["text_5"]}</span>
              <div className="service-icon">⌘</div>
              <h3>{content.fields["text_6"]}</h3>
              <p>{content.fields["text_7"]}</p>
              <a
                href={content.fields["link_8"]}
                aria-label="Learn about Software engineering"
              >
                {content.fields["text_9"]}
                <b>↗</b>
              </a>
            </article>
            <article className="service-card">
              <span>{content.fields["text_10"]}</span>
              <div className="service-icon">↗</div>
              <h3>{content.fields["text_11"]}</h3>
              <p>{content.fields["text_12"]}</p>
              <a
                href={content.fields["link_13"]}
                aria-label="Learn about Digital marketing"
              >
                {content.fields["text_14"]}
                <b>↗</b>
              </a>
            </article>
            <article className="service-card">
              <span>{content.fields["text_15"]}</span>
              <div className="service-icon">✦</div>
              <h3>{content.fields["text_16"]}</h3>
              <p>{content.fields["text_17"]}</p>
              <a
                href={content.fields["link_18"]}
                aria-label="Learn about AI &amp; automation"
              >
                {content.fields["text_19"]}
                <b>↗</b>
              </a>
            </article>
            <article className="service-card">
              <span>{content.fields["text_20"]}</span>
              <div className="service-icon">◈</div>
              <h3>{content.fields["text_21"]}</h3>
              <p>{content.fields["text_22"]}</p>
              <a
                href={content.fields["link_23"]}
                aria-label="Learn about Secure experience design"
              >
                {content.fields["text_24"]}
                <b>↗</b>
              </a>
            </article>
          </div>
        </section>
      );
    case "capability":
      return (
        <section className={"capability" + tone} id="industries">
          <div className="capability-copy">
            <p className="eyebrow">
              {content.fields["text_1"]}
              <i />
            </p>
            <h2>
              {content.fields["text_2"]}
              <br />
              <em>{content.fields["text_3"]}</em>
            </h2>
            <p>{content.fields["text_4"]}</p>
            <a className="button button-light" href={content.fields["link_5"]}>
              {content.fields["text_6"]}
              <b>↗</b>
            </a>
          </div>
          <div className="capability-list">
            <div>
              <span>{content.fields["text_7"]}</span>
              <h3>{content.fields["text_8"]}</h3>
              <p>{content.fields["text_9"]}</p>
            </div>
            <div>
              <span>{content.fields["text_10"]}</span>
              <h3>{content.fields["text_11"]}</h3>
              <p>{content.fields["text_12"]}</p>
            </div>
            <div>
              <span>{content.fields["text_13"]}</span>
              <h3>{content.fields["text_14"]}</h3>
              <p>{content.fields["text_15"]}</p>
            </div>
          </div>
        </section>
      );
    case "technology":
      return (
        <section className={"technology section" + tone}>
          <div className="technology-title">
            <p className="eyebrow">
              {content.fields["text_1"]}
              <i />
            </p>
            <h2>
              {content.fields["text_2"]}
              <br />
              {content.fields["text_3"]}
              <em>{content.fields["text_4"]}</em>
            </h2>
            <p>{content.fields["text_5"]}</p>
          </div>
          <div className="stack-groups">
            <article>
              <div className="stack-heading">
                <span>{content.fields["text_6"]}</span>
                <h3>{content.fields["text_7"]}</h3>
                <p>{content.fields["text_8"]}</p>
              </div>
              <div className="tech-badges">
                <b className="html">
                  {content.fields["text_9"]}
                  <span>{content.fields["text_10"]}</span>
                </b>
                <b className="css">
                  {content.fields["text_11"]}
                  <span>{content.fields["text_12"]}</span>
                </b>
                <b className="js">{content.fields["text_13"]}</b>
                <b className="react">
                  ⚛<small>{content.fields["text_14"]}</small>
                </b>
                <b className="next">
                  {content.fields["text_15"]}
                  <small>{content.fields["text_16"]}</small>
                </b>
              </div>
            </article>
            <article>
              <div className="stack-heading">
                <span>{content.fields["text_17"]}</span>
                <h3>{content.fields["text_18"]}</h3>
                <p>{content.fields["text_19"]}</p>
              </div>
              <div className="tech-badges">
                <b className="node">
                  ⬡<small>{content.fields["text_20"]}</small>
                </b>
                <b className="python">
                  {content.fields["text_21"]}
                  <small>{content.fields["text_22"]}</small>
                </b>
                <b className="java">
                  {content.fields["text_23"]}
                  <small>{content.fields["text_24"]}</small>
                </b>
                <b className="azure">
                  ◆<small>{content.fields["text_25"]}</small>
                </b>
                <b className="aws">{content.fields["text_26"]}</b>
              </div>
            </article>
            <article>
              <div className="stack-heading">
                <span>{content.fields["text_27"]}</span>
                <h3>{content.fields["text_28"]}</h3>
                <p>{content.fields["text_29"]}</p>
              </div>
              <div className="tech-badges">
                <b className="postgres">
                  ▣<small>{content.fields["text_30"]}</small>
                </b>
                <b className="mongo">
                  ◒<small>{content.fields["text_31"]}</small>
                </b>
                <b className="flutter">
                  {content.fields["text_32"]}
                  <small>{content.fields["text_33"]}</small>
                </b>
                <b className="ai">
                  ✦<small>{content.fields["text_34"]}</small>
                </b>
                <b className="api">
                  &lt;/&gt;<small>{content.fields["text_35"]}</small>
                </b>
              </div>
            </article>
          </div>
        </section>
      );
    case "features":
      return (
        <section className={"outcomes section" + tone} id="work">
          <p className="eyebrow">
            {content.fields["text_1"]}
            <i />
          </p>
          <div className="split">
            <h2>{content.fields["text_2"]}</h2>
            <p>{content.fields["text_3"]}</p>
          </div>
          <div className="outcome-grid">
            <div>
              <strong>{content.fields["text_4"]}</strong>
              <span>{content.fields["text_5"]}</span>
            </div>
            <div>
              <strong>{content.fields["text_6"]}</strong>
              <span>{content.fields["text_7"]}</span>
            </div>
            <div>
              <strong>{content.fields["text_8"]}</strong>
              <span>{content.fields["text_9"]}</span>
            </div>
          </div>
        </section>
      );
    case "industries":
      return (
        <section className={"industries-showcase" + tone}>
          <div>
            <p className="eyebrow">
              {content.fields["text_1"]}
              <i />
            </p>
            <h2>
              {content.fields["text_2"]}
              <br />
              {content.fields["text_3"]}
              <em>{content.fields["text_4"]}</em>
            </h2>
          </div>
          <div className="industry-tags">
            <span>{content.fields["text_5"]}</span>
            <span>{content.fields["text_6"]}</span>
            <span>{content.fields["text_7"]}</span>
            <span>{content.fields["text_8"]}</span>
            <span>{content.fields["text_9"]}</span>
            <span>{content.fields["text_10"]}</span>
            <span>{content.fields["text_11"]}</span>
            <span>{content.fields["text_12"]}</span>
            <span>{content.fields["text_13"]}</span>
          </div>
        </section>
      );
    case "results":
      return (
        <section className={"results section" + tone}>
          <div className="results-intro">
            <p className="eyebrow">
              {content.fields["text_1"]}
              <i />
            </p>
            <h2>
              {content.fields["text_2"]}
              <br />
              <em>{content.fields["text_3"]}</em>
            </h2>
            <p>{content.fields["text_4"]}</p>
          </div>
          <div className="result-cards">
            <article>
              <b>{content.fields["text_5"]}</b>
              <strong>{content.fields["text_6"]}</strong>
              <p>{content.fields["text_7"]}</p>
            </article>
            <article>
              <b>{content.fields["text_8"]}</b>
              <strong>{content.fields["text_9"]}</strong>
              <p>{content.fields["text_10"]}</p>
            </article>
            <article>
              <b>{content.fields["text_11"]}</b>
              <strong>{content.fields["text_12"]}</strong>
              <p>{content.fields["text_13"]}</p>
            </article>
          </div>
        </section>
      );
    case "process":
      return (
        <section className={"process" + tone}>
          <div className="process-label">
            <span>{content.fields["text_1"]}</span>
            <b>{content.fields["text_2"]}</b>
          </div>
          <div className="process-stages">
            <article>
              <span>{content.fields["text_3"]}</span>
              <h3>{content.fields["text_4"]}</h3>
              <p>{content.fields["text_5"]}</p>
            </article>
            <article>
              <span>{content.fields["text_6"]}</span>
              <h3>{content.fields["text_7"]}</h3>
              <p>{content.fields["text_8"]}</p>
            </article>
            <article>
              <span>{content.fields["text_9"]}</span>
              <h3>{content.fields["text_10"]}</h3>
              <p>{content.fields["text_11"]}</p>
            </article>
          </div>
        </section>
      );
    case "updates":
      return (
        <section className={"updates section" + tone} id="updates">
          <div className="section-head">
            <div>
              <p className="eyebrow">
                {content.fields["text_1"]}
                <i />
              </p>
              <h2>
                {content.fields["text_2"]}
                <br />
                <em>{content.fields["text_3"]}</em>
              </h2>
            </div>
            <a className="button" href={content.fields["link_4"]}>
              {content.fields["text_5"]}
              <b>↗</b>
            </a>
          </div>
          <div className="update-grid">
            <article>
              <span>{content.fields["text_6"]}</span>
              <h3>{content.fields["text_7"]}</h3>
              <a href={content.fields["link_8"]}>{content.fields["text_9"]}</a>
            </article>
            <article>
              <span>{content.fields["text_10"]}</span>
              <h3>{content.fields["text_11"]}</h3>
              <a href={content.fields["link_12"]}>
                {content.fields["text_13"]}
              </a>
            </article>
            <article>
              <span>{content.fields["text_14"]}</span>
              <h3>{content.fields["text_15"]}</h3>
              <a href={content.fields["link_16"]}>
                {content.fields["text_17"]}
              </a>
            </article>
          </div>
        </section>
      );
    case "showcase":
      return (
        <section className={"showcase" + tone}>
          <div className="showcase-heading">
            <p className="eyebrow">
              {content.fields["text_1"]}
              <i />
            </p>
            <h2>
              {content.fields["text_2"]}
              <br />
              <em>{content.fields["text_3"]}</em>
            </h2>
            <p>{content.fields["text_4"]}</p>
            <a className="button" href={content.fields["link_5"]}>
              {content.fields["text_6"]}
              <b>↗</b>
            </a>
          </div>
          <div className="site-previews" aria-label="Example website previews">
            <article className="browser-preview retail">
              <div className="browser-bar">
                <i />
                <i />
                <i />
                <span>{content.fields["text_7"]}</span>
              </div>
              <div className="preview-hero">
                <b>
                  {content.fields["text_8"]}
                  <br />
                  {content.fields["text_9"]}
                </b>
                <span>{content.fields["text_10"]}</span>
                <div className="preview-shape" />
              </div>
              <div className="preview-bottom">
                <span>{content.fields["text_11"]}</span>
                <b>↗</b>
              </div>
            </article>
            <article className="browser-preview data">
              <div className="browser-bar">
                <i />
                <i />
                <i />
                <span>{content.fields["text_12"]}</span>
              </div>
              <div className="data-panel">
                <div>
                  <span>{content.fields["text_13"]}</span>
                  <b>{content.fields["text_14"]}</b>
                </div>
                <div className="chart">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <div className="data-grid">
                  <span>
                    {content.fields["text_15"]}
                    <b>{content.fields["text_16"]}</b>
                  </span>
                  <span>
                    {content.fields["text_17"]}
                    <b>{content.fields["text_18"]}</b>
                  </span>
                </div>
              </div>
            </article>
            <article className="browser-preview studio">
              <div className="browser-bar">
                <i />
                <i />
                <i />
                <span>{content.fields["text_19"]}</span>
              </div>
              <div className="studio-panel">
                <span>{content.fields["text_20"]}</span>
                <b>
                  {content.fields["text_21"]}
                  <br />
                  <em>{content.fields["text_22"]}</em>
                  {content.fields["text_23"]}
                </b>
                <div className="studio-orb" />
              </div>
            </article>
          </div>
        </section>
      );
    case "floating-work":
      return (
        <section
          className={"floating-work" + tone}
          aria-label="Selected digital experiences"
        >
          <div className="screen-field" aria-hidden="true">
            <i className="screen-card screen-one" />
            <i className="screen-card screen-two" />
            <i className="screen-card screen-three" />
            <i className="screen-card screen-four" />
            <i className="screen-card screen-five" />
            <i className="screen-card screen-six" />
            <i className="screen-card screen-seven" />
            <i className="screen-card screen-eight" />
            <i className="screen-card screen-nine" />
            <i className="screen-card screen-ten" />
            <i className="screen-card screen-eleven" />
            <i className="screen-card screen-twelve" />
          </div>
          <div className="floating-work-copy">
            <p>{content.fields["text_1"]}</p>
            <h2>{content.fields["text_2"]}</h2>
            <span>{content.fields["text_3"]}</span>
          </div>
        </section>
      );
    case "contact":
      return (
        <section className={"contact" + tone} id="contact">
          <div>
            <p className="eyebrow">
              {content.fields["text_1"]}
              <i />
            </p>
            <h2>
              {content.fields["text_2"]}
              <br />
              {content.fields["text_3"]}
            </h2>
            <p>{content.fields["text_4"]}</p>
          </div>
          <InquiryForm
            submit={submit}
            formState={formState}
            labels={{
              name: content.fields.text_5,
              email: content.fields.text_6,
              message: content.fields.text_7,
              button: content.fields.text_8,
            }}
          />
        </section>
      );
    case "site-header":
      return (
        <>
          <div className="notice">
            <span className="pulse" />
            {content.fields["text_1"]}
            <span>{content.fields["text_2"]}</span>
          </div>
          <header className="public-site-header">
            <a
              className="brand"
              href={content.fields["link_3"]}
              aria-label="On Zen On home"
            >
              <img
                src={content.fields["image_4"]}
                alt={content.fields["text_5"]}
              />
            </a>
            <button
              className="mobile-toggle"
              onClick={() => setMenu(!menu)}
              aria-label="Toggle navigation"
            >
              {menu ? "×" : "☰"}
            </button>
            <nav className={menu ? "open" : ""}>
              {menuLinks("header", menus)}
            </nav>
            <a
              className="button button-small desktop-cta"
              href={content.fields["link_6"]}
            >
              {content.fields["text_7"]}
              <b>↗</b>
            </a>
          </header>
        </>
      );
    case "site-footer":
      return (
        <footer>
          <div className="footer-brand">
            <img
              src={content.fields["image_1"]}
              alt={content.fields["text_2"]}
            />
            <p>{content.fields["text_3"]}</p>
            <p className="footer-tagline">{content.fields["text_4"]}</p>
          </div>
          <div>
            <strong>{content.fields["text_5"]}</strong>
            {menuLinks("footer", menus)}
          </div>
          <div>
            <strong>{content.fields["text_6"]}</strong>
            {menuLinks("services", menus)}
          </div>
          <div className="reach-us">
            <strong>{content.fields["text_7"]}</strong>
            <p>
              <b>{content.fields["text_8"]}</b>
              <br />
              {content.fields["text_9"]}
              <br />
              {content.fields["text_10"]}
              <br />
              {content.fields["text_11"]}
            </p>
            <p>
              <b>{content.fields["text_12"]}</b>
              <br />
              {content.fields["text_13"]}
              <br />
              {content.fields["text_14"]}
              <br />
              {content.fields["text_15"]}
            </p>
            <a href={content.fields["link_16"]}>{content.fields["text_17"]}</a>
            <a href={content.fields["link_18"]}>{content.fields["text_19"]}</a>
          </div>
          <small>
            © {new Date().getFullYear()}
            {content.fields["text_20"]}
          </small>
        </footer>
      );
    default:
      return null;
  }
}

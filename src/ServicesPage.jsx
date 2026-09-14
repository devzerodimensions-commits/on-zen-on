import React from "react";
import { serviceForTitle } from "../shared/services.js";
import "./services-page.css";

function Icon({ name = "spark" }) {
  const paths = {
    code: "m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16",
    server: "M4 3h16v7H4zM4 14h16v7H4zM7 6h.01M7 17h.01M11 6h6M11 17h6",
    phone: "M7 2h10v20H7zM10 5h4M11 19h2",
    spark: "m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z",
    growth: "M3 20h18M5 16l5-6 4 3 6-9m-6 0h6v6",
    design: "m4 16 12-12 4 4L8 20H4v-4ZM13 7l4 4M3 4h5M5.5 1.5v5",
    cloud:
      "M7 18a5 5 0 1 1 0-10 6 6 0 0 1 11 1 4.5 4.5 0 0 1 0 9M12 22V12m-3 3 3-3 3 3",
    shield: "m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4Zm-4 10 3 3 5-6",
  };
  return (
    <svg
      aria-hidden="true"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name] || paths.spark} />
    </svg>
  );
}

export function ServicesPage({ page, submit, formState, renderFallback }) {
  const overview = page.path === "/services";
  return (
    <div className="oz-services">
      {page.blocks.map((b) => {
        if (b.type === "template") return renderFallback(b);
        if (b.type === "hero")
          return (
            <section
              className="oz-service-hero"
              id={b.anchor || undefined}
              key={b.id}
            >
              <div className="oz-service-wrap oz-hero-grid">
                <div className="oz-hero-copy">
                  <nav aria-label="Breadcrumb" className="oz-breadcrumb">
                    <a href="/">Home</a>
                    <span>/</span>
                    {overview ? (
                      <span>Services</span>
                    ) : (
                      <>
                        <a href="/services">Services</a>
                        <span>/</span>
                        <span>{page.title}</span>
                      </>
                    )}
                  </nav>
                  <p className="oz-kicker">{b.eyebrow}</p>
                  <h1>{b.heading}</h1>
                  <p className="oz-intro">{b.body}</p>
                  <div className="oz-hero-actions">
                    {b.buttonLabel && b.href && (
                      <a className="oz-action" href={b.href}>
                        {b.buttonLabel}
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}
                    {overview && (
                      <a className="oz-text-link" href="#core-services">
                        Explore our expertise ↓
                      </a>
                    )}
                  </div>
                </div>
                {b.image && (
                  <div className="oz-hero-art">
                    <span className="oz-art-orbit" />
                    <img src={b.image} alt={b.alt} fetchPriority="high" />
                    <div className="oz-art-label">
                      <Icon name="spark" />
                      <span>
                        Thoughtfully designed.
                        <br />
                        <strong>Built for what’s next.</strong>
                      </span>
                    </div>
                  </div>
                )}
              </div>
              {b.items.length > 0 && (
                <div className="oz-service-wrap oz-hero-benefits">
                  {b.items.map((item, i) => (
                    <div key={i}>
                      <span className="oz-small-number">0{i + 1}</span>
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        return (
          <section
            key={b.id}
            id={b.anchor || undefined}
            className={`oz-service-section oz-kind-${b.type} ${b.type === "about" && b.image ? "oz-image-story" : ""}`}
          >
            <div className="oz-service-wrap">
              <div className="oz-section-heading">
                <p className="oz-kicker">{b.eyebrow}</p>
                <h2>{b.heading}</h2>
                {b.body && <p className="oz-section-description">{b.body}</p>}
              </div>
              {b.image && (
                <img
                  className="oz-section-image"
                  src={b.image}
                  alt={b.alt}
                  loading="lazy"
                />
              )}
              {b.type === "faq" ? (
                <div className="oz-questions">
                  {b.items.map((item, i) => (
                    <details key={i}>
                      <summary>
                        {item.title}
                        <span aria-hidden="true">+</span>
                      </summary>
                      <p>{item.text}</p>
                    </details>
                  ))}
                </div>
              ) : (
                b.items.length > 0 && (
                  <div className="oz-service-grid">
                    {b.items.map((item, i) => {
                      const service =
                        b.type === "services"
                          ? serviceForTitle(item.title)
                          : null;
                      const href =
                        service && (!item.href || item.href === "/#contact")
                          ? `/services/${service.slug}`
                          : item.href;
                      return (
                        <article key={i} className="oz-service-card">
                          {item.image && (
                            <div className="oz-card-visual">
                              <img
                                src={item.image}
                                alt={item.alt}
                                loading="lazy"
                              />
                            </div>
                          )}
                          <div className="oz-card-content">
                            <div className="oz-card-top">
                              <span className="oz-service-icon">
                                <Icon
                                  name={
                                    item.icon ||
                                    service?.icon ||
                                    (b.type === "technology" ? "code" : "spark")
                                  }
                                />
                              </span>
                              <span className="oz-card-number">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                            </div>
                            <h3>
                              {item.title.replace(/^[^a-zA-Z0-9]+\s*/, "")}
                            </h3>
                            <p>{item.text}</p>
                            {href && (
                              <a className="oz-card-link" href={href}>
                                Explore service{" "}
                                <span aria-hidden="true">↗</span>
                              </a>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )
              )}
              {b.buttonLabel && b.href && (
                <a className="oz-action" href={b.href}>
                  {b.buttonLabel}
                  <span aria-hidden="true">↗</span>
                </a>
              )}
              {b.type === "contact" && (
                <form className="oz-inquiry" onSubmit={submit}>
                  <div className="oz-form-row">
                    <label>
                      Your name
                      <input
                        name="name"
                        autoComplete="name"
                        required
                        maxLength={150}
                        placeholder="Full name"
                      />
                    </label>
                    <label>
                      Email address
                      <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength={254}
                        placeholder="you@company.com"
                      />
                    </label>
                  </div>
                  <label>
                    What do you have in mind?
                    <textarea
                      name="message"
                      required
                      maxLength={10000}
                      rows={4}
                      placeholder="Share your goals and the service you’re interested in…"
                    />
                  </label>
                  <button
                    className="oz-action"
                    type="submit"
                    disabled={formState === "Sending…"}
                  >
                    {formState === "Sending…"
                      ? "Sending…"
                      : "Send your inquiry"}
                    <span aria-hidden="true">↗</span>
                  </button>
                  <p role="status">{formState}</p>
                </form>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

import { ServiceIcon as Icon } from "./ServiceIcon.jsx";
import { sectionClasses } from "../shared/section-style.js";
import { InquiryForm } from "./InquiryForm.jsx";
import React from "react";
import { serviceForTitle } from "../shared/services.js";
import "./services-page.css";

export function ServicesPage({ page, submit, formState, renderFallback }) {
  const overview = page.path === "/services";
  return (
    <div className="oz-services">
      {page.blocks.map((b) => {
        if (b.type === "template") return renderFallback(b);
        if (b.type === "hero")
          return (
            <section
              className={"oz-service-hero" + sectionClasses(b)}
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
                  <p className="oz-kicker">
                    <span className="section-symbol" aria-hidden="true">
                      <Icon
                        name={
                          b.type === "process"
                            ? "growth"
                            : b.type === "technology"
                              ? "code"
                              : b.type === "contact"
                                ? "phone"
                                : "spark"
                        }
                      />
                    </span>
                    {b.eyebrow}
                  </p>
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
                    {(b.imageCaption !== "" || b.imageCaptionStrong !== "") && (
                      <div className="oz-art-label">
                        <Icon name="spark" />
                        <span>
                          {b.imageCaption ?? "Thoughtfully designed."}
                          <br />
                          <strong>
                            {b.imageCaptionStrong ?? "Built for what’s next."}
                          </strong>
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {b.items.length > 0 && (
                <div className="oz-service-wrap oz-hero-benefits">
                  {b.items.map((item, i) => (
                    <div key={i}>
                      <span className="oz-small-number">0{i + 1}</span>
                      <div>
                        {item.image && (
                          <img
                            className="oz-detail-item-image"
                            src={item.image}
                            alt={item.alt}
                            loading="lazy"
                          />
                        )}
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
            className={`oz-service-section oz-kind-${b.type} ${b.type === "about" && b.image ? "oz-image-story" : ""}${sectionClasses(b)}`}
          >
            <div className="oz-service-wrap">
              <div className="oz-section-heading">
                <p className="oz-kicker">
                  <span className="section-symbol" aria-hidden="true">
                    <Icon
                      name={
                        b.type === "process"
                          ? "growth"
                          : b.type === "technology"
                            ? "code"
                            : b.type === "contact"
                              ? "phone"
                              : "spark"
                      }
                    />
                  </span>
                  {b.eyebrow}
                </p>
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
              {b.anchor === "included-services" && (
                <nav
                  className="oz-offering-index"
                  aria-label="Choose a service"
                >
                  {b.items.map((item, i) => (
                    <a key={i} href={`#offering-${i + 1}`}>
                      {item.title}
                      <span aria-hidden="true">↘</span>
                    </a>
                  ))}
                </nav>
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
                      {item.image && (
                        <img
                          className="oz-detail-item-image"
                          src={item.image}
                          alt={item.alt}
                          loading="lazy"
                        />
                      )}
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
                        <article
                          key={i}
                          className="oz-service-card"
                          id={
                            b.anchor === "included-services"
                              ? `offering-${i + 1}`
                              : undefined
                          }
                        >
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
                            {item.text
                              .split(/\n\n+/)
                              .map((paragraph, index) => (
                                <p key={index}>
                                  {paragraph.startsWith("Includes: ") ? (
                                    <>
                                      <strong>What’s included</strong>
                                      <br />
                                      {paragraph.slice(10)}
                                    </>
                                  ) : (
                                    paragraph
                                  )}
                                </p>
                              ))}
                            {href && (
                              <a className="oz-card-link" href={href}>
                                {b.cardLinkLabel ??
                                  (b.anchor === "included-services"
                                    ? "Discuss this service"
                                    : "Explore service")}{" "}
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
                <InquiryForm submit={submit} formState={formState} />
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

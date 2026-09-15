import React from "react";
import "./blog.css";
export function BlogCards({ block: b }) {
  return (
    <section className="blog-listing" id={b.anchor || undefined}>
      <div className="blog-heading">
        <div>
          <p className="blog-eyebrow">{b.eyebrow}</p>
          <h2>{b.heading}</h2>
          <p>{b.body}</p>
        </div>
        {b.href && (
          <a className="blog-button" href={b.href}>
            {b.buttonLabel} ↗
          </a>
        )}
      </div>
      <div className="blog-grid">
        {b.items.map((i, n) => (
          <article className="blog-card" key={n}>
            {i.image && (
              <a href={i.href} tabIndex={-1} aria-hidden="true">
                <img loading="lazy" src={i.image} alt={i.alt} />
              </a>
            )}
            <div>
              <h3>
                <a href={i.href}>{i.title}</a>
              </h3>
              <p>{i.text}</p>
              <a className="blog-read" href={i.href}>
                Read article <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
export function BlogPage({ page }) {
  const article = page.path.startsWith("/blog/");
  return (
    <div className="blog-page">
      <nav className="blog-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span>/</span>
        <a href="/tech-updates">Tech Updates</a>
        {article && (
          <>
            <span>/</span>
            <span>Article</span>
          </>
        )}
      </nav>
      {page.blocks.map((b) =>
        b.type === "updates" ? (
          <BlogCards key={b.id} block={b} />
        ) : b.type === "hero" ? (
          <section className="blog-hero" key={b.id}>
            <p className="blog-eyebrow">{b.eyebrow}</p>
            <h1>{b.heading}</h1>
            <p className="blog-deck">{b.body}</p>
            {b.image && <img src={b.image} alt={b.alt} />}
          </section>
        ) : (
          <section
            id={b.anchor || undefined}
            key={b.id}
            className={b.type === "cta" ? "blog-cta" : "blog-prose"}
          >
            <h2>{b.heading}</h2>
            {b.body
              .split(/\n\n/)
              .filter(Boolean)
              .map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            {b.image && <img src={b.image} alt={b.alt} loading="lazy" />}
            {b.items?.map((it, i) => (
              <div key={i}>
                <h3>{it.title}</h3>
                <p>{it.text}</p>
                {it.image && <img src={it.image} alt={it.alt} />}{" "}
                {it.href && <a href={it.href}>Learn more ↗</a>}
              </div>
            ))}
            {b.href && (
              <a className="blog-read" href={b.href}>
                {b.buttonLabel} ↗
              </a>
            )}
          </section>
        ),
      )}
    </div>
  );
}

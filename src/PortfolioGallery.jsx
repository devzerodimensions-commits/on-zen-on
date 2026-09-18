import React, { useRef, useState } from "react";
import "./portfolio.css";
const category = (item) =>
  item.icon === "phone"
    ? "Applications"
    : item.icon === "server"
      ? "Software"
      : "Websites";
export function PortfolioGallery({ items }) {
  const [filter, setFilter] = useState("All projects");
  const [selected, select] = useState(null);
  const dialog = useRef(null);
  const visible =
    filter === "All projects"
      ? items
      : items.filter((i) => category(i) === filter);
  return (
    <div className="portfolio-showcase">
      <div className="portfolio-filters" aria-label="Filter portfolio">
        {["All projects", "Websites", "Applications", "Software"].map((f) => (
          <button
            type="button"
            key={f}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f}{" "}
            <span>
              {f === "All projects"
                ? items.length
                : items.filter((i) => category(i) === f).length}
            </span>
          </button>
        ))}
      </div>
      <p className="portfolio-disclosure">
        Original design concepts. These previews demonstrate possible
        interfaces; they are not client endorsements or live products.
      </p>
      <div className="portfolio-grid">
        {visible.map((item, i) => (
          <article className="portfolio-project" key={item.title + i}>
            <button
              type="button"
              className="portfolio-preview"
              aria-label={`Preview ${item.title}`}
              onClick={() => {
                select(item);
                dialog.current.showModal();
              }}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.alt || item.title}
                  loading="lazy"
                  width="1200"
                  height="820"
                />
              )}
              <span className="portfolio-open">View design ↗</span>
            </button>
            <div className="portfolio-copy">
              <p className="portfolio-category">{category(item)} · Concept</p>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="portfolio-dialog"
        aria-labelledby="portfolio-preview-title"
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current.close();
        }}
      >
        <button
          className="portfolio-close"
          type="button"
          onClick={() => dialog.current.close()}
          aria-label="Close preview"
        >
          Close ×
        </button>
        {selected && (
          <>
            <h2 id="portfolio-preview-title">{selected.title}</h2>
            <p>Design concept · {category(selected)}</p>
            <img src={selected.image} alt={selected.alt || selected.title} />
            <p>{selected.text}</p>
            <a className="button" href={selected.href || "/contact"}>
              Discuss a similar project ↗
            </a>
          </>
        )}
      </dialog>
    </div>
  );
}

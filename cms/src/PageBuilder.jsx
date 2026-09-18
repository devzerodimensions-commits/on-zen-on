import React, { useEffect, useRef, useState } from "react";
import { sectionNames } from "./PageStarter.jsx";
import { templateManifest } from "../../shared/templates.js";

const devices = {
  desktop: { label: "Computer", width: "100%", icon: "🖥" },
  tablet: { label: "Tablet", width: "820px", icon: "▭" },
  mobile: { label: "Mobile", width: "390px", icon: "▯" },
};

const blockName = (block) =>
  block.heading ||
  templateManifest[block.template]?.label ||
  (block.type === "shared" ? "Shared section" : "Untitled section");

const blockKind = (block) =>
  sectionNames[block.type] ||
  (block.type === "template"
    ? "Branded design"
    : block.type === "shared"
      ? "Shared section"
      : "Section");

/* A visual page builder: the website on the right, the section being edited on
   the left. Clicking a section on the website opens it, and every keystroke
   shows up straight away. */
export function PageBuilder({
  documentId,
  draft,
  onChange,
  onAddSection,
  children,
  selected,
  onSelect,
  busy,
  dirty,
  onSave,
  onPublish,
  canPublish,
}) {
  const [device, setDevice] = useState("desktop");
  const [dragging, setDragging] = useState(null);
  const [over, setOver] = useState(null);
  const frame = useRef(null);
  const [ready, setReady] = useState(0);

  const blocks = draft.blocks;
  const index = blocks.findIndex((b) => b.id === selected);

  /* Send the draft into the preview as it is edited. */
  useEffect(() => {
    const target = frame.current?.contentWindow;
    if (!target) return;
    const id = setTimeout(() => {
      target.postMessage(
        { type: "oz-page-preview", page: draft },
        window.location.origin,
      );
      target.postMessage(
        { type: "oz-builder-select", id: selected || "" },
        window.location.origin,
      );
    }, 120);
    return () => clearTimeout(id);
  }, [draft, selected, ready]);

  useEffect(() => {
    const listen = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "oz-preview-ready") setReady((n) => n + 1);
      if (event.data?.type === "oz-block-click") onSelect(event.data.id);
    };
    window.addEventListener("message", listen);
    return () => window.removeEventListener("message", listen);
  }, [onSelect]);

  const move = (from, to) => {
    if (to < 0 || to >= blocks.length || from === to) return;
    const next = [...blocks];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };
  const patch = (i, changes) =>
    onChange(blocks.map((b, j) => (i === j ? { ...b, ...changes } : b)));

  return (
    <div className="builder">
      <div className="builder-bar">
        <strong>Page builder</strong>
        <small>
          Click any part of the website on the right to edit it. Drag the
          sections on the left to change their order.
        </small>
        <div className="spacer" />
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
        <button type="button" disabled={busy || !dirty} onClick={onSave}>
          {dirty ? "Save changes" : "Saved"}
        </button>
        <button
          type="button"
          className="primary"
          disabled={busy || !canPublish}
          title={
            canPublish
              ? "Put this page on the website"
              : "Only administrators can publish"
          }
          onClick={onPublish}
        >
          Publish page ↗
        </button>
      </div>

      <div className="builder-body">
        <div className="builder-panel">
          <div className="builder-list">
            <div className="row">
              <h3>Sections on this page</h3>
              <button type="button" onClick={onAddSection}>
                + Add
              </button>
            </div>
            {blocks.map((block, i) => (
              <div
                key={block.id}
                draggable
                onDragStart={() => setDragging(i)}
                onDragEnd={() => {
                  setDragging(null);
                  setOver(null);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOver(i);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragging !== null) move(dragging, i);
                  setDragging(null);
                  setOver(null);
                }}
                className={[
                  "builder-item",
                  selected === block.id ? "chosen" : "",
                  block.hidden ? "is-hidden" : "",
                  over === i && dragging !== null && dragging !== i
                    ? "drop-here"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <button
                  type="button"
                  className="builder-item-main"
                  onClick={() => onSelect(block.id)}
                >
                  <span className="grip" aria-hidden="true">
                    ⠿
                  </span>
                  <span className="builder-item-text">
                    <strong>{blockName(block)}</strong>
                    <small>
                      {blockKind(block)}
                      {block.hidden ? " · hidden" : ""}
                    </small>
                  </span>
                </button>
                <span className="builder-item-tools">
                  <button
                    type="button"
                    title="Move up"
                    disabled={!i}
                    onClick={() => move(i, i - 1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    title="Move down"
                    disabled={i === blocks.length - 1}
                    onClick={() => move(i, i + 1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    title={
                      block.hidden
                        ? "Show on the website"
                        : "Hide from visitors"
                    }
                    onClick={() => patch(i, { hidden: !block.hidden })}
                  >
                    {block.hidden ? "◉" : "◌"}
                  </button>
                </span>
              </div>
            ))}
            {!blocks.length && (
              <p className="empty">
                This page has no sections yet. Choose <strong>+ Add</strong> to
                put the first one in place.
              </p>
            )}
          </div>

          <div className="builder-inspector">
            {index === -1 ? (
              <div className="builder-hint">
                <h3>Nothing selected</h3>
                <p>
                  Click a section on the website, or pick one from the list
                  above, and its settings appear here.
                </p>
              </div>
            ) : (
              <>
                <div className="row">
                  <h3>{blockName(blocks[index])}</h3>
                  <small>
                    Section {index + 1} of {blocks.length}
                  </small>
                </div>
                {children}
              </>
            )}
          </div>
        </div>

        <div className="builder-stage">
          <iframe
            ref={frame}
            title="Page being built"
            src={`/_preview/${documentId}`}
            style={{ width: devices[device].width }}
            onLoad={() => setReady((n) => n + 1)}
          />
        </div>
      </div>
    </div>
  );
}

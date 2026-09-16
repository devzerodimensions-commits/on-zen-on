import React, { useRef, useState } from "react";

/* The picture library: upload, search, rename and remove images without
   touching any code. */
export function MediaLibrary({ media, api, run, reload, canDelete, notify }) {
  const [search, setSearch] = useState("");
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState(null);
  const [altDraft, setAltDraft] = useState("");
  const [copied, setCopied] = useState("");
  const [dragging, setDragging] = useState(false);
  const input = useRef(null);

  const visible = media.filter((m) =>
    `${m.alt} ${m.original_name || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const upload = () =>
    run(async () => {
      if (!files.length) throw Error("Choose at least one picture first.");
      if (!description.trim())
        throw Error("Describe the picture so the website stays accessible.");
      for (const [index, file] of files.entries()) {
        const body = new FormData();
        body.append("file", file);
        body.append(
          "alt",
          files.length > 1
            ? `${description.trim()} (${index + 1})`
            : description.trim(),
        );
        await api("/media", "POST", body);
      }
      await reload();
      setFiles([]);
      setDescription("");
      if (input.current) input.current.value = "";
      notify(
        files.length > 1
          ? `${files.length} pictures uploaded. They are ready to use in any section.`
          : "Picture uploaded. It is ready to use in any section.",
      );
    });

  const copy = async (url) => {
    const full = `${window.location.origin}${url}`;
    try {
      await navigator.clipboard.writeText(full);
      setCopied(url);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      window.prompt("Copy this website address:", full);
    }
  };

  return (
    <>
      <div
        className={dragging ? "panel upload dropping" : "panel upload"}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const dropped = [...e.dataTransfer.files].filter((f) =>
            ["image/png", "image/jpeg", "image/webp"].includes(f.type),
          );
          if (dropped.length) setFiles(dropped);
        }}
      >
        <h2>Add pictures</h2>
        <p>
          Drag pictures here, or choose them below. PNG, JPEG or WebP, up to 8
          MB each. Every picture is made smaller and converted automatically so
          your website stays fast.
        </p>
        <div className="two">
          <label className="field">
            <span>Choose one or more pictures</span>
            <input
              ref={input}
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => setFiles([...e.target.files])}
            />
          </label>
          <label className="field">
            <span>Describe the picture</span>
            <input
              value={description}
              maxLength={230}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="For example: our team reviewing a website design"
            />
            <small>
              This text is read aloud to visitors who cannot see images, and
              helps Google understand the picture.
            </small>
          </label>
        </div>
        {files.length > 0 && (
          <p className="note">
            Ready to upload: {files.map((f) => f.name).join(", ")}
          </p>
        )}
        <button
          className="primary"
          type="button"
          disabled={!files.length || !description.trim()}
          onClick={upload}
        >
          Upload {files.length > 1 ? `${files.length} pictures` : "picture"} ↗
        </button>
      </div>

      <div className="row">
        <h2>
          Your pictures <small>{media.length}</small>
        </h2>
        <input
          className="media-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your pictures…"
          aria-label="Search your pictures"
        />
      </div>

      <div className="media-grid">
        {visible.map((m) => (
          <article key={m.id}>
            <img src={m.url} alt={m.alt} loading="lazy" />
            <div>
              {editing === m.id ? (
                <>
                  <input
                    autoFocus
                    value={altDraft}
                    maxLength={250}
                    onChange={(e) => setAltDraft(e.target.value)}
                    aria-label="Picture description"
                  />
                  <div className="media-actions">
                    <button
                      type="button"
                      className="primary"
                      disabled={!altDraft.trim()}
                      onClick={() =>
                        run(async () => {
                          await api(`/media/${m.id}`, "PATCH", {
                            alt: altDraft.trim(),
                          });
                          await reload();
                          setEditing(null);
                          notify("Picture description updated.");
                        })
                      }
                    >
                      Save
                    </button>
                    <button type="button" onClick={() => setEditing(null)}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <strong>{m.alt}</strong>
                  <small>
                    {m.width} × {m.height} · WebP
                  </small>
                  <div className="media-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(m.id);
                        setAltDraft(m.alt);
                      }}
                    >
                      Rename
                    </button>
                    <button type="button" onClick={() => copy(m.url)}>
                      {copied === m.url ? "Copied ✓" : "Copy link"}
                    </button>
                    {canDelete && (
                      <button
                        type="button"
                        className="danger"
                        onClick={() =>
                          run(async () => {
                            if (
                              !window.confirm(
                                `Delete "${m.alt}" for good? Pictures still used on a page cannot be deleted.`,
                              )
                            )
                              return;
                            await api(`/media/${m.id}`, "DELETE");
                            await reload();
                            notify("Picture deleted.");
                          })
                        }
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
      {!media.length && (
        <div className="empty">
          Your picture library is ready for its first image.
        </div>
      )}
      {media.length > 0 && !visible.length && (
        <div className="empty">
          No picture matches “{search}”. Try a different word.
        </div>
      )}
    </>
  );
}

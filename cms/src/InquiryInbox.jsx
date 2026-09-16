import React, { useEffect, useState } from "react";
import "./inbox.css";
const statuses = { new: "New", contacted: "Contacted", closed: "Closed" };
function Inquiry({ row, onSave }) {
  const [status, setStatus] = useState(row.status),
    [notes, setNotes] = useState(row.notes || ""),
    [busy, B] = useState(false),
    [feedback, F] = useState("");
  const dirty = status !== row.status || notes !== (row.notes || "");
  return (
    <details className="inbox-item">
      <summary>
        <span className="inbox-avatar" aria-hidden="true">
          {row.name.slice(0, 1).toUpperCase()}
        </span>
        <span className="inbox-person">
          <strong>{row.name}</strong>
          <span>{row.email}</span>
          <span className="inbox-preview">{row.message}</span>
        </span>
        <span className={"inbox-badge inbox-" + row.status}>
          {statuses[row.status]}
        </span>
        <time dateTime={new Date(row.created_at).toISOString()}>
          {new Date(row.created_at).toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </time>
        <span className="inbox-open">
          View details <span aria-hidden="true">⌄</span>
        </span>
      </summary>
      <div className="inbox-detail">
        <section>
          <div className="inbox-label">CUSTOMER MESSAGE</div>
          <p className="inbox-message">{row.message}</p>
          <dl>
            <dt>Email address</dt>
            <dd>
              <a href={"mailto:" + row.email}>{row.email}</a>
            </dd>
            <dt>Received</dt>
            <dd>{new Date(row.created_at).toLocaleString()}</dd>
            <dt>Inquiry number</dt>
            <dd>#{row.id}</dd>
          </dl>
          <a className="inbox-reply" href={"mailto:" + row.email}>
            Reply by email ↗
          </a>
          <p className="inbox-hint">
            Opens your email app. Update the status after you reply.
          </p>
        </section>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (busy) return;
            B(true);
            F("");
            try {
              await onSave(row.id, { status, notes });
              F("Changes saved.");
            } catch (err) {
              F(err.message || "Could not save. Please try again.");
            } finally {
              B(false);
            }
          }}
        >
          <div className="inbox-label">FOLLOW-UP</div>
          <label className="field">
            Inquiry status
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                F("");
              }}
              disabled={busy}
            >
              {Object.entries(statuses).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <p className="inbox-hint">
            New: awaiting a reply · Contacted: follow-up in progress · Closed:
            completed
          </p>
          <label className="field">
            Private team notes
            <textarea
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                F("");
              }}
              rows={4}
              maxLength={10000}
              disabled={busy}
              placeholder="Record the next step, a call summary, or a follow-up date…"
            />
          </label>
          <p className="inbox-hint">Only administrators can see these notes.</p>
          <div className="inbox-save">
            <button className="primary" disabled={busy || !dirty}>
              {busy ? "Saving…" : "Save changes"}
            </button>
            <span role="status">
              {feedback || (dirty ? "Unsaved changes" : "")}
            </span>
          </div>
        </form>
      </div>
    </details>
  );
}
export function InquiryInbox({ api }) {
  const [rows, R] = useState([]),
    [query, Q] = useState(""),
    [filter, F] = useState("all"),
    [error, E] = useState(""),
    [loading, L] = useState(true),
    [updated, U] = useState(null);
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await api("/inquiries");
        if (active) {
          R((old) => {
            const map = new Map(old.map((r) => [r.id, r]));
            return data.map((r) => map.get(r.id) || r);
          });
          E("");
          U(new Date());
        }
      } catch (e) {
        if (active) E(e.message || "Could not load inquiries.");
      } finally {
        if (active) L(false);
      }
    };
    load();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, 30000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);
  const refresh = async () => {
    L(true);
    try {
      const data = await api("/inquiries");
      R((old) => {
        const map = new Map(old.map((r) => [r.id, r]));
        return data.map((r) => map.get(r.id) || r);
      });
      U(new Date());
      E("");
    } catch (e) {
      E(e.message || "Could not refresh inquiries.");
    } finally {
      L(false);
    }
  };
  const save = async (id, data) => {
    await api(`/inquiries/${id}`, "PATCH", data);
    R((old) => old.map((r) => (r.id === id ? { ...r, ...data } : r)));
  };
  const visible = rows.filter(
    (r) =>
      (filter === "all" || r.status === filter) &&
      [r.name, r.email, r.message].some((t) =>
        t.toLowerCase().includes(query.trim().toLowerCase()),
      ),
  );
  return (
    <div className="inbox">
      <div className="inbox-heading">
        <div>
          <h2>Customer inbox</h2>
          <p>Read new messages, reply to customers, and track the next step.</p>
        </div>
        <button onClick={refresh} disabled={loading}>
          {loading ? "Loading…" : "↻ Refresh"}
        </button>
      </div>
      <div className="inbox-counts">
        {[
          ["all", "All inquiries"],
          ["new", "Needs a reply"],
          ["contacted", "In progress"],
          ["closed", "Completed"],
        ].map(([value, label]) => (
          <button
            key={value}
            className={filter === value ? "selected" : ""}
            aria-pressed={filter === value}
            onClick={() => F(value)}
          >
            <span>{label}</span>
            <strong>
              {value === "all"
                ? rows.length
                : rows.filter((r) => r.status === value).length}
            </strong>
          </button>
        ))}
      </div>
      <div className="panel inbox-panel">
        <div className="inbox-toolbar">
          <label>
            Search inquiries
            <input
              type="search"
              placeholder="Search name, email, or message…"
              value={query}
              onChange={(e) => Q(e.target.value)}
            />
          </label>
          <label>
            Status
            <select value={filter} onChange={(e) => F(e.target.value)}>
              <option value="all">All statuses</option>
              {Object.entries(statuses).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="inbox-meta">
          <span>
            {visible.length} of {rows.length} inquiries · newest first
            {rows.length === 200 ? " · latest 200 loaded" : ""}
          </span>
          <span>
            Updates every 30 seconds
            {updated
              ? " · Checked " +
                updated.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </span>
        </div>
        {error && (
          <p role="alert" className="inbox-error">
            {error} Use Refresh to try again.
          </p>
        )}
        {visible.map((row) => (
          <Inquiry key={row.id} row={row} onSave={save} />
        ))}
        {!visible.length && !loading && (
          <div className="inbox-empty">
            <h3>
              {rows.length ? "No matching inquiries" : "Your inbox is ready"}
            </h3>
            <p>
              {rows.length
                ? "Try another search or choose All statuses."
                : "When someone submits the website form, their inquiry will appear here."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

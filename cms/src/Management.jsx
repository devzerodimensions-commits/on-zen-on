import React, { useEffect, useState } from "react";
import { PasswordField } from "./PasswordField.jsx";
export function Management({ view, api, run }) {
  const [rows, S] = useState([]);
  const users = view === "Users";
  const load = async () => S(await api(users ? "/users" : "/inquiries"));
  useEffect(() => {
    run(load);
    if (users) return;
    let active = true;
    const timer = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      run(async () => {
        const latest = await api("/inquiries");
        if (active)
          S((current) => [
            ...latest.filter(
              (row) => !current.some((old) => old.id === row.id),
            ),
            ...current,
          ]);
      });
    }, 30000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [view]);
  return (
    <div className="panel">
      <h2>{view}</h2>
      {!users && (
        <div className="row">
          <p>
            Website inquiries · newest first · new inquiries appear every 30
            seconds. Open an inquiry below to update its status and notes.
          </p>
          <button onClick={() => run(load)}>Refresh inquiries</button>
        </div>
      )}
      {users && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const f = e.currentTarget;
            const data = Object.fromEntries(new FormData(f));
            run(async () => {
              await api("/users", "POST", data);
              f.reset();
              await load();
            });
          }}
        >
          <div className="two">
            <label className="field">
              Email
              <input type="email" name="email" required autoComplete="off" />
            </label>
            <PasswordField
              label="Initial password"
              name="password"
              minLength={14}
              maxLength={200}
              required
              autoComplete="new-password"
            />
          </div>
          <label className="field">
            Role
            <select name="role">
              <option value="editor">Editor</option>
              <option value="admin">Administrator</option>
            </select>
          </label>
          <button className="primary">Add user</button>
        </form>
      )}
      {rows.map((row) =>
        users ? (
          <div className="row revision" key={row.id}>
            <strong>{row.email}</strong>
            <span>
              {row.role} · {row.active ? "Active" : "Disabled"}
            </span>
            <button
              onClick={() =>
                run(async () => {
                  await api(`/users/${row.id}`, "PATCH", {
                    role: row.role,
                    active: !row.active,
                  });
                  await load();
                })
              }
            >
              {row.active ? "Disable" : "Enable"}
            </button>
          </div>
        ) : (
          <form
            className="item"
            key={row.id}
            onSubmit={(e) => {
              e.preventDefault();
              const data = Object.fromEntries(new FormData(e.currentTarget));
              run(async () => {
                await api(`/inquiries/${row.id}`, "PATCH", data);
                await load();
              });
            }}
          >
            <h3>{row.name}</h3>
            <a href={`mailto:${row.email}`}>{row.email}</a>
            <p>{row.message}</p>
            <small>{new Date(row.created_at).toLocaleString()}</small>
            <label className="field">
              Status
              <select name="status" defaultValue={row.status}>
                {["new", "contacted", "closed"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="field">
              Internal notes
              <textarea
                name="notes"
                defaultValue={row.notes}
                maxLength={10000}
              />
            </label>
            <button>Save inquiry</button>
          </form>
        ),
      )}
      {!rows.length && <p>No {users ? "users" : "inquiries"} found.</p>}
    </div>
  );
}

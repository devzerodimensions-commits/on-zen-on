import React, { useEffect, useState } from "react";
import { PasswordField } from "./PasswordField.jsx";
export function Management({ view, api, run }) {
  const [rows, S] = useState([]);
  const users = view === "Users";
  const load = async () => S(await api(users ? "/users" : "/inquiries"));
  useEffect(() => {
    run(load);
  }, [view]);
  return (
    <div className="panel">
      <h2>{view}</h2>
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

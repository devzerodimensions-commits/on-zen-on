import React, { useState, useEffect } from "react";
export function Requests({ api, run }) {
  const [rows, S] = useState([]);
  const load = async () => S(await api("/requests"));
  useEffect(() => {
    run(load);
  }, []);
  return (
    <section className="panel">
      <h2>Portal requests</h2>
      <button onClick={() => run(load)}>Refresh</button>
      {rows.map((r) => (
        <form
          className="item"
          key={r.id}
          onSubmit={(e) => {
            e.preventDefault();
            const status = new FormData(e.currentTarget).get("status");
            run(async () => {
              await api("/requests/" + r.id, "PATCH", { status });
              await load();
            });
          }}
        >
          <h3>
            {r.name} · {r.service}
          </h3>
          <a href={"mailto:" + r.email}>{r.email}</a>
          <p>{r.message}</p>
          <small>
            {r.id} · {new Date(Number(r.created)).toLocaleString()}
          </small>
          <label className="field">
            Status visible to customer
            <select name="status" defaultValue={r.status}>
              {[
                "received",
                "reviewing",
                "contacted",
                "completed",
                "cancelled",
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <button>Update status</button>
          {r.starts && (
            <div>
              <p>
                30-minute consultation:{" "}
                {new Date(Number(r.starts)).toLocaleString()} ·{" "}
                {r.appointment_status}
              </p>
              <small>
                Times are shown in your device timezone. Contact the client to
                arrange meeting details; this does not send an email.
              </small>
              {["confirmed", "cancelled"].map((status) => (
                <button
                  type="button"
                  key={status}
                  onClick={() =>
                    run(async () => {
                      await api("/appointments/" + r.id, "PATCH", { status });
                      await load();
                    })
                  }
                >
                  {status === "confirmed"
                    ? "Confirm consultation"
                    : "Cancel consultation"}
                </button>
              ))}
            </div>
          )}
        </form>
      ))}
      {!rows.length && <p>No portal requests yet.</p>}
    </section>
  );
}

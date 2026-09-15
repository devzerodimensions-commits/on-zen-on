import React, { useState } from "react";
import { mainServices } from "../shared/main-services.js";
import { ExperienceTools } from "./ExperienceTools.jsx";
import { ServiceChat } from "./ServiceChat.jsx";
import "./portal.css";
function calendar(appointment) {
  const stamp = (n) =>
    new Date(Number(n))
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");
  const data = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//On Zen On//Appointments//EN",
    "BEGIN:VEVENT",
    "UID:" + appointment.starts + "@onzenon.com",
    "DTSTAMP:" + stamp(Date.now()),
    "DTSTART:" + stamp(appointment.starts),
    "DTEND:" + stamp(Number(appointment.starts) + 1800000),
    "SUMMARY:On Zen On consultation",
    "DESCRIPTION:Check your email for meeting arrangements from the team.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([data], { type: "text/calendar" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "on-zen-on-consultation.ics";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function Portal() {
  const [result, R] = useState(null),
    [status, S] = useState(null),
    [error, E] = useState(""),
    [busy, B] = useState(false);
  async function send(e, lookup) {
    e.preventDefault();
    if (busy) return;
    B(true);
    E("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (!lookup) {
      if (data.preferredTime)
        data.starts = new Date(data.preferredTime).getTime();
      delete data.preferredTime;
    }
    try {
      const response = await fetch(
        lookup ? "/api/portal/status" : "/api/portal/requests",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          signal: AbortSignal.timeout(15000),
        },
      );
      const json = await response.json();
      if (!response.ok) throw Error(json.error || "Please try again.");
      lookup ? S(json) : R(json);
    } catch (err) {
      E(
        err.name === "TimeoutError"
          ? "The request timed out. Please try again."
          : err.message,
      );
    } finally {
      B(false);
    }
  }
  return (
    <div className="portal-page">
      <ExperienceTools />
      <main className="portal-wrap">
        <a href="/">← Back to On Zen On</a>
        <p className="eyebrow">YOUR NEXT STEP</p>
        <h1>Let’s move your project forward.</h1>
        <p>
          Explore services, send a project request and check its progress in one
          place.
        </p>
        <div className="portal-services">
          {mainServices.map((s) => (
            <a key={s.slug} href={"/services/" + s.slug}>
              {s.title} ↗
            </a>
          ))}
        </div>
        <div className="portal-grid">
          <section className="portal-card">
            <h2>Start a project</h2>
            {result ? (
              <div role="status">
                <h3>Your request is received</h3>
                <p>
                  Save these details to check your status. The private access
                  code is shown only here; keep it safe.
                </p>
                <label>
                  Request ID
                  <input readOnly value={result.id} />
                </label>
                <label>
                  Private access code
                  <input readOnly value={result.access} />
                </label>
                <p>
                  The team will review your request and contact you at the email
                  you supplied. Check your status below for any requested
                  appointment.
                </p>
                <button onClick={() => R(null)}>Create another request</button>
              </div>
            ) : (
              <form onSubmit={(e) => send(e, false)}>
                <label>
                  Name
                  <input name="name" required maxLength={150} />
                </label>
                <label>
                  Email
                  <input name="email" type="email" required maxLength={254} />
                </label>
                <label>
                  Service
                  <select name="service">
                    {mainServices.map((s) => (
                      <option key={s.slug}>{s.title}</option>
                    ))}
                  </select>
                </label>
                <label>
                  What would you like to build?
                  <textarea
                    name="message"
                    required
                    minLength={10}
                    maxLength={5000}
                    rows={5}
                  />
                </label>
                <label>
                  Preferred consultation time (optional)
                  <input name="preferredTime" type="datetime-local" />
                </label>
                <p className="portal-note">
                  Times use your device timezone:{" "}
                  {Intl.DateTimeFormat().resolvedOptions().timeZone}. Choose a
                  time at least one hour ahead and within 180 days.
                  Consultations are 30 minutes; a request is not confirmed until
                  the team approves it.
                </p>
                <p className="portal-note">
                  Your details are saved for the team to respond. Please do not
                  include passwords or sensitive information.
                </p>
                <button disabled={busy}>Send project request</button>
              </form>
            )}
          </section>
          <section className="portal-card">
            <h2>Track your request</h2>
            <p>
              Use the request ID and private access code shown after submission.
            </p>
            <form onSubmit={(e) => send(e, true)}>
              <label>
                Request ID
                <input name="id" required autoComplete="off" />
              </label>
              <label>
                Private access code
                <input
                  name="access"
                  type="password"
                  required
                  autoComplete="off"
                />
              </label>
              <button disabled={busy}>Check status</button>
            </form>
            {status && (
              <div role="status">
                <h3>{status.service}</h3>
                <p>
                  Status: <strong>{status.status}</strong>
                </p>
                <p>
                  Received {new Date(Number(status.created)).toLocaleString()}
                </p>
                {status.appointment && (
                  <div>
                    <p>
                      Consultation:{" "}
                      {new Date(
                        Number(status.appointment.starts),
                      ).toLocaleString()}{" "}
                      · {status.appointment.status}
                    </p>
                    {status.appointment.status === "confirmed" && (
                      <button
                        type="button"
                        onClick={() => calendar(status.appointment)}
                      >
                        Add to calendar
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
        <p role="status">{busy ? "Working…" : error}</p>
      </main>
      <ServiceChat page={{ blocks: [] }} />
    </div>
  );
}

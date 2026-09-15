import React from "react";
import { experienceDefaults } from "../../shared/experience-settings.js";
export function ExperienceSettings({ value, onChange }) {
  const v = { ...experienceDefaults, ...value },
    set = (key, val) => onChange({ ...v, [key]: val });
  const check = (key, label) => (
    <label className="field feature-toggle">
      <input
        type="checkbox"
        checked={v[key]}
        onChange={(e) => set(key, e.target.checked)}
      />{" "}
      <span>{label}</span>
    </label>
  );
  const field = (key, label, area = false) => (
    <label className="field">
      {label}
      {area ? (
        <textarea
          rows={4}
          value={v[key]}
          onChange={(e) => set(key, e.target.value)}
        />
      ) : (
        <input value={v[key]} onChange={(e) => set(key, e.target.value)} />
      )}
    </label>
  );
  return (
    <div className="experience-settings">
      <h2>Website features</h2>
      <p>
        Save the draft, then publish these site settings to apply changes to the
        live website.
      </p>
      <details open>
        <summary>Chatbot and answers</summary>
        {check("chatEnabled", "Show the free website guide")}
        {field("chatTitle", "Chatbot name")}
        {field("chatLauncher", "Chat button label")}
        {field("chatGreeting", "Welcome message", true)}
        {field("pricingAnswer", "Pricing response", true)}
        {field("timelineAnswer", "Timeline response", true)}
        {field("contactAnswer", "Contact response", true)}
        <h3>Custom questions and answers</h3>
        <p>
          Matching questions use your answer before searching published service
          pages. Generative AI is not connected.
        </p>
        {v.customAnswers.map((a, i) => (
          <div className="item" key={i}>
            <label className="field">
              Question
              <input
                value={a.question}
                onChange={(e) =>
                  set(
                    "customAnswers",
                    v.customAnswers.map((x, j) =>
                      j === i ? { ...x, question: e.target.value } : x,
                    ),
                  )
                }
              />
            </label>
            <label className="field">
              Answer
              <textarea
                value={a.answer}
                onChange={(e) =>
                  set(
                    "customAnswers",
                    v.customAnswers.map((x, j) =>
                      j === i ? { ...x, answer: e.target.value } : x,
                    ),
                  )
                }
              />
            </label>
            <button
              type="button"
              onClick={() =>
                set(
                  "customAnswers",
                  v.customAnswers.filter((_, j) => j !== i),
                )
              }
            >
              Remove answer
            </button>
          </div>
        ))}
        <button
          type="button"
          disabled={v.customAnswers.length >= 50}
          onClick={() =>
            set("customAnswers", [
              ...v.customAnswers,
              { question: "New question", answer: "Add your answer here." },
            ])
          }
        >
          Add custom answer
        </button>
      </details>
      <details>
        <summary>Self-service portal and booking</summary>
        {check("portalEnabled", "Accept new project requests")}
        {field("portalTitle", "Portal heading")}
        {field("portalIntro", "Portal introduction", true)}
        {field(
          "portalClosedMessage",
          "Message when new requests are closed",
          true,
        )}
        <label className="field">
          Service choices (one per line)
          <textarea
            rows={5}
            value={v.portalServices.join("\n")}
            onChange={(e) => set("portalServices", e.target.value.split("\n"))}
          />
        </label>
        {check("bookingEnabled", "Allow preferred consultation time requests")}
        <label className="field">
          Minimum notice (hours)
          <input
            type="number"
            min={1}
            max={168}
            value={v.bookingLeadHours}
            onChange={(e) => set("bookingLeadHours", Number(e.target.value))}
          />
        </label>
        <label className="field">
          Booking horizon (days)
          <input
            type="number"
            min={8}
            max={365}
            value={v.bookingMaxDays}
            onChange={(e) => set("bookingMaxDays", Number(e.target.value))}
          />
        </label>
        <p>
          Consultations are 30 minutes and require confirmation in Requests.
          Existing request tracking remains available when new requests are
          closed.
        </p>
      </details>
      <details>
        <summary>Appearance and animation</summary>
        {check("darkModeEnabled", "Allow visitors to switch light/dark mode")}
        <label className="field">
          Default appearance
          <select
            value={v.defaultTheme}
            onChange={(e) => set("defaultTheme", e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        {check("motionEnabled", "Enable motion effects")}
        {check("introEnabled", "Show first-visit logo introduction")}
        {field("introTagline", "Logo introduction tagline")}
        <p>
          The logo is managed in the global header. Visitor reduced-motion
          preferences are always respected.
        </p>
      </details>
      <details>
        <summary>Backend and security</summary>
        <p>
          Requests and bookings are stored in the database. Admin
          authentication, role permissions, CSRF protection, input validation,
          rate limits and private tracking codes remain enforced. Manage staff
          in Users and content in Pages, Shared sections, Menus and Media
          library.
        </p>
        <p>
          Server credentials and database connections remain in Render
          environment settings. No AI or external calendar provider is
          connected.
        </p>
      </details>
    </div>
  );
}

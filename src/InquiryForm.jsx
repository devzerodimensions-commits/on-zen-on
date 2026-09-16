import React from "react";
import "./inquiry.css";
export function InquiryForm({ submit, formState, labels = {} }) {
  const busy = formState === "Sending…";
  return (
    <form className="inquiry-card" onSubmit={submit} aria-busy={busy}>
      <div className="inquiry-card-top">
        <span aria-hidden="true">↗</span>
        <div>
          <small>LET’S BUILD SOMETHING GREAT</small>
          <h3>Your next idea starts here.</h3>
        </div>
      </div>
      <div className="inquiry-fields">
        <label>
          {labels.name || "Your name"}
          <input
            name="name"
            autoComplete="name"
            required
            maxLength={150}
            placeholder="Full name"
            disabled={busy}
          />
        </label>
        <label>
          {labels.email || "Email address"}
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="you@company.com"
            disabled={busy}
          />
        </label>
      </div>
      <label>
        {labels.message || "Tell us about your project"}
        <textarea
          name="message"
          required
          maxLength={10000}
          rows={5}
          placeholder="What would you like to create or improve? Share your goals, preferred timeline, or questions."
          disabled={busy}
        />
      </label>
      <p className="inquiry-note">
        Your details go directly to our team so we can follow up about your
        project.
      </p>
      <button type="submit" disabled={busy}>
        {busy
          ? "Sending your inquiry…"
          : labels.button || "Let’s talk about your project"}
        <span aria-hidden="true">↗</span>
      </button>
      {formState && (
        <p className="inquiry-feedback" role="status" aria-live="polite">
          {formState}
        </p>
      )}
    </form>
  );
}
export function ThankYou() {
  let received = false;
  try {
    received = sessionStorage.getItem("inquiry-received") === "yes";
  } catch {}
  return (
    <main className="inquiry-thanks">
      <a href="/" aria-label="On Zen On home">
        <img src="/assets/on-zen-on-official-logo.png" alt="On Zen On" />
      </a>
      <div className="inquiry-thanks-card">
        <span className="inquiry-check" aria-hidden="true">
          ✓
        </span>
        <p className="inquiry-kicker">LET’S CREATE WHAT’S NEXT</p>
        <h1>
          {received
            ? "Thank you for reaching out!"
            : "Let’s start a conversation."}
        </h1>
        <p>
          {received
            ? "Your inquiry has been saved and sent to our team’s inbox. We’ll review your project and reply using the email address you provided."
            : "Have a project in mind? Send us an inquiry and our team will review your goals."}
        </p>
        <div>
          <a href="/">Back to home ↗</a>
          <a href={received ? "/services" : "/#contact"}>
            {received ? "Explore our services" : "Send an inquiry"}
          </a>
        </div>
      </div>
    </main>
  );
}

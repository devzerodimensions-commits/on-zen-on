import React, { useEffect, useRef, useState } from "react";
import "./service-chat.css";

const greeting = {
  text: "Hello! I can help you explore On Zen On services or start an inquiry. What would you like to know?",
};
export function ServiceChat({ page }) {
  const [open, setOpen] = useState(false),
    [input, setInput] = useState(""),
    [messages, setMessages] = useState([greeting]);
  const field = useRef(null),
    log = useRef(null),
    launcher = useRef(null);
  useEffect(() => {
    if (open) field.current?.focus();
  }, [open]);
  useEffect(() => {
    if (open && log.current) log.current.scrollTop = Math.max(0,(log.current.lastElementChild?.offsetTop||0)-16);
  }, [messages, open]);
  const close = () => {
    setOpen(false);
    launcher.current?.focus();
  };
  const [busy, setBusy] = useState(false),
    [context, setContext] = useState(page?.path?.startsWith("/services/")?page.path:null);
  const sending = useRef(false);
  const send = async (text) => {
    const question = text.trim().slice(0, 500);
    if (!question || sending.current) return;
    sending.current = true;
    setBusy(true);
    setInput("");
    setMessages((current) => [
      ...current.slice(-38),
      { text: question, user: true },
    ]);
    try {
      const response = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, context: context || undefined }),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error();
      const reply = await response.json();
      setContext(reply.context || null);
      setMessages((current) => [...current, reply]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          text: "I could not load the service information. Please try again, or open our self-service portal.",
          links: [{ label: "Self-service portal", href: "/portal" }],
        },
      ]);
    } finally {
      sending.current = false;
      setBusy(false);
    }
  };
  return (
    <div className="service-chat">
      {open && (
        <section
          className="service-chat-panel"
          aria-label="On Zen On chat"
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
          }}
        >
          <header className="service-chat-head">
            <div>
              <strong>On Zen On helper</strong>
              <small>Website knowledge guide</small>
            </div>
            <button type="button" onClick={close} aria-label="Close chat">
              ×
            </button>
          </header>
          <div
            className="service-chat-log"
            ref={log}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.user
                    ? "service-chat-message from-user"
                    : "service-chat-message"
                }
              >
                <p>{m.text}</p>
                {m.links?.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            ))}
            {busy && <p role="status">Finding service details…</p>}
          </div>
          <div className="service-chat-prompts">
            {["Our services", "Tell me more", "Pricing", "Contact team"].map(
              (q) => (
                <button
                  key={q}
                  type="button"
                  disabled={busy}
                  onClick={() => send(q)}
                >
                  {q}
                </button>
              ),
            )}
          </div>
          <form
            className="service-chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              ref={field}
              aria-label="Your question"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              placeholder="Ask about our services…"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send question"
            >
              ↑
            </button>
          </form>
          <small className="service-chat-note">
            Answers use published website content, not generative AI. Questions
            are processed by our server. Please don’t enter sensitive
            information.
          </small>
        </section>
      )}
      <button
        ref={launcher}
        className="service-chat-launcher"
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Chat with On Zen On"}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <svg
          aria-hidden="true"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6 4V6a2 2 0 0 1 2-2Z" />
          <path d="M7 9h10M7 13h6" />
        </svg>{" "}
        {open ? "Close" : "Chat with us"}
      </button>
    </div>
  );
}

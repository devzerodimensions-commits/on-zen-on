import React, { useState, useEffect } from "react";
import "./experience.css";
export function ExperienceTools() {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("oz-theme") === "dark";
    } catch {
      return false;
    }
  });
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    try {
      localStorage.setItem("oz-theme", dark ? "dark" : "light");
    } catch {}
  }, [dark]);
  return (
    <aside className="experience-tools" aria-label="Website tools">
      <a href="/portal">Self-service portal ↗</a>
      <button type="button" aria-pressed={dark} onClick={() => setDark(!dark)}>
        {dark ? "☀ Light mode" : "☾ Dark mode"}
      </button>
    </aside>
  );
}

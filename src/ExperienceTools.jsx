import React, { useState, useEffect } from "react";
import "./experience.css";
import {useExperience} from "./ExperienceContext.jsx";
export function ExperienceTools() {
  const config=useExperience();
  const [dark, setDark] = useState(() => {
    try {
      const saved=localStorage.getItem("oz-theme");return config.darkModeEnabled&&saved?saved==="dark":config.defaultTheme==="dark";
    } catch {
      return config.defaultTheme==="dark";
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
      {config.darkModeEnabled&&<button type="button" aria-pressed={dark} onClick={() => setDark(!dark)}>
        {dark ? "☀ Light mode" : "☾ Dark mode"}
      </button>}
    </aside>
  );
}

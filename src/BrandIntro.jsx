import React, { useEffect, useState } from "react";
import "./brand-intro.css";
import {useExperience} from "./ExperienceContext.jsx";

const sessionKey = "onzenon-brand-intro-v1";
export function BrandIntro({ logo }) {
  const config=useExperience();
  const [visible, setVisible] = useState(() => {
    if (!config.introEnabled||!config.motionEnabled||window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    try { return !sessionStorage.getItem(sessionKey); } catch { return true; }
  });
  useEffect(() => {
    if (!visible) return;
    try { sessionStorage.setItem(sessionKey, "seen"); } catch {}
    const dismiss = () => setVisible(false);
    const timer = window.setTimeout(dismiss, 2200);
    const onKey = (e) => { if (e.key === "Escape") dismiss(); };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [visible]);
  if (!visible) return null;
  return (
    <div className="brand-intro" aria-label="Welcome to On Zen On">
      <div className="brand-intro-mark">
        <div className="brand-intro-ring" aria-hidden="true" />
        <img src={logo} alt="On Zen On" onError={() => setVisible(false)} />
        <p>{config.introTagline}</p>
        <span className="brand-intro-line" aria-hidden="true" />
      </div>
      <button type="button" className="brand-intro-skip" onClick={() => setVisible(false)}>Skip intro →</button>
    </div>
  );
}

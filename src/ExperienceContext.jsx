import React, { createContext, useContext, useEffect, useState } from "react";
import { experienceDefaults } from "../shared/experience-settings.js";
const Context = createContext(experienceDefaults);
export const useExperience = () => useContext(Context);
export function ExperienceProvider({ children }) {
  const [settings, S] = useState(null);
  useEffect(() => {
    const c = new AbortController();
    fetch("/api/public/experience", { signal: c.signal })
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then(S)
      .catch((e) => {
        if (e.name !== "AbortError")
          S({
            ...experienceDefaults,
            chatEnabled: false,
            portalEnabled: false,
            bookingEnabled: false,
          });
      });
    return () => c.abort();
  }, []);
  useEffect(() => {
    if (settings)
      document.documentElement.dataset.motion = settings.motionEnabled
        ? "on"
        : "off";
  }, [settings]);
  return settings ? (
    <Context.Provider value={settings}>{children}</Context.Provider>
  ) : (
    <p role="status">Loading website…</p>
  );
}

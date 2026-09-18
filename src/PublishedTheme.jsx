import React, { useEffect, useState } from "react";
import { themeCss, defaultSectionCss } from "../shared/theme.js";
export function PublishedTheme() {
  const [css, S] = useState(defaultSectionCss);
  const [preview, P] = useState(null);
  useEffect(() => {
    const c = new AbortController();
    fetch("/api/public/site", { signal: c.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((site) => S(themeCss(site?.settings?.theme) || defaultSectionCss))
      .catch(() => {});
    return () => c.abort();
  }, []);
  /* The appearance studio shows this page inside an iframe and pushes unsaved
     theme changes down as they are made, so the editor sees the real website. */
  useEffect(() => {
    if (window.parent === window) return;
    const listen = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "oz-theme-preview") return;
      P(typeof event.data.css === "string" ? event.data.css : null);
    };
    window.addEventListener("message", listen);
    window.parent.postMessage(
      { type: "oz-preview-ready" },
      window.location.origin,
    );
    return () => window.removeEventListener("message", listen);
  }, []);
  const active = preview === null ? css : preview || defaultSectionCss;
  return active ? <style>{active}</style> : null;
}

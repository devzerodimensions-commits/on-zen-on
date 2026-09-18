import React, { useEffect, useState } from "react";
import { themeCss } from "../shared/theme.js";
export function PublishedTheme() {
  const [css, S] = useState("");
  useEffect(() => {
    const c = new AbortController();
    fetch("/api/public/site", { signal: c.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((site) => S(themeCss(site?.settings?.theme)))
      .catch(() => {});
    return () => c.abort();
  }, []);
  return css ? <style>{css}</style> : null;
}

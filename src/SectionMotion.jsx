import React, { useEffect, useState } from "react";
import { useExperience } from "./ExperienceContext.jsx";
import "./section-motion.css";
export function SectionMotion() {
  const { motionEnabled } = useExperience();
  const [reduced, R] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => R(q.matches);
    q.addEventListener("change", update);
    return () => q.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (
      window.parent !== window ||
      !motionEnabled ||
      reduced ||
      !("IntersectionObserver" in window)
    )
      return;
    const seen = new WeakSet();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("section-enter");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -24px 0px" },
    );
    const scan = () => {
      if (document.querySelector(".brand-intro")) return;
      document
        .querySelectorAll(
          "main section, main article, main .inquiry-thanks-card, main .portal-card, #root footer",
        )
        .forEach((el) => {
          if (!seen.has(el)) {
            seen.add(el);
            observer.observe(el);
          }
        });
    };
    scan();
    const changes = new MutationObserver(scan);
    changes.observe(document.getElementById("root"), {
      childList: true,
      subtree: true,
    });
    return () => {
      observer.disconnect();
      changes.disconnect();
      document
        .querySelectorAll(".section-enter")
        .forEach((el) => el.classList.remove("section-enter"));
    };
  }, [motionEnabled, reduced]);
  return null;
}

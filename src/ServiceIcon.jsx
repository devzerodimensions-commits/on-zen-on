import React from "react";
export function ServiceIcon({ name = "spark" }) {
  const paths = {
    code: "m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16",
    server: "M4 3h16v7H4zM4 14h16v7H4zM7 6h.01M7 17h.01M11 6h6M11 17h6",
    phone: "M7 2h10v20H7zM10 5h4M11 19h2",
    spark: "m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z",
    growth: "M3 20h18M5 16l5-6 4 3 6-9m-6 0h6v6",
    design: "m4 16 12-12 4 4L8 20H4v-4ZM13 7l4 4M3 4h5M5.5 1.5v5",
    cloud:
      "M7 18a5 5 0 1 1 0-10 6 6 0 0 1 11 1 4.5 4.5 0 0 1 0 9M12 22V12m-3 3 3-3 3 3",
    shield: "m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4Zm-4 10 3 3 5-6",
  };
  return (
    <svg
      aria-hidden="true"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name] || paths.spark} />
    </svg>
  );
}

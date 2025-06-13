"use client";

import { useEffect, useState } from "react";

export default function AlertError({ text }) {
  const [alert, setAlert] = useState(null);
  useEffect(() => {
    setAlert(text);
    const timeout = setTimeout(() => {
      setAlert(null);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [text]);

  return (
    <div
      role="alert"
      className={`alert alert-error fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        alert ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{text}</span>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || "dark");
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  if (!theme) return <div className="h-9 w-9" aria-hidden="true" />;

  return (
    <button
      onClick={toggle}
      aria-label={
        theme === "light" ? "Switch to dark mode" : "Switch to light mode"
      }
      className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted transition hover:border-accent hover:text-accent"
    >
      {theme === "light" ? <FiMoon size={16} /> : <FiSun size={16} />}
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () =>
      setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-muted shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:text-accent ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <FiArrowUp size={18} />
    </button>
  );
}

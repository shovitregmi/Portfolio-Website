"use client";

import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Nav({ profile }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-border/60">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="font-mono text-lg font-bold text-ink"
            aria-label="Home"
          >
            {initials(profile?.name)}
          </a>

          {profile?.availability && (
            <span className="hidden items-center gap-1.5 font-mono text-[11px] text-muted sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-accent2" />
              Available for work
            </span>
          )}
        </div>

        <nav className="hidden gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-sm text-muted transition hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button
            className="flex flex-col gap-1.5 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`h-0.5 w-6 bg-ink transition ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />

            <span
              className={`h-0.5 w-6 bg-ink transition ${
                open ? "opacity-0" : ""
              }`}
            />

            <span
              className={`h-0.5 w-6 bg-ink transition ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {profile?.availability && (
        <div className="flex justify-center border-t border-border/60 py-1.5 sm:hidden">
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent2" />
            Available for work
          </span>
        </div>
      )}

      {open && (
        <nav className="flex flex-col gap-4 border-t border-border/60 px-6 py-6 md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-mono text-sm text-muted transition hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

function initials(name) {
  if (!name) return "</>";

  const parts = name.trim().split(/\s+/);

  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}


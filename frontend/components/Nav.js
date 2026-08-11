"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { FiGithub, FiLinkedin } from "react-icons/fi";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#certifications", label: "Certificates" },
  { href: "#contact", label: "Contact" },
];

export default function Nav({ profile }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const sections = document.querySelectorAll("section[id], div[id='contact']");
    const onScroll = () => {
      let current = "";
      sections.forEach((section) => {
        const top = section.getBoundingClientRect().top;
        if (top < 100) current = section.id;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "SR";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-bg/85 backdrop-blur-md">
      <div className="container-px mx-auto flex max-w-[1200px] items-center justify-between py-4 md:py-5">
        <a
          href="#top"
          className="font-display text-[1.1rem] font-extrabold tracking-[0.08em] text-accent"
        >
          {initials}_
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-mono text-[0.72rem] uppercase tracking-[0.12em] transition ${
                active === link.href.slice(1)
                  ? "text-accent"
                  : "text-muted2 hover:text-accent"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {profile?.githubUrl && (
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hidden text-muted transition hover:text-accent sm:block"
            >
              <FiGithub size={16} />
            </a>
          )}
          {profile?.linkedinUrl && (
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hidden text-muted transition hover:text-accent sm:block"
            >
              <FiLinkedin size={16} />
            </a>
          )}
          <ThemeToggle />
          <button
            type="button"
            className="flex flex-col gap-1.5 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`h-0.5 w-6 bg-ink transition ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 w-6 bg-ink transition ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-0.5 w-6 bg-ink transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="flex flex-col gap-4 border-t border-border/70 px-6 py-6 lg:hidden"
          aria-label="Mobile"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-wider text-muted hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

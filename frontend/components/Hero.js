"use client";

import { useEffect, useState } from "react";
import { FiGithub, FiLinkedin, FiChevronDown } from "react-icons/fi";

// Full phrases (not just the role) so grammar like "a" vs "an" can differ
// per item. Edit this list to change what rotates through the hero.
const ROLES = [
  "Full-Stack Developer",
  "AI/ML Enthusiast",
  "CSIT Student",
  "UI/UX Creative",
  "Tech Explorer",
  "Problem Solver",
];

const TYPE_SPEED = 45;
const DELETE_SPEED = 25;
const HOLD_MS = 1400;

export default function Hero({ profile }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState("typing"); // typing | holding | deleting

  useEffect(() => {
    const currentPhrase = ROLES[roleIndex];
    let timeout;

    if (phase === "typing") {
      if (typed.length < currentPhrase.length) {
        timeout = setTimeout(
          () => setTyped(currentPhrase.slice(0, typed.length + 1)),
          TYPE_SPEED,
        );
      } else {
        timeout = setTimeout(() => setPhase("holding"), HOLD_MS);
      }
    } else if (phase === "holding") {
      timeout = setTimeout(() => setPhase("deleting"), HOLD_MS);
    } else if (phase === "deleting") {
      if (typed.length > 0) {
        timeout = setTimeout(() => setTyped(typed.slice(0, -1)), DELETE_SPEED);
      } else {
        setRoleIndex((i) => (i + 1) % ROLES.length);
        setPhase("typing");
      }
    }

    return () => clearTimeout(timeout);
  }, [typed, phase, roleIndex]);

  return (
    <section
      id="top"
      className="section relative flex min-h-[90vh] flex-col items-center justify-center text-center"
    >
      <div className="animate-fadeUp mx-auto max-w-3xl">
        {profile.availability && (
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-accent2" />
            <span className="font-mono text-sm uppercase tracking-wider text-accent2">
              Available for work
            </span>
          </div>
        )}

        <h1 className="font-display mt-7 text-6xl font-semibold leading-[1.05] tracking-tight md:text-8xl">
          {profile.name}
        </h1>

        <p className="mt-5 flex min-h-[2.25rem] items-center justify-center font-mono text-xl text-muted md:text-2xl">
          Currently a&nbsp;<span className="text-accent">{typed}</span>
          <span className="ml-1 inline-block h-6 w-2.5 animate-blink bg-accent align-middle" />
        </p>

        <p className="mx-auto mt-7 max-w-2xl text-xl text-muted">
          {profile.tagline}
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <a
            href="#contact"
            className="btn-primary text-base transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_30px_-6px_rgb(var(--color-accent))]"
          >
            Get in touch
          </a>
          {profile.githubUrl && (
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-base transition-transform duration-200 hover:-translate-y-0.5"
            >
              <FiGithub size={18} />
              GitHub
            </a>
          )}
          {profile.linkedinUrl && (
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-base transition-transform duration-200 hover:-translate-y-0.5"
            >
              <FiLinkedin size={18} />
              LinkedIn
            </a>
          )}
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to about section"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-muted transition hover:text-accent"
      >
        <FiChevronDown size={26} />
      </a>
    </section>
  );
}

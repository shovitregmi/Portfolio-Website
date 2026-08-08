"use client";

import { useEffect, useState } from "react";

export default function Hero({ profile }) {
  const [typed, setTyped] = useState("");
  const command = "whoami";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setTyped(command.slice(0, i));
      if (i >= command.length) clearInterval(interval);
    }, 110);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="top" className="section flex min-h-[85vh] flex-col justify-center">
      <div className="animate-fadeUp">
        <div className="card inline-block px-4 py-3 font-mono text-sm text-muted">
          <span className="text-accent2">guest@portfolio</span>
          <span className="text-muted">:~$ </span>
          <span className="text-ink">{typed}</span>
          <span className="ml-0.5 inline-block w-2 animate-blink bg-accent align-middle">&nbsp;</span>
        </div>

        <h1 className="font-display mt-8 text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
          {profile.name}
        </h1>

        <p className="mt-4 font-mono text-lg text-accent md:text-xl">{profile.title}</p>

        <p className="mt-6 max-w-xl text-lg text-muted">{profile.tagline}</p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a href="#projects" className="btn-primary">
            View my work
          </a>
          <a href="#contact" className="btn-secondary">
            Get in touch
          </a>
        </div>
      </div>
    </section>
  );
}

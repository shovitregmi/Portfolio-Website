import Reveal from "@/components/Reveal";
import TerminalPanel from "@/components/TerminalPanel";

function splitName(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) return { first: name, last: "" };
  const last = parts.pop();
  return { first: parts.join(" "), last };
}

export default function Hero({ profile }) {
  const { first, last } = splitName(profile.name);

  return (
    <section
      id="top"
      className="relative min-h-screen overflow-hidden pt-28 md:pt-32"
    >
      <div
        className="pointer-events-none absolute inset-0 hero-grid-bg"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_70%_40%,rgb(var(--color-accent)/0.06),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="container-px relative z-10 mx-auto grid max-w-[1200px] gap-12 pb-20 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal className="animate-fadeUp">
          {profile.availability && (
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-accent">
                Available for Opportunities
              </span>
            </div>
          )}

          <h1 className="font-display text-[clamp(3rem,6vw,5.5rem)] font-extrabold leading-[1.02] tracking-tight">
            {first}
            {last && (
              <>
                <br />
                <em className="font-serif italic text-accent">{last}</em>
              </>
            )}
          </h1>

          <p className="mt-4 font-display text-lg font-semibold text-muted md:text-xl">
            {profile.title}
          </p>

          <p className="mt-5 max-w-md text-[0.88rem] leading-relaxed text-muted2">
            {profile.tagline}
          </p>

          <div className="mt-10 flex flex-wrap gap-3.5">
            <a href="#projects" className="btn-primary">
              View Projects
            </a>
            <a href="#contact" className="btn-ghost">
              Get In Touch
            </a>
          </div>

          <TerminalPanel profile={profile} />
        </Reveal>

        <Reveal className="hidden space-y-3.5 lg:block">
          {[
            profile.institution && {
              label: "Education",
              value: `${profile.major} @ ${profile.institution}`,
            },
            profile.educationStatus && {
              label: "Status",
              value: profile.educationStatus,
            },
            profile.currentFocus && {
              label: "Focus",
              value: profile.currentFocus,
            },
            profile.location && {
              label: "Location",
              value: profile.location,
            },
          ]
            .filter(Boolean)
            .map((item) => (
              <div
                key={item.label}
                className="card flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:border-accent/40"
              >
                <div>
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted2">
                    {item.label}
                  </p>
                  <p className="font-display text-base font-bold">{item.value}</p>
                </div>
              </div>
            ))}
        </Reveal>
      </div>
    </section>
  );
}

import Reveal from "@/components/Reveal";
import { getIcon, getIconByKey } from "@/lib/icons";

export default function About({ profile, skills = [], projectsCount = 0 }) {
  const highlightSkills = skills.filter((s) => s.showInAbout);

  const stats = [
    { value: `${projectsCount}+`, label: "Projects built", underline: true },
    { value: profile.major || "BSc. CSIT", label: "Major" },
    { value: "\u221E", label: "Curiosity" },
    { value: "NP", label: "Nepal" },
  ];

  return (
    <section id="about" className="section">
      <div className="grid gap-14 md:grid-cols-2 md:items-start">
        <Reveal>
          <p className="eyebrow flex items-center gap-2">
            <span className="h-px w-6 bg-accent" />
            About
          </p>
          <h2 className="font-display mt-4 text-3xl font-semibold leading-tight md:text-4xl">
            A bit about how I work
          </h2>

          <p className="mt-5 max-w-xl whitespace-pre-line text-base leading-relaxed text-muted">
            {profile.bio}
          </p>

          {highlightSkills.length > 0 && (
            <div className="mt-6 flex max-w-xl flex-wrap gap-2">
              {highlightSkills.map((skill) => {
                const Icon = skill.icon
                  ? getIconByKey(skill.icon)
                  : getIcon(skill.name);
                return (
                  <span
                    key={skill.id}
                    className="pill transition hover:border-accent hover:text-accent"
                  >
                    <Icon size={13} />
                    {skill.name}
                  </span>
                );
              })}
            </div>
          )}
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="relative bg-surface p-6 transition hover:-translate-y-1 hover:z-10 hover:shadow-lg"
              >
                <p className="font-display text-2xl font-semibold md:text-3xl">
                  {stat.value}
                </p>
                <p className="label mt-2">{stat.label}</p>
                {stat.underline && (
                  <div className="mt-4 h-0.5 w-full bg-accent" />
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

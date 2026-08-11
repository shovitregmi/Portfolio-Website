import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import TagPill from "@/components/TagPill";
import { getIcon, getIconByKey } from "@/lib/icons";

export default function About({ profile, skills = [] }) {
  const highlightSkills = skills.filter((s) => s.showInAbout);

  return (
    <section id="about" className="section">
      <SectionHeader
        number="01"
        label="About Me"
        title="About"
        titleAccent="Me"
      />

      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <Reveal>
          <p className="max-w-xl whitespace-pre-line text-[0.88rem] leading-relaxed text-muted2">
            {profile.bio}
          </p>

          {highlightSkills.length > 0 && (
            <div className="mt-6 flex max-w-xl flex-wrap gap-2">
              {highlightSkills.map((skill) => {
                const Icon = skill.icon
                  ? getIconByKey(skill.icon)
                  : getIcon(skill.name);
                return (
                  <TagPill key={skill.id} active>
                    <Icon size={12} />
                    {skill.name}
                  </TagPill>
                );
              })}
            </div>
          )}
        </Reveal>

        <Reveal>
          <div className="card divide-y divide-border overflow-hidden">
            {[
              {
                label: "Education",
                value: profile.major,
                sub: profile.institution,
              },
              {
                label: "Status",
                value: profile.educationStatus || "Final Year",
              },
              {
                label: "Focus",
                value: profile.currentFocus,
              },
            ]
              .filter((item) => item.value)
              .map((item) => (
                <div key={item.label} className="p-5">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-accent">
                    {item.label}
                  </p>
                  <p className="mt-1 font-display text-base font-bold">
                    {item.value}
                  </p>
                  {item.sub && (
                    <p className="mt-1 text-sm text-muted2">{item.sub}</p>
                  )}
                </div>
              ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

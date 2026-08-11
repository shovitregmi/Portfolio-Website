import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import TagPill from "@/components/TagPill";

const CATEGORY_ACCENTS = [
  "text-accentWarm",
  "text-accent",
  "text-accent2",
  "text-accentDark",
  "text-accentWarm",
  "text-accent",
];

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;

  const grouped = skills.reduce((acc, skill) => {
    const key = skill.category || "General";
    acc[key] = acc[key] || [];
    acc[key].push(skill);
    return acc;
  }, {});

  const categories = Object.entries(grouped);

  return (
    <section id="skills" className="section">
      <SectionHeader
        number="02"
        label="Technical Arsenal"
        title="Skills &"
        titleAccent="Stack"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map(([category, items], i) => (
          <Reveal
            key={category}
            className="card p-6 transition hover:border-accent/40"
          >
            <p
              className={`mb-3.5 font-display text-[0.82rem] font-bold uppercase tracking-[0.06em] ${CATEGORY_ACCENTS[i % CATEGORY_ACCENTS.length]}`}
            >
              {category}
            </p>
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <TagPill key={skill.id} active={skill.level >= 70}>
                  {skill.name}
                </TagPill>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

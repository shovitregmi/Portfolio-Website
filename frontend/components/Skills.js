import Reveal from "@/components/Reveal";
import { getIcon } from "@/lib/icons";

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;

  const grouped = skills.reduce((acc, skill) => {
    const key = skill.category || "General";
    acc[key] = acc[key] || [];
    acc[key].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="section">
      <Reveal>
        <p className="eyebrow">Skills</p>
        <h2 className="font-display mt-3 max-w-2xl text-3xl font-semibold md:text-4xl">
          Tools I reach for
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {Object.entries(grouped).map(([category, items], i) => (
          <Reveal key={category} className={`card p-6 ${i % 2 === 1 ? "delay-100" : ""}`}>
            <p className="label mb-5">{category}</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {items.map((skill) => {
                const Icon = getIcon(skill.name);
                const dots = Math.max(1, Math.round(skill.level / 20));
                return (
                  <div
                    key={skill.id}
                    className="group flex flex-col items-center gap-2 rounded-lg border border-border bg-surface2 px-3 py-4 text-center transition hover:border-accent"
                  >
                    <Icon size={22} className="text-muted transition group-hover:text-accent" />
                    <span className="text-xs text-ink">{skill.name}</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, dotIndex) => (
                        <span
                          key={dotIndex}
                          className={`h-1.5 w-1.5 rounded-full ${
                            dotIndex < dots ? "bg-accent" : "bg-border"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
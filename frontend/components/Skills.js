import Reveal from "@/components/Reveal";

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
      <Reveal className="max-w-2xl">
        <p className="eyebrow flex items-center gap-2">
          <span className="h-px w-6 bg-accent" />
          Skills
        </p>
        <h2 className="font-display mt-4 text-3xl font-semibold leading-tight md:text-4xl">
          Tools I reach for
        </h2>
      </Reveal>

      <div className="mx-auto mt-10 grid max-w-4xl gap-8 md:grid-cols-2">
        {Object.entries(grouped).map(([category, items], i) => (
          <Reveal
            key={category}
            className={`card p-6 transition hover:-translate-y-1 hover:shadow-lg ${
              i % 2 === 1 ? "delay-100" : ""
            }`}
          >
            <p className="label mb-5">{category}</p>
            <div className="space-y-4">
              {items.map((skill) => (
                <div key={skill.id}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm text-ink">{skill.name}</span>
                    <span className="font-mono text-xs text-muted">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-surface2">
                    <div
                      className="h-1.5 rounded-full bg-accent transition-all duration-700"
                      style={{
                        width: `${Math.min(100, Math.max(0, skill.level))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

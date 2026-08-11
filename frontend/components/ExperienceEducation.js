import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";

function formatDateRange(startDate, endDate, current) {
  const fmt = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

  if (!startDate && !endDate) return "";
  const start = startDate ? fmt(startDate) : "";
  const end = current ? "Present" : endDate ? fmt(endDate) : "";
  if (start && end) return `${start} – ${end}`;
  return start || end;
}

function parseBullets(text = "") {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function TimelineItem({ item, type }) {
  const date =
    type === "experience"
      ? formatDateRange(item.startDate, item.endDate, item.current)
      : formatDateRange(item.startDate, item.endDate, item.current);

  const title = type === "experience" ? item.position : item.degree;
  const subtitle =
    type === "experience"
      ? `${item.company}${item.location ? ` — ${item.location}` : ""}`
      : `${item.institution}${item.location ? ` — ${item.location}` : ""}`;

  const bullets = parseBullets(item.description);

  return (
    <div className="timeline-dot relative mb-12 pl-8 last:mb-0">
      {date && (
        <p className="mb-1.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-accent">
          {date}
        </p>
      )}
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="mb-3.5 text-[0.8rem] text-muted2">{subtitle}</p>
      {bullets.length > 0 && (
        <ul className="space-y-1.5">
          {bullets.map((bullet) => (
            <li
              key={bullet}
              className="timeline-bullet relative pl-4 text-[0.8rem] leading-relaxed text-muted2"
            >
              {bullet}
            </li>
          ))}
        </ul>
      )}
      {type === "experience" && item.technologies?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {item.technologies.map((tech) => (
            <span key={tech} className="tech-pill">
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExperienceEducation({ experiences = [], education = [] }) {
  if (experiences.length === 0 && education.length === 0) return null;

  const timeline = [
    ...experiences.map((item) => ({ ...item, _type: "experience" })),
    ...education.map((item) => ({ ...item, _type: "education" })),
  ].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    const aDate = a.startDate ? new Date(a.startDate).getTime() : 0;
    const bDate = b.startDate ? new Date(b.startDate).getTime() : 0;
    return bDate - aDate;
  });

  return (
    <section id="experience" className="section">
      <SectionHeader
        number="04"
        label="Work & Education"
        title="Experience &"
        titleAccent="Education"
      />

      <Reveal>
        <div className="timeline-rail relative pl-8">
          {timeline.map((item) => (
            <TimelineItem
              key={`${item._type}-${item.id}`}
              item={item}
              type={item._type}
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}

import Reveal from "@/components/Reveal";

export default function SectionHeader({
  number,
  label,
  title,
  titleAccent,
  className = "",
}) {
  return (
    <Reveal className={className}>
      <p className="section-label">
        // {number} — {label}
      </p>
      <h2 className="section-title">
        {title}
        {titleAccent && <span className="text-accent"> {titleAccent}</span>}
      </h2>
    </Reveal>
  );
}

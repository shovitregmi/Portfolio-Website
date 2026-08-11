export default function TagPill({ children, active = false, className = "" }) {
  return (
    <span
      className={`pill ${active ? "pill-active" : ""} ${className}`}
    >
      {children}
    </span>
  );
}

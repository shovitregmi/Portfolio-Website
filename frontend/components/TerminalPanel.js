export default function TerminalPanel({ profile }) {
  const lines = [
    { key: "location", value: profile.location },
    { key: "focus", value: profile.currentFocus },
    {
      key: "status",
      value: profile.availability
        ? "Open to internships & full-stack roles"
        : "Currently unavailable",
    },
    profile.educationStatus && profile.institution
      ? {
          key: "education",
          value: `${profile.educationStatus} · ${profile.major} @ ${profile.institution}`,
        }
      : null,
  ].filter(Boolean);

  return (
    <div className="card mt-8 overflow-hidden p-5 md:p-6 font-mono text-[0.78rem] leading-8">
      <div className="mb-3.5 flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
      </div>
      {lines.map((line) => (
        <div key={line.key} className="text-muted">
          <span className="text-accentWarm">{line.key}</span>
          <span className="text-muted2"> → </span>
          <span className="text-accent">{line.value}</span>
        </div>
      ))}
      <div className="text-muted">
        $ <span className="ml-0.5 inline-block h-3.5 w-2 animate-blink bg-accent align-middle" />
      </div>
    </div>
  );
}

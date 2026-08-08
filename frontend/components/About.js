import Reveal from "@/components/Reveal";
import { getIcon } from "@/lib/icons";

export default function About({ profile, skills = [] }) {
  return (
    <section id="about" className="section">
      <Reveal>
        <p className="eyebrow">About</p>
        <h2 className="font-display mt-3 max-w-2xl text-3xl font-semibold md:text-4xl">
          A bit about how I work
        </h2>

        <div className="mt-10 grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <p className="whitespace-pre-line text-lg leading-relaxed text-muted">{profile.bio}</p>

            {skills.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {skills.map((skill) => {
                  const Icon = getIcon(skill.name);
                  return (
                    <span key={skill.id} className="pill">
                      <Icon size={13} />
                      {skill.name}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card space-y-4 p-6">
            <Row label="Location" value={profile.location} />
            <Row label="Email" value={profile.email} />
            <Row
              label="Status"
              value={profile.availability ? "Available for work" : "Not currently available"}
              dot={profile.availability}
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Row({ label, value, dot }) {
  if (!value) return null;
  return (
    <div>
      <p className="label">{label}</p>
      <p className="mt-1 flex items-center gap-2 text-ink">
        {dot !== undefined && (
          <span className={`h-2 w-2 rounded-full ${dot ? "bg-accent2" : "bg-muted"}`} />
        )}
        {value}
      </p>
    </div>
  );
}
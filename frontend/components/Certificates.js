import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { FiExternalLink } from "react-icons/fi";

const STATUS_LABELS = {
  completed: "✓ Completed",
  participated: "✓ Participated",
  in_progress: "In Progress",
};

function statusClass(status) {
  if (status === "in_progress") return "text-accentWarm";
  return "text-accent";
}

export default function Certificates({ certificates }) {
  if (!certificates || certificates.length === 0) return null;

  const sorted = [...certificates].sort((a, b) => a.order - b.order);

  return (
    <section id="certifications" className="section">
      <SectionHeader
        number="05"
        label="Credentials"
        title="Certifications &"
        titleAccent="Learning"
      />

      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((cert) => (
          <Reveal key={cert.id}>
            <article className="card flex h-full items-start gap-3.5 p-5 transition hover:border-accent/40">
              <div className="min-w-0 flex-1">
                <h3 className="text-[0.78rem] font-medium leading-snug">
                  {cert.title}
                </h3>
                <p className="mt-1 text-[0.72rem] text-muted2">{cert.issuer}</p>
                {cert.issueDate && (
                  <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-muted2">
                    {new Date(cert.issueDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}
                <p
                  className={`mt-2 font-mono text-[0.62rem] uppercase tracking-[0.08em] ${statusClass(cert.status)}`}
                >
                  {STATUS_LABELS[cert.status] || cert.status}
                </p>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 font-mono text-[0.68rem] text-accent transition hover:underline"
                  >
                    <FiExternalLink size={12} />
                    View certificate
                  </a>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

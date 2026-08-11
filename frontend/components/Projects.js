import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { FiExternalLink, FiGithub } from "react-icons/fi";

function formatProjectNumber(index) {
  return String(index + 1).padStart(2, "0");
}

export default function Projects({ projects }) {
  if (!projects || projects.length === 0) return null;

  const sorted = [...projects].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <section id="projects" className="section">
      <SectionHeader
        number="03"
        label="Selected Work"
        title="Featured"
        titleAccent="Projects"
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {sorted.map((project, i) => (
          <Reveal key={project.id}>
            <article
              className={`card group relative flex h-full flex-col overflow-hidden p-7 transition hover:-translate-y-1 hover:border-accent/40 ${
                project.featured ? "" : "opacity-90"
              }`}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted2">
                  {formatProjectNumber(i)}
                </span>
                {project.featured && (
                  <span className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-accent">
                    Featured
                  </span>
                )}
              </div>

              {project.imageUrl && (
                <div className="relative mb-5 aspect-video overflow-hidden rounded-lg border border-border">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}

              <h3 className="font-display text-xl font-extrabold leading-tight">
                {project.title}
              </h3>
              <p className="mt-2 flex-1 text-[0.8rem] leading-relaxed text-muted2">
                {project.summary}
              </p>

              {project.tags?.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tech-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-5 flex gap-4">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-accent transition hover:underline"
                  >
                    <FiExternalLink size={13} />
                    Live
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-muted transition hover:text-ink hover:underline"
                  >
                    <FiGithub size={13} />
                    Source
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

import Reveal from "@/components/Reveal";
import { getIcon } from "@/lib/icons";
import { FiStar, FiExternalLink, FiGithub } from "react-icons/fi";

export default function Projects({ projects }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects">
      <Reveal>
        <div className="space-y-3">
          <p className="font-mono text-sm text-accent">Projects</p>

          <h2 className="text-3xl font-semibold text-ink">
            Things I've built
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal
              key={project.id}
              className={i % 2 === 1 ? "delay-100" : ""}
            >
              <article className="card group relative flex h-full flex-col overflow-hidden">
                {project.featured && (
                  <span className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] font-medium text-bg">
                    <FiStar size={11} />
                    Featured
                  </span>
                )}

                {project.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="h-48 w-full object-cover"
                  />
                )}

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-semibold">
                    {project.title}
                  </h3>

                  <p className="mt-2 flex-1 text-sm text-muted">
                    {project.summary}
                  </p>

                  {project.tags?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag) => {
                        const Icon = getIcon(tag);

                        return (
                          <span key={tag} className="pill">
                            <Icon size={12} />
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  <div className="mt-5 flex gap-5">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-sm text-accent hover:underline"
                      >
                        <FiExternalLink size={14} />
                        Live
                      </a>
                    )}

                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-sm text-muted hover:text-ink hover:underline"
                      >
                        <FiGithub size={14} />
                        Source
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  );
}


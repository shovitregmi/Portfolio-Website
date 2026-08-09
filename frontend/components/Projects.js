import Reveal from "@/components/Reveal";
import { getIcon, getIconByKey } from "@/lib/icons";
import { FiStar, FiExternalLink, FiGithub } from "react-icons/fi";

export default function Projects({ projects }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="section">
      <Reveal className="max-w-2xl">
        <p className="eyebrow flex items-center gap-2">
          <span className="h-px w-6 bg-accent" />
          Projects
        </p>
        <h2 className="font-display mt-4 text-3xl font-semibold leading-tight md:text-4xl">
          Things I&apos;ve built
        </h2>
      </Reveal>

      <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.id} className={i % 2 === 1 ? "delay-100" : ""}>
            <article className="card relative flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-accent/50">
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

              <div className="flex flex-1 flex-col p-6 text-left">
                <h3 className="font-display text-xl font-semibold">
                  {project.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-muted">
                  {project.summary}
                </p>

                {project.tags?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => {
                      const overrideKey = project.tagIcons?.[tag];
                      const Icon = overrideKey
                        ? getIconByKey(overrideKey)
                        : getIcon(tag);
                      return (
                        <span
                          key={tag}
                          className="pill transition hover:border-accent hover:text-accent"
                        >
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
                      className="inline-flex items-center gap-1.5 font-mono text-sm text-accent transition hover:underline"
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
                      className="inline-flex items-center gap-1.5 font-mono text-sm text-muted transition hover:text-ink hover:underline"
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
    </section>
  );
}

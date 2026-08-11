import { FiGithub, FiLinkedin } from "react-icons/fi";

export default function Footer({ profile }) {
  const socials = [
    { href: profile.githubUrl, Icon: FiGithub, label: "GitHub" },
    { href: profile.linkedinUrl, Icon: FiLinkedin, label: "LinkedIn" },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-border/70 py-10">
      <div className="container-px mx-auto flex max-w-[1200px] flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <p className="font-display text-sm font-bold">{profile.name}</p>
          <p className="mt-1 font-mono text-xs text-muted2">{profile.title}</p>
        </div>

        {socials.length > 0 && (
          <div className="flex items-center gap-5">
            {socials.map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-muted transition hover:text-accent"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        )}

        <p className="font-mono text-[0.72rem] tracking-[0.08em] text-muted2">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  );
}

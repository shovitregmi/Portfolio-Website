export default function Footer({ profile }) {
  const links = [
    { label: "GitHub", href: profile.githubUrl },
    { label: "LinkedIn", href: profile.linkedinUrl },
    { label: "Instagram", href: profile.instagramUrl },
    { label: "WhatsApp", href: profile.whatsappUrl },
  ].filter((l) => l.href);

  return (
    <footer className="container-px mx-auto max-w-6xl border-t border-border/60 py-10 pb-16">
      <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <p className="font-mono text-xs text-muted">
          &copy; {new Date().getFullYear()} {profile.name}. Built from scratch.
        </p>
        {links.length > 0 && (
          <div className="flex gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-muted transition hover:text-accent"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}

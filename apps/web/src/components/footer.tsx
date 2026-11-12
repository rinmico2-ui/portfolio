import Link from "next/link";
import { Mail, ArrowUp } from "lucide-react";
import { Profile } from "@portfolio/shared-types";
import { GithubIcon, LinkedinIcon, FacebookIcon } from "@/components/social-icons";

const navLinks = [
  { href: "/#top", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

export function Footer({ profile }: { profile: Profile }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-footer-bg text-footer-fg">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="font-display text-2xl tracking-[0.02em]">
              Marcus <span className="italic text-accent-secondary">Mallari</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-footer-fg/70">
              Business Informatics student building useful digital experiences.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-2.5 text-sm text-footer-fg/70" aria-label="Footer">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="group inline-flex transition-colors hover:text-accent-secondary">
                <span className="underline-grow">{l.label}</span>
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-footer-fg/50">Direct line</span>
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 text-sm text-footer-fg/80 transition-colors hover:text-accent-secondary"
              >
                <Mail size={14} className="text-accent-secondary" /> {profile.email}
              </a>
            )}
            {profile.availabilityStatus && (
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-footer-fg/60">
                <span aria-hidden className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent-secondary" />
                {profile.availabilityStatus}
              </span>
            )}
            {(profile.githubUrl || profile.linkedinUrl || profile.facebookUrl) && (
              <div className="mt-2 flex gap-5 text-footer-fg/70">
                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="transition-colors hover:text-accent-secondary"
                  >
                    <GithubIcon size={17} />
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="transition-colors hover:text-accent-secondary"
                  >
                    <LinkedinIcon size={17} />
                  </a>
                )}
                {profile.facebookUrl && (
                  <a
                    href={profile.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="transition-colors hover:text-accent-secondary"
                  >
                    <FacebookIcon size={17} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="mt-14 flex items-center justify-between border-t border-footer-fg/15 pt-6">
          <p className="font-mono text-[11px] tracking-[0.14em] text-footer-fg/55">© {year} Marcus Mallari</p>
          <a href="#top" className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-footer-fg/60 transition-colors hover:text-accent-secondary">
            <span className="underline-grow">Back to top</span>
            <ArrowUp size={13} className="transition-transform duration-300 group-hover:-translate-y-1" />
          </a>
        </div>
      </div>
    </footer>
  );
}

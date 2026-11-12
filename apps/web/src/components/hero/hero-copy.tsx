"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon, FacebookIcon } from "@/components/social-icons";

interface Props {
  availability?: string;
  email?: string;
  location?: string;
  socials: { github?: string; linkedin?: string; facebook?: string };
}

const EASE = [0.22, 1, 0.36, 1] as const;

function MaskedLine({ children, delay, reduced }: { children: React.ReactNode; delay: number; reduced: boolean | null }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        data-reveal=""
        className="block will-change-transform"
        initial={reduced ? false : { y: "112%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.85, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function HeroCopy({ availability, email, location, socials }: Props) {
  const reduced = useReducedMotion();
  const hasSocials = !!(socials.github || socials.linkedin || socials.facebook);

  const fade = (delay: number) => ({
    "data-reveal": "",
    initial: reduced ? false : ({ opacity: 0, y: 18 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: "easeOut" as const },
  });

  return (
    <div>
      <motion.p {...fade(0.15)} className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-teal">
        <span aria-hidden className="h-px w-9 bg-accent-secondary" />
        Business Informatics Student — Web Developer
      </motion.p>

      <h1 className="mt-6 font-display text-[clamp(2.7rem,9vw,4.75rem)] leading-[1.02] text-text-primary">
        <MaskedLine delay={0.25} reduced={reduced}>Building</MaskedLine>
        <MaskedLine delay={0.35} reduced={reduced}>digital solutions</MaskedLine>
        <MaskedLine delay={0.45} reduced={reduced}>
          with <span className="swipe italic text-accent-primary">purpose.</span>
        </MaskedLine>
      </h1>

      <motion.p {...fade(0.6)} className="mt-7 max-w-xl text-[15px] leading-relaxed text-text-secondary sm:text-base">
        I&apos;m Marcus — a fourth-year BSIT student majoring in Business Informatics (BAM) at PHINMA
        Araullo University. I build useful digital experiences and technology-driven business solutions —
        from scheduling and ordering systems to management applications.
      </motion.p>

      <motion.div {...fade(0.72)} className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
        <a
          href="#projects"
          className="group inline-flex items-center gap-3 bg-accent-primary px-7 py-3.5 font-mono text-[12px] font-medium uppercase tracking-[0.18em] text-on-accent transition-colors duration-300 hover:bg-bg-navy"
        >
          View My Projects
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1.5" />
        </a>
        <a
          href="#contact"
          className="group inline-flex items-center gap-3 border border-border-strong px-7 py-3.5 font-mono text-[12px] font-medium uppercase tracking-[0.18em] text-text-primary transition-colors duration-300 hover:border-accent-primary hover:text-accent-primary"
        >
          Let&apos;s Connect
          <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </motion.div>

      <motion.div {...fade(0.84)} className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
        {location && (
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-1 w-1 rounded-full bg-accent-secondary" />
            {location}
          </span>
        )}
        {availability && (
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent-secondary" />
            {availability}
          </span>
        )}
        {(hasSocials || email) && (
          <span className="inline-flex items-center gap-4">
            {socials.github && (
              <a href={socials.github} aria-label="GitHub" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-text-primary">
                <GithubIcon size={16} />
              </a>
            )}
            {socials.linkedin && (
              <a href={socials.linkedin} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-text-primary">
                <LinkedinIcon size={16} />
              </a>
            )}
            {socials.facebook && (
              <a href={socials.facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-text-primary">
                <FacebookIcon size={16} />
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="underline-grow transition-colors hover:text-text-primary">
                {email}
              </a>
            )}
          </span>
        )}
      </motion.div>
    </div>
  );
}

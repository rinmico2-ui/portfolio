"use client";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, GraduationCap, Mail } from "lucide-react";

interface Props {
  fullName: string;
  role: string;
  location?: string;
  availability?: string;
  email?: string;
  imageUrl?: string;
}

export function HeroIdentity({ fullName, role, location, availability, email, imageUrl }: Props) {
  const reduced = useReducedMotion();
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  const float = reduced
    ? {}
    : {
        animate: { y: [0, -8, 0] },
        transition: { duration: 7, repeat: Infinity, ease: "easeInOut" as const },
      };

  return (
    <div className="relative mx-auto w-full max-w-sm md:ml-auto md:mr-4" aria-hidden={false}>
      {/* Geometric composition */}
      <div aria-hidden className="pointer-events-none absolute -inset-8">
        <span className="absolute -right-2 -top-6 h-24 w-24 rounded-full border border-accent-secondary/60" />
        <span className="absolute -left-6 top-16 h-16 w-16 rotate-12 rounded-sm bg-teal/15" />
        <span className="dot-grid absolute -left-10 bottom-6 h-28 w-28 opacity-70" />
        <span className="absolute -bottom-4 right-10 h-2.5 w-2.5 rounded-full bg-accent-secondary" />
      </div>

      <motion.div
        data-reveal=""
        initial={reduced ? false : { opacity: 0, y: 32, rotate: 1.5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
        className="relative"
      >
        <motion.div
          {...float}
          className="card-shadow relative overflow-hidden rounded-xl border border-white/10 bg-bg-navy text-text-on-navy"
        >
          {/* Card header */}
          <div className="dot-grid-light flex items-center justify-between border-b border-white/10 px-6 py-5">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-accent-secondary/70 font-display text-xl text-accent-secondary">
              {initials}
            </span>
            <span className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.3em] text-text-on-navy-muted">
              Business
              <br />
              × Technology
            </span>
          </div>

          {imageUrl && (
            <div className="border-b border-white/10 px-6 py-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={fullName}
                className="aspect-[4/3] w-full rounded-lg object-cover object-[50%_30%]"
              />
            </div>
          )}

          {/* Card body */}
          <div className="px-6 py-6">
            <h2 className="font-display text-[1.7rem] leading-tight text-text-on-navy">{fullName}</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-text-on-navy-muted">{role}</p>

            <div className="mt-5 space-y-2.5 border-t border-white/10 pt-5 text-[12.5px] text-text-on-navy-muted">
              {location && (
                <p className="flex items-center gap-2.5">
                  <MapPin size={13} className="shrink-0 text-accent-secondary" />
                  {location}
                </p>
              )}
              {email && (
                <p className="flex items-center gap-2.5">
                  <Mail size={13} className="shrink-0 text-accent-secondary" />
                  <a href={`mailto:${email}`} className="transition-colors hover:text-accent-secondary" aria-label={`Email ${fullName}`}>
                    {email}
                  </a>
                </p>
              )}
              {availability && (
                <p className="flex items-center gap-2.5">
                  <span aria-hidden className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent-secondary" />
                  {availability}
                </p>
              )}
            </div>
          </div>

          {/* Card footer strip */}
          <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.03] px-6 py-3">
            <span className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] text-text-on-navy-muted">
              <GraduationCap size={12} className="text-accent-secondary" />
              BSIT — Business Informatics
            </span>
            <span className="font-mono text-[9px] tracking-[0.25em] text-accent-secondary">EST. 2022</span>
          </div>
        </motion.div>

        {/* Backdrop card for depth */}
        <span
          aria-hidden
          className="absolute -bottom-3 -right-3 -z-10 h-full w-full rounded-xl border border-border bg-bg-card"
        />
      </motion.div>
    </div>
  );
}

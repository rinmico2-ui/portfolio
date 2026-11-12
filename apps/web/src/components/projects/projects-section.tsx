"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Project } from "@portfolio/shared-types";
import { cn } from "@/lib/utils";
import { ProjectArt } from "./project-art";

interface Props {
  projects: Project[];
}

export function ProjectsSection({ projects }: Props) {
  const [active, setActive] = useState<Project | null>(null);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduced = useReducedMotion();
  const touchStartX = useRef<number | null>(null);

  const count = projects.length;
  const safeIndex = count ? Math.min(index, count - 1) : 0;
  const current = count ? projects[safeIndex] : null;

  const step = useCallback(
    (dir: number) => {
      if (!count) return;
      setDirection(dir);
      setIndex((i) => (((i + dir) % count) + count) % count);
    },
    [count],
  );

  const select = (next: number) => {
    if (!count || next === safeIndex) return;
    setDirection(next > safeIndex ? 1 : -1);
    setIndex(next);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  const regionRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = regionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!count || hovered || !inView || reduced || active) return;
    const id = setInterval(() => {
      if (!document.hidden) step(1);
    }, 6000);
    return () => clearInterval(id);
  }, [count, hovered, inView, reduced, active, index, step]);

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active, close]);

  if (!current) {
    return <p className="border-t border-border-strong py-12 text-text-secondary">No projects published yet.</p>;
  }

  const flip = safeIndex % 2 === 1;

  return (
    <>
      <div
        ref={regionRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Selected work"
        className="border-t border-border-strong"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        {/* Active slide — same editorial layout as the original list */}
        <AnimatePresence custom={direction} mode="popLayout" initial={false}>
          <motion.article
            key={current.id}
            custom={direction}
            data-reveal=""
            initial={reduced ? false : { opacity: 0, x: direction * 56 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: direction * -56 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="group relative grid items-center gap-8 py-14 md:grid-cols-2 md:gap-10 md:py-20 lg:gap-14"
          >
            {/* Ghost numeral */}
            <span
              aria-hidden
              className={cn(
                "ghost-numeral pointer-events-none absolute top-8 font-display text-[7rem] leading-none select-none md:text-[10rem]",
                flip ? "right-2 md:right-6" : "left-2 md:left-6",
              )}
            >
              {String(safeIndex + 1).padStart(2, "0")}
            </span>

            {/* Artwork */}
            <div className={cn("relative", flip ? "md:order-2" : "md:order-1")}>
              <ProjectArt slug={current.slug} coverImageUrl={current.coverImageUrl || undefined} title={current.title} />
            </div>

            {/* Copy */}
            <div className={cn("relative", flip ? "md:order-1" : "md:order-2")}>
              <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-text-secondary">
                <span className="text-accent-secondary">{current.developmentDate?.slice(0, 4)}</span>
                <span aria-hidden className="h-px w-10 bg-border-strong" />
                <span>{current.category || "Project"}</span>
              </div>
              <h3 className="mt-4 font-display text-4xl leading-[1.04] text-text-primary transition-transform duration-500 ease-out group-hover:-translate-x-1 lg:text-5xl">
                {current.title}
              </h3>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-text-secondary">
                {current.description || current.summary}
              </p>
              <p className="mt-5 max-w-lg font-mono text-[11px] uppercase tracking-[0.18em] leading-loose text-teal">
                {current.techStack.join("  /  ")}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
                {current.liveUrl && (
                  <a
                    href={current.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex items-center gap-2 font-mono text-[12px] font-medium uppercase tracking-[0.18em] text-accent-primary"
                  >
                    <span className="underline-grow">Visit live project</span>
                    <ArrowUpRight size={14} className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                  </a>
                )}
                <button
                  onClick={() => setActive(current)}
                  className="group/link inline-flex items-center gap-2 font-mono text-[12px] font-medium uppercase tracking-[0.18em] text-text-secondary transition-colors hover:text-text-primary"
                >
                  <span className="underline-grow">Case details</span>
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover/link:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>

        {/* Carousel controls */}
        <div className="flex flex-wrap items-center justify-between gap-5 border-t border-border-strong py-6">
          <div className="flex items-center gap-7">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-text-secondary">
              <span className="text-accent-secondary">{String(safeIndex + 1).padStart(2, "0")}</span>
              {" — "}
              {String(count).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-2" role="tablist" aria-label="Choose project">
              {projects.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => select(i)}
                  aria-label={`Show project ${i + 1}: ${p.title}`}
                  aria-current={i === safeIndex ? true : undefined}
                  className={cn(
                    "h-[3px] transition-all duration-300",
                    i === safeIndex ? "w-10 bg-accent-secondary" : "w-4 bg-border-strong hover:bg-accent-primary/60",
                  )}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-text-secondary/70 sm:block">
              Swipe or use arrow keys
            </span>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous project"
              className="flex h-11 w-11 items-center justify-center border border-border-strong text-text-primary transition-colors hover:border-accent-primary hover:text-accent-primary"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next project"
              className="flex h-11 w-11 items-center justify-center border border-border-strong text-text-primary transition-colors hover:border-accent-primary hover:text-accent-primary"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ Case detail modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="project-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] flex items-end justify-center bg-graphite/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={`${active.title} details`}
          >
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 56 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto border border-border-strong bg-bg-primary sm:mx-6"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-bg-primary/95 px-6 py-4 backdrop-blur sm:px-8">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-secondary">
                  Case file — {active.developmentDate?.slice(0, 4)}
                </span>
                <button
                  onClick={close}
                  aria-label="Close details"
                  className="rounded-sm p-1.5 text-text-secondary transition-colors hover:text-accent-primary"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-6 py-8 sm:px-8">
                <h3 className="font-display text-3xl leading-tight text-text-primary sm:text-4xl">{active.title}</h3>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-accent-secondary">
                  {active.category} · {active.techStack.join(" / ")}
                </p>

                <div className="mt-8 grid gap-x-10 gap-y-7 md:grid-cols-2">
                  {active.overview && (
                    <section className="md:col-span-2">
                      <h4 className="border-b border-border pb-2 font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-teal">Overview</h4>
                      <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">{active.overview}</p>
                    </section>
                  )}
                  {active.problem && (
                    <section>
                      <h4 className="border-b border-border pb-2 font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-teal">The problem</h4>
                      <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">{active.problem}</p>
                    </section>
                  )}
                  {active.objectives && active.objectives.length > 0 && (
                    <section>
                      <h4 className="border-b border-border pb-2 font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-teal">Objectives</h4>
                      <ul className="mt-3 space-y-2">
                        {active.objectives.map((o) => (
                          <li key={o} className="flex gap-2.5 text-[14px] leading-relaxed text-text-secondary">
                            <span aria-hidden className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent-secondary" />
                            {o}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {active.keyFeatures && active.keyFeatures.length > 0 && (
                    <section>
                      <h4 className="border-b border-border pb-2 font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-teal">Key features</h4>
                      <ul className="mt-3 space-y-2">
                        {active.keyFeatures.map((f) => (
                          <li key={f} className="flex gap-2.5 text-[14px] leading-relaxed text-text-secondary">
                            <span aria-hidden className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent-secondary" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {active.contributions && active.contributions.length > 0 && (
                    <section>
                      <h4 className="border-b border-border pb-2 font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-teal">My contributions</h4>
                      <ul className="mt-3 space-y-2">
                        {active.contributions.map((c) => (
                          <li key={c} className="flex gap-2.5 text-[14px] leading-relaxed text-text-secondary">
                            <span aria-hidden className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent-secondary" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>

                {active.images.length > 0 && (
                  <section className="mt-8">
                    <h4 className="border-b border-border pb-2 font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-teal">Screenshots</h4>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {active.images.map((img) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={img.id}
                          src={img.url}
                          alt={img.alt || `${active.title} screenshot`}
                          loading="lazy"
                          className="w-full border border-border object-cover"
                        />
                      ))}
                    </div>
                  </section>
                )}

                <div className="mt-10 flex flex-wrap gap-4 border-t border-border pt-6">
                  {active.liveUrl && (
                    <a
                      href={active.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-accent-primary px-6 py-3 font-mono text-[12px] font-medium uppercase tracking-[0.18em] text-on-accent transition-colors hover:bg-bg-navy"
                    >
                      Visit live project <ArrowUpRight size={14} />
                    </a>
                  )}
                  {active.githubUrl && (
                    <a
                      href={active.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-border-strong px-6 py-3 font-mono text-[12px] font-medium uppercase tracking-[0.18em] text-text-primary transition-colors hover:border-accent-primary hover:text-accent-primary"
                    >
                      Source code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

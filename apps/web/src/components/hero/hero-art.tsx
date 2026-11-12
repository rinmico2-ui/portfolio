"use client";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Hero portrait composition: the owner's photograph inside the editorial
 * framed layout (rotating Business × Technology inscription, registration
 * ticks, layered scroll parallax). Falls back to a pure "MM" monogram
 * when no portrait is available.
 */
export function HeroArt({ imageUrl, fullName }: { imageUrl?: string; fullName: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yFrame = useTransform(scrollYProgress, [0, 1], [26, -26]);
  const yRing = useTransform(scrollYProgress, [0, 1], [48, -48]);
  const yBack = useTransform(scrollYProgress, [0, 1], [14, -14]);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[26rem] md:ml-auto md:mr-2">
      {/* Layered geometry behind the frame */}
      <div aria-hidden className="pointer-events-none absolute -inset-10">
        <motion.span style={reduced ? undefined : { y: yBack }} className="absolute -left-2 top-10 block h-36 w-36 bg-sage/40" />
        <motion.span style={reduced ? undefined : { y: yRing }} className="absolute -right-6 bottom-8 block h-24 w-24 rounded-full border border-accent-secondary/70" />
        <span className="dot-grid absolute -left-8 bottom-0 block h-28 w-28 opacity-80" />
        <span className="absolute -top-2 right-14 block h-2 w-2 rotate-45 bg-accent-secondary" />
      </div>

      {/* Main frame */}
      <motion.div
        style={reduced ? undefined : { y: yFrame }}
        initial={reduced ? false : { opacity: 0, y: 36, rotate: 0.5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative border border-border-strong bg-bg-primary p-1.5 shadow-[0_24px_60px_-30px_rgba(23,56,47,0.35)]"
      >
        <div className="relative overflow-hidden border border-border bg-white px-6 pb-7 pt-8 sm:px-8">
          {/* Registration ticks */}
          <span aria-hidden className="absolute left-3 top-3 h-3 w-3 border-l border-t border-accent-primary/60" />
          <span aria-hidden className="absolute right-3 top-3 h-3 w-3 border-r border-t border-accent-primary/60" />
          <span aria-hidden className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-accent-primary/60" />
          <span aria-hidden className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-accent-primary/60" />

          {/* Rotating circular inscription */}
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
            className="pointer-events-none absolute right-4 top-4 z-10 h-20 w-20 sm:right-5 sm:top-5 sm:h-24 sm:w-24"
          >
            <span className="absolute inset-0 rounded-full bg-white/80" aria-hidden />
            <svg viewBox="0 0 100 100" className="spin-slow relative h-full w-full">
              <defs>
                <path id="ring-path" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
              </defs>
              <text className="fill-accent-primary font-mono" style={{ fontSize: "7.2px", letterSpacing: "0.18em" }}>
                <textPath href="#ring-path">
                  BUSINESS × TECHNOLOGY · NUEVA ECIJA ·
                </textPath>
              </text>
            </svg>
            <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-secondary" />
          </motion.div>

          {imageUrl ? (
            <motion.figure
              initial={reduced ? false : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative mt-8"
            >
              <div className="overflow-hidden border border-border-strong">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={`${fullName} portrait`}
                  loading="eager"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover object-[50%_30%]"
                />
              </div>
              <div className="mt-5 flex items-end justify-between gap-4 border-t border-border pt-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-secondary">{fullName}</p>
                  <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-accent-secondary">
                    BSIT — Business Informatics
                  </p>
                </div>
                <p className="shrink-0 text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.28em] text-text-secondary">
                  Est.
                  <br />
                  2022
                </p>
              </div>
            </motion.figure>
          ) : (
            <>
              {/* Monogram */}
              <div className="relative mt-14">
                <motion.span
                  initial={reduced ? false : { opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="block font-display text-[7.5rem] leading-[0.85] text-accent-primary sm:text-[8.5rem]"
                >
                  M<span className="italic text-accent-secondary">M</span>
                </motion.span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-1 block h-px w-4/5 origin-left bg-accent-primary/50"
                />
              </div>

              {/* Meta rows */}
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
                className="mt-7 flex items-end justify-between gap-4 border-t border-border pt-5"
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-secondary">{fullName}</p>
                  <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-accent-secondary">
                    BSIT — Business Informatics
                  </p>
                </div>
                <p className="shrink-0 text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.28em] text-text-secondary">
                  Est.
                  <br />
                  2022
                </p>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>

      {/* Vertical caption */}
      <motion.p
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.15 }}
        className="vertical-label absolute -right-9 top-1/2 hidden -translate-y-1/2 font-mono text-[9px] uppercase tracking-[0.35em] text-text-secondary/70 lg:block"
      >
        Building with purpose — MM
      </motion.p>
    </div>
  );
}

"use client";
import { motion, useReducedMotion } from "framer-motion";
import { CoverImage } from "@/components/cover-image";

/**
 * Abstract technical artwork for each project — stylized, palette-native
 * compositions that evoke what each system does. Deliberately NOT fake
 * screenshots; they act as editorial illustration until real screenshots
 * are uploaded through the admin dashboard.
 */

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  const reduced = useReducedMotion();
  return (
    <div className="dot-grid relative flex h-full min-h-[16rem] items-center justify-center overflow-hidden border border-border-strong bg-bg-primary p-8 transition-transform duration-500 group-hover:scale-[1.015] sm:min-h-[19rem]">
      <div className="relative">{children}</div>
      <span className="absolute bottom-3 left-4 font-mono text-[9px] uppercase tracking-[0.3em] text-text-secondary/70">
        {label}
      </span>
      <span aria-hidden className="absolute right-3 top-3 h-2.5 w-2.5 border-t border-r border-accent-primary/50" />
      <span aria-hidden className="absolute bottom-3 right-3 h-2.5 w-2.5 border-b border-r border-accent-primary/50" />
      <motion.span
        aria-hidden
        animate={reduced ? undefined : { x: [0, 8, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-6 top-8 h-px w-16 bg-accent-secondary/60"
      />
    </div>
  );
}

/** 01 — Smart Scheduling System: weekly grid with a gold "now" cell */
function SchedulerArt() {
  const reduced = useReducedMotion();
  const cells = Array.from({ length: 28 });
  const filled = new Set([2, 5, 9, 12, 16, 19, 23, 26]);
  const gold = 16;
  return (
    <Frame label="Fig. 01 — Schedule Grid">
      <svg width="220" height="180" viewBox="0 0 220 180" className="overflow-visible">
        <rect x="0" y="0" width="220" height="180" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" />
        {cells.map((_, i) => {
          const col = i % 7;
          const row = Math.floor(i / 7);
          return (
            <rect
              key={i}
              x={10 + col * 29}
              y={22 + row * 37}
              width="26"
              height="34"
              fill={
                i === gold
                  ? "var(--accent-secondary)"
                  : filled.has(i)
                    ? "color-mix(in srgb, var(--accent-primary) 22%, transparent)"
                    : "transparent"
              }
              stroke="color-mix(in srgb, var(--accent-primary) 45%, transparent)"
              strokeWidth="1"
            />
          );
        })}
        <line x1="10" y1="14" x2="210" y2="14" stroke="var(--accent-primary)" strokeWidth="1" />
        <motion.g
          animate={reduced ? undefined : { y: [0, -4, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect x={10 + (16 % 7) * 29 - 3} y={22 + Math.floor(16 / 7) * 37 - 3} width="32" height="40" fill="none" stroke="var(--accent-secondary)" strokeWidth="1.5" />
        </motion.g>
      </svg>
    </Frame>
  );
}

/** 02 — Shoe Ordering System: storefront card stack with a gold tag */
function StoreArt() {
  const reduced = useReducedMotion();
  return (
    <Frame label="Fig. 02 — Storefront Stack">
      <svg width="220" height="180" viewBox="0 0 220 180" className="overflow-visible">
        <rect x="14" y="26" width="150" height="118" fill="color-mix(in srgb, var(--accent-primary) 12%, transparent)" stroke="color-mix(in srgb, var(--accent-primary) 40%, transparent)" strokeWidth="1" />
        <rect x="30" y="40" width="150" height="118" fill="var(--bg-secondary)" stroke="var(--accent-primary)" strokeWidth="1.5" />
        <rect x="42" y="52" width="58" height="46" fill="color-mix(in srgb, var(--accent-primary) 20%, transparent)" stroke="var(--accent-primary)" strokeWidth="1" />
        <line x1="112" y1="58" x2="168" y2="58" stroke="var(--accent-primary)" strokeWidth="1.5" />
        <line x1="112" y1="72" x2="156" y2="72" stroke="color-mix(in srgb, var(--accent-primary) 55%, transparent)" strokeWidth="1" />
        <line x1="112" y1="86" x2="162" y2="86" stroke="color-mix(in srgb, var(--accent-primary) 55%, transparent)" strokeWidth="1" />
        <rect x="42" y="116" width="72" height="16" fill="var(--accent-primary)" />
        <line x1="42" y1="146" x2="168" y2="146" stroke="var(--border-strong)" strokeWidth="1" />
        <motion.g
          animate={reduced ? undefined : { y: [0, -5, 0], rotate: [0, -2, 0] }}
          transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "160px 40px" }}
        >
          <circle cx="160" cy="40" r="17" fill="var(--accent-secondary)" />
          <text x="160" y="44" textAnchor="middle" className="fill-bg-navy font-mono" style={{ fontSize: "10px", fontWeight: 500 }}>
            PHP
          </text>
        </motion.g>
      </svg>
    </Frame>
  );
}

/** 03 — Payroll System: ledger lines with a gold seal */
function PayrollArt() {
  const reduced = useReducedMotion();
  return (
    <Frame label="Fig. 03 — Payroll Ledger">
      <svg width="220" height="180" viewBox="0 0 220 180" className="overflow-visible">
        <rect x="10" y="14" width="200" height="152" fill="var(--bg-secondary)" stroke="var(--accent-primary)" strokeWidth="1.5" />
        <rect x="10" y="14" width="200" height="26" fill="color-mix(in srgb, var(--accent-primary) 14%, transparent)" />
        <line x1="10" y1="40" x2="210" y2="40" stroke="var(--accent-primary)" strokeWidth="1" />
        {[54, 76, 98, 120, 142].map((y, i) => (
          <g key={y}>
            <rect x="24" y={y} width={64 - i * 6} height="7" fill="color-mix(in srgb, var(--accent-primary) 30%, transparent)" />
            <rect x="150" y={y} width="34" height="7" fill="var(--accent-secondary)" opacity={0.9 - i * 0.13} />
          </g>
        ))}
        <motion.g
          animate={reduced ? undefined : { scale: [1, 1.06, 1] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "178px 132px" }}
        >
          <circle cx="178" cy="132" r="21" fill="none" stroke="var(--accent-secondary)" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="178" y="137" textAnchor="middle" className="fill-accent-primary font-mono" style={{ fontSize: "10px", fontWeight: 500 }}>
            PAID
          </text>
        </motion.g>
      </svg>
    </Frame>
  );
}

const ART: Record<string, React.ReactNode> = {
  "smart-scheduling-system": <SchedulerArt />,
  "shoe-ordering-system": <StoreArt />,
  "simple-payroll-management-system": <PayrollArt />,
};

export function ProjectArt({ slug, coverImageUrl, title }: { slug: string; coverImageUrl?: string; title: string }) {
  if (coverImageUrl) {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden border border-border-strong bg-white transition-transform duration-500 group-hover:scale-[1.015]">
        <CoverImage
          src={coverImageUrl}
          alt={`${title} screenshot`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <span aria-hidden className="absolute right-3 top-3 block h-2.5 w-2.5 border-r border-t border-accent-primary/70" />
        <span aria-hidden className="absolute bottom-3 left-3 block h-2.5 w-2.5 border-b border-l border-accent-primary/70" />
        <span className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-[0.3em] text-white/85 [text-shadow:0_1px_4px_rgba(23,56,47,0.7)]">
          {title} — screenshot
        </span>
      </div>
    );
  }
  return <>{ART[slug] ?? <SchedulerArt />}</>;
}

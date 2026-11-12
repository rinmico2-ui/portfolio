import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./animated/reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
  index?: string;
  tone?: "light" | "navy";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
  index,
  tone = "light",
}: SectionHeadingProps) {
  const navy = tone === "navy";
  return (
    <Reveal
      className={cn(
        "relative flex flex-col gap-5 border-t pt-7",
        navy ? "border-footer-fg/20" : "border-border-strong",
        align === "center" ? "items-center text-center" : null,
        action ? "sm:flex-row sm:items-end sm:justify-between" : null,
        className,
      )}
    >
      {index && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute -top-2 right-0 font-display text-[5.5rem] leading-none select-none md:text-[7rem]",
            navy ? "ghost-numeral-dark" : "ghost-numeral",
          )}
        >
          {index}
        </span>
      )}
      <span
        aria-hidden
        className={cn("absolute -top-px left-0 h-[3px] w-14 bg-accent-secondary", align === "center" && "left-1/2 -translate-x-1/2")}
      />
      <div>
        {eyebrow && (
          <p
            className={cn(
              "flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.3em]",
              navy ? "text-accent-secondary" : "text-teal",
              align === "center" && "justify-center",
            )}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            "mt-4 font-display text-4xl leading-[1.05] md:text-[3.4rem]",
            navy ? "text-footer-fg" : "text-text-primary",
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "mt-4 max-w-xl text-[15px] leading-relaxed",
              navy ? "text-footer-fg/70" : "text-text-secondary",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}

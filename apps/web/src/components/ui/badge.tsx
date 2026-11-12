import * as React from "react";
import { cn } from "@/lib/utils";
export function Badge({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border border-border bg-bg-secondary px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

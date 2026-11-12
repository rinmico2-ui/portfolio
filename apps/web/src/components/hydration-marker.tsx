"use client";
import { useEffect } from "react";

/**
 * Marks <html data-hydrated> once React has taken over. Combined with the
 * data-js inline script, the CSS safety net can distinguish:
 *  - no JS at all  -> reveal everything statically
 *  - JS ran but React never hydrated -> reveal after a short delay
 *  - everything fine -> keep scroll-triggered animations
 */
export function HydrationMarker() {
  useEffect(() => {
    document.documentElement.setAttribute("data-hydrated", "");
  }, []);
  return null;
}

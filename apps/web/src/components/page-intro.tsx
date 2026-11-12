"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/** How long the curtain holds before lifting (ms). */
const INTRO_DURATION = 2000;
/** Keep in sync with the exit transition duration below. */
const EXIT_DURATION = 700;
/** Extra time to let a redirect render behind the curtain before lifting. */
const REDIRECT_GRACE = 500;

/**
 * One-time editorial page-load reveal: a Dark Evergreen curtain with the
 * serif monogram that holds briefly, then lifts away and lands on the home
 * page. Shown once per browser session, skipped entirely for reduced-motion
 * users and inside the admin app.
 */
export function PageIntro() {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => {
    if (reduced) return;
    if (pathname.startsWith("/admin")) return;

    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem("mm-intro") === "1";
      if (!alreadyShown) sessionStorage.setItem("mm-intro", "1");
    } catch {
      // Private mode: fall back to once per component mount.
      alreadyShown = shownRef.current;
      shownRef.current = true;
    }
    if (alreadyShown) return;

    setShow(true);

    // Deliberately NOT cleared on cleanup: React StrictMode remounts every
    // effect (mount -> unmount -> mount) in dev, and a cleared timer would
    // leave the curtain stuck open forever. The timer only flips local
    // state and restores scroll, so letting it run is safe.
    setTimeout(() => {
      if (pathname !== "/") {
        router.push("/");
        // Let the home page render behind the curtain before lifting.
        setTimeout(() => setShow(false), REDIRECT_GRACE);
      } else {
        setShow(false);
      }
    }, INTRO_DURATION);
  }, [reduced, pathname, router]);

  // Lock page scroll exactly while the curtain is up.
  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="page-intro"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: EXIT_DURATION / 1000, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-navy"
          aria-hidden
        >
          <div className="flex flex-col items-center gap-5">
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="font-display text-5xl text-text-on-navy"
            >
              M<span className="text-accent-secondary">.</span> MALLARI
            </motion.span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="h-px w-24 origin-left bg-accent-secondary"
            />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="font-mono text-[10px] uppercase tracking-[0.35em] text-text-on-navy-muted"
            >
              Business × Technology
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

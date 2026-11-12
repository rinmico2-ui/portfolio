"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Download } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#top", label: "Home", index: "01" },
  { href: "/#about", label: "About", index: "02" },
  { href: "/#projects", label: "Projects", index: "03" },
  { href: "/#experience", label: "Experience", index: "04" },
  { href: "/#skills", label: "Skills", index: "05" },
  { href: "/#education", label: "Education", index: "06" },
  { href: "/#certifications", label: "Certificates", index: "07" },
  { href: "/#contact", label: "Contact", index: "08" },
];

export function Navbar({ resumeUrl, email }: { resumeUrl?: string; email?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onHash = () => setActiveSection(window.location.hash.slice(1) || "top");
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;

    const sections = navLinks
      .map((link) => document.getElementById(link.href.slice(2)))
      .filter((section): section is HTMLElement => section !== null);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const isActive = (href: string) => pathname === "/" && activeSection === href.slice(2);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-border bg-bg-primary/92 shadow-[0_10px_30px_-24px_rgba(23,56,47,0.4)] backdrop-blur-md"
            : "border-b border-transparent bg-bg-primary",
        )}
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex h-16 items-center justify-between md:h-[4.5rem]">
            <Link
              href="/"
              className="font-display text-lg tracking-[0.06em] transition-opacity hover:opacity-70"
              aria-label="Marcus Mallari — home"
            >
              M<span className="text-accent-secondary">.</span> MALLARI
            </Link>
            <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={isActive(l.href) ? true : undefined}
                  className={cn(
                    "group relative py-2 text-[13px] tracking-wide transition-colors duration-200 focus-visible:text-text-primary",
                    isActive(l.href) ? "text-text-primary" : "text-text-secondary hover:text-text-primary",
                  )}
                >
                  {l.label}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-[2px] w-full origin-left bg-accent-secondary transition-all duration-300 ease-out",
                      isActive(l.href)
                        ? "scale-x-100 opacity-100"
                        : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-60 group-focus-visible:scale-x-100 group-focus-visible:opacity-60",
                    )}
                  />
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  download
                  className="hidden items-center gap-1.5 border border-border-strong px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-text-primary transition-colors hover:border-accent-primary hover:text-accent-primary sm:inline-flex"
                >
                  <Download size={13} /> Resume
                </a>
              )}
              <button
                className="flex items-center gap-2 py-2 pl-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-text-primary lg:hidden"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
              >
                Menu
                <span aria-hidden className="flex flex-col gap-1">
                  <span className="block h-px w-6 bg-text-primary" />
                  <span className="block h-px w-4 bg-accent-secondary" />
                </span>
              </button>
            </div>
          </div>
        </div>
        {!reduced && (
          <motion.div
            style={{ scaleX: progress }}
            className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-accent-secondary"
            aria-hidden
          />
        )}
      </header>

      {/* Full-screen editorial mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[90] flex flex-col bg-bg-navy text-text-on-navy lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex items-center justify-between px-5 py-4 sm:px-8">
              <span className="font-display text-lg tracking-[0.06em]">
                M<span className="text-accent-secondary">.</span> MALLARI
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex items-center gap-2 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-text-on-navy"
              >
                Close <span aria-hidden className="relative block h-4 w-4"><span className="absolute left-0 top-1/2 block h-px w-4 rotate-45 bg-current" /><span className="absolute left-0 top-1/2 block h-px w-4 -rotate-45 bg-current" /></span>
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center px-5 sm:px-8" aria-label="Mobile">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(l.href) ? true : undefined}
                    className={cn(
                      "group flex items-baseline gap-4 border-b border-white/10 py-3.5 transition-colors sm:py-4",
                      isActive(l.href) ? "text-accent-secondary" : "text-text-on-navy hover:text-accent-secondary",
                    )}
                  >
                    <span className="font-mono text-[10px] tracking-[0.25em] text-text-on-navy-muted">{l.index}</span>
                    <span className="font-display text-4xl leading-none transition-transform duration-300 group-hover:translate-x-1.5 sm:text-5xl">
                      {l.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.4 }}
              className="flex flex-wrap items-center justify-between gap-3 px-5 pb-8 pt-4 sm:px-8"
            >
              {email && (
                <a href={`mailto:${email}`} className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-on-navy-muted transition-colors hover:text-accent-secondary">
                  {email}
                </a>
              )}
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  download
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-accent-secondary"
                >
                  Download resume <ArrowUpRight size={13} />
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

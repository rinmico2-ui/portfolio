"use client";
import { useCallback, useEffect, useState } from "react";
import { Award, ExternalLink, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Certification } from "@portfolio/shared-types";

export function CertificationsSection({ certifications }: { certifications: Certification[] }) {
  const [active, setActive] = useState<Certification | null>(null);
  const reduced = useReducedMotion();

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

  if (certifications.length === 0) {
    return (
      <motion.div
        data-reveal=""
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="flex flex-col items-center gap-3 rounded-none border border-dashed border-border-strong bg-bg-card/60 px-6 py-14 text-center"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-secondary text-text-secondary">
          <Award size={22} />
        </span>
        <p className="font-display text-xl text-text-primary">Certifications coming soon</p>
        <p className="max-w-md text-sm leading-relaxed text-text-secondary">
          Certificates and achievements are being compiled and will be published here â€” complete with
          issuing organizations, dates, and verifiable previews.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((c, i) => (
          <motion.button
            key={c.id}
            type="button"
            data-reveal=""
            onClick={() => setActive(c)}
            initial={reduced ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: "easeOut" }}
            className="card-shadow card-shadow-hover group overflow-hidden rounded-none border border-border bg-bg-card text-left"
            aria-label={`View ${c.name}`}
          >
            <div className="flex h-44 items-center justify-center overflow-hidden border-b border-border bg-bg-secondary p-4">
              {c.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.imageUrl}
                  alt={c.name}
                  loading="lazy"
                  className="max-h-full w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                />
              ) : (
                <span className="text-text-secondary/50">
                  <Award size={40} strokeWidth={1.25} />
                </span>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg leading-snug text-text-primary">{c.name}</h3>
              <p className="mt-1 text-sm text-text-secondary">{c.issuer}</p>
              <p className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-teal">
                {c.issueDate ? new Date(c.issueDate).toLocaleDateString("en-US", { year: "numeric", month: "long" }) : ""}
                {c.expiryDate
                  ? ` â€” ${new Date(c.expiryDate).toLocaleDateString("en-US", { year: "numeric", month: "long" })}`
                  : ""}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-accent-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                View certificate <ExternalLink size={12} />
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            key="cert-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-bg-navy/70 p-4 backdrop-blur-sm sm:p-8"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={active.name}
          >
            <motion.figure
              initial={reduced ? false : { opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-full w-full max-w-3xl overflow-hidden rounded-none bg-bg-card"
            >
              <button
                onClick={close}
                aria-label="Close certificate view"
                className="absolute right-3 top-3 z-10 rounded-full bg-bg-primary/90 p-2 text-text-secondary shadow-sm transition-colors hover:text-text-primary"
              >
                <X size={18} />
              </button>
              <div className="flex max-h-[70vh] items-center justify-center overflow-auto bg-bg-secondary p-4">
                {active.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={active.imageUrl}
                    alt={active.name}
                    className="max-h-[68vh] w-auto max-w-full rounded object-contain"
                  />
                ) : (
                  <span className="py-20 text-text-secondary/50">
                    <Award size={64} strokeWidth={1} />
                  </span>
                )}
              </div>
              <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4">
                <div>
                  <p className="font-display text-lg leading-snug text-text-primary">{active.name}</p>
                  <p className="text-sm text-text-secondary">{active.issuer}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal">
                    {active.issueDate
                      ? new Date(active.issueDate).toLocaleDateString("en-US", { year: "numeric", month: "long" })
                      : ""}
                  </span>
                  {active.credentialUrl && (
                    <a
                      href={active.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-primary hover:underline"
                    >
                      Credential <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

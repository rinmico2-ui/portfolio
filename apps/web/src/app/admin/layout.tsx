"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, Wrench, Briefcase, GraduationCap, Award, FileText, MessageSquare, Settings, LogOut, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/analytics", label: "Analytics", icon: LayoutDashboard },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const nav = (
    <>
      <div className="font-display text-lg tracking-[0.08em] mb-6">M. MALLARI <span className="text-text-secondary text-sm">Admin</span></div>
      <nav className="space-y-1" aria-label="Admin">
        {items.map(it => (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
              pathname === it.href
                ? "bg-bg-card text-text-primary font-medium"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-card",
            )}
          >
            <it.icon size={16}/> {it.label}
          </Link>
        ))}
      </nav>
      <form action="/api/admin/logout" method="POST" className="mt-6">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-text-secondary hover:text-text-primary w-full">
          <LogOut size={16}/> Logout
        </button>
      </form>
    </>
  );

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-bg-primary/95 px-4 py-3 backdrop-blur md:hidden">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          aria-expanded={open}
          className="rounded-md p-2 text-text-secondary transition-colors hover:text-text-primary"
        >
          <Menu size={20}/>
        </button>
        <span className="font-display text-[15px] tracking-[0.08em]">M. MALLARI <span className="text-text-secondary text-xs">Admin</span></span>
        <span className="w-9" aria-hidden />
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 h-screen w-64 shrink-0 border-r border-border bg-bg-secondary/40 p-4 hidden md:block overflow-y-auto">
          {nav}
        </aside>

        {/* Mobile drawer */}
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                key="admin-drawer-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
                aria-hidden
              />
              <motion.aside
                key="admin-drawer"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] overflow-y-auto border-r border-border bg-bg-primary p-5 md:hidden"
                aria-label="Admin navigation"
              >
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close admin menu"
                  className="absolute right-3 top-3 rounded-md p-2 text-text-secondary transition-colors hover:text-text-primary"
                >
                  <X size={18}/>
                </button>
                {nav}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="min-w-0 flex-1 p-4 sm:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}

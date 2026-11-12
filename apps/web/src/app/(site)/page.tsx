import { getDb } from "@/lib/store";
import { Phone, MapPin, GraduationCap, Award, Briefcase, Monitor, Server, Database, Cloud, GitBranch, PieChart, Wrench, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/animated/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ContactForm } from "@/components/contact-form";
import { ProjectsSection } from "@/components/projects/projects-section";
import { CertificationsSection } from "@/components/certifications/certifications-section";
import { HeroArt } from "@/components/hero/hero-art";
import { HeroCopy } from "@/components/hero/hero-copy";

export const dynamic = "force-dynamic";

const MARQUEE_ITEMS = [
  "Smart Scheduling",
  "E-Commerce",
  "Payroll Systems",
  "Business × Technology",
  "Web Development",
  "Project Coordination",
];

// Enterprise-style narrative order: build → platform → engineering practice → business → environment
const SKILL_GROUP_ORDER = [
  "frontend-development",
  "backend-development",
  "database-and-cloud-technologies",
  "cloud-and-deployment-platforms",
  "version-control-and-collaboration",
  "business-informatics",
  "development-tools",
  "productivity",
  "professional-skills",
];

const SKILL_GROUP_ICONS: Record<string, LucideIcon> = {
  "frontend-development": Monitor,
  "backend-development": Server,
  "database-and-cloud-technologies": Database,
  "cloud-and-deployment-platforms": Cloud,
  "version-control-and-collaboration": GitBranch,
  "business-informatics": PieChart,
  "development-tools": Wrench,
  productivity: Briefcase,
  "professional-skills": Users,
};

export default function HomePage() {
  const db = getDb();
  const profile = db.profile;
  const projects = db.projects
    .filter((p) => p.status === "published")
    .sort((a, b) => (b.developmentDate || "").localeCompare(a.developmentDate || ""));
  const experiences = [...db.experiences].sort((a, b) => a.displayOrder - b.displayOrder);
  const education = [...db.education].sort((a, b) => a.displayOrder - b.displayOrder);
  const certifications = [...db.certifications].sort((a, b) => a.displayOrder - b.displayOrder);
  const skillGroups = db.skillCategories
    .map((cat) => ({
      category: cat,
      skills: db.skills
        .filter((s) => s.categoryId === cat.id)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    }))
    .filter((g) => g.skills.length > 0)
    .sort((a, b) => {
      const rank = (slug?: string) => {
        const i = SKILL_GROUP_ORDER.indexOf(slug ?? "");
        return i === -1 ? SKILL_GROUP_ORDER.length : i;
      };
      return rank(a.category.slug) - rank(b.category.slug);
    });
  const bioParagraphs = (profile.biography || "").split(/\n\n+/).filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.fullName,
    jobTitle: profile.professionalTitle,
    email: profile.email ? `mailto:${profile.email}` : undefined,
    telephone: profile.phone || undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Carranglan",
      addressRegion: "Nueva Ecija",
      addressCountry: "PH",
    },
    alumniOf: { "@type": "CollegeOrUniversity", name: "PHINMA Araullo University" },
    knowsAbout: ["Web Development", "Business Informatics", "Project Management", "SQL", "Node.js"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ------------------------------------------------ Hero */}
      <section id="top" className="relative overflow-hidden">
        <div aria-hidden className="dot-grid pointer-events-none absolute inset-x-0 top-0 h-96 opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div aria-hidden className="pointer-events-none absolute -left-40 top-56 h-80 w-80 rounded-full border border-border" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-5 pb-20 pt-12 sm:px-8 md:pt-16 lg:grid-cols-[1.2fr_1fr] lg:pb-28">
          <HeroCopy
            availability={profile.availabilityStatus}
            email={profile.email}
            location={profile.location}
            socials={{
              github: profile.githubUrl || undefined,
              linkedin: profile.linkedinUrl || undefined,
              facebook: profile.facebookUrl || undefined,
            }}
          />
          <HeroArt imageUrl={profile.profileImageUrl || undefined} fullName={profile.fullName} />
        </div>
      </section>

      {/* ------------------------------------------------ Marquee strip */}
      <div className="overflow-hidden border-y border-bg-navy/20 bg-bg-navy py-3.5 text-text-on-navy" aria-hidden>
        <div className="marquee-wrap">
          <div className="marquee-track" style={{ ["--marquee-duration" as string]: "40s" }}>
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {MARQUEE_ITEMS.map((item) => (
                  <span key={`${copy}-${item}`} className="flex items-center font-mono text-[11px] uppercase tracking-[0.3em]">
                    <span className="px-6">{item}</span>
                    <span className="text-accent-secondary">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ About */}
      <section id="about" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
        <SectionHeading eyebrow="Introduction" title={<>About <span className="italic text-accent-primary">Me</span></>} index="01" />
        <div className="mt-12 grid gap-12 lg:grid-cols-[1.35fr_1fr]">
          <div className="space-y-6">
            {bioParagraphs.map((para, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p className={i === 0 ? "dropcap text-[17px] leading-[1.75] text-text-primary" : "text-[15px] leading-[1.8] text-text-secondary"}>
                  {para}
                </p>
              </Reveal>
            ))}
          </div>
          <div className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            {profile.profileImageUrl && (
              <Reveal delay={0.1}>
                <figure>
                  <div className="border border-border-strong bg-bg-secondary p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profile.profileImageUrl}
                      alt={profile.fullName}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover object-[50%_28%]"
                    />
                  </div>
                  <figcaption className="mt-2.5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.25em] text-text-secondary">
                    <span>{profile.fullName}</span>
                    <span className="text-accent-secondary">Portrait</span>
                  </figcaption>
                </figure>
              </Reveal>
            )}
            <Reveal delay={0.16}>
              <dl className="divide-y divide-border border-y border-border">
                {[
                  { term: "Role", value: "Business Informatics Student | Web Developer | Project Manager" },
                  { term: "Location", value: profile.location || "" },
                  { term: "Education", value: "BSIT — Business Informatics" },
                  { term: "Status", value: profile.availabilityStatus || "" },
                ].map((row) => (
                  <div key={row.term} className="flex items-baseline justify-between gap-6 py-3.5">
                    <dt className="shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">{row.term}</dt>
                    <dd className="text-right text-[13px] font-medium leading-snug text-text-primary">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={0.22}>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-secondary">Professional positioning</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {[
                    "Web Development",
                    "Business Information Systems",
                    "Database Management",
                    "Business Process Solutions",
                    "System Analysis and Development",
                    "Project Coordination",
                  ].map((c) => (
                    <li
                      key={c}
                      className="border border-border-strong bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-text-primary"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
        <div className="mt-16 grid gap-10 border-t border-border-strong pt-12 md:grid-cols-3">
          {[
            { n: "01", t: "Understand the process", d: "Map how work really gets done before writing any code." },
            { n: "02", t: "Design the system", d: "Turn that process into clear data flows and a usable interface." },
            { n: "03", t: "Build the product", d: "Ship small, test with real users, and keep improving." },
          ].map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <p className="font-display text-2xl italic text-accent-secondary">{s.n}</p>
              <h3 className="mt-2 font-display text-2xl text-text-primary">{s.t}</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-secondary">{s.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ Projects */}
      <section id="projects" className="border-y border-border-strong bg-bg-secondary">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
          <SectionHeading
            eyebrow="Portfolio"
            title={<>Selected <span className="italic text-accent-primary">Work</span></>}
            description="Systems I designed and built during my studies — each one solving a concrete problem."
            index="02"
          />
          <div className="mt-14">
            {projects.length > 0 ? (
              <ProjectsSection projects={projects} />
            ) : (
              <p className="text-text-secondary">No projects published yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Experience */}
      <section id="experience" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
        <SectionHeading
          eyebrow="Journey"
          title={<>Experience &amp; <span className="italic text-accent-primary">Leadership</span></>}
          description="Coordinating the work while staying close to the code."
          index="03"
        />
        <div className="relative mt-14">
          <span aria-hidden className="absolute bottom-3 left-[7px] top-3 w-px bg-border-strong md:left-[calc(12rem+7px)]" />
          {experiences.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.06}>
              <article className="relative grid gap-4 pb-14 md:grid-cols-[12rem_1fr] md:gap-12">
                <div className="relative">
                  <span
                    aria-hidden
                    className="absolute -left-[0px] top-2 h-[15px] w-[15px] rotate-45 border-2 border-accent-secondary bg-bg-primary md:left-[12rem]"
                  />
                  <p className="pl-8 font-mono text-[11px] uppercase tracking-[0.22em] text-text-secondary md:pl-10">
                    {e.startDate.slice(0, 4)} — {e.current ? "Present" : e.endDate ? e.endDate.slice(0, 4) : ""}
                  </p>
                  {e.location && (
                    <p className="mt-1.5 pl-8 font-mono text-[10px] uppercase tracking-[0.22em] text-teal md:pl-10">
                      {e.location}
                    </p>
                  )}
                </div>
                <div className="pl-8 md:pl-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <Briefcase size={15} className="text-accent-primary" />
                    <h3 className="font-display text-3xl leading-snug text-text-primary">{e.position}</h3>
                  </div>
                  <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-teal-deep">{e.company}</p>
                  <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-text-secondary">{e.description}</p>
                  {e.responsibilities.length > 0 && (
                    <ul className="mt-6 grid max-w-2xl gap-x-10 gap-y-2.5 sm:grid-cols-2">
                      {e.responsibilities.map((r) => (
                        <li key={r} className="flex gap-3 text-sm leading-relaxed text-text-secondary">
                          <span aria-hidden className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent-secondary" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  )}
                  {e.achievements.length > 0 && (
                    <div className="mt-6 max-w-2xl border-l-2 border-accent-secondary bg-bg-secondary/70 px-5 py-4">
                      {e.achievements.map((a) => (
                        <p key={a} className="flex items-start gap-3 text-sm text-text-primary">
                          <Award size={14} className="mt-0.5 shrink-0 text-accent-secondary" />
                          {a}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
          {experiences.length === 0 && <p className="text-text-secondary">No experience entries yet.</p>}
        </div>
      </section>

      {/* ------------------------------------------------ Skills */}
      <section id="skills" className="relative overflow-hidden bg-footer-bg text-footer-fg">
        <div aria-hidden className="dot-grid-light pointer-events-none absolute inset-x-0 bottom-0 h-48 opacity-40 [mask-image:linear-gradient(to_top,black,transparent)]" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
          <SectionHeading
            tone="navy"
            eyebrow="Capabilities"
            title={<>Skills &amp; <span className="italic text-accent-secondary">Toolkit</span></>}
            description="The technologies I build with, the tools I rely on, and the professional skills I bring to a team."
            index="04"
          />
          {/* Skills matrix — hairline-divider grid, uniform enterprise cards */}
          <div className="mt-14 grid gap-px overflow-hidden border border-footer-fg/15 bg-footer-fg/15 sm:grid-cols-2 lg:grid-cols-3">
            {skillGroups.map((g, gi) => {
              const Icon = SKILL_GROUP_ICONS[g.category.slug] ?? Wrench;
              return (
                <Reveal key={g.category.id} delay={gi * 0.05} className="h-full">
                  <article className="group flex h-full flex-col bg-footer-bg p-6 transition-colors duration-300 hover:bg-[#1c4035] sm:p-7">
                    <header className="flex items-center justify-between gap-3 border-b border-footer-fg/10 pb-4">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <Icon size={15} strokeWidth={1.5} aria-hidden className="shrink-0 text-accent-secondary" />
                        <h3 className="truncate font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-footer-fg/85">
                          {g.category.name}
                        </h3>
                      </div>
                      <span aria-hidden className="shrink-0 font-mono text-[10px] tracking-[0.25em] text-footer-fg/35">
                        {String(g.skills.length).padStart(2, "0")}
                      </span>
                    </header>
                    <ul className="mt-4 flex flex-1 flex-wrap content-start gap-1.5">
                      {g.skills.map((s) => (
                        <li
                          key={s.id}
                          className="border border-footer-fg/15 px-2.5 py-[7px] text-[12px] leading-none text-footer-fg/90 transition-colors duration-200 hover:border-accent-secondary/60 hover:text-accent-secondary"
                        >
                          {s.name.trim()}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Education */}
      <section id="education" className="border-y border-border-strong bg-bg-secondary">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
          <SectionHeading
            eyebrow="Academics"
            title={<>Academic <span className="italic text-accent-primary">Background</span></>}
            index="05"
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {education.map((ed, i) => (
              <Reveal key={ed.id} delay={i * 0.08}>
                <article className="relative h-full border border-border-strong bg-bg-primary p-8">
                  <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-accent-secondary" />
                  <div className="flex items-start gap-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-accent-primary text-accent-secondary">
                      <GraduationCap size={22} />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-accent-primary">
                          {ed.status || (ed.endDate ? "Completed" : "In progress")}
                        </span>
                        <span aria-hidden className="h-px w-6 bg-border-strong" />
                        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary">
                          {ed.startDate ? ed.startDate.slice(0, 4) : ""} — {ed.endDate ? ed.endDate.slice(0, 4) : "Present"}
                        </span>
                      </div>
                      <h3 className="mt-3.5 font-display text-2xl leading-snug text-text-primary sm:text-[1.7rem]">{ed.degree}</h3>
                      <p className="mt-2 text-sm font-medium text-text-primary">{ed.institution}</p>
                      {ed.fieldOfStudy && (
                        <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.16em] text-teal">
                          Major — {ed.fieldOfStudy}
                        </p>
                      )}
                      {ed.description && (
                        <p className="mt-4 text-sm leading-relaxed text-text-secondary">{ed.description}</p>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Certifications */}
      <section id="certifications" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
        <SectionHeading
          eyebrow="Credentials"
          title={<>Certifications &amp; <span className="italic text-accent-primary">Achievements</span></>}
          description="Certificates that back up the skills — verified and on display."
          index="06"
        />
        <div className="mt-14">
          <CertificationsSection certifications={certifications} />
        </div>
      </section>

      {/* ------------------------------------------------ Contact */}
      <section id="contact" className="mx-auto max-w-6xl px-5 pb-24 pt-2 sm:px-8">
        <Reveal>
          <div className="border border-bg-navy/40 bg-bg-navy text-text-on-navy shadow-[0_40px_80px_-50px_rgba(23,56,47,0.6)]">
            <div className="grid lg:grid-cols-[1fr_1.15fr]">
              <div className="relative p-8 sm:p-10 lg:p-14">
                <span aria-hidden className="dot-grid-light pointer-events-none absolute inset-0 opacity-25" />
                <div className="relative">
                  <p className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-accent-secondary">
                    <span aria-hidden className="h-px w-9 bg-accent-secondary" />
                    Contact
                  </p>
                  <h2 className="mt-5 font-display text-4xl leading-[1.08] sm:text-5xl">
                    Let&apos;s build something <span className="italic text-accent-secondary">together.</span>
                  </h2>
                  <p className="mt-5 max-w-md text-[15px] leading-relaxed text-text-on-navy-muted">
                    Have a project, internship, or collaboration in mind? Send me a message.
                  </p>

                  <a
                    href={profile.email ? `mailto:${profile.email}` : "#"}
                    className="group mt-9 inline-block font-display text-xl transition-colors hover:text-accent-secondary sm:text-2xl"
                  >
                    <span className="underline-grow">{profile.email}</span>
                  </a>

                  <dl className="mt-10 space-y-5 border-t border-white/10 pt-8">
                    {profile.phone && (
                      <div className="flex items-baseline gap-4">
                        <dt className="w-20 shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-text-on-navy-muted/70">Phone</dt>
                        <dd>
                          <a
                            href={`tel:${profile.phone.replace(/\s/g, "")}`}
                            className="inline-flex items-center gap-2.5 text-[15px] text-text-on-navy transition-colors hover:text-accent-secondary"
                          >
                            <Phone size={14} className="text-accent-secondary" /> {profile.phone}
                          </a>
                        </dd>
                      </div>
                    )}
                    {profile.location && (
                      <div className="flex items-baseline gap-4">
                        <dt className="w-20 shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-text-on-navy-muted/70">Based in</dt>
                        <dd className="inline-flex items-center gap-2.5 text-[15px] text-text-on-navy">
                          <MapPin size={14} className="text-accent-secondary" /> {profile.location}
                        </dd>
                      </div>
                    )}
                  </dl>

                  {(profile.githubUrl || profile.linkedinUrl || profile.facebookUrl) && (
                    <div className="mt-8 flex gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-text-on-navy-muted">
                      {profile.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent-secondary">GitHub ↗</a>}
                      {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent-secondary">LinkedIn ↗</a>}
                      {profile.facebookUrl && <a href={profile.facebookUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent-secondary">Facebook ↗</a>}
                    </div>
                  )}
                </div>
              </div>
              <div className="border-t border-white/10 bg-bg-primary p-8 text-text-primary sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
                <ContactForm />
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

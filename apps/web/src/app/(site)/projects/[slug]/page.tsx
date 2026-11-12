"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Project } from "@portfolio/shared-types";
import { GitBranch, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { CoverImage } from "@/components/cover-image";

function DetailSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 border-t border-border pt-7">
      <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-teal">{label}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function ProjectDetailInner() {
  const params = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`/api/projects/${params.slug}`).then(r => r.json()).then(j => { setProject(j.data); setLoading(false); });
  }, [params.slug]);
  if (loading) return <div className="mx-auto max-w-3xl px-5 py-12 text-text-secondary">Loading...</div>;
  if (!project) return <div className="mx-auto max-w-3xl px-5 py-12">Not found.</div>;
  return (
    <article className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <Link href="/#projects" className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary mb-8">
        <ArrowLeft size={15} /> All projects
      </Link>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal">
        {project.developmentDate?.slice(0, 4)}
        {project.category ? ` — ${project.category}` : ""}
      </p>
      <h1 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">{project.title}</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-text-secondary">{project.summary}</p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.techStack.map(t => (
          <span key={t} className="rounded border border-border bg-bg-secondary px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-secondary">
            {t}
          </span>
        ))}
      </div>
      {(project.liveUrl || project.githubUrl) && (
        <div className="mt-7 flex flex-wrap gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[3px] bg-accent-primary px-5 py-2.5 font-mono text-[12px] font-medium uppercase tracking-[0.16em] text-on-accent transition-colors hover:bg-bg-navy"
            >
              View project <ExternalLink size={14} />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[3px] border border-border px-5 py-2.5 font-mono text-[12px] font-medium uppercase tracking-[0.16em] text-text-primary transition-colors hover:border-accent-primary hover:text-accent-primary"
            >
              Source code <GitBranch size={14} />
            </a>
          )}
        </div>
      )}
      {project.coverImageUrl && (
        <CoverImage
          src={project.coverImageUrl}
          alt={project.title}
          className="mt-10 aspect-[16/10] w-full border border-border object-cover"
        />
      )}
      <div className="mt-10">
        <p className="text-[15px] leading-relaxed text-text-secondary">{project.description}</p>
        {project.overview && (
          <DetailSection label="Overview"><p className="text-[15px] leading-relaxed text-text-secondary">{project.overview}</p></DetailSection>
        )}
        {project.problem && (
          <DetailSection label="The problem"><p className="text-[15px] leading-relaxed text-text-secondary">{project.problem}</p></DetailSection>
        )}
        {project.objectives && project.objectives.length > 0 && (
          <DetailSection label="Objectives">
            <ul className="space-y-2">
              {project.objectives.map(o => (
                <li key={o} className="flex gap-2.5 text-[15px] leading-relaxed text-text-secondary">
                  <span aria-hidden className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-accent-secondary" /> {o}
                </li>
              ))}
            </ul>
          </DetailSection>
        )}
        {project.keyFeatures && project.keyFeatures.length > 0 && (
          <DetailSection label="Key features">
            <ul className="space-y-2">
              {project.keyFeatures.map(f => (
                <li key={f} className="flex gap-2.5 text-[15px] leading-relaxed text-text-secondary">
                  <span aria-hidden className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-accent-secondary" /> {f}
                </li>
              ))}
            </ul>
          </DetailSection>
        )}
        {project.contributions && project.contributions.length > 0 && (
          <DetailSection label="My contributions">
            <ul className="space-y-2">
              {project.contributions.map(c => (
                <li key={c} className="flex gap-2.5 text-[15px] leading-relaxed text-text-secondary">
                  <span aria-hidden className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-accent-secondary" /> {c}
                </li>
              ))}
            </ul>
          </DetailSection>
        )}
        {project.images.length > 0 && (
          <DetailSection label="Screenshots">
            <div className="grid gap-4 sm:grid-cols-2">
              {project.images.map(img => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={img.id}
                  src={img.url}
                  alt={img.alt || project.title}
                  loading="lazy"
                  className="w-full border border-border object-cover"
                />
              ))}
            </div>
          </DetailSection>
        )}
      </div>
    </article>
  );
}

export default function ProjectDetailPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-5 py-12 text-text-secondary">Loading...</div>}>
      <ProjectDetailInner />
    </Suspense>
  );
}

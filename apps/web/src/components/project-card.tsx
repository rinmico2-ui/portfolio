import Link from "next/link";
import { Project } from "@portfolio/shared-types";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ExternalLink } from "lucide-react";
import { CoverImage } from "@/components/cover-image";

export function ProjectCard({ project }: { project: Project }) {
  const year = project.developmentDate?.slice(0, 4);
  return (
    <article className="group flex h-full flex-col">
      <Link href={`/projects/${project.slug}`} aria-label={project.title}>
        <div className="overflow-hidden rounded-lg border border-border bg-bg-secondary transition-colors duration-300 group-hover:border-accent-primary/50">
          {project.coverImageUrl ? (
            <CoverImage
              src={project.coverImageUrl}
              alt={project.title}
              className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-1.5 transition-colors group-hover:bg-bg-card">
              <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">Screenshot</span>
              <span className="px-4 text-center font-display text-lg font-semibold text-text-secondary/60">
                {project.title}
              </span>
            </div>
          )}
        </div>
      </Link>
      <div className="mt-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-text-secondary">
        {year && <span className="text-accent-primary">{year}</span>}
        {project.category && <span>{project.category}</span>}
      </div>
      <h3 className="mt-2 font-display text-xl font-semibold tracking-tight">
        <Link href={`/projects/${project.slug}`} className="transition-colors hover:text-accent-primary">
          {project.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">{project.summary}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.techStack.slice(0, 4).map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-5 text-sm">
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1 text-accent-primary hover:underline"
        >
          Details <ArrowRight size={13} />
        </Link>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-text-secondary transition-colors hover:text-text-primary"
          >
            <ExternalLink size={13} /> Live
          </a>
        )}
      </div>
    </article>
  );
}

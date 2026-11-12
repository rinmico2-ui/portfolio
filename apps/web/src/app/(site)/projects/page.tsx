"use client";
import { useEffect, useState } from "react";
import { Project } from "@portfolio/shared-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";
import { Search } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/animated/reveal";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    const res = await fetch(`/api/projects?${params.toString()}`);
    const json = await res.json();
    setProjects(json.data?.items || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const categories = Array.from(new Set(projects.map(p => p.category).filter(Boolean)));

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <SectionHeading
        eyebrow="Portfolio"
        title="Projects"
        description="A selection of my recent work."
      />
      <Reveal delay={0.1}>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <Input className="pl-9" placeholder="Search projects..." value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && load()} />
          </div>
          <select
            value={category}
            onChange={e => { setCategory(e.target.value); }}
            className="rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary transition-colors hover:border-text-secondary/40 focus:border-accent-primary focus:outline-none"
          >
            <option value="">All categories</option>
            {categories.map(c => <option key={c} value={c!}>{c}</option>)}
          </select>
          <Button onClick={load}>Search</Button>
        </div>
      </Reveal>
      {loading ? (
        <div className="mt-10 text-text-secondary">Loading...</div>
      ) : (
        <RevealGroup className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3" delayStep={0.08}>
          {projects.map(p => (
            <RevealItem key={p.id}>
              <ProjectCard project={p} />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
      {!loading && projects.length === 0 && <p className="mt-10 text-text-secondary">No projects found.</p>}
    </div>
  );
}

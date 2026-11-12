"use client";
import { useEffect, useState } from "react";
import { BlogPost } from "@portfolio/shared-types";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/section-heading";
import { RevealGroup, RevealItem } from "@/components/animated/reveal";
import { Clock } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [tagNames, setTagNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/blog").then(r=>r.json()).then(j=>{ setPosts(j.data?.items || []); setLoading(false); });
    fetch("/api/blog-categories").then(r=>r.json()).then(j=>{
      const map: Record<string, string> = {};
      for (const t of j.data?.tags || []) map[t.id] = t.name;
      setTagNames(map);
    }).catch(() => {});
  }, []);
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <SectionHeading
        eyebrow="Writing"
        title="Blog"
        description="Thoughts, tutorials, and insights."
      />
      {loading ? <div className="mt-10 text-text-secondary">Loading...</div> : (
        <RevealGroup className="mt-10 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3" delayStep={0.08}>
          {posts.map(p => (
            <RevealItem key={p.id}>
              <Link href={`/blog/${p.slug}`} className="group block h-full">
                <div className="h-full rounded-lg border border-border bg-bg-card p-5 transition-colors duration-200 hover:border-text-secondary/30">
                  <h3 className="font-semibold text-lg transition-colors group-hover:text-accent-primary">{p.title}</h3>
                  <p className="mt-2 text-sm text-text-secondary line-clamp-3">{p.excerpt}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-text-secondary">
                    <span>{new Date(p.publishedAt||p.createdAt).toLocaleDateString()}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} /> {p.readingTimeMinutes} min read
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.tagIds.filter(t => tagNames[t]).map(t => <Badge key={t}>{tagNames[t]}</Badge>)}
                  </div>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      )}
      {!loading && posts.length === 0 && <p className="mt-10 text-text-secondary">No articles yet.</p>}
    </div>
  );
}

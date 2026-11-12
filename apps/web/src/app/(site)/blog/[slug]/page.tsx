"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BlogPost } from "@portfolio/shared-types";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Suspense } from "react";

function BlogDetailInner() {
  const params = useParams<{ slug: string }>();
  const [data, setData] = useState<{ post: BlogPost; related: BlogPost[] } | null>(null);
  const [dateStr, setDateStr] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`/api/blog/${params.slug}`).then(r=>r.json()).then(j=>{ setData(j.data); if (j.data?.post) setDateStr(new Date(j.data.post.publishedAt || j.data.post.createdAt).toLocaleDateString()); setLoading(false); });
  }, [params.slug]);
  if (loading) return <div className="mx-auto max-w-3xl px-4 py-12 text-text-secondary">Loading...</div>;
  if (!data?.post) return <div className="mx-auto max-w-3xl px-4 py-12">Not found.</div>;
  const { post, related } = data;
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-6"><ArrowLeft size={16}/> Back</Link>
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{post.title}</h1>
      <div className="mt-3 flex items-center gap-3 text-sm text-text-secondary">
        <span className="inline-flex items-center gap-1"><Calendar size={14}/> {dateStr}</span>
        <span className="inline-flex items-center gap-1"><Clock size={14}/> {post.readingTimeMinutes} min read</span>
        <span>by {post.authorName}</span>
      </div>
      <article className="mt-8 text-text-secondary whitespace-pre-wrap leading-relaxed">{post.content}</article>
      {related?.length > 0 && (
        <div className="mt-12">
          <h3 className="font-display text-xl font-semibold mb-4">Related Articles</h3>
          <div className="grid gap-3">
            {related.map(r => (
              <Link key={r.id} href={`/blog/${r.slug}`} className="block rounded-lg border border-border p-4 transition-colors hover:border-text-secondary/30">
                <div className="font-medium">{r.title}</div>
                <div className="text-sm text-text-secondary">{r.excerpt}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


export default function BlogDetailPage() {
  return <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-12 text-text-secondary">Loading...</div>}><BlogDetailInner/></Suspense>;
}

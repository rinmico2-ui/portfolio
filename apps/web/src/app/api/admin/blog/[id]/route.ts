import { NextResponse } from "next/server";
import { getDb, now } from "@/lib/store";
import { readingTimeMinutes } from "@portfolio/shared-utils";
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: pid } = await params;
  const p = getDb().blogPosts.find(x=>x.id===pid);
  if (!p) return NextResponse.json({ success:false, error:"Not found"},{status:404});
  return NextResponse.json({ success:true, data: p });
}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: pid } = await params;
  const body = await req.json().catch(()=>({}));
  const db = getDb();
  const idx = db.blogPosts.findIndex(x=>x.id===pid);
  if (idx===-1) return NextResponse.json({ success:false, error:"Not found"},{status:404});
  const content = body.content ?? db.blogPosts[idx].content;
  db.blogPosts[idx] = { ...db.blogPosts[idx], ...body, readingTimeMinutes: readingTimeMinutes(content), updatedAt: now() };
  if (body.status === "published" && !db.blogPosts[idx].publishedAt) db.blogPosts[idx].publishedAt = now();
  const { saveDb } = await import("@/lib/store"); saveDb();
  return NextResponse.json({ success:true, data: db.blogPosts[idx] });
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: pid } = await params;
  const db = getDb();
  db.blogPosts = db.blogPosts.filter(x=>x.id!==pid);
  const { saveDb } = await import("@/lib/store"); saveDb();
  return NextResponse.json({ success:true });
}

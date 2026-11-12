import { NextResponse } from "next/server";
import { getDb, id, now } from "@/lib/store";
import { readingTimeMinutes } from "@portfolio/shared-utils";
export async function GET() { return NextResponse.json({ success: true, data: getDb().blogPosts }); }
export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  const db = getDb();
  const post = {
    id: id(),
    title: body.title || "Untitled",
    slug: body.slug || (body.title||"untitled").toLowerCase().replace(/\s+/g,"-"),
    excerpt: body.excerpt || "",
    content: body.content || "",
    coverImageUrl: body.coverImageUrl || "",
    categoryId: body.categoryId,
    tagIds: body.tagIds || [],
    status: body.status || "draft",
    featured: !!body.featured,
    publishedAt: body.status === "published" ? (body.publishedAt || now()) : undefined,
    scheduledAt: body.scheduledAt,
    readingTimeMinutes: readingTimeMinutes(body.content || ""),
    seoTitle: body.seoTitle,
    seoDescription: body.seoDescription,
    views: 0,
    authorName: body.authorName || db.profile.fullName,
    createdAt: now(),
    updatedAt: now(),
  };
  db.blogPosts.unshift(post);
  const { saveDb } = await import("@/lib/store"); saveDb();
  return NextResponse.json({ success: true, data: post });
}

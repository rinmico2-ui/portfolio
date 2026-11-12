import { NextResponse } from "next/server";
import { getDb } from "@/lib/store";
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getDb().blogPosts.find(p => p.slug === slug && p.status === "published");
  if (!post) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  post.views += 1;
  const related = getDb().blogPosts.filter(p => p.id !== post.id && p.status === "published" && p.categoryId === post.categoryId).slice(0,3);
  return NextResponse.json({ success: true, data: { post, related } });
}

import { NextResponse } from "next/server";
import { getDb } from "@/lib/store";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.toLowerCase() || "";
  const category = url.searchParams.get("category") || "";
  const featured = url.searchParams.get("featured");
  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = parseInt(url.searchParams.get("pageSize") || "12");
  let items = getDb().blogPosts.filter(p => p.status === "published");
  if (q) items = items.filter(p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
  if (category) items = items.filter(p => p.categoryId === category);
  if (featured === "true") items = items.filter(p => p.featured);
  items.sort((a,b) => new Date(b.publishedAt||b.createdAt).getTime() - new Date(a.publishedAt||a.createdAt).getTime());
  const total = items.length;
  const paged = items.slice((page-1)*pageSize, page*pageSize);
  return NextResponse.json({ success: true, data: { items: paged, total, page, pageSize, totalPages: Math.ceil(total/pageSize) } });
}

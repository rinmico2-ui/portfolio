import { NextResponse } from "next/server";
import { getDb } from "@/lib/store";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.toLowerCase() || "";
  const category = url.searchParams.get("category") || "";
  const featured = url.searchParams.get("featured");
  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = parseInt(url.searchParams.get("pageSize") || "12");
  let items = getDb().projects.filter(p => p.status === "published");
  if (q) items = items.filter(p => p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.techStack.some(t=>t.toLowerCase().includes(q)));
  if (category) items = items.filter(p => p.category === category);
  if (featured === "true") items = items.filter(p => p.featured);
  const total = items.length;
  const paged = items.slice((page-1)*pageSize, page*pageSize);
  return NextResponse.json({ success: true, data: { items: paged, total, page, pageSize, totalPages: Math.ceil(total/pageSize) } });
}

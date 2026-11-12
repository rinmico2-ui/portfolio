import { NextResponse } from "next/server";
import { getDb } from "@/lib/store";
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getDb().projects.find(p => p.slug === slug && p.status === "published");
  if (!project) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  project.views += 1;
  return NextResponse.json({ success: true, data: project });
}

import { NextResponse } from "next/server";
import { getDb, id, now } from "@/lib/store";
export async function GET() {
  return NextResponse.json({ success: true, data: getDb().projects });
}
export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  const title = String(body.title || "").trim() || "Untitled";
  const slug = String(body.slug || title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `project-${Date.now().toString(36)}`;
  const db = getDb();
  if (db.projects.some(p => p.slug === slug && p.id !== body.id)) {
    return NextResponse.json({ success: false, error: "A project with this slug already exists" }, { status: 400 });
  }
  const project = {
    id: id(),
    title,
    slug,
    summary: String(body.summary || ""),
    description: String(body.description || ""),
    overview: body.overview ? String(body.overview) : undefined,
    problem: body.problem ? String(body.problem) : undefined,
    objectives: Array.isArray(body.objectives) ? body.objectives.map(String).filter(Boolean) : [],
    keyFeatures: Array.isArray(body.keyFeatures) ? body.keyFeatures.map(String).filter(Boolean) : [],
    contributions: Array.isArray(body.contributions) ? body.contributions.map(String).filter(Boolean) : [],
    coverImageUrl: body.coverImageUrl || "",
    category: body.category || "",
    techStack: Array.isArray(body.techStack) ? body.techStack.map(String).filter(Boolean) : [],
    status: ["draft", "published", "archived"].includes(body.status) ? body.status : "draft",
    featured: !!body.featured,
    liveUrl: body.liveUrl || "",
    githubUrl: body.githubUrl || "",
    developmentDate: body.developmentDate || "",
    images: Array.isArray(body.images) ? body.images : [],
    views: 0,
    createdAt: now(),
    updatedAt: now(),
  };
  db.projects.unshift(project);
  const { saveDb } = await import("@/lib/store");
  saveDb();
  return NextResponse.json({ success: true, data: project });
}

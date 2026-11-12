import { NextResponse } from "next/server";
import { getDb, now } from "@/lib/store";
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: pid } = await params;
  const p = getDb().projects.find(x => x.id === pid);
  if (!p) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: p });
}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: pid } = await params;
  const body = await req.json().catch(()=>({}));
  const db = getDb();
  const idx = db.projects.findIndex(x => x.id === pid);
  if (idx === -1) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  db.projects[idx] = { ...db.projects[idx], ...body, updatedAt: now() };
  const { saveDb } = await import("@/lib/store");
  saveDb();
  return NextResponse.json({ success: true, data: db.projects[idx] });
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: pid } = await params;
  const db = getDb();
  db.projects = db.projects.filter(x => x.id !== pid);
  const { saveDb } = await import("@/lib/store");
  saveDb();
  return NextResponse.json({ success: true });
}

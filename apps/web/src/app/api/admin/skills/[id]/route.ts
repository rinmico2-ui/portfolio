import { NextResponse } from "next/server";
import { getDb, now } from "@/lib/store";
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: sid } = await params;
  const body = await req.json().catch(()=>({}));
  const db = getDb();
  const idx = db.skills.findIndex(x => x.id === sid);
  if (idx === -1) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  db.skills[idx] = { ...db.skills[idx], ...body, updatedAt: now() };
  const { saveDb } = await import("@/lib/store");
  saveDb();
  return NextResponse.json({ success: true, data: db.skills[idx] });
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: sid } = await params;
  const db = getDb();
  db.skills = db.skills.filter(x => x.id !== sid);
  const { saveDb } = await import("@/lib/store");
  saveDb();
  return NextResponse.json({ success: true });
}

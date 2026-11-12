import { NextResponse } from "next/server";
import { getDb, now } from "@/lib/store";
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: eid } = await params;
  const body = await req.json().catch(()=>({}));
  const db = getDb();
  const idx = db.experiences.findIndex(x=>x.id===eid);
  if (idx===-1) return NextResponse.json({ success:false, error:"Not found"},{status:404});
  db.experiences[idx] = { ...db.experiences[idx], ...body, updatedAt: now() };
  const { saveDb } = await import("@/lib/store"); saveDb();
  return NextResponse.json({ success:true, data: db.experiences[idx] });
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: eid } = await params;
  const db = getDb();
  db.experiences = db.experiences.filter(x=>x.id!==eid);
  const { saveDb } = await import("@/lib/store"); saveDb();
  return NextResponse.json({ success:true });
}

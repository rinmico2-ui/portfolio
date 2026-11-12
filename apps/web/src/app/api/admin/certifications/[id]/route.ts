import { NextResponse } from "next/server";
import { getDb, now } from "@/lib/store";
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: cid } = await params;
  const body = await req.json().catch(()=>({}));
  const db = getDb();
  const idx = db.certifications.findIndex(x=>x.id===cid);
  if (idx===-1) return NextResponse.json({ success:false, error:"Not found"},{status:404});
  db.certifications[idx] = { ...db.certifications[idx], ...body, updatedAt: now() };
  const { saveDb } = await import("@/lib/store"); saveDb();
  return NextResponse.json({ success:true, data: db.certifications[idx] });
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: cid } = await params;
  const db = getDb();
  db.certifications = db.certifications.filter(x=>x.id!==cid);
  const { saveDb } = await import("@/lib/store"); saveDb();
  return NextResponse.json({ success:true });
}

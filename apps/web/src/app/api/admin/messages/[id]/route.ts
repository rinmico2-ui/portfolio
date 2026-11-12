import { NextResponse } from "next/server";
import { getDb } from "@/lib/store";
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: mid } = await params;
  const body = await req.json().catch(()=>({}));
  const db = getDb();
  const idx = db.contactMessages.findIndex(x=>x.id===mid);
  if (idx===-1) return NextResponse.json({ success:false, error:"Not found"},{status:404});
  db.contactMessages[idx] = { ...db.contactMessages[idx], ...body };
  const { saveDb } = await import("@/lib/store"); saveDb();
  return NextResponse.json({ success:true, data: db.contactMessages[idx] });
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: mid } = await params;
  const db = getDb();
  db.contactMessages = db.contactMessages.filter(x=>x.id!==mid);
  const { saveDb } = await import("@/lib/store"); saveDb();
  return NextResponse.json({ success:true });
}


import { NextResponse } from "next/server";
import { getDb, now } from "@/lib/store";
export async function GET() { return NextResponse.json({ success:true, data: getDb().siteSettings }); }
export async function PUT(req: Request) {
  const body = await req.json().catch(()=>({}));
  const db = getDb();
  db.siteSettings = { ...db.siteSettings, ...body, updatedAt: now() };
  const { saveDb } = await import("@/lib/store"); saveDb();
  return NextResponse.json({ success:true, data: db.siteSettings });
}

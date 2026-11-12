import { NextResponse } from "next/server";
import { getDb, id, now } from "@/lib/store";
export async function GET() { return NextResponse.json({ success: true, data: getDb().education }); }
export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  const db = getDb();
  const e = { id: id(), institution: body.institution||"", degree: body.degree||"", fieldOfStudy: body.fieldOfStudy, startDate: body.startDate, endDate: body.endDate, description: body.description, displayOrder: body.displayOrder ?? db.education.length+1, createdAt: now(), updatedAt: now() };
  db.education.unshift(e);
  const { saveDb } = await import("@/lib/store"); saveDb();
  return NextResponse.json({ success: true, data: e });
}

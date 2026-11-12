import { NextResponse } from "next/server";
import { getDb, id, now } from "@/lib/store";
export async function GET() { return NextResponse.json({ success: true, data: getDb().experiences }); }
export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  const db = getDb();
  const e = { id: id(), company: body.company||"", position: body.position||"", location: body.location, startDate: body.startDate||"", endDate: body.endDate, current: !!body.current, description: body.description||"", responsibilities: body.responsibilities||[], technologies: body.technologies||[], achievements: body.achievements||[], displayOrder: body.displayOrder ?? db.experiences.length+1, createdAt: now(), updatedAt: now() };
  db.experiences.unshift(e);
  const { saveDb } = await import("@/lib/store"); saveDb();
  return NextResponse.json({ success: true, data: e });
}

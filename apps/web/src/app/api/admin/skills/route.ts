import { NextResponse } from "next/server";
import { getDb, id, now } from "@/lib/store";
export async function GET() {
  return NextResponse.json({ success: true, data: { categories: getDb().skillCategories, skills: getDb().skills } });
}
export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  const db = getDb();
  const skill = { id: id(), name: body.name || "Skill", categoryId: body.categoryId || db.skillCategories[0]?.id, proficiency: body.proficiency, iconUrl: body.iconUrl, displayOrder: body.displayOrder ?? db.skills.length+1, createdAt: now(), updatedAt: now() };
  db.skills.push(skill);
  const { saveDb } = await import("@/lib/store");
  saveDb();
  return NextResponse.json({ success: true, data: skill });
}

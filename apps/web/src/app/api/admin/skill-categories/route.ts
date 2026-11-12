import { NextResponse } from "next/server";
import { getDb, id } from "@/lib/store";
export async function GET() {
  return NextResponse.json({ success: true, data: getDb().skillCategories });
}
export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  const db = getDb();
  const cat = { id: id(), name: body.name || "Category", slug: (body.name||"category").toLowerCase().replace(/\s+/g,"-"), displayOrder: body.displayOrder ?? db.skillCategories.length+1 };
  db.skillCategories.push(cat);
  const { saveDb } = await import("@/lib/store");
  saveDb();
  return NextResponse.json({ success: true, data: cat });
}

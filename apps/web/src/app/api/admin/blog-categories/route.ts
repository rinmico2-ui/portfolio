import { NextResponse } from "next/server";
import { getDb, id } from "@/lib/store";
export async function GET() { return NextResponse.json({ success: true, data: { categories: getDb().blogCategories, tags: getDb().blogTags } }); }
export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  const db = getDb();
  const type = body.type; // category or tag
  if (type === "tag") {
    const t = { id: id(), name: body.name, slug: (body.name||"").toLowerCase().replace(/\s+/g,"-") };
    db.blogTags.push(t); const { saveDb } = await import("@/lib/store"); saveDb();
    return NextResponse.json({ success:true, data: t });
  }
  const c = { id: id(), name: body.name, slug: (body.name||"").toLowerCase().replace(/\s+/g,"-") };
  db.blogCategories.push(c); const { saveDb } = await import("@/lib/store"); saveDb();
  return NextResponse.json({ success:true, data: c });
}

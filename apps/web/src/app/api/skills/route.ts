import { NextResponse } from "next/server";
import { getDb } from "@/lib/store";
export async function GET() {
  const db = getDb();
  return NextResponse.json({ success: true, data: { categories: db.skillCategories, skills: db.skills } });
}

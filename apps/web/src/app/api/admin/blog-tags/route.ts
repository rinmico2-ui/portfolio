import { NextResponse } from "next/server";
import { getDb } from "@/lib/store";
export async function GET() { return NextResponse.json({ success: true, data: getDb().blogTags }); }

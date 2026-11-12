import { NextResponse } from "next/server";
import { getDb, now, saveDb } from "@/lib/store";

const MAX_EVENTS = 5000;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const type = typeof body.type === "string" && body.type ? body.type.slice(0, 40) : "pageview";
    const path = typeof body.path === "string" && body.path ? body.path.slice(0, 120) : undefined;
    const db = getDb();
    db.analytics.push({ type, path, createdAt: now() });
    if (db.analytics.length > MAX_EVENTS) {
      db.analytics = db.analytics.slice(-MAX_EVENTS);
    }
    saveDb();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

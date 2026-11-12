import { NextResponse } from "next/server";
import { getDb, id, now } from "@/lib/store";
export async function GET() { return NextResponse.json({ success: true, data: getDb().certifications }); }
export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  const db = getDb();
  const c = { id: id(), name: body.name||"", issuer: body.issuer||"", issueDate: body.issueDate, expiryDate: body.expiryDate, credentialUrl: body.credentialUrl, imageUrl: body.imageUrl||"", displayOrder: body.displayOrder ?? db.certifications.length+1, createdAt: now(), updatedAt: now() };
  db.certifications.unshift(c);
  const { saveDb } = await import("@/lib/store"); saveDb();
  return NextResponse.json({ success: true, data: c });
}

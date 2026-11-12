import { NextResponse } from "next/server";
import { getDb } from "@/lib/store";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const q = url.searchParams.get("q")?.toLowerCase() || "";
  let items = getDb().contactMessages;
  if (status) items = items.filter(m=>m.status===status);
  if (q) items = items.filter(m=>m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q));
  return NextResponse.json({ success:true, data: items });
}

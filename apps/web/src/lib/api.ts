import { NextResponse } from "next/server";

export function ok<T>(data: T, message?: string) {
  return NextResponse.json({ success: true, data, message });
}
export function fail(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}
export function parseBody<T = any>(req: Request): Promise<T> {
  return req.json().catch(() => ({} as T));
}

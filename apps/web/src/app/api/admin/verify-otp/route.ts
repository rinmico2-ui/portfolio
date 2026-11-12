import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

const otpStore = (globalThis as any).__OTP_STORE__ || ((globalThis as any).__OTP_STORE__ = new Map());

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { email, otp } = body || {};
  const key = String(email || "").toLowerCase();
  const entry = otpStore.get(key);
  if (!entry || Date.now() > entry.exp || entry.code !== String(otp).trim()) {
    return NextResponse.json({ success: false, error: "Invalid or expired OTP" }, { status: 401 });
  }
  otpStore.delete(key);
  const token = await signSession(key);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, sessionCookieOptions);
  return NextResponse.json({ success: true });
}

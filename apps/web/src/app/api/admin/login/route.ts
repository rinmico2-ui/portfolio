import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/store";
import { verifyPassword, hashPassword, isLegacyHash } from "@/lib/auth";
import { sendOtpEmail } from "@/lib/email";
import crypto from "crypto";

const SECRET = process.env.CAPTCHA_SECRET || process.env.AUTH_SECRET || "portfolio-captcha-secret";

function verifyCaptcha(token: string, answer: string) {
  try {
    const [data, sig] = token.split(".");
    const expected = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
    if (sig !== expected) return false;
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
    if (Date.now() > payload.exp) return false;
    return String(payload.answer) === String(answer).trim();
  } catch {
    return false;
  }
}

const otpStore = (globalThis as any).__OTP_STORE__ || ((globalThis as any).__OTP_STORE__ = new Map());
const attemptStore = (globalThis as any).__LOGIN_ATTEMPTS__ || ((globalThis as any).__LOGIN_ATTEMPTS__ = new Map());

const MAX_FAILS = 8;
const WINDOW_MS = 15 * 60 * 1000;

function rateLimited(ip: string): number {
  const entry = attemptStore.get(ip);
  if (!entry) return 0;
  if (entry.until && Date.now() < entry.until) return Math.ceil((entry.until - Date.now()) / 1000);
  return 0;
}

function recordFail(ip: string) {
  const entry = attemptStore.get(ip) || { fails: 0 };
  entry.fails = (entry.fails || 0) + 1;
  if (entry.fails >= MAX_FAILS) {
    entry.until = Date.now() + WINDOW_MS;
    entry.fails = 0;
  }
  attemptStore.set(ip, entry);
}

function clearFails(ip: string) {
  attemptStore.delete(ip);
}

/**
 * Ensure the admin user configured via ADMIN_EMAIL / ADMIN_PASSWORD env vars
 * exists (and is stored hashed). Runs on every login attempt so env changes
 * take effect without reseeding.
 */
function ensureAdminFromEnv() {
  const email = (process.env.ADMIN_EMAIL || "").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  if (!email || !password) return;
  const db = getDb();
  const existing = db.adminUsers.find((u) => u.email.toLowerCase() === email);
  if (!existing) {
    db.adminUsers.push({ id: `admin-${Date.now().toString(36)}`, email, passwordHash: hashPassword(password), role: "admin" });
    saveDb();
  } else if (isLegacyHash(existing.passwordHash) || !verifyPassword(password, existing.passwordHash)) {
    // Keep the stored hash in sync with the configured env password.
    existing.passwordHash = hashPassword(password);
    saveDb();
  }
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "local";
    const wait = rateLimited(ip);
    if (wait > 0) {
      return NextResponse.json(
        { success: false, error: `Too many attempts. Try again in ${wait}s.` },
        { status: 429 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const { email, password, captchaToken, captchaAnswer } = body || {};
    if (!verifyCaptcha(captchaToken || "", captchaAnswer || "")) {
      recordFail(ip);
      return NextResponse.json({ success: false, error: "Invalid captcha" }, { status: 400 });
    }

    ensureAdminFromEnv();

    const db = getDb();
    const user = db.adminUsers.find((u) => u.email.toLowerCase() === String(email || "").toLowerCase());
    if (!user || !verifyPassword(String(password || ""), user.passwordHash)) {
      recordFail(ip);
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    // Upgrade legacy plaintext hash to scrypt.
    if (isLegacyHash(user.passwordHash)) {
      user.passwordHash = hashPassword(String(password));
      saveDb();
    }

    clearFails(ip);

    const code = String(Math.floor(100000 + Math.random() * 900000));
    otpStore.set(user.email, { code, exp: Date.now() + 5 * 60 * 1000 });

    const sent = await sendOtpEmail({ to: user.email, code });
    if (!sent || process.env.NODE_ENV !== "production") {
      console.log(`OTP for ${user.email}: ${code}`);
    }
    return NextResponse.json({ success: true, requiresOtp: true });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

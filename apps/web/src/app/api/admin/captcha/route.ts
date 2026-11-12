import { NextResponse } from "next/server";
import crypto from "crypto";

const SECRET = process.env.CAPTCHA_SECRET || "portfolio-captcha-secret";

export async function GET() {
  const a = Math.floor(Math.random() * 90) + 10;
  const b = Math.floor(Math.random() * 9) + 1;
  const op = "+";
  const answer = a + b;
  const payload = { a, b, op, answer, exp: Date.now() + 5 * 60 * 1000 };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return NextResponse.json({ question: `${a} ${op} ${b} = ?`, token: `${data}.${sig}` });
}
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function secret(): string {
  return (
    process.env.AUTH_SECRET ||
    process.env.CAPTCHA_SECRET ||
    "portfolio-dev-secret-change-me"
  );
}

function toB64url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  for (const b of arr) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return toB64url(sig);
}

export interface SessionPayload {
  email: string;
  exp: number;
}

/** Sign a session token: base64url(payload).base64url(hmac) */
export async function signSession(email: string): Promise<string> {
  const payload = toB64url(
    new TextEncoder().encode(JSON.stringify({ email, exp: Date.now() + SESSION_TTL_MS })),
  );
  return `${payload}.${await hmac(payload)}`;
}

/** Verify a signed session token. Returns the payload or null. */
export async function verifySession(token?: string | null): Promise<SessionPayload | null> {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  try {
    const expected = await hmac(payload);
    if (sig !== expected) return null;
    const json = JSON.parse(
      new TextDecoder().decode(
        Uint8Array.from(atob(payload.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0)),
      ),
    ) as SessionPayload;
    if (!json?.email || typeof json.exp !== "number" || Date.now() > json.exp) return null;
    return json;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = "admin_session";

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_MS / 1000,
};

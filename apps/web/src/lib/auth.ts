import crypto from "crypto";

const SCRYPT_KEYLEN = 64;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    if (stored.startsWith("scrypt$")) {
      const [, salt, hash] = stored.split("$");
      const candidate = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
      const expected = Buffer.from(hash, "hex");
      return candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected);
    }
    // Legacy plaintext support: constant-time compare, allows upgrade on next login.
    const a = Buffer.from(password);
    const b = Buffer.from(stored);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function isLegacyHash(stored: string): boolean {
  return !stored.startsWith("scrypt$");
}

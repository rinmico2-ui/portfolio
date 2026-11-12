export const API_BASE = process.env.EXPO_PUBLIC_API_BASE || "http://localhost:3000";
export async function api(path: string, init?: RequestInit) {
  const res = await fetch(API_BASE + path, init);
  return res.json();
}

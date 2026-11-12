import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
};

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  // Strict filename validation — no traversal, no hidden files.
  if (!/^[A-Za-z0-9_-]+\.(png|jpe?g|webp|gif|pdf)$/.test(name)) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }
  try {
    const filePath = path.join(process.cwd(), ".data", "uploads", name);
    const data = await fs.readFile(filePath);
    const ext = path.extname(name).toLowerCase();
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }
}

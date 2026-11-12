import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "application/pdf": ".pdf",
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }
    const ext = ALLOWED[file.type];
    if (!ext) {
      return NextResponse.json(
        { success: false, error: "Unsupported file type. Allowed: PNG, JPEG, WebP, GIF, PDF." },
        { status: 400 },
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: "File exceeds the 5 MB limit." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Extra safety: verify magic bytes for images.
    const isPng = buffer.length > 8 && buffer[0] === 0x89 && buffer[1] === 0x50;
    const isJpg = buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8;
    const isGif = buffer.length > 6 && buffer.subarray(0, 3).toString() === "GIF";
    const isRiff = buffer.length > 12 && buffer.subarray(0, 4).toString() === "RIFF";
    const isPdf = buffer.subarray(0, 5).toString() === "%PDF-";
    const magicOk =
      (ext === ".png" && isPng) ||
      (ext === ".jpg" && isJpg) ||
      (ext === ".gif" && isGif) ||
      (ext === ".webp" && isRiff) ||
      (ext === ".pdf" && isPdf);
    if (!magicOk) {
      return NextResponse.json({ success: false, error: "File content does not match its type." }, { status: 400 });
    }

    const dir = path.join(process.cwd(), ".data", "uploads");
    await fs.mkdir(dir, { recursive: true });
    const name = `${Date.now().toString(36)}-${crypto.randomBytes(6).toString("hex")}${ext}`;
    await fs.writeFile(path.join(dir, name), buffer);

    return NextResponse.json({ success: true, data: { url: `/api/uploads/${name}` } });
  } catch {
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}

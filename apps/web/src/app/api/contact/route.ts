import { NextResponse } from "next/server";
import { getDb, id, now, saveDb } from "@/lib/store";
import { ContactMessage } from "@portfolio/shared-types";
import { sendContactEmail } from "@/lib/email";

const rateStore = (globalThis as any).__CONTACT_RATE__ || ((globalThis as any).__CONTACT_RATE__ = new Map());
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "local";

    // Rate limit
    const stamps: number[] = (rateStore.get(ip) || []).filter((t: number) => Date.now() - t < WINDOW_MS);
    if (stamps.length >= MAX_PER_WINDOW) {
      return NextResponse.json(
        { success: false, error: "Too many messages sent. Please try again later." },
        { status: 429 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const subject = String(body?.subject ?? "").trim();
    const message = String(body?.message ?? "").trim();
    const honeypot = String(body?.company ?? "").trim();
    const openedAt = Number(body?.openedAt ?? 0);

    // Spam protection: honeypot field must stay empty; form must have been
    // open for a moment; timestamps in the future are bots.
    if (honeypot) {
      return NextResponse.json({ success: false, error: "Submission rejected." }, { status: 400 });
    }
    const elapsed = Date.now() - openedAt;
    if (!openedAt || elapsed < 1200 || elapsed > 24 * 60 * 60 * 1000) {
      return NextResponse.json(
        { success: false, error: "Submission rejected. Please try again." },
        { status: 400 },
      );
    }

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: "All fields are required." }, { status: 400 });
    }
    if (name.length < 2 || name.length > 80) {
      return NextResponse.json({ success: false, error: "Please enter your name." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
    }
    if (subject.length < 3 || subject.length > 120) {
      return NextResponse.json({ success: false, error: "Subject must be between 3 and 120 characters." }, { status: 400 });
    }
    if (message.length < 10 || message.length > 2000) {
      return NextResponse.json({ success: false, error: "Message must be between 10 and 2000 characters." }, { status: 400 });
    }

    // Persist — the message always reaches the owner via the admin dashboard.
    const msg: ContactMessage = { id: id(), name, email, subject, message, status: "unread", createdAt: now() };
    getDb().contactMessages.unshift(msg);
    saveDb();
    rateStore.set(ip, [...stamps, Date.now()]);

    // Best-effort email notification.
    let emailed = false;
    if (process.env.SMTP_HOST || process.env.RESEND_API_KEY) {
      emailed = await sendContactEmail({ name, email, subject, message });
      if (!emailed) console.error("Contact email notification failed; message saved to admin dashboard.");
    }

    return NextResponse.json({
      success: true,
      message: emailed
        ? "Message sent successfully. I'll get back to you soon."
        : "Message received. I'll get back to you soon.",
    });
  } catch {
    return NextResponse.json({ success: false, error: "Server error. Please try again." }, { status: 500 });
  }
}

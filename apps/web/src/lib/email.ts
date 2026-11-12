interface OtpMailOptions {
  to: string;
  code: string;
}

interface ContactMailOptions {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function smtpConfigured() {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function fromAddress(): string {
  return process.env.CONTACT_FROM_EMAIL || process.env.FROM_EMAIL || process.env.SMTP_USER || "onboarding@resend.dev";
}

function contactTo(): string {
  return process.env.CONTACT_TO_EMAIL || fromAddress();
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function sendViaSmtp(options: {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}): Promise<boolean> {
  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: fromAddress(),
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      ...(options.replyTo ? { replyTo: options.replyTo } : {}),
    });
    return true;
  } catch (err) {
    console.error("SMTP send failed:", err);
    return false;
  }
}

async function sendViaResend(options: {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}): Promise<boolean> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: fromAddress(),
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        ...(options.replyTo ? { reply_to: options.replyTo } : {}),
      }),
    });
    if (!res.ok) {
      console.error("Resend send failed:", await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Resend send failed:", err);
    return false;
  }
}

async function send(options: {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}): Promise<boolean> {
  if (smtpConfigured()) return sendViaSmtp(options);
  if (process.env.RESEND_API_KEY) return sendViaResend(options);
  return false;
}

export async function sendOtpEmail({ to, code }: OtpMailOptions): Promise<boolean> {
  const subject = "Your admin login OTP";
  const text = `Your one-time passcode is ${code}. It expires in 5 minutes.`;
  const html = `<p>Your one-time passcode is <strong>${code}</strong>. It expires in 5 minutes.</p>`;
  return send({ to, subject, text, html });
}

export async function sendContactEmail({ name, email, subject, message }: ContactMailOptions): Promise<boolean> {
  const to = contactTo();
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const mailSubject = `Portfolio contact: ${subject}`;
  const text = `New message from the portfolio contact form.\n\nName: ${name}\nEmail: ${email}\n\n${message}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px;">
      <h2 style="color:#142B45;">New portfolio message</h2>
      <p><strong>From:</strong> ${safeName} &lt;${safeEmail}&gt;</p>
      <p><strong>Subject:</strong> ${safeSubject}</p>
      <hr style="border:none;border-top:1px solid #e3dfd2;" />
      <p style="white-space:pre-wrap;">${safeMessage}</p>
    </div>
  `;
  return send({ to, subject: mailSubject, text, html, replyTo: email });
}

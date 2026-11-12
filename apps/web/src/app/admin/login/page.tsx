"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const loadCaptcha = async () => {
    const res = await fetch("/api/admin/captcha");
    const json = await res.json();
    if (json.success !== false) {
      setCaptchaQuestion(json.question);
      setCaptchaToken(json.token);
    }
  };

  useEffect(() => { loadCaptcha(); }, []);

  const submitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, captchaToken, captchaAnswer }),
      });
      const json = await res.json();
      if (json.requiresOtp) setStep("otp");
      else if (json.success) router.push("/admin");
      else setErr(json.error || "Login failed");
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setLoading(false);
      loadCaptcha();
      setCaptchaAnswer("");
    }
  };

  const submitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const json = await res.json();
      if (json.success) { setMsg("OTP verified. Redirecting..."); router.push("/admin"); }
      else setErr(json.error || "OTP verification failed");
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-bg-card p-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Admin Login</h1>
        <p className="text-sm text-text-secondary mt-1">Sign in to manage your portfolio.</p>
        {step === "credentials" ? (
          <form onSubmit={submitCredentials} className="mt-6 space-y-4">
            <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <div className="space-y-2">
              <div className="text-sm text-text-secondary">{captchaQuestion}</div>
              <Input placeholder="Captcha answer" value={captchaAnswer} onChange={e => setCaptchaAnswer(e.target.value)} required />
            </div>
            {msg && <div className="text-sm text-accent-primary">{msg}</div>}
            {err && <div className="text-sm text-red-600 dark:text-red-400">{err}</div>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>
          </form>
        ) : (
          <form onSubmit={submitOtp} className="mt-6 space-y-4">
            <p className="text-sm text-text-secondary">An OTP has been sent. Check the server console.</p>
            <Input placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} required />
            {msg && <div className="text-sm text-accent-primary">{msg}</div>}
            {err && <div className="text-sm text-red-600 dark:text-red-400">{err}</div>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => setStep("credentials")}>Back</Button>
          </form>
        )}
      </div>
    </div>
  );
}
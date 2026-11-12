"use client";
import { useEffect, useRef, useState } from "react";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, ArrowRight, LoaderCircle } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
  company: string; // honeypot
}

const initial: FormState = { name: "", email: "", subject: "", message: "", company: "" };

function validate(form: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (form.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Please enter a valid email address.";
  if (form.subject.trim().length < 3) errors.subject = "Please add a short subject.";
  if (form.message.trim().length < 10) errors.message = "Message should be at least 10 characters.";
  if (form.message.trim().length > 2000) errors.message = "Message must be under 2000 characters.";
  return errors;
}

const lineInput = "line-input font-sans text-[15px]";

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [toast, setToast] = useState<{ msg: string; kind: "success" | "error" } | null>(null);
  const openedAt = useRef<number>(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!openedAt.current) openedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [key]: e.target.value });
    if (errors[key]) setErrors({ ...errors, [key]: undefined });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot filled → almost certainly a bot. Pretend success, send nothing.
    if (form.company.trim()) {
      setStatus("success");
      setMsg("Message sent. I'll get back to you soon.");
      setForm(initial);
      return;
    }

    const validation = validate(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      setStatus("error");
      setMsg("Please fix the highlighted fields.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, openedAt: openedAt.current }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        setMsg(json.message || "Message sent. I'll get back to you soon.");
        setToast({ msg: json.message || "Message sent. I'll get back to you soon.", kind: "success" });
        setForm(initial);
      } else {
        setStatus("error");
        setMsg(json.error || "Failed to send. Please try again.");
        setToast({ msg: json.error || "Failed to send. Please try again.", kind: "error" });
      }
    } catch {
      setStatus("error");
      setMsg("Network error. Please try again.");
      setToast({ msg: "Network error. Please try again.", kind: "error" });
    }
  };

  const fieldError = (key: keyof FormState) =>
    errors[key] ? (
      <span role="alert" className="mt-1.5 block text-xs text-red-700">{errors[key]}</span>
    ) : null;

  return (
    <form onSubmit={submit} noValidate className="space-y-7" aria-label="Contact form">
      <div className="grid gap-7 sm:grid-cols-2 sm:gap-x-8">
        <label className="block">
          <span className="mb-0.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-text-secondary">Name</span>
          <Input
            placeholder="Your name"
            value={form.name}
            onChange={set("name")}
            required
            maxLength={80}
            autoComplete="name"
            aria-invalid={!!errors.name}
            className={cn(lineInput, errors.name && "border-b-red-700")}
          />
          {fieldError("name")}
        </label>
        <label className="block">
          <span className="mb-0.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-text-secondary">Email</span>
          <Input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={set("email")}
            required
            maxLength={120}
            autoComplete="email"
            aria-invalid={!!errors.email}
            className={cn(lineInput, errors.email && "border-b-red-700")}
          />
          {fieldError("email")}
        </label>
      </div>
      <label className="block">
        <span className="mb-0.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-text-secondary">Subject</span>
        <Input
          placeholder="What is this about?"
          value={form.subject}
          onChange={set("subject")}
          required
          maxLength={120}
          aria-invalid={!!errors.subject}
          className={cn(lineInput, errors.subject && "border-b-red-700")}
        />
        {fieldError("subject")}
      </label>
      <label className="block">
        <span className="mb-0.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-text-secondary">Message</span>
        <Textarea
          placeholder="Tell me about your project, internship, or collaboration..."
          rows={4}
          value={form.message}
          onChange={set("message")}
          required
          maxLength={2000}
          aria-invalid={!!errors.message}
          className={cn(lineInput, "resize-none", errors.message && "border-b-red-700")}
        />
        {fieldError("message")}
      </label>

      {/* Honeypot — hidden from humans, catnip for bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={form.company}
            onChange={set("company")}
          />
        </label>
      </div>

      <div className="pt-1">
        <Button
          type="submit"
          disabled={status === "loading"}
          className="group rounded-none px-8 py-3.5 font-mono text-[12px] font-medium uppercase tracking-[0.18em]"
        >
          {status === "loading" ? (
            <>
              Sending <LoaderCircle size={14} className="animate-spin" />
            </>
          ) : (
            <>
              Send message
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {status === "success" && (
          <motion.p
            key="success"
            initial={reduced ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            role="status"
            className="flex items-start gap-2 text-sm font-medium text-accent-primary"
          >
            <CheckCircle size={16} className="mt-0.5 shrink-0 text-accent-secondary" /> {msg}
          </motion.p>
        )}
        {status === "error" && (
          <motion.p
            key="error"
            initial={reduced ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            role="alert"
            className="flex items-start gap-2 text-sm font-medium text-red-700"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" /> {msg}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="contact-toast"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            role={toast.kind === "success" ? "status" : "alert"}
            className="fixed bottom-6 left-6 z-[60] flex max-w-[calc(100vw-3rem)] items-start gap-2.5 border border-border-strong bg-white px-5 py-3.5 shadow-[0_20px_50px_-20px_rgba(23,56,47,0.4)]"
          >
            {toast.kind === "success" ? (
              <CheckCircle size={16} className="mt-0.5 shrink-0 text-accent-secondary" />
            ) : (
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-700" />
            )}
            <p className="text-sm font-medium leading-snug text-text-primary">{toast.msg}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

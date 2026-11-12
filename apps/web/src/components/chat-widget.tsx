"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const PANEL_ID = "ai-chat-panel";

const SUGGESTIONS = [
  "What projects has Marcus built?",
  "Marcus's skills",
  "His education",
  "How can I contact him?",
  "Is he available for opportunities?",
];

export function ChatWidget({
  name = "Developer Assistant",
  enabled = true,
}: {
  name?: string;
  enabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: `Hi! I'm the ${name}. Ask me about projects, skills, experience, or how to get in touch.` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const reduced = useReducedMotion();
  const sessionId = useRef("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [msgs, loading, open, reduced]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open ]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open ]);

  const send = async (preset?: string) => {
    const text = (preset ?? input).trim();
    if (!text || loading) return;
    if (!sessionId.current) sessionId.current = "sess-" + Math.random().toString(36).slice(2);
    setInput("");
    setMsgs((m) => [...m, { role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId: sessionId.current }),
      });
      const json = await res.json().catch(() => ({}));
      const reply = json?.success
        ? json.data?.reply || "Sorry, something went wrong."
        : "Sorry, I could not reply. Please try again.";
      setMsgs((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "Network error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!enabled) return null;

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(!open)}
        whileHover={reduced ? undefined : { scale: 1.08 }}
        whileTap={reduced ? undefined : { scale: 0.94 }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent-primary text-on-accent shadow-lg transition-shadow hover:shadow-xl"
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        aria-controls={PANEL_ID}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "chat"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="block"
          >
            {open ? <X size={22} /> : <MessageCircle size={22} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={PANEL_ID}
            key="chat-panel"
            role="dialog"
            aria-label={`${name} chat`}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed bottom-24 right-6 z-50 flex h-[min(500px,calc(100dvh-7.5rem))] w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-lg border border-border bg-bg-card shadow-xl"
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <Bot size={18} className="text-accent-primary" />
              <span className="text-sm font-semibold">{name}</span>
            </div>
            <div
              ref={scrollRef}
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
              className="flex-1 space-y-3 overflow-y-auto p-4"
            >
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}
                >
                  {m.role === "assistant" && <Bot size={16} className="mt-1 shrink-0 text-accent-primary" />}
                  <div
                    className={`min-w-0 max-w-[80%] rounded-lg px-3 py-2 text-sm break-words [overflow-wrap:anywhere] ${m.role === "user" ? "bg-accent-primary text-on-accent" : "bg-bg-secondary text-text-primary"}`}
                  >
                    {m.content}
                  </div>
                  {m.role === "user" && <User size={16} className="mt-1 shrink-0 text-text-secondary" />}
                </motion.div>
              ))}
              {loading && <div className="text-sm text-text-secondary">Thinking...</div>}
            </div>
            <div className="flex gap-2 border-t border-border p-3">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
                placeholder="Ask something..."
                maxLength={1000}
                aria-label="Message the assistant"
              />
              <Button type="button" size="sm" onClick={() => send()} disabled={loading || !input.trim()} aria-label="Send message">
                <Send size={16} />
              </Button>
            </div>
            {msgs.length <= 1 && !loading && (
              <div className="flex flex-wrap gap-1.5 px-3 pb-2" aria-label="Suggested questions">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="border border-border bg-bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-text-primary transition-colors hover:border-accent-primary hover:text-accent-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div className="px-3 pb-2 text-[10px] text-text-secondary">
              Privacy: conversations may be stored. Don&apos;t share sensitive info.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

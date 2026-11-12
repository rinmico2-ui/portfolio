"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, MailOpen, Archive } from "lucide-react";

export default function MessagesAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const load = () => {
    const p = filter ? `?status=${filter}` : "";
    fetch(`/api/admin/messages${p}`).then(r=>r.json()).then(j=>setItems(j.data||[]));
  };
  useEffect(() => { load(); }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps
  const update = async (id: string, status: string) => { await fetch(`/api/admin/messages/${id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ status }) }); load(); };
  const remove = async (id: string) => { await fetch(`/api/admin/messages/${id}`, { method:"DELETE" }); load(); };
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight mb-6">Messages</h1>
      <div className="flex gap-2 mb-4">
        {["","unread","read","archived"].map(s => (
          <Button key={s} variant={filter===s?"primary":"outline"} size="sm" onClick={()=>setFilter(s)}>{s||"All"}</Button>
        ))}
      </div>
      <div className="grid gap-3">
        {items.map(m => (
          <Card key={m.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 break-words">
                <div className="break-words font-medium">{m.name} <span className="text-xs text-text-secondary">({m.email})</span></div>
                <div className="text-sm text-accent-primary">{m.subject}</div>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm text-text-secondary">{m.message}</p>
                <div className="mt-2 text-xs text-text-secondary">{new Date(m.createdAt).toLocaleString()} · {m.status}</div>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="sm" onClick={()=>update(m.id,"read")} aria-label="Mark as read"><MailOpen size={16}/></Button>
                <Button variant="ghost" size="sm" onClick={()=>update(m.id,"archived")} aria-label="Archive"><Archive size={16}/></Button>
                <Button variant="ghost" size="sm" onClick={()=>remove(m.id)} aria-label="Delete message"><Trash2 size={16}/></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {items.length===0 && <p className="text-text-secondary">No messages.</p>}
    </div>
  );
}

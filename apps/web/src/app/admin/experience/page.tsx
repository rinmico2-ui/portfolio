"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

export default function ExperienceAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ company:"", position:"", startDate:"", current:false, description:"", responsibilities:"", technologies:"", achievements:"" });
  const [open, setOpen] = useState(false);
  const load = () => fetch("/api/admin/experience").then(r=>r.json()).then(j=>setItems(j.data||[]));
  useEffect(() => { load(); }, []);
  const save = async () => {
    await fetch("/api/admin/experience", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({
      ...form,
      responsibilities: form.responsibilities.split("\n").filter(Boolean),
      technologies: form.technologies.split(",").map((s:string)=>s.trim()).filter(Boolean),
      achievements: form.achievements.split("\n").filter(Boolean),
    }) });
    setOpen(false); load();
  };
  const remove = async (id: string) => { await fetch(`/api/admin/experience/${id}`, { method:"DELETE" }); load(); };
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Experience</h1>
        <Button onClick={()=>setOpen(!open)}><Plus size={16}/> New</Button>
      </div>
      {open && (
        <Card className="p-6 mb-6 space-y-3">
          <Input placeholder="Company" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} />
          <Input placeholder="Position" value={form.position} onChange={e=>setForm({...form,position:e.target.value})} />
          <Input placeholder="Start date" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})} />
          <Input placeholder="End date (optional)" value={form.endDate||""} onChange={e=>setForm({...form,endDate:e.target.value})} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.current} onChange={e=>setForm({...form,current:e.target.checked})}/> Current</label>
          <textarea className="w-full rounded-md border border-border bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary" rows={3} placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
          <textarea className="w-full rounded-md border border-border bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary" rows={3} placeholder="Responsibilities (one per line)" value={form.responsibilities} onChange={e=>setForm({...form,responsibilities:e.target.value})} />
          <Input placeholder="Technologies (comma)" value={form.technologies} onChange={e=>setForm({...form,technologies:e.target.value})} />
          <textarea className="w-full rounded-md border border-border bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary" rows={2} placeholder="Achievements (one per line)" value={form.achievements} onChange={e=>setForm({...form,achievements:e.target.value})} />
          <Button onClick={save}>Save</Button>
        </Card>
      )}
      <div className="grid gap-3">
        {items.map(e => (
          <Card key={e.id} className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="break-words font-medium">{e.position} – {e.company}</div>
                <div className="text-sm text-text-secondary">{e.startDate?.slice(0,10)}</div>
              </div>
              <Button variant="ghost" size="sm" className="self-end sm:self-auto" onClick={()=>remove(e.id)} aria-label={`Delete ${e.position}`}><Trash2 size={16}/></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Pencil, X } from "lucide-react";

const empty = { institution: "", degree: "", fieldOfStudy: "", status: "", startDate: "", endDate: "", description: "" };

export default function EducationAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<any>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const load = () => fetch("/api/admin/education").then(r=>r.json()).then(j=>setItems(j.data||[]));
  useEffect(() => { load(); }, []);
  const save = async () => {
    if (editId) {
      await fetch(`/api/admin/education/${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch("/api/admin/education", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setForm(empty); setEditId(null); setOpen(false); load();
  };
  const edit = (e: any) => {
    setForm({
      institution: e.institution || "", degree: e.degree || "", fieldOfStudy: e.fieldOfStudy || "",
      status: e.status || "", startDate: e.startDate || "", endDate: e.endDate || "", description: e.description || "",
    });
    setEditId(e.id); setOpen(true);
  };
  const remove = async (id: string) => { if (!confirm("Delete this entry?")) return; await fetch(`/api/admin/education/${id}`, { method: "DELETE" }); load(); };
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl tracking-tight">Education</h1>
        <Button onClick={()=>{ setForm(empty); setEditId(null); setOpen(!open); }}><Plus size={16}/> New</Button>
      </div>
      {open && (
        <Card className="p-6 mb-6 space-y-3">
          <Input placeholder="Institution" value={form.institution} onChange={e=>setForm({...form,institution:e.target.value})} />
          <Input placeholder="Degree" value={form.degree} onChange={e=>setForm({...form,degree:e.target.value})} />
          <Input placeholder="Field of study / major" value={form.fieldOfStudy} onChange={e=>setForm({...form,fieldOfStudy:e.target.value})} />
          <Input placeholder="Status (e.g. Fourth-Year Student)" value={form.status} onChange={e=>setForm({...form,status:e.target.value})} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="Start date (e.g. 2022-08-01)" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})} />
            <Input placeholder="End date (empty = in progress)" value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})} />
          </div>
          <textarea className="w-full rounded-md border border-border bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary" rows={3} placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
          <div className="flex gap-2">
            <Button onClick={save}>{editId ? "Update" : "Save"}</Button>
            <Button variant="ghost" onClick={()=>{ setOpen(false); setForm(empty); setEditId(null); }}><X size={16}/> Cancel</Button>
          </div>
        </Card>
      )}
      <div className="grid gap-3">
        {items.map(e => (
          <Card key={e.id} className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="break-words font-medium">{e.degree} – {e.institution}</div>
                <div className="break-words text-sm text-text-secondary">
                  {e.fieldOfStudy || ""}{e.status ? ` · ${e.status}` : ""}{e.startDate ? ` · ${e.startDate.slice(0,4)}` : ""}
                </div>
              </div>
              <div className="flex shrink-0 gap-2 self-end sm:self-auto">
                <Button variant="ghost" size="sm" onClick={()=>edit(e)} aria-label="Edit"><Pencil size={16}/></Button>
                <Button variant="ghost" size="sm" onClick={()=>remove(e.id)} aria-label="Delete"><Trash2 size={16}/></Button>
              </div>
            </div>
          </Card>
        ))}
        {items.length === 0 && <p className="text-text-secondary">No education entries yet.</p>}
      </div>
    </div>
  );
}

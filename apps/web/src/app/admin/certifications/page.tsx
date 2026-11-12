"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UploadField } from "@/components/admin/upload-field";
import { Plus, Trash2, Pencil, ExternalLink } from "lucide-react";

const empty = { name:"", issuer:"", issueDate:"", expiryDate:"", credentialUrl:"", imageUrl:"" };

export default function CertificationsAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<any>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const load = () => fetch("/api/admin/certifications").then(r=>r.json()).then(j=>setItems(j.data||[]));
  useEffect(() => { load(); }, []);
  const save = async () => {
    if (editId) {
      await fetch(`/api/admin/certifications/${editId}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body: JSON.stringify(form) });
    } else {
      await fetch("/api/admin/certifications", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(form) });
    }
    setForm(empty); setEditId(null); setOpen(false); load();
  };
  const edit = (c: any) => { setForm({ name:c.name||"", issuer:c.issuer||"", issueDate:c.issueDate||"", expiryDate:c.expiryDate||"", credentialUrl:c.credentialUrl||"", imageUrl:c.imageUrl||"" }); setEditId(c.id); setOpen(true); };
  const remove = async (id: string) => { await fetch(`/api/admin/certifications/${id}`, { method:"DELETE" }); load(); };
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Certifications</h1>
        <Button onClick={()=>{ setForm(empty); setEditId(null); setOpen(!open); }}><Plus size={16}/> New</Button>
      </div>
      {open && (
        <Card className="p-6 mb-6 space-y-3">
          <Input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <Input placeholder="Issuer" value={form.issuer} onChange={e=>setForm({...form,issuer:e.target.value})} />
          <Input placeholder="Issue date" value={form.issueDate} onChange={e=>setForm({...form,issueDate:e.target.value})} />
          <Input placeholder="Expiry date (optional)" value={form.expiryDate} onChange={e=>setForm({...form,expiryDate:e.target.value})} />
          <Input placeholder="Credential URL (optional)" value={form.credentialUrl} onChange={e=>setForm({...form,credentialUrl:e.target.value})} />
          <UploadField
            label="Certificate image"
            value={form.imageUrl}
            onChange={v => setForm({...form, imageUrl: v})}
            preview
            placeholder="Upload a certificate image or paste a URL"
          />
          {form.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.imageUrl} alt="Preview" className="h-28 rounded-lg border border-border object-contain bg-bg-secondary/60 p-1" />
          )}
          <div className="flex gap-2">
            <Button onClick={save}>{editId ? "Update" : "Save"}</Button>
            <Button variant="ghost" onClick={()=>{ setOpen(false); setForm(empty); setEditId(null); }}>Cancel</Button>
          </div>
        </Card>
      )}
      <div className="grid gap-3">
        {items.map(c => (
          <Card key={c.id} className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex min-w-0 items-center gap-4">
                {c.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.imageUrl} alt={c.name} className="h-12 w-16 shrink-0 rounded-md border border-border object-contain bg-bg-secondary/60 p-0.5" />
                ) : (
                  <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-md border border-border bg-bg-secondary/60 text-[10px] text-text-secondary">No image</div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="break-words font-medium sm:truncate">{c.name}</div>
                  <div className="break-words text-sm text-text-secondary sm:truncate">{c.issuer}{c.issueDate ? ` · ${c.issueDate.slice(0,10)}` : ""}</div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2 self-end sm:ml-auto sm:self-auto">
                {c.credentialUrl && (
                  <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-text-primary" aria-label="Open credential">
                    <ExternalLink size={16}/>
                  </a>
                )}
                <Button variant="ghost" size="sm" onClick={()=>edit(c)} aria-label={`Edit ${c.name}`}><Pencil size={16}/></Button>
                <Button variant="ghost" size="sm" onClick={()=>remove(c.id)} aria-label={`Delete ${c.name}`}><Trash2 size={16}/></Button>
              </div>
            </div>
          </Card>
        ))}
        {items.length === 0 && <p className="text-text-secondary">No certifications yet.</p>}
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UploadField } from "@/components/admin/upload-field";
import { Plus, Trash2, Edit, Save, X, ImagePlus } from "lucide-react";

interface ProjectImage { id: string; url: string; alt?: string; displayOrder: number }
interface Project {
  id: string; title: string; slug: string; summary: string; description: string;
  overview?: string; problem?: string; objectives?: string[]; keyFeatures?: string[]; contributions?: string[];
  techStack: string[]; status: string; featured: boolean; coverImageUrl?: string; liveUrl?: string; githubUrl?: string;
  category?: string; developmentDate?: string; images: ProjectImage[];
}

const blank: Project = {
  id: "", title: "", slug: "", summary: "", description: "", techStack: [], status: "draft",
  featured: false, images: [], developmentDate: "",
};

function ListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-1.5">
      <span className="block font-mono text-[11px] uppercase tracking-wider text-text-secondary">{label}</span>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Input value={item} onChange={(e) => onChange(items.map((v, j) => (j === i ? e.target.value : v)))} placeholder={placeholder} />
          <Button type="button" variant="ghost" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label={`Remove ${label} item`}>
            <Trash2 size={15} />
          </Button>
        </div>
      ))}
      <Button type="button" variant="ghost" size="sm" onClick={() => onChange([...items, ""])}>
        <Plus size={14} /> Add
      </Button>
    </div>
  );
}

export default function ProjectsAdmin() {
  const [items, setItems] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Project>(blank);
  const [saving, setSaving] = useState(false);

  const load = () => fetch("/api/admin/projects").then(r => r.json()).then(j => setItems(j.data || []));
  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/admin/projects/${editing.id}` : "/api/admin/projects";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    setEditing(null); setCreating(false); setForm(blank); load();
  };
  const remove = async (id: string) => { if (!confirm("Delete this project?")) return; await fetch(`/api/admin/projects/${id}`, { method: "DELETE" }); load(); };
  const startEdit = (p: Project) => {
    setEditing(p);
    setForm({
      ...blank, ...p,
      techStack: p.techStack || [],
      objectives: p.objectives || [],
      keyFeatures: p.keyFeatures || [],
      contributions: p.contributions || [],
      images: p.images || [],
    });
    setCreating(true);
  };
  const setImages = (images: ProjectImage[]) => setForm({ ...form, images: images.map((img, i) => ({ ...img, displayOrder: i })) });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl tracking-tight">Projects</h1>
        <Button onClick={() => { setCreating(true); setEditing(null); setForm(blank); }}><Plus size={16}/> New</Button>
      </div>
      {creating && (
        <Card className="p-6 mb-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
            <Input placeholder="Slug (auto if empty)" value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} />
            <Input placeholder="Summary" value={form.summary} onChange={e=>setForm({...form,summary:e.target.value})} />
            <Input placeholder="Category (e.g. Academic Project)" value={form.category||""} onChange={e=>setForm({...form,category:e.target.value})} />
            <Input placeholder="Year (e.g. 2026-01-01)" value={form.developmentDate||""} onChange={e=>setForm({...form,developmentDate:e.target.value})} />
            <div className="flex flex-wrap items-center gap-3">
              <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary">
                <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
              </select>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})}/> Featured</label>
            </div>
          </div>
          <textarea className="w-full rounded-md border border-border bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary" rows={3} placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
          <Input placeholder="Overview" value={form.overview||""} onChange={e=>setForm({...form,overview:e.target.value})} />
          <Input placeholder="Problem being addressed" value={form.problem||""} onChange={e=>setForm({...form,problem:e.target.value})} />
          <ListEditor label="Objectives" items={form.objectives || []} onChange={v => setForm({...form, objectives: v})} placeholder="Objective" />
          <ListEditor label="Key features" items={form.keyFeatures || []} onChange={v => setForm({...form, keyFeatures: v})} placeholder="Feature" />
          <ListEditor label="Personal contributions" items={form.contributions || []} onChange={v => setForm({...form, contributions: v})} placeholder="Contribution" />
          <Input placeholder="Tech stack (comma separated)" value={form.techStack.join(", ")} onChange={e=>setForm({...form,techStack:e.target.value.split(",").map(s=>s.trim()).filter(Boolean)})} />
          <UploadField label="Cover screenshot" value={form.coverImageUrl||""} onChange={v => setForm({...form, coverImageUrl: v})} preview />
          <div className="space-y-1.5">
            <span className="block font-mono text-[11px] uppercase tracking-wider text-text-secondary">Screenshots</span>
            {(form.images || []).map((img, i) => (
              <div key={img.id} className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.alt || "screenshot"} className="h-12 w-20 shrink-0 rounded border border-border bg-bg-secondary object-cover" />
                <Input className="min-w-0 flex-1" value={img.url} onChange={e => setImages(form.images.map((m, j) => (j === i ? { ...m, url: e.target.value } : m)))} />
                <Button type="button" variant="ghost" onClick={() => setImages(form.images.filter((_, j) => j !== i))} aria-label="Remove screenshot"><X size={15} /></Button>
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = async () => {
                  const f = input.files?.[0];
                  if (!f) return;
                  const fd = new FormData();
                  fd.append("file", f);
                  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
                  const json = await res.json();
                  if (json.success && json.data?.url) {
                    setImages([...form.images, { id: Math.random().toString(36).slice(2), url: json.data.url, alt: form.title, displayOrder: form.images.length }]);
                  }
                };
                input.click();
              }}
            >
              <ImagePlus size={14} /> Add screenshot
            </Button>
          </div>
          <Input placeholder="Live URL (optional)" value={form.liveUrl||""} onChange={e=>setForm({...form,liveUrl:e.target.value})} />
          <Input placeholder="Source code URL (optional)" value={form.githubUrl||""} onChange={e=>setForm({...form,githubUrl:e.target.value})} />
          <div className="flex gap-2">
            <Button onClick={save} disabled={saving}><Save size={16}/> {saving ? "Saving..." : "Save"}</Button>
            <Button variant="ghost" onClick={()=>{setCreating(false);setEditing(null);}}><X size={16}/> Cancel</Button>
          </div>
        </Card>
      )}
      <div className="grid gap-3">
        {items.map(p => (
          <Card key={p.id} className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                {p.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.coverImageUrl} alt="" className="h-12 w-20 shrink-0 rounded border border-border object-cover" />
                ) : (
                  <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded border border-border bg-bg-secondary text-[9px] uppercase tracking-wider text-text-secondary">No image</div>
                )}
                <div className="min-w-0">
                  <div className="break-words font-medium sm:truncate">{p.title} <span className="text-xs text-text-secondary">({p.status})</span></div>
                  <div className="line-clamp-2 text-sm text-text-secondary sm:truncate">{p.summary}</div>
                </div>
              </div>
              <div className="flex shrink-0 gap-2 self-end sm:self-auto">
                <Button variant="ghost" size="sm" onClick={()=>startEdit(p)} aria-label={`Edit ${p.title}`}><Edit size={16}/></Button>
                <Button variant="ghost" size="sm" onClick={()=>remove(p.id)} aria-label={`Delete ${p.title}`}><Trash2 size={16}/></Button>
              </div>
            </div>
          </Card>
        ))}
        {items.length === 0 && <p className="text-text-secondary">No projects yet.</p>}
      </div>
    </div>
  );
}

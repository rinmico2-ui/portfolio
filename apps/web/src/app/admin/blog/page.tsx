"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Edit } from "lucide-react";

export default function BlogAdmin() {
  const [posts, setPosts] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [, setTags] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({ title:"", slug:"", excerpt:"", content:"", status:"draft", featured:false, categoryId:"", tagIds:[] });
  const load = () => {
    fetch("/api/admin/blog").then(r=>r.json()).then(j=>setPosts(j.data||[]));
    fetch("/api/admin/blog-categories").then(r=>r.json()).then(j=>{ setCats(j.data?.categories||[]); setTags(j.data?.tags||[]); });
  };
  useEffect(() => { load(); }, []);
  const save = async () => {
    const url = editing ? `/api/admin/blog/${editing.id}` : "/api/admin/blog";
    const method = editing ? "PUT" : "POST";
    await fetch(url, { method, headers:{"Content-Type":"application/json"}, body: JSON.stringify(form) });
    setOpen(false); setEditing(null); load();
  };
  const remove = async (id: string) => { await fetch(`/api/admin/blog/${id}`, { method:"DELETE" }); load(); };
  const startEdit = (p: any) => { setEditing(p); setForm({ ...p, tagIds: p.tagIds || [] }); setOpen(true); };
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Blog</h1>
        <Button onClick={()=>{ setOpen(true); setEditing(null); setForm({ title:"", slug:"", excerpt:"", content:"", status:"draft", featured:false, categoryId:"", tagIds:[] }); }}><Plus size={16}/> New</Button>
      </div>
      {open && (
        <Card className="p-6 mb-6 space-y-3">
          <Input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
          <Input placeholder="Slug" value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} />
          <Input placeholder="Excerpt" value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})} />
          <textarea className="w-full rounded-md border border-border bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary font-mono text-sm" rows={12} placeholder="Content (Markdown)" value={form.content} onChange={e=>setForm({...form,content:e.target.value})} />
          <select value={form.categoryId||""} onChange={e=>setForm({...form,categoryId:e.target.value})} className="w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary">
            <option value="">Category</option>
            {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="flex flex-wrap items-center gap-3">
            <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary">
              <option value="draft">Draft</option><option value="published">Published</option><option value="scheduled">Scheduled</option>
            </select>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})}/> Featured</label>
          </div>
          <Input placeholder="SEO title" value={form.seoTitle||""} onChange={e=>setForm({...form,seoTitle:e.target.value})} />
          <Input placeholder="SEO description" value={form.seoDescription||""} onChange={e=>setForm({...form,seoDescription:e.target.value})} />
          <div className="flex gap-2">
            <Button onClick={save}>Save</Button>
            <Button variant="ghost" onClick={()=>{setOpen(false);setEditing(null);}}>Cancel</Button>
          </div>
        </Card>
      )}
      <div className="grid gap-3">
        {posts.map(p => (
          <Card key={p.id} className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="break-words font-medium">{p.title} <span className="text-xs text-text-secondary">({p.status})</span></div>
                <div className="line-clamp-2 break-words text-sm text-text-secondary sm:truncate">{p.excerpt}</div>
              </div>
              <div className="flex shrink-0 gap-2 self-end sm:self-auto">
                <Button variant="ghost" size="sm" onClick={()=>startEdit(p)} aria-label={`Edit ${p.title}`}><Edit size={16}/></Button>
                <Button variant="ghost" size="sm" onClick={()=>remove(p.id)} aria-label={`Delete ${p.title}`}><Trash2 size={16}/></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

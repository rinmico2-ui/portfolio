"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

export default function SkillsAdmin() {
  const [data, setData] = useState<{categories:any[];skills:any[]}>({categories:[],skills:[]});
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [newCat, setNewCat] = useState("");
  const load = () => fetch("/api/admin/skills").then(r=>r.json()).then(j=>setData(j.data||{categories:[],skills:[]}));
  useEffect(() => { load(); }, []);
  const addSkill = async () => {
    await fetch("/api/admin/skills", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ name, categoryId: categoryId || data.categories[0]?.id }) });
    setName(""); load();
  };
  const addCat = async () => {
    await fetch("/api/admin/skill-categories", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ name: newCat }) });
    setNewCat(""); load();
  };
  const remove = async (id: string) => { await fetch(`/api/admin/skills/${id}`, { method:"DELETE" }); load(); };
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight mb-6">Skills</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-5 space-y-3">
          <h3 className="font-semibold">Add Category</h3>
          <div className="flex gap-2">
            <Input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="Category name" />
            <Button onClick={addCat}><Plus size={16}/></Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {data.categories.map(c => <span key={c.id} className="px-2 py-1 rounded bg-bg-secondary text-sm">{c.name}</span>)}
          </div>
        </Card>
        <Card className="p-5 space-y-3">
          <h3 className="font-semibold">Add Skill</h3>
          <Input value={name} onChange={e=>setName(e.target.value)} placeholder="Skill name" />
          <select value={categoryId} onChange={e=>setCategoryId(e.target.value)} className="w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary">
            {data.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <Button onClick={addSkill}><Plus size={16}/> Add</Button>
        </Card>
      </div>
      <div className="mt-6 grid gap-2">
        {data.skills.map(s => (
          <Card key={s.id} className="p-3 flex items-center justify-between gap-3">
            <span className="min-w-0 break-words">{s.name}</span>
            <Button variant="ghost" size="sm" className="shrink-0" onClick={()=>remove(s.id)} aria-label={`Delete ${s.name}`}><Trash2 size={16}/></Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

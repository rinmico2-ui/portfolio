"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function SettingsAdmin() {
  const [s, setS] = useState<any>(null);
  useEffect(() => { fetch("/api/admin/settings").then(r=>r.json()).then(j=>setS(j.data)); }, []);
  const save = async () => { await fetch("/api/admin/settings", { method:"PUT", headers:{"Content-Type":"application/json"}, body: JSON.stringify(s) }); };
  if (!s) return <div>Loading...</div>;
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight mb-6">Site Settings</h1>
      <Card className="p-6 space-y-3 max-w-2xl">
        <Input value={s.siteName} onChange={e=>setS({...s,siteName:e.target.value})} placeholder="Site name" />
        <Input value={s.siteDescription} onChange={e=>setS({...s,siteDescription:e.target.value})} placeholder="Description" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={s.aiAssistantEnabled} onChange={e=>setS({...s,aiAssistantEnabled:e.target.checked})}/> AI Assistant enabled</label>
        <Input value={s.aiAssistantName} onChange={e=>setS({...s,aiAssistantName:e.target.value})} placeholder="Assistant name" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={s.maintenanceMode} onChange={e=>setS({...s,maintenanceMode:e.target.checked})}/> Maintenance mode</label>
        <Button onClick={save}>Save</Button>
      </Card>
    </div>
  );
}

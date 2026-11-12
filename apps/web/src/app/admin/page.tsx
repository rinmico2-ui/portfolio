"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { FolderKanban, FileText, MessageSquare, Eye, Download, Bot } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { fetch("/api/admin/analytics").then(r=>r.json()).then(j=>setData(j.data)); }, []);
  const stats = data ? [
    { label: "Projects", value: (data.projectViews ?? 0), icon: FolderKanban },
    { label: "Articles", value: (data.blogViews ?? 0), icon: FileText },
    { label: "Messages", value: data.contactSubmissions, icon: MessageSquare },
    { label: "Visits", value: data.totalVisits, icon: Eye },
    { label: "Resume Downloads", value: data.resumeDownloads, icon: Download },
    { label: "AI Conversations", value: data.aiConversations, icon: Bot },
  ] : [];
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight mb-6">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(s => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-text-secondary">{s.label}</div>
                <div className="text-2xl font-bold mt-1">{s.value ?? 0}</div>
              </div>
              <s.icon className="text-accent-primary" size={24}/>
            </div>
          </Card>
        ))}
      </div>
      {data?.daily && (
        <Card className="p-6 mt-6">
          <h3 className="font-semibold mb-4">Activity (last 7 days)</h3>
          <div className="flex items-end gap-2 h-32">
            {data.daily.map((d:any) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-accent-primary/30 rounded-t" style={{ height: `${Math.max(4, d.count*8)}px` }} />
                <span className="text-[10px] text-text-secondary">{d.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}


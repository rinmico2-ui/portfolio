"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { fetch("/api/admin/analytics").then(r=>r.json()).then(j=>setData(j.data)); }, []);
  if (!data) return <div>Loading...</div>;
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight mb-6">Analytics</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(data).filter(([k])=>k!=="daily").map(([k,v]) => (
          <Card key={k} className="p-5"><div className="text-sm text-text-secondary">{k}</div><div className="text-2xl font-bold mt-1">{String(v)}</div></Card>
        ))}
      </div>
      {data.daily && (
        <Card className="p-6 mt-6">
          <h3 className="font-semibold mb-4">Daily activity</h3>
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

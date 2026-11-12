import { NextResponse } from "next/server";
import { getDb } from "@/lib/store";
export async function GET() {
  const db = getDb();
  const events = db.analytics;
  const totalVisits = events.filter(e=>e.type==="pageview").length;
  const projectViews = db.projects.reduce((a,p)=>a+p.views,0);
  const blogViews = db.blogPosts.reduce((a,p)=>a+p.views,0);
  const resumeDownloads = events.filter(e=>e.type==="resume_download").length;
  const contactSubmissions = db.contactMessages.length;
  const aiConversations = db.aiConversations.length;
  // daily trend last 7
  const days: { date: string; count: number }[] = [];
  for (let i=6;i>=0;i--) {
    const d = new Date(); d.setDate(d.getDate()-i);
    const key = d.toISOString().slice(0,10);
    days.push({ date: key, count: events.filter(e=>e.createdAt.slice(0,10)===key).length });
  }
  return NextResponse.json({ success:true, data: {
    totalVisits, uniqueVisitors: totalVisits, pageViews: totalVisits, projectViews, blogViews, resumeDownloads, contactSubmissions, aiConversations,
    daily: days,
    topPages: [],
    deviceCategories: [],
    trafficSources: [],
  }});
}

import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ChatWidget } from "@/components/chat-widget";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { getDb } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const db = getDb();
  const profile = db.profile;
  return (
    <>
      <Suspense fallback={<div className="h-16" />}>
        <Navbar resumeUrl={profile.resumeUrl || undefined} email={profile.email || undefined} />
      </Suspense>
      <main>{children}</main>
      <Footer profile={profile} />
      <ChatWidget name={db.siteSettings.aiAssistantName || undefined} enabled={db.siteSettings.aiAssistantEnabled} />
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
    </>
  );
}

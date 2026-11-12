"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UploadField } from "@/components/admin/upload-field";

export default function ProfileAdmin() {
  const [p, setP] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => { fetch("/api/admin/profile").then(r => r.json()).then(j => setP(j.data)); }, []);
  const save = async () => {
    await fetch("/api/admin/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  if (!p) return <div>Loading...</div>;
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl tracking-tight">Profile</h1>
        <Button onClick={save}>{saved ? "Saved" : "Save"}</Button>
      </div>
      <Card className="max-w-2xl space-y-3 p-6">
        <Input value={p.fullName} onChange={e => setP({ ...p, fullName: e.target.value })} placeholder="Full name" />
        <Input value={p.professionalTitle} onChange={e => setP({ ...p, professionalTitle: e.target.value })} placeholder="Title" />
        <Input value={p.headline} onChange={e => setP({ ...p, headline: e.target.value })} placeholder="Headline" />
        <Textarea value={p.biography} onChange={e => setP({ ...p, biography: e.target.value })} rows={6} placeholder="Biography (separate paragraphs with a blank line)" />
        <Input value={p.location || ""} onChange={e => setP({ ...p, location: e.target.value })} placeholder="Location" />
        <Input value={p.email || ""} onChange={e => setP({ ...p, email: e.target.value })} placeholder="Email" />
        <Input value={p.phone || ""} onChange={e => setP({ ...p, phone: e.target.value })} placeholder="Phone" />
        <Input value={p.availabilityStatus || ""} onChange={e => setP({ ...p, availabilityStatus: e.target.value })} placeholder="Availability" />
        <Input value={p.githubUrl || ""} onChange={e => setP({ ...p, githubUrl: e.target.value })} placeholder="GitHub URL" />
        <Input value={p.linkedinUrl || ""} onChange={e => setP({ ...p, linkedinUrl: e.target.value })} placeholder="LinkedIn URL" />
        <Input value={p.facebookUrl || ""} onChange={e => setP({ ...p, facebookUrl: e.target.value })} placeholder="Facebook URL" />
        <UploadField
          label="Profile photo"
          value={p.profileImageUrl || ""}
          onChange={v => setP({ ...p, profileImageUrl: v })}
          preview
          placeholder="Upload a professional photo of yourself"
        />
        <UploadField
          label="Resume (PDF)"
          value={p.resumeUrl || ""}
          onChange={v => setP({ ...p, resumeUrl: v })}
          accept="application/pdf"
          placeholder="Upload your resume PDF"
        />
        <Button onClick={save}>{saved ? "Saved" : "Save"}</Button>
      </Card>
    </div>
  );
}

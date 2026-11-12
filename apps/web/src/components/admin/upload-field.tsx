"use client";
import { useRef, useState } from "react";
import { UploadCloud, LoaderCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  preview?: boolean;
  placeholder?: string;
}

export function UploadField({ label, value, onChange, accept = "image/*", preview = false, placeholder }: UploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (json.success && json.data?.url) {
        onChange(json.data.url);
      } else {
        setError(json.error || "Upload failed.");
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <span className="block font-mono text-[11px] uppercase tracking-wider text-text-secondary">{label}</span>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Upload a file or paste a URL"}
        />
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
        <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()} disabled={uploading} className="shrink-0">
          {uploading ? <LoaderCircle size={15} className="animate-spin" /> : <UploadCloud size={15} />}
          Upload
        </Button>
        {value && (
          <Button type="button" variant="ghost" onClick={() => onChange("")} className="shrink-0" aria-label={`Clear ${label}`}>
            <X size={15} />
          </Button>
        )}
      </div>
      {preview && value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt={`${label} preview`} className="h-28 rounded-lg border border-border bg-bg-secondary object-contain p-1" />
      )}
      {error && <span className="block text-xs text-red-700">{error}</span>}
    </div>
  );
}

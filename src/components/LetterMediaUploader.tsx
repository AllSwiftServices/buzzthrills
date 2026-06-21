"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, Music, Mic, Video, Image as ImageIcon } from "lucide-react";
import { LETTER_MEDIA_LIMITS } from "@/lib/letters";
import { useAuth } from "@/context/AuthContext";

type Kind = "music" | "voice" | "video" | "photo";

const KIND_META: Record<Kind, { label: string; accept: string; icon: any }> = {
  music: { label: "Background Music", accept: "audio/*", icon: Music },
  voice: { label: "Voice Note", accept: "audio/*", icon: Mic },
  video: { label: "Video Message", accept: "video/*", icon: Video },
  photo: { label: "Recipient Photo", accept: "image/*", icon: ImageIcon },
};

interface Props {
  kind: Kind;
  value: string | null;
  letterId?: string | null;
  onChange: (url: string | null) => void;
  hint?: string;
  disabled?: boolean;
}

export default function LetterMediaUploader({ kind, value, letterId, onChange, hint, disabled }: Props) {
  const meta = KIND_META[kind];
  const Icon = meta.icon;
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refresh } = useAuth();

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    // 1. Client-side size check
    if (file.size > LETTER_MEDIA_LIMITS.maxFileBytes) {
      setError(`File is too large (max ${LETTER_MEDIA_LIMITS.maxFileBytes / (1024 * 1024)}MB)`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    // 2. Client-side type check
    let acceptedTypes: readonly string[] = [];
    if (kind === "music") acceptedTypes = LETTER_MEDIA_LIMITS.acceptedMusic;
    else if (kind === "voice") acceptedTypes = LETTER_MEDIA_LIMITS.acceptedVoice;
    else if (kind === "video") acceptedTypes = LETTER_MEDIA_LIMITS.acceptedVideo;
    else if (kind === "photo") acceptedTypes = LETTER_MEDIA_LIMITS.acceptedPhoto;

    if (file.type && !acceptedTypes.includes(file.type)) {
      setError(`Unsupported file type for ${meta.label.toLowerCase()}`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setUploading(true);
    try {
      // 3. Request signed upload URL from Next.js server
      let res = await fetch("/api/letters/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          filetype: file.type || "application/octet-stream",
          filesize: file.size,
          kind,
          letterId: letterId || null,
        }),
      });

      let data = await res.json();

      // If unauthorized, attempt to refresh the token and retry once
      if (res.status === 401) {
        try {
          await refresh();
          res = await fetch("/api/letters/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              filetype: file.type || "application/octet-stream",
              filesize: file.size,
              kind,
              letterId: letterId || null,
            }),
          });
          data = await res.json();
        } catch (refreshErr) {
          console.error("Token refresh failed during upload retry:", refreshErr);
        }
      }

      if (!res.ok) {
        setError(data.error || "Failed to initiate upload");
        return;
      }

      // 4. Perform direct upload to the signedUrl
      const uploadRes = await fetch(data.signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });

      if (!uploadRes.ok) {
        const uploadErrText = await uploadRes.text();
        console.error("Direct upload error:", uploadErrText);
        setError("Failed to upload file directly to storage.");
        return;
      }

      onChange(data.url);
    } catch (err) {
      console.error(err);
      setError("Network error. Try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-foreground/70">
          <Icon size={14} className="text-primary" />
          {meta.label}
        </div>
        {hint && <span className="text-[10px] text-muted-foreground italic">{hint}</span>}
      </div>

      {value ? (
        kind === "photo" ? (
          <div className="relative rounded-2xl overflow-hidden border border-primary/30 bg-primary/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Recipient" className="w-full h-48 object-cover" />
            <button
              type="button"
              onClick={() => onChange(null)}
              disabled={disabled || uploading}
              className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 text-white hover:bg-red-500 transition-all"
              aria-label="Remove photo"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-primary/30 bg-primary/5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-white shrink-0">
                <Icon size={16} />
              </div>
              <span className="text-xs font-bold truncate">{meta.label} uploaded</span>
            </div>
            <div className="flex items-center gap-2">
              {kind !== "video" ? (
                <audio src={value} controls className="h-8 max-w-[140px] sm:max-w-[200px]" />
              ) : (
                <a href={value} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest text-primary">
                  Preview
                </a>
              )}
              <button
                type="button"
                onClick={() => onChange(null)}
                disabled={disabled || uploading}
                className="p-2 rounded-xl text-foreground/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
                aria-label="Remove file"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || uploading}
          className="w-full p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <Loader2 size={22} className="text-primary animate-spin" />
          ) : (
            <Upload size={22} className="text-primary" />
          )}
          <span className="text-xs font-black uppercase tracking-widest text-foreground/70">
            {uploading ? "Uploading…" : `Upload ${meta.label.toLowerCase()}`}
          </span>
          <span className="text-[10px] text-muted-foreground italic">Max 20MB</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={meta.accept}
        onChange={handleSelect}
        className="hidden"
      />

      {error && <p className="text-[10px] font-bold text-red-400 mt-1">{error}</p>}
    </div>
  );
}

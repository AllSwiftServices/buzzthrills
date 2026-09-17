"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, Mic, Video, Music, CheckCircle2, AlertCircle } from "lucide-react";
import { LETTER_THEMES, type LetterTheme } from "@/lib/letters";
import LetterMediaUploader from "@/components/LetterMediaUploader";

interface AdminLetterEditorProps {
  letter: any;
  onSaved?: () => void;
}

export default function AdminLetterEditor({ letter, onSaved }: AdminLetterEditorProps) {
  const [form, setForm] = useState({
    message: letter.message || "",
    theme: (letter.theme || "parchment") as LetterTheme,
    backgroundMusicUrl: letter.background_music_url || letter.voice_note_url || (null as string | null),
    voiceNoteUrl: letter.voice_note_url || (null as string | null),
    videoUrl: letter.video_url || (null as string | null),
    extraKind: (letter.video_url ? "video" : "none") as "none" | "video",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Reset saved indicator when form changes
  useEffect(() => {
    setSaved(false);
    setSaveError(null);
  }, [form]);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setSaveError(null);
    try {
      const res = await fetch(`/api/letters/${letter.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: form.message,
          theme: form.theme,
          background_music_url: form.backgroundMusicUrl,
          voice_note_url: null,
          video_url: form.extraKind === "video" ? form.videoUrl : null,
        }),
      });
      if (res.ok) {
        setSaved(true);
        onSaved?.();
      } else {
        const d = await res.json();
        setSaveError(d.error || "Save failed. Please try again.");
      }
    } catch {
      setSaveError("Network error. Check your connection.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Letter Content ── */}
      <section className="p-6 rounded-3xl border border-foreground/10 bg-foreground/[0.02] space-y-4">
        <div className="text-[10px] font-black tracking-[0.3em] text-primary">
          Letter Content
        </div>

        {letter.request_admin_letter && (
          <div className="flex gap-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-base shrink-0">✍️</span>
            <p className="text-xs font-medium text-amber-300">
              This user asked BuzzThrills to write this letter.
              {letter.additional_comments && (
                <>
                  {" "}Their brief:{" "}
                  <span className="font-medium text-amber-200/80">
                    "{letter.additional_comments}"
                  </span>
                </>
              )}
            </p>
          </div>
        )}

        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={10}
          placeholder="Write the letter content here…"
          className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-4 px-5 text-sm font-medium leading-relaxed outline-none focus:border-primary/40 resize-none"
        />
      </section>

      {/* ── Theme ── */}
      <section className="p-6 rounded-3xl border border-foreground/10 bg-foreground/[0.02] space-y-4">
        <div className="text-[10px] font-black tracking-[0.3em] text-primary">Theme</div>
        <div className="grid grid-cols-3 gap-3">
          {LETTER_THEMES.map((t) => {
            const active = form.theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setForm({ ...form, theme: t.id as LetterTheme })}
                className={`p-3 rounded-2xl border-2 text-left transition-all ${
                  active ? "border-primary" : "border-foreground/10 hover:border-foreground/20"
                }`}
              >
                <div
                  className="w-full h-12 rounded-xl mb-2 border border-black/10 flex items-center justify-center font-serif text-sm"
                  style={{ background: t.preview.paperBg, color: t.preview.paperText }}
                >
                  Aa
                </div>
                <span className="text-[10px] font-black tracking-widest text-foreground/70">
                  {t.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Voice Recording / Background Music ── */}
      <section className="p-6 rounded-3xl border border-foreground/10 bg-foreground/[0.02] space-y-4">
        {letter.request_admin_voice && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <Mic size={15} className="text-amber-400 shrink-0" />
            <p className="text-xs font-medium text-amber-300">
              User requested a BuzzThrills voice recording. Upload it below.
            </p>
          </div>
        )}

        <LetterMediaUploader
          kind="music"
          label="Upload voice recording or background music"
          value={form.backgroundMusicUrl}
          letterId={letter.id}
          onChange={(url) => setForm({ ...form, backgroundMusicUrl: url, voiceNoteUrl: null })}
        />
      </section>

      {/* ── Video Message ── */}
      <section className="p-6 rounded-3xl border border-foreground/10 bg-foreground/[0.02] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video size={14} className="text-primary" />
            <div className="text-[10px] font-black tracking-[0.3em] text-primary">
              Video Message
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,
                extraKind: form.extraKind === "video" ? "none" : "video",
                videoUrl: form.extraKind === "video" ? null : form.videoUrl,
              })
            }
            className={`px-3 py-1.5 rounded-xl border text-[10px] font-black tracking-widest transition-all ${
              form.extraKind === "video"
                ? "border-primary bg-primary/10 text-primary"
                : "border-foreground/10 text-foreground/60 hover:text-foreground"
            }`}
          >
            {form.extraKind === "video" ? "Remove Video" : "Add Video"}
          </button>
        </div>

        {form.extraKind === "video" && (
          <LetterMediaUploader
            kind="video"
            value={form.videoUrl}
            letterId={letter.id}
            onChange={(url) => setForm({ ...form, videoUrl: url })}
          />
        )}
      </section>

      {/* ── Feedback banners ── */}
      {saved && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400">
          <CheckCircle2 size={16} className="shrink-0" />
          <span className="text-xs font-black tracking-widest">
            Changes saved. Ready to publish when you're done.
          </span>
        </div>
      )}
      {saveError && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400">
          <AlertCircle size={16} className="shrink-0" />
          <span className="text-xs font-black tracking-widest">{saveError}</span>
        </div>
      )}

      {/* ── Save ── */}
      <button
        onClick={save}
        disabled={saving}
        className="w-full py-4 rounded-2xl border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary font-black text-sm tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
      >
        {saving ? (
          <Loader2 size={16} className="animate-spin" />
        ) : saved ? (
          <CheckCircle2 size={16} />
        ) : (
          <Save size={16} />
        )}
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save Changes"}
      </button>
    </div>
  );
}

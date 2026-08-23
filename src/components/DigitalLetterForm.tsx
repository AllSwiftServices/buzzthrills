"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Phone,
  User,
  Sparkles,
  CreditCard,
  Mic,
  Video,
  QrCode,
  Mail,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { PAYSTACK_PUBLIC_KEY } from "@/lib/paystack";
import {
  LETTER_THEMES,
  LETTER_PRICING,
  calculateLetterPrice,
  type LetterTheme,
  type LetterTier,
} from "@/lib/letters";
import LetterMediaUploader from "@/components/LetterMediaUploader";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

type Step = "compose" | "recipient" | "media" | "pay";

interface Draft {
  id: string | null;
  code: string | null;
  message: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  recipientPhotoUrl: string | null;
  theme: LetterTheme;
  tier: LetterTier;
  backgroundMusicUrl: string | null;
  voiceNoteUrl: string | null;
  videoUrl: string | null;
  extraKind: "none" | "voice" | "video";
  wantsScannable: boolean;
  requestAdminVoice: boolean;
  additionalComments: string;
  requestAdminLetter: boolean;
}

interface FormProps {
  mode?: "user" | "admin";
  existing?: any; // editing
}

function DigitalLetterFormContent({ mode = "user", existing }: FormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refresh } = useAuth();
  const isAdmin = mode === "admin";
  const isEditing = !!existing;

  // Tier is legacy — always "standard" now. Kept in state for back-compat with existing rows.
  void searchParams;

  const [step, setStep] = useState<Step>("compose");
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [draft, setDraft] = useState<Draft>({
    id: existing?.id || null,
    code: existing?.qr_identifier || null,
    message: existing?.message || "",
    recipientName: existing?.recipient_name || "",
    recipientPhone: existing?.recipient_phone || "",
    recipientEmail: existing?.recipient_email || "",
    recipientPhotoUrl: existing?.recipient_photo_url || null,
    theme: (existing?.theme as LetterTheme) || "parchment",
    tier: "standard",
    backgroundMusicUrl: existing?.background_music_url || null,
    voiceNoteUrl: existing?.voice_note_url || null,
    videoUrl: existing?.video_url || null,
    extraKind: existing?.video_url ? "video" : existing?.voice_note_url ? "voice" : "none",
    wantsScannable: !!existing?.wants_scannable,
    requestAdminVoice: !!existing?.request_admin_voice,
    additionalComments: existing?.additional_comments || "",
    requestAdminLetter: !!existing?.request_admin_letter,
  });

  useEffect(() => {
    if (isAdmin) return;
    async function checkSub() {
      if (!user) return;
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        if (data.subscription?.status === "active") setSubscription(data.subscription);
      } catch (e) {
        console.error(e);
      }
    }
    checkSub();
  }, [user, isAdmin]);

  const isSubscriber = subscription?.status === "active";
  const hasAudioOrVideo =
    draft.extraKind === "voice" ||
    draft.extraKind === "video" ||
    draft.requestAdminVoice;
  const priceBreakdown = calculateLetterPrice({
    hasAudioOrVideo,
    wantsScannable: draft.wantsScannable,
  });
  // Digital letters are always paid separately — not covered by subscription.
  const amountToCharge = priceBreakdown.total;

  const ensureDraftSaved = async (): Promise<{ id: string; code: string } | null> => {
    if (draft.id && draft.code) return { id: draft.id, code: draft.code };
    let res = await fetch("/api/letters/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient_name: draft.recipientName || "Recipient",
        recipient_phone: draft.recipientPhone || null,
        recipient_email: draft.recipientEmail || null,
        recipient_photo_url: draft.recipientPhotoUrl || null,
        message: draft.message || "(draft)",
        theme: draft.theme,
        tier: "standard",
        wants_scannable: draft.wantsScannable,
        request_admin_voice: draft.requestAdminVoice,
        request_admin_letter: draft.requestAdminLetter,
        additional_comments: draft.additionalComments || null,
      }),
    });

    if (res.status === 401) {
      try {
        await refresh();
        res = await fetch("/api/letters/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipient_name: draft.recipientName || "Recipient",
            recipient_phone: draft.recipientPhone || null,
            recipient_email: draft.recipientEmail || null,
            recipient_photo_url: draft.recipientPhotoUrl || null,
            message: draft.message || "(draft)",
            theme: draft.theme,
            tier: "standard",
            wants_scannable: draft.wantsScannable,
            request_admin_voice: draft.requestAdminVoice,
            request_admin_letter: draft.requestAdminLetter,
            additional_comments: draft.additionalComments || null,
          }),
        });
      } catch (err) {
        console.error("Token refresh failed during draft save:", err);
      }
    }

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Could not save draft");
      return null;
    }
    setDraft((d) => ({ ...d, id: data.letter.id, code: data.letter.qr_identifier }));
    return { id: data.letter.id, code: data.letter.qr_identifier };
  };

  const persistField = async (patch: Partial<{
    message: string;
    recipient_name: string;
    recipient_phone: string | null;
    recipient_email: string | null;
    recipient_photo_url: string | null;
    theme: LetterTheme;
    tier: LetterTier;
    background_music_url: string | null;
    voice_note_url: string | null;
    video_url: string | null;
    wants_scannable: boolean;
    request_admin_voice: boolean;
    request_admin_letter: boolean;
    additional_comments: string | null;
  }>) => {
    if (!draft.id) return;
    try {
      let res = await fetch(`/api/letters/${draft.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });

      if (res.status === 401) {
        try {
          await refresh();
          res = await fetch(`/api/letters/${draft.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patch),
          });
        } catch (refreshErr) {
          console.error("Token refresh failed during persistField:", refreshErr);
        }
      }
    } catch (e) {
      console.error("Patch failure", e);
    }
  };

  const nextStep = async () => {
    if (step === "compose") {
      if (!draft.requestAdminLetter && !draft.message.trim()) {
        alert("Please write your message, or choose 'Write it for me'.");
        return;
      }
      setStep("recipient");
      return;
    }
    if (step === "recipient") {
      if (!draft.recipientName.trim()) {
        alert("Please enter the recipient's name.");
        return;
      }
      if (!draft.id) {
        setLoading(true);
        const saved = await ensureDraftSaved();
        setLoading(false);
        if (!saved) return;
      } else {
        await persistField({
          message: draft.message,
          recipient_name: draft.recipientName,
          recipient_phone: draft.recipientPhone || null,
          recipient_email: draft.recipientEmail || null,
          recipient_photo_url: draft.recipientPhotoUrl || null,
          theme: draft.theme,
        });
      }
      setStep("media");
      return;
    }
    if (step === "media") {
      await persistField({
        background_music_url: draft.backgroundMusicUrl,
        voice_note_url: draft.extraKind === "voice" ? draft.voiceNoteUrl : null,
        video_url: draft.extraKind === "video" ? draft.videoUrl : null,
        wants_scannable: draft.wantsScannable,
        request_admin_voice: draft.requestAdminVoice,
        request_admin_letter: draft.requestAdminLetter,
        additional_comments: draft.additionalComments || null,
      });
      if (isAdmin || isEditing) {
        await finalizeAdmin();
        return;
      }
      setStep("pay");
      return;
    }
    if (step === "pay") {
      handlePay();
    }
  };

  const prevStep = () => {
    if (step === "recipient") setStep("compose");
    else if (step === "media") setStep("recipient");
    else if (step === "pay") setStep("media");
  };

  const finalizeAdmin = async () => {
    if (!draft.id) return;
    setLoading(true);
    try {
      let res = await fetch(`/api/letters/${draft.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "published" }),
      });

      if (res.status === 401) {
        try {
          await refresh();
          res = await fetch(`/api/letters/${draft.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "published" }),
          });
        } catch (refreshErr) {
          console.error("Token refresh failed during finalizeAdmin:", refreshErr);
        }
      }
      router.push(`/admin/letters`);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = () => {
    if (!window.PaystackPop) {
      alert("Payment gateway is loading, please try again.");
      return;
    }
    if (!user?.email) {
      alert("Missing your email address.");
      return;
    }
    if (!draft.id) {
      alert("Letter draft missing. Please go back a step.");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: amountToCharge * 100,
      currency: "NGN",
      metadata: {
        purchase_type: "digital_letter",
        letter_id: draft.id,
        user_id: user.id,
        has_audio_video: hasAudioOrVideo,
        wants_scannable: draft.wantsScannable,
      },
      callback: function (response: any) {
        fetch(`/api/payments/verify?reference=${response.reference}`)
          .then((r) => r.json())
          .then((data) => {
            if (data.success) {
              if (data.needs_processing) {
                router.push(`/digital-letters/processing/${draft.id}`);
              } else {
                router.push(`/digital-letters/share/${draft.id}`);
              }
            } else {
              alert("Payment verification failed.");
            }
          })
          .catch(() => alert("Verification error."));
      },
      onClose: () => {},
    });
    handler.openIframe();
  };

  const steps: Step[] = isAdmin || isEditing
    ? ["compose", "recipient", "media"]
    : ["compose", "recipient", "media", "pay"];

  return (
    <div className="w-full max-w-3xl mx-auto glass p-4 sm:p-8 md:p-12 min-h-[500px] flex flex-col border border-border shadow-2xl relative overflow-hidden rounded-[40px]">
      <div className="absolute top-0 left-0 w-full h-1 gradient-bg opacity-50" />

      <div className="flex items-center justify-between mb-8 relative px-1">
        <div className="absolute top-1/2 left-0 w-full h-px bg-border -translate-y-1/2 z-0" />
        {steps.map((s, i, arr) => {
          const isPast = arr.indexOf(step) > i;
          const isCurrent = step === s;
          return (
            <button
              key={s}
              onClick={() => isPast && setStep(s)}
              disabled={!isPast}
              className={`relative z-10 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-xs md:text-sm transition-all border-2 ${
                isCurrent
                  ? "gradient-bg border-transparent text-white scale-110 shadow-lg shadow-primary/20"
                  : isPast
                  ? "bg-primary border-primary text-white cursor-pointer hover:scale-110"
                  : "bg-muted border-border text-muted-foreground cursor-default"
              }`}
            >
              {isPast ? <Check size={16} /> : i + 1}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {step === "compose" && (
          <motion.div
            key="compose"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-grow space-y-6"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 tracking-tighter">
                Write Your <span className="gradient-text">Letter</span>
              </h2>
              <p className="text-muted-foreground font-medium text-[10px] tracking-widest">
                Pour it out. They'll see the words animate to life on the other end.
              </p>
            </div>

            {/* Write mode toggle */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDraft({ ...draft, requestAdminLetter: false })}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  !draft.requestAdminLetter
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className={`text-xs font-black tracking-widest mb-1 ${!draft.requestAdminLetter ? "text-primary" : "text-foreground/40"}`}>
                  ✍️ I'll write it
                </div>
                <p className="text-[10px] text-muted-foreground font-medium leading-snug">
                  Write your own heartfelt message
                </p>
              </button>
              <button
                type="button"
                onClick={() => setDraft({ ...draft, requestAdminLetter: true })}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  draft.requestAdminLetter
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className={`text-xs font-black tracking-widest mb-1 ${draft.requestAdminLetter ? "text-primary" : "text-foreground/40"}`}>
                  ✨ Write it for me
                </div>
                <p className="text-[10px] text-muted-foreground font-medium leading-snug">
                  BuzzThrills crafts the letter for you
                </p>
              </button>
            </div>

            {draft.requestAdminLetter ? (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
                  <span className="text-lg shrink-0">✨</span>
                  <p className="text-[11px] text-amber-300 font-medium leading-relaxed">
                    Our team will craft a beautiful, personalised letter on your behalf. Just tell us a little about the occasion and recipient. We'll take care of the rest before your letter is published.
                  </p>
                </div>
                <label className="text-[10px] font-black text-primary tracking-[0.2em] ml-1">
                  Tell us about the occasion
                </label>
                <textarea
                  value={draft.additionalComments}
                  onChange={(e) => setDraft({ ...draft, additionalComments: e.target.value })}
                  rows={6}
                  className="w-full bg-foreground/5 border border-border rounded-[24px] py-5 px-6 focus:border-primary outline-none font-medium text-base leading-relaxed resize-none"
                  placeholder="e.g. It's my mum's 60th birthday. She loves poetry and has always been my biggest supporter. Keep it warm and celebratory…"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <label className="text-[10px] font-black text-primary tracking-[0.2em] ml-1">
                  Your Message
                </label>
                <textarea
                  value={draft.message}
                  onChange={(e) => setDraft({ ...draft, message: e.target.value })}
                  rows={8}
                  className="w-full bg-foreground/5 border border-border rounded-[24px] py-5 px-6 focus:border-primary outline-none font-medium text-base leading-relaxed resize-none"
                  placeholder="Dear ..., I want you to know..."
                />
                <p className="text-[10px] font-medium text-muted-foreground/70 ml-1">
                  {draft.message.length} characters · keep it heartfelt and personal
                </p>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-[10px] font-black text-primary tracking-[0.2em] ml-1">Theme</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {LETTER_THEMES.map((t) => {
                  const active = draft.theme === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setDraft({ ...draft, theme: t.id })}
                      className={`p-3 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${
                        active
                          ? "border-primary shadow-xl shadow-primary/10"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <div
                        className="w-full h-16 rounded-xl mb-3 border border-black/10"
                        style={{ background: t.preview.paperBg, color: t.preview.paperText }}
                      >
                        <div className="h-full flex items-center justify-center font-serif text-sm">Aa</div>
                      </div>
                      <span className="text-xs font-black tracking-widest">{t.name}</span>
                      <p className="text-[10px] text-muted-foreground font-medium mt-1 leading-snug">{t.tagline}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black tracking-[0.3em] text-primary">Base price</div>
                <p className="text-[11px] text-muted-foreground mt-1">Add voice/video and scannable copy in the next steps.</p>
              </div>
              <span className="text-2xl font-black gradient-text">₦{LETTER_PRICING.base.toLocaleString()}</span>
            </div>
          </motion.div>
        )}

        {step === "recipient" && (
          <motion.div
            key="recipient"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-grow space-y-6"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 tracking-tighter">
                Who Is This <span className="gradient-text">For</span>?
              </h2>
              <p className="text-muted-foreground font-medium text-[10px] tracking-widest">
                The link you'll share opens to a letter addressed to them.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-primary tracking-[0.2em] ml-1">
                Recipient&apos;s Name
              </label>
              <div className="relative group">
                <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={draft.recipientName}
                  onChange={(e) => setDraft({ ...draft, recipientName: e.target.value })}
                  className="w-full bg-foreground/5 border border-border rounded-[24px] py-5 pl-14 pr-6 focus:border-primary outline-none font-bold"
                  placeholder="Their first name or nickname"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-primary tracking-[0.2em] ml-1">
                Phone Number <span className="text-muted-foreground/60 normal-case font-bold">(optional, in case we WhatsApp them the link for you)</span>
              </label>
              <div className="relative group">
                <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="tel"
                  value={draft.recipientPhone}
                  onChange={(e) => setDraft({ ...draft, recipientPhone: e.target.value })}
                  className="w-full bg-foreground/5 border border-border rounded-[24px] py-5 pl-14 pr-6 focus:border-primary outline-none font-bold"
                  placeholder="+234 ..."
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-primary tracking-[0.2em] ml-1">
                Email Address <span className="text-muted-foreground/60 normal-case font-bold">(optional, in case we email them the link for you)</span>
              </label>
              <div className="relative group">
                <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={draft.recipientEmail}
                  onChange={(e) => setDraft({ ...draft, recipientEmail: e.target.value })}
                  className="w-full bg-foreground/5 border border-border rounded-[24px] py-5 pl-14 pr-6 focus:border-primary outline-none font-bold"
                  placeholder="recipient@example.com"
                />
              </div>
            </div>

            <LetterMediaUploader
              kind="photo"
              value={draft.recipientPhotoUrl}
              letterId={draft.id}
              onChange={(url) => setDraft({ ...draft, recipientPhotoUrl: url })}
              hint="Shows at the top of the letter (optional but recommended)"
            />
          </motion.div>
        )}

        {step === "media" && (
          <motion.div
            key="media"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-grow space-y-6"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 tracking-tighter">
                Add A <span className="gradient-text">Soundtrack</span>
              </h2>
              <p className="text-muted-foreground font-medium text-[10px] tracking-widest">
                Background music sets the mood. Add a voice note or video for a personal touch.
              </p>
            </div>

            <LetterMediaUploader
              kind="music"
              value={draft.backgroundMusicUrl}
              letterId={draft.id}
              onChange={(url) => setDraft({ ...draft, backgroundMusicUrl: url })}
              hint="Plays softly when they open the letter"
            />

            <div className="space-y-3">
              <div className="text-[10px] font-black tracking-[0.3em] text-foreground/70">
                Personal Touch <span className="text-muted-foreground/50 normal-case">(pick one)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {([
                  { id: "none", label: "None", icon: Sparkles },
                  { id: "voice", label: "My Voice", icon: Mic },
                  { id: "video", label: "Video", icon: Video },
                ] as { id: Draft["extraKind"]; label: string; icon: any }[]).map((opt) => {
                  const active = draft.extraKind === opt.id && !draft.requestAdminVoice;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          extraKind: opt.id,
                          requestAdminVoice: false,
                          voiceNoteUrl: opt.id === "voice" ? draft.voiceNoteUrl : null,
                          videoUrl: opt.id === "video" ? draft.videoUrl : null,
                        })
                      }
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                        active ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                      }`}
                    >
                      <Icon size={18} className={active ? "text-primary" : "text-foreground/40"} />
                      <span className="text-[10px] font-black tracking-widest">{opt.label}</span>
                    </button>
                  );
                })}
                {/* Request BuzzThrills voice recording */}
                <button
                  type="button"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      requestAdminVoice: !draft.requestAdminVoice,
                      extraKind: !draft.requestAdminVoice ? "none" : draft.extraKind,
                      voiceNoteUrl: null,
                    })
                  }
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                    draft.requestAdminVoice ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                  }`}
                >
                  <Mic size={18} className={draft.requestAdminVoice ? "text-primary" : "text-foreground/40"} />
                  <span className="text-[10px] font-black tracking-widest text-center leading-tight">BuzzThrills Voice</span>
                </button>
              </div>
              {draft.requestAdminVoice && (
                <p className="text-[11px] text-primary/80 font-medium px-1">
                  ✓ We'll record a professional voice-over for your letter. Leave any instructions in the comments below.
                </p>
              )}
            </div>

            {draft.extraKind === "voice" && (
              <LetterMediaUploader
                kind="voice"
                value={draft.voiceNoteUrl}
                letterId={draft.id}
                onChange={(url) => setDraft({ ...draft, voiceNoteUrl: url })}
                hint={draft.tier === "premium" ? "Up to 3 min" : "Up to 60 sec"}
              />
            )}

            {draft.extraKind === "video" && (
              <LetterMediaUploader
                kind="video"
                value={draft.videoUrl}
                letterId={draft.id}
                onChange={(url) => setDraft({ ...draft, videoUrl: url })}
                hint="Up to 60 sec"
              />
            )}

            <button
              type="button"
              onClick={() => setDraft({ ...draft, wantsScannable: !draft.wantsScannable })}
              className={`w-full p-5 rounded-2xl border-2 transition-all flex items-start gap-4 text-left ${
                draft.wantsScannable ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${draft.wantsScannable ? "gradient-bg text-white" : "bg-foreground/5 text-foreground/40"}`}>
                <QrCode size={22} />
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="text-sm font-black tracking-tight">Scannable physical copy</span>
                  <span className="text-[10px] font-black tracking-widest text-primary">
                    +₦{LETTER_PRICING.scannableAddon.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                  We'll print a physical card with a QR that opens the letter. Our team coordinates delivery with you after checkout.
                </p>
              </div>
            </button>

            {/* Additional comments */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-primary tracking-[0.2em] ml-1">
                Additional Comments <span className="text-muted-foreground/60 normal-case font-bold">(optional)</span>
              </label>
              <textarea
                value={draft.additionalComments}
                onChange={(e) => setDraft({ ...draft, additionalComments: e.target.value })}
                rows={3}
                className="w-full bg-foreground/5 border border-border rounded-[20px] py-4 px-5 focus:border-primary outline-none font-medium text-sm leading-relaxed resize-none"
                placeholder="Any special instructions: tone, style, timing, language preference…"
              />
            </div>

            <div className="p-5 rounded-2xl bg-foreground/5 border border-border space-y-2">
              <div className="text-[10px] font-black tracking-[0.3em] text-primary mb-2">Running total</div>
              {priceBreakdown.lines.map((line) => (
                <div key={line.label} className={`flex justify-between text-xs ${line.included ? "text-foreground" : "text-muted-foreground/40"}`}>
                  <span className="font-bold">{line.label}</span>
                  <span className="font-black">{line.included ? `₦${line.amount.toLocaleString()}` : "—"}</span>
                </div>
              ))}
              <div className="flex justify-between pt-3 border-t border-border text-sm">
                <span className="font-black tracking-widest">Total</span>
                <span className="font-black gradient-text">₦{priceBreakdown.total.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        )}

        {step === "pay" && (
          <motion.div
            key="pay"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-grow flex flex-col items-center justify-center text-center py-8"
          >
            <div className="w-20 h-20 rounded-[28px] gradient-bg flex items-center justify-center mb-8 shadow-huge animate-pulse">
              <CreditCard size={32} className="text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-3 tracking-tighter">
              Pay &amp; <span className="gradient-text">Publish</span>
            </h2>
            <p className="text-muted-foreground font-medium mb-8 max-w-sm leading-relaxed text-[10px] tracking-[0.2em]">
              Secure checkout via Paystack. You'll receive your share link instantly after payment.
            </p>

            <div className="w-full max-w-md p-6 sm:p-8 rounded-[32px] glass border border-border text-left space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-bold tracking-widest text-[10px]">Recipient</span>
                <span className="font-black">{draft.recipientName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-bold tracking-widest text-[10px]">Theme</span>
                <span className="font-black capitalize">{draft.theme}</span>
              </div>

              <div className="pt-3 border-t border-border space-y-2">
                {priceBreakdown.lines.map((line) => (
                  <div
                    key={line.label}
                    className={`flex justify-between text-xs ${line.included ? "text-foreground" : "text-muted-foreground/40"}`}
                  >
                    <span className="font-bold">{line.label}</span>
                    <span className="font-black">{line.included ? `₦${line.amount.toLocaleString()}` : "—"}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-border flex justify-between items-center">
                <span className="text-xs font-black tracking-[0.2em]">You pay now</span>
                <span className="text-2xl font-black gradient-text">
                  ₦{amountToCharge.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 flex justify-between items-center pt-6 border-t border-border">
        <button
          onClick={prevStep}
          disabled={step === "compose"}
          className={`flex items-center gap-2 px-6 py-4 rounded-[28px] font-black text-[10px] tracking-widest transition-all ${
            step === "compose"
              ? "opacity-0 pointer-events-none"
              : "glass border border-border hover:border-foreground/20 text-foreground/60 hover:text-foreground hover:scale-105 active:scale-95"
          }`}
        >
          <ChevronLeft size={16} />
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={loading}
          className="flex items-center gap-2 px-8 py-4 rounded-[28px] gradient-bg text-white font-black text-[10px] tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              {step === "pay"
                ? "Pay & Publish"
                : step === "media" && (isAdmin || isEditing)
                ? isEditing
                  ? "Save & Publish"
                  : "Publish"
                : "Next"}
              {step !== "pay" && step !== "media" && <ChevronRight size={16} />}
              {step === "pay" && <Sparkles size={16} />}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function DigitalLetterForm(props: FormProps) {
  return (
    <Suspense fallback={<div className="text-center text-sm text-muted-foreground py-12">Loading…</div>}>
      <DigitalLetterFormContent {...props} />
    </Suspense>
  );
}

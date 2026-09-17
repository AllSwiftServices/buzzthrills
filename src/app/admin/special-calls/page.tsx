/* eslint-disable @next/next/no-img-element */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  Sparkles, Plus, Trash2, Pencil, CheckCircle2, XCircle, Calendar,
  Loader2, Save, X, Upload, Image as ImageIcon, Link as LinkIcon, HelpCircle,
  Share2, Copy, Check, ExternalLink
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type PriceOption = {
  title: string;
  price: number;
};

type SpecialCall = {
  id: string;
  title: string;
  description: string;
  occasion_emoji: string;
  image_url?: string | null;
  price: number;
  currency: string;
  price_options?: PriceOption[] | null;
  custom_questions?: string[] | null;
  active: boolean;
  call_date: string | null;
  created_at: string;
};

type FormPriceOption = {
  title: string;
  price: string;
};

const emptyForm = {
  title: "",
  description: "",
  occasion_emoji: "🎉",
  image_url: "",
  currency: "NGN",
  active: false,
  call_date: "",
  price_options: [
    { title: "Standard Call", price: "" },
    { title: "", price: "" },
    { title: "", price: "" },
  ] as FormPriceOption[],
  custom_questions: ["", "", "", "", ""] as string[],
};

export default function AdminSpecialCallsPage() {
  const { user, loading: authLoading } = useAuth();
  const [calls, setCalls] = useState<SpecialCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCall, setEditingCall] = useState<SpecialCall | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedGeneral, setCopiedGeneral] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showForm]);

  function getShareUrl(callId?: string) {
    if (typeof window === "undefined") return "https://buzzthrills.com/#special-calls";
    const origin = window.location.origin;
    return callId ? `${origin}/?specialCall=${callId}#special-calls` : `${origin}/#special-calls`;
  }

  function handleCopyLink(callId?: string) {
    const url = getShareUrl(callId);
    navigator.clipboard.writeText(url);
    if (callId) {
      setCopiedId(callId);
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      setCopiedGeneral(true);
      setTimeout(() => setCopiedGeneral(false), 2000);
    }
  }

  function handleShareWhatsApp(call: SpecialCall) {
    const url = getShareUrl(call.id);
    const text = `🎉 Special Surprise Call: *${call.title}* on Buzzthrills!\n\n${call.description ? call.description + "\n\n" : ""}Book this special moment now: ${url}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  async function fetchCalls() {
    if (authLoading || !user || user.role !== "admin") return;
    try {
      const res = await fetch("/api/admin/special-calls");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCalls(data.specialCalls || []);
    } catch (err) {
      console.error("Special calls fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchCalls(); }, [user, authLoading]);

  function openCreate() {
    setEditingCall(null);
    setForm({
      ...emptyForm,
      price_options: [
        { title: "Standard Call", price: "" },
        { title: "", price: "" },
        { title: "", price: "" },
      ],
      custom_questions: ["", "", "", "", ""],
    });
    setUploadError(null);
    setShowForm(true);
  }

  function openEdit(call: SpecialCall) {
    setEditingCall(call);

    const existingOptions =
      call.price_options && Array.isArray(call.price_options) && call.price_options.length > 0
        ? call.price_options.map((opt) => ({ title: opt.title, price: String(opt.price) }))
        : [{ title: call.title || "Standard Call", price: String(call.price || "") }];

    const paddedOptions: FormPriceOption[] = [
      existingOptions[0] || { title: "Standard Call", price: "" },
      existingOptions[1] || { title: "", price: "" },
      existingOptions[2] || { title: "", price: "" },
    ];

    const existingQuestions = Array.isArray(call.custom_questions) ? call.custom_questions : [];
    const paddedQuestions: string[] = [
      existingQuestions[0] || "",
      existingQuestions[1] || "",
      existingQuestions[2] || "",
      existingQuestions[3] || "",
      existingQuestions[4] || "",
    ];

    setForm({
      title: call.title,
      description: call.description,
      occasion_emoji: call.occasion_emoji,
      image_url: call.image_url || "",
      currency: call.currency,
      active: call.active,
      call_date: call.call_date || "",
      price_options: paddedOptions,
      custom_questions: paddedQuestions,
    });
    setUploadError(null);
    setShowForm(true);
  }

  async function handleImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image is too large (max 10MB).");
      return;
    }

    setUploadError(null);
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/special-calls/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload image");

      setForm((prev) => ({ ...prev, image_url: data.url }));
    } catch (err: unknown) {
      console.error("Flyer upload error:", err);
      const message = err instanceof Error ? err.message : "Failed to upload image.";
      setUploadError(message);
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSave() {
    if (!form.title) {
      alert("Title is required.");
      return;
    }

    const validOptions = form.price_options
      .filter((opt) => opt.title.trim() && opt.price.trim() && !isNaN(Number(opt.price)))
      .map((opt) => ({
        title: opt.title.trim(),
        price: Number(opt.price),
      }));

    if (validOptions.length === 0) {
      alert("Please provide at least one pricing option with a title and price.");
      return;
    }

    const validQuestions = form.custom_questions
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    setSaving(true);
    try {
      const primaryPrice = validOptions[0].price;
      const payload = {
        title: form.title,
        description: form.description,
        occasion_emoji: form.occasion_emoji,
        image_url: form.image_url ? form.image_url.trim() : null,
        price: primaryPrice,
        currency: form.currency || "NGN",
        price_options: validOptions,
        custom_questions: validQuestions,
        active: form.active,
        call_date: form.call_date || null,
      };

      if (editingCall) {
        const res = await fetch(`/api/admin/special-calls/${editingCall.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Update failed");
      } else {
        const res = await fetch("/api/admin/special-calls", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Create failed");
      }
      setShowForm(false);
      await fetchCalls();
    } catch (err) {
      console.error("Save error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(call: SpecialCall) {
    try {
      await fetch(`/api/admin/special-calls/${call.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !call.active }),
      });
      await fetchCalls();
    } catch (err) {
      console.error("Toggle error:", err);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this special call? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/special-calls/${id}`, { method: "DELETE" });
      await fetchCalls();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div className="text-[10px] font-black tracking-[0.3em] text-foreground/20">Loading Special Calls...</div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black mb-1 sm:mb-2 text-foreground tracking-tighter">
            Special Calls
          </h1>
          <p className="text-foreground/40 font-medium text-[8px] sm:text-[10px] tracking-[0.2em]">
            Create occasion-based call banners shown on the homepage.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-3 px-6 py-3 rounded-2xl gradient-bg text-white font-black text-[10px] tracking-widest shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={16} />
          New Special Call
        </button>
      </header>

      {/* Active Special Call Live Share Bar */}
      {calls.some((c) => c.active) && (
        <div className="p-5 sm:p-6 rounded-[28px] bg-gradient-to-r from-emerald-500/10 via-primary/10 to-secondary/10 border-2 border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-500 uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              Live Homepage Link Ready for WhatsApp &amp; Socials
            </div>
            <p className="text-[11px] text-foreground/70 font-medium">
              Post this link on WhatsApp or socials. When people click it, it takes them right to your Special Call on the homepage!
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleCopyLink()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-xs font-bold hover:border-primary/50 transition-all shadow-sm active:scale-95"
            >
              {copiedGeneral ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              {copiedGeneral ? "Link Copied!" : "Copy Link"}
            </button>
            {(() => {
              const activeCall = calls.find((c) => c.active);
              if (!activeCall) return null;
              return (
                <button
                  onClick={() => handleShareWhatsApp(activeCall)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/25 active:scale-95"
                >
                  <Share2 size={14} />
                  Share on WhatsApp
                </button>
              );
            })()}
            <a
              href="/#special-calls"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-foreground/5 border border-border text-foreground/50 hover:text-foreground transition-all"
              title="Preview on homepage"
            >
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      )}

      {/* Calls List */}
      <div className="grid grid-cols-1 gap-6">
        {calls.length > 0 ? calls.map((call, i) => (
          <motion.div
            key={call.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="p-5 sm:p-8 rounded-[24px] sm:rounded-[40px] bg-foreground/[0.03] border border-foreground/5 hover:border-primary/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[50px] rounded-full group-hover:bg-primary/10 transition-all -mr-24 -mt-24" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              {/* Left: Info */}
              <div className="flex items-center gap-4 sm:gap-6">
                {call.image_url ? (
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] sm:rounded-[24px] overflow-hidden border border-primary/20 bg-foreground/5 shadow-xl group-hover:scale-105 transition-transform duration-500 shrink-0">
                    <img
                      src={call.image_url}
                      alt={call.title}
                      className="w-full h-full object-cover"
                    />
                    {call.occasion_emoji && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-background/90 backdrop-blur-sm border border-primary/20 flex items-center justify-center text-xs shadow">
                        {call.occasion_emoji}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] sm:rounded-[24px] bg-foreground/5 border border-foreground/10 flex items-center justify-center text-3xl shadow-xl group-hover:scale-110 transition-transform duration-500 shrink-0">
                    {call.occasion_emoji}
                  </div>
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-1.5">
                    <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tighter">{call.title}</h3>
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest flex items-center gap-1.5 ${
                      call.active
                        ? "bg-green-500/10 text-green-500 border border-green-500/20"
                        : "bg-foreground/5 text-foreground/30 border border-foreground/10"
                    }`}>
                      {call.active ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                      {call.active ? "Live" : "Inactive"}
                    </div>
                  </div>
                  <p className="text-sm text-foreground/50 font-medium max-w-md">{call.description}</p>
                  {call.price_options && Array.isArray(call.price_options) && call.price_options.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-2 mt-2.5">
                      {call.price_options.map((opt, oIdx) => (
                        <span
                          key={oIdx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10 border border-primary/20 text-[10px] font-black text-primary tracking-wide"
                        >
                          <span className="text-foreground/70">{opt.title}:</span>
                          <span className="text-foreground font-black">₦{opt.price.toLocaleString()}</span>
                        </span>
                      ))}
                      {call.custom_questions && Array.isArray(call.custom_questions) && call.custom_questions.length > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-foreground/5 border border-foreground/10 text-[10px] font-bold text-foreground/70 tracking-wide">
                          <HelpCircle size={11} className="text-primary" />
                          {call.custom_questions.length} Custom {call.custom_questions.length === 1 ? "Question" : "Questions"}
                        </span>
                      )}
                      {call.call_date && (
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-foreground/40 tracking-widest ml-1">
                          <Calendar size={10} className="text-primary/60" />
                          {new Date(call.call_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                      <span className="text-[10px] font-black text-foreground/40 tracking-widest">
                        ₦{call.price.toLocaleString()} {call.currency}
                      </span>
                      {call.call_date && (
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-foreground/40 tracking-widest">
                          <Calendar size={10} className="text-primary/60" />
                          {new Date(call.call_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
                {/* Share on WhatsApp */}
                <button
                  onClick={() => handleShareWhatsApp(call)}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] tracking-wide hover:bg-emerald-500 hover:text-white transition-all active:scale-95 shadow-sm"
                  title="Share to WhatsApp"
                >
                  <Share2 size={13} />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>

                {/* Copy Link */}
                <button
                  onClick={() => handleCopyLink(call.id)}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground/70 hover:text-primary hover:border-primary/30 font-bold text-[10px] tracking-wide transition-all active:scale-95"
                  title="Copy link to this special call on homepage"
                >
                  {copiedId === call.id ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  <span>{copiedId === call.id ? "Copied!" : "Copy Link"}</span>
                </button>

                {/* Preview on Homepage */}
                <a
                  href="/#special-calls"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground/40 hover:text-foreground hover:border-foreground/30 transition-all"
                  title="Preview on homepage"
                >
                  <ExternalLink size={15} />
                </a>

                {/* Toggle active */}
                <button
                  onClick={() => toggleActive(call)}
                  className={`px-4 sm:px-5 py-2.5 rounded-2xl font-black text-[9px] tracking-widest border transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    call.active
                      ? "bg-green-500/10 border-green-500/20 text-green-500 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-500"
                      : "bg-foreground/5 border-foreground/10 text-foreground/40 hover:bg-green-500/10 hover:border-green-500/20 hover:text-green-500"
                  }`}
                >
                  {call.active ? "Deactivate" : "Activate"}
                </button>

                <button
                  onClick={() => openEdit(call)}
                  className="p-2.5 rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground/40 hover:text-primary hover:border-primary/30 transition-all"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => handleDelete(call.id)}
                  disabled={deletingId === call.id}
                  className="p-2.5 rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground/40 hover:text-red-500 hover:border-red-500/30 transition-all disabled:opacity-40"
                >
                  {deletingId === call.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="flex flex-col items-center justify-center py-24 px-8 rounded-[40px] border-2 border-dashed border-foreground/5 bg-foreground/[0.02] text-center">
            <Sparkles size={48} className="text-foreground/10 mb-4" />
            <div className="text-xl font-black text-foreground tracking-tighter">No special calls yet</div>
            <div className="text-[10px] font-black text-foreground/40 tracking-widest mt-2 mb-8">
              Create your first occasion banner for Valentine&apos;s, Mother&apos;s Day, and more.
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl gradient-bg text-white font-black text-[10px] tracking-widest shadow-2xl shadow-primary/40 hover:scale-[1.02] transition-all"
            >
              <Plus size={16} />
              Create First Special Call
            </button>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {mounted && createPortal(
        <AnimatePresence>
          {showForm && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowForm(false)}
                className="fixed inset-0 z-[200] bg-background/80 backdrop-blur-2xl"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 28, stiffness: 350 }}
                className="fixed inset-0 sm:inset-x-4 sm:top-[3%] sm:bottom-[3%] z-[201] max-w-2xl mx-auto flex flex-col overflow-hidden rounded-none sm:rounded-[36px] bg-background border-0 sm:border sm:border-border shadow-2xl"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-5 sm:p-8 border-b border-border shrink-0 pt-[max(1.25rem,env(safe-area-inset-top))] sm:pt-8 bg-background">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl gradient-bg flex items-center justify-center">
                      {editingCall ? <Pencil size={18} className="text-white" /> : <Plus size={18} className="text-white" />}
                    </div>
                    <div>
                      <div className="font-black text-sm tracking-widest">
                        {editingCall ? "Edit Special Call" : "New Special Call"}
                      </div>
                      <div className="text-[9px] font-bold text-foreground/30 tracking-[0.2em]">
                        {editingCall ? "Update occasion banner details" : "Create a new occasion banner"}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-all text-foreground/40"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 overscroll-contain">
                {/* Emoji + Title Row */}
                <div className="flex gap-4">
                  <div className="space-y-2 w-24 shrink-0">
                    <label className="text-[10px] font-black text-primary tracking-[0.2em]">Emoji</label>
                    <input
                      type="text"
                      value={form.occasion_emoji}
                      onChange={e => setForm({ ...form, occasion_emoji: e.target.value })}
                      className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-4 text-center text-2xl outline-none focus:border-primary transition-all"
                      placeholder="🎉"
                      maxLength={4}
                    />
                  </div>
                  <div className="space-y-2 flex-1">
                    <label className="text-[10px] font-black text-primary tracking-[0.2em]">Title *</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-5 outline-none focus:border-primary transition-all font-bold"
                      placeholder="e.g. Valentine's Day Special Call"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary tracking-[0.2em]">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-5 outline-none focus:border-primary transition-all font-medium resize-none"
                    placeholder="Short tagline shown on the homepage banner..."
                  />
                </div>

                {/* Image / Flyer */}
                <div className="space-y-3 p-5 rounded-2xl bg-foreground/[0.03] border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <ImageIcon size={14} className="text-primary" />
                        <label className="text-[10px] font-black text-primary tracking-[0.2em] uppercase">
                          Image / Flyer <span className="text-foreground/30 font-normal lowercase">(optional)</span>
                        </label>
                      </div>
                      <p className="text-[10px] text-foreground/40 font-medium mt-0.5">
                        Upload an event flyer or banner. When set, it replaces the emoji on the homepage banner.
                      </p>
                    </div>
                    {form.image_url && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, image_url: "" })}
                        className="text-[9px] font-black tracking-widest text-red-400 hover:text-red-500 transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start pt-1">
                    {form.image_url ? (
                      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border border-primary/30 shadow-md bg-black/20 shrink-0 group">
                        <img
                          src={form.image_url}
                          alt="Flyer preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-[9px] font-black text-white tracking-widest uppercase">Preview</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center text-foreground/30 bg-foreground/[0.02] shrink-0">
                        <ImageIcon size={28} className="mb-1 opacity-40" />
                        <span className="text-[8px] font-black tracking-widest uppercase">No Flyer</span>
                      </div>
                    )}

                    <div className="flex-1 space-y-3 w-full">
                      <label className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer text-primary text-[10px] font-black tracking-widest">
                        {uploadingImage ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Uploading Flyer...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={14} />
                            <span>{form.image_url ? "Replace Flyer Image" : "Upload Flyer Image"}</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-[9px] font-bold text-foreground/40 tracking-wider">
                          <LinkIcon size={10} /> Or enter direct image URL
                        </div>
                        <input
                          type="url"
                          value={form.image_url}
                          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                          placeholder="https://example.com/flyer.jpg"
                          className="w-full bg-foreground/5 border border-border rounded-xl py-2.5 px-3 outline-none focus:border-primary transition-all text-xs font-medium"
                        />
                      </div>

                      {uploadError && (
                        <p className="text-xs text-red-500 font-bold">{uploadError}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3 Price Options / Packages */}
                <div className="space-y-4 p-5 sm:p-6 rounded-3xl bg-foreground/[0.03] border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-primary" />
                        <label className="text-[10px] font-black text-primary tracking-[0.2em] uppercase">
                          3 Price Options / Packages
                        </label>
                      </div>
                      <p className="text-[10px] text-foreground/40 font-medium mt-0.5">
                        Set titles &amp; prices for up to 3 package tiers (e.g. Father&apos;s Day Special Call ₦1,500, Poetry Thrills ₦2,000, Super Men&apos;s ₦1,000).
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-[9px] font-bold text-foreground/40 tracking-wider">Currency</label>
                      <input
                        type="text"
                        value={form.currency}
                        onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })}
                        className="w-16 bg-foreground/5 border border-border rounded-xl py-1.5 px-2.5 outline-none focus:border-primary transition-all font-bold text-xs text-center"
                        placeholder="NGN"
                        maxLength={5}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {form.price_options.map((opt, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-foreground/[0.02] border border-border hover:border-primary/30 transition-all space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black tracking-widest uppercase text-foreground/60 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full gradient-bg text-white flex items-center justify-center text-[9px] font-black shadow-sm">
                              {idx + 1}
                            </span>
                            {idx === 0 ? "Option 1 (Primary / Default) *" : `Option ${idx + 1} (Optional)`}
                          </span>
                          {idx > 0 && (opt.title || opt.price) && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...form.price_options];
                                updated[idx] = { title: "", price: "" };
                                setForm({ ...form, price_options: updated });
                              }}
                              className="text-[9px] font-bold text-foreground/30 hover:text-red-400 tracking-wider transition-colors"
                            >
                              Clear
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-[9px] font-bold text-foreground/40 tracking-wider">Package Title</label>
                            <input
                              type="text"
                              value={opt.title}
                              onChange={(e) => {
                                const updated = [...form.price_options];
                                updated[idx].title = e.target.value;
                                setForm({ ...form, price_options: updated });
                              }}
                              placeholder={
                                idx === 0
                                  ? "e.g. Father's Day Special Call"
                                  : idx === 1
                                  ? "e.g. Poetry Thrills"
                                  : "e.g. Super Men's Appreciation Call"
                              }
                              className="w-full bg-foreground/5 border border-border rounded-xl py-3 px-4 outline-none focus:border-primary transition-all font-bold text-xs"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-foreground/40 tracking-wider">Price (₦)</label>
                            <input
                              type="number"
                              min="0"
                              value={opt.price}
                              onChange={(e) => {
                                const updated = [...form.price_options];
                                updated[idx].price = e.target.value;
                                setForm({ ...form, price_options: updated });
                              }}
                              placeholder={idx === 0 ? "1500" : idx === 1 ? "2000" : "1000"}
                              className="w-full bg-foreground/5 border border-border rounded-xl py-3 px-4 outline-none focus:border-primary transition-all font-bold text-xs tabular-nums"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5 Custom Question Fields */}
                <div className="space-y-4 p-5 sm:p-6 rounded-3xl bg-foreground/[0.03] border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <HelpCircle size={14} className="text-primary" />
                        <label className="text-[10px] font-black text-primary tracking-[0.2em] uppercase">
                          5 Custom Question Fields
                        </label>
                      </div>
                      <p className="text-[10px] text-foreground/40 font-medium mt-0.5">
                        Ask any question for this special call. These questions will be presented to the user during booking.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {form.custom_questions.map((q, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-foreground/[0.02] border border-border hover:border-primary/30 transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black tracking-widest uppercase text-foreground/60 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full gradient-bg text-white flex items-center justify-center text-[9px] font-black shadow-sm">
                              {idx + 1}
                            </span>
                            Question {idx + 1} <span className="text-foreground/30 normal-case font-bold">(optional)</span>
                          </span>
                          {q.trim() && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...form.custom_questions];
                                updated[idx] = "";
                                setForm({ ...form, custom_questions: updated });
                              }}
                              className="text-[9px] font-bold text-foreground/30 hover:text-red-400 tracking-wider transition-colors"
                            >
                              Clear
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          value={q}
                          onChange={(e) => {
                            const updated = [...form.custom_questions];
                            updated[idx] = e.target.value;
                            setForm({ ...form, custom_questions: updated });
                          }}
                          placeholder={
                            idx === 0
                              ? "e.g. What is their favorite childhood memory with you?"
                              : idx === 1
                              ? "e.g. What is a special nickname only you call them?"
                              : idx === 2
                              ? "e.g. What song or artist always reminds you of them?"
                              : idx === 3
                              ? "e.g. What inside joke or phrase always makes them laugh?"
                              : "e.g. What is one message you must make sure they hear?"
                          }
                          className="w-full bg-foreground/5 border border-border rounded-xl py-2.5 px-3.5 outline-none focus:border-primary transition-all font-medium text-xs text-foreground placeholder:text-foreground/30"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call Date */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary tracking-[0.2em]">
                    Occasion Date <span className="text-foreground/30 normal-case font-bold">(optional)</span>
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" />
                    <input
                      type="date"
                      value={form.call_date}
                      onChange={e => setForm({ ...form, call_date: e.target.value })}
                      className="w-full bg-foreground/5 border border-border rounded-2xl py-4 pl-11 pr-5 outline-none focus:border-primary transition-all font-bold"
                    />
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center justify-between p-5 rounded-2xl bg-foreground/5 border border-foreground/10">
                  <div>
                    <div className="font-black text-sm tracking-widest">Set as Active</div>
                    <div className="text-[10px] text-foreground/40 font-bold tracking-widest mt-0.5">
                      Only one active call is shown on the homepage at a time.
                    </div>
                  </div>
                  <button
                    onClick={() => setForm({ ...form, active: !form.active })}
                    className={`relative w-14 h-7 rounded-full transition-all duration-300 ${form.active ? "gradient-bg shadow-lg shadow-primary/30" : "bg-foreground/10"}`}
                  >
                    <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${form.active ? "left-7" : "left-0.5"}`} />
                  </button>
                </div>
              </div>

                {/* Modal Footer */}
                <div className="p-5 sm:p-8 border-t border-border shrink-0 flex gap-3 sm:gap-4 bg-background pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-8">
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3.5 sm:py-4 rounded-2xl bg-foreground/5 border border-foreground/10 font-black text-xs sm:text-[10px] tracking-widest hover:bg-foreground/10 transition-all text-center"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-3.5 sm:py-4 rounded-2xl gradient-bg text-white font-black text-xs sm:text-[10px] tracking-widest shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? "Saving..." : editingCall ? "Update Call" : "Create Call"}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

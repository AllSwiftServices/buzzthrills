"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Plus, Trash2, Pencil, CheckCircle2, XCircle, Calendar,
  Loader2, Save, X, Phone, AlarmClock
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type SpecialCall = {
  id: string;
  title: string;
  description: string;
  occasion_emoji: string;
  price: number;
  currency: string;
  active: boolean;
  call_date: string | null;
  created_at: string;
};

const emptyForm = {
  title: "",
  description: "",
  occasion_emoji: "🎉",
  price: "",
  currency: "NGN",
  active: false,
  call_date: "",
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
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(call: SpecialCall) {
    setEditingCall(call);
    setForm({
      title: call.title,
      description: call.description,
      occasion_emoji: call.occasion_emoji,
      price: String(call.price),
      currency: call.currency,
      active: call.active,
      call_date: call.call_date || "",
    });
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.title || !form.price) {
      alert("Title and price are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
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
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">Loading Special Calls...</div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black mb-1 sm:mb-2 italic text-foreground uppercase tracking-tighter">
            Special <span className="gradient-text italic">Calls</span>
          </h1>
          <p className="text-foreground/40 font-black uppercase text-[8px] sm:text-[10px] tracking-[0.2em]">
            Create occasion-based call banners shown on the homepage.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-3 px-6 py-3 rounded-2xl gradient-bg text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={16} />
          New Special Call
        </button>
      </header>

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
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] sm:rounded-[24px] bg-foreground/5 border border-foreground/10 flex items-center justify-center text-3xl shadow-xl group-hover:scale-110 transition-transform duration-500 shrink-0">
                  {call.occasion_emoji}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-1.5">
                    <h3 className="text-xl sm:text-2xl font-black text-foreground italic uppercase tracking-tighter">{call.title}</h3>
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                      call.active
                        ? "bg-green-500/10 text-green-500 border border-green-500/20"
                        : "bg-foreground/5 text-foreground/30 border border-foreground/10"
                    }`}>
                      {call.active ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                      {call.active ? "Live" : "Inactive"}
                    </div>
                  </div>
                  <p className="text-sm text-foreground/50 font-medium italic max-w-md">{call.description}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                    <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">
                      ₦{call.price.toLocaleString()} {call.currency}
                    </span>
                    {call.call_date && (
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-foreground/40 uppercase tracking-widest">
                        <Calendar size={10} className="text-primary/60" />
                        {new Date(call.call_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {/* Toggle active */}
                <button
                  onClick={() => toggleActive(call)}
                  className={`px-5 py-2.5 rounded-2xl font-black text-[9px] uppercase tracking-widest border transition-all hover:scale-[1.02] active:scale-[0.98] ${
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
            <div className="text-xl font-black text-foreground italic uppercase tracking-tighter">No Special Calls Yet</div>
            <div className="text-[10px] font-black text-foreground/20 uppercase tracking-widest mt-2 mb-8">
              Create your first occasion banner for Valentine's, Mother's Day, and more.
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl gradient-bg text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/40 hover:scale-[1.02] transition-all"
            >
              <Plus size={16} />
              Create First Special Call
            </button>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 28, stiffness: 350 }}
              className="fixed inset-x-4 top-[5%] bottom-[5%] z-50 max-w-2xl mx-auto flex flex-col overflow-hidden rounded-[32px] sm:rounded-[48px] bg-background border border-border shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 sm:p-8 border-b border-border shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl gradient-bg flex items-center justify-center">
                    {editingCall ? <Pencil size={18} className="text-white" /> : <Plus size={18} className="text-white" />}
                  </div>
                  <div>
                    <div className="font-black text-sm uppercase tracking-widest">
                      {editingCall ? "Edit Special Call" : "New Special Call"}
                    </div>
                    <div className="text-[9px] font-bold text-foreground/30 uppercase tracking-[0.2em]">
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
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                {/* Emoji + Title Row */}
                <div className="flex gap-4">
                  <div className="space-y-2 w-24 shrink-0">
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Emoji</label>
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
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Title *</label>
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
                  <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-5 outline-none focus:border-primary transition-all font-medium resize-none"
                    placeholder="Short tagline shown on the homepage banner..."
                  />
                </div>

                {/* Price + Currency */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Price (₦) *</label>
                    <input
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                      className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-5 outline-none focus:border-primary transition-all font-bold tabular-nums"
                      placeholder="5000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Currency</label>
                    <input
                      type="text"
                      value={form.currency}
                      onChange={e => setForm({ ...form, currency: e.target.value.toUpperCase() })}
                      className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-5 outline-none focus:border-primary transition-all font-bold"
                      placeholder="NGN"
                      maxLength={5}
                    />
                  </div>
                </div>

                {/* Call Date */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                    Occasion Date <span className="text-foreground/30 normal-case font-bold italic">— optional</span>
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
                    <div className="font-black text-sm uppercase tracking-widest">Set as Active</div>
                    <div className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mt-0.5">
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
              <div className="p-6 sm:p-8 border-t border-border shrink-0 flex gap-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-4 rounded-2xl bg-foreground/5 border border-foreground/10 font-black text-[10px] uppercase tracking-widest hover:bg-foreground/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-4 rounded-2xl gradient-bg text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? "Saving..." : editingCall ? "Update Call" : "Create Call"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

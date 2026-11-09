"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarOff, Plus, Trash2, Loader2 } from "lucide-react";

type Blocked = { id: string; blocked_date: string; reason: string | null };

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const pretty = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-NG", { weekday: "short", year: "numeric", month: "long", day: "numeric" });

export default function AdminBlockedDates() {
  const [items, setItems] = useState<Blocked[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/blocked-dates");
      const data = await res.json();
      setItems(data.blocked || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const add = async () => {
    setError(null);
    if (!from) return setError("Pick a date to block.");
    const end = to && to >= from ? to : from;
    const dates: string[] = [];
    for (let d = new Date(`${from}T00:00:00`); d <= new Date(`${end}T00:00:00`); d.setDate(d.getDate() + 1)) {
      dates.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dates, reason }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      setFrom(""); setTo(""); setReason("");
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    await fetch(`/api/admin/blocked-dates?id=${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const today = todayStr();
  const upcoming = items.filter((i) => i.blocked_date >= today);
  const past = items.filter((i) => i.blocked_date < today);
  const inputCls = "w-full bg-foreground/5 border border-border rounded-2xl py-4 px-5 focus:border-primary outline-none text-sm font-bold";

  return (
    <div className="space-y-8 sm:space-y-10">
      <header>
        <h1 className="text-3xl sm:text-4xl font-black mb-2 tracking-tighter">Blocked Dates</h1>
        <p className="text-muted-foreground font-medium text-xs sm:text-sm">
          Days you are closed. Clients can&apos;t book calls for these dates.
        </p>
      </header>

      <section className="p-5 sm:p-8 rounded-3xl border border-border bg-foreground/[0.02] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground tracking-widest ml-1">From</label>
            <input type="date" min={today} value={from} onChange={(e) => setFrom(e.target.value)} className={inputCls} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground tracking-widest ml-1">To (optional, for a range)</label>
            <input type="date" min={from || today} value={to} onChange={(e) => setTo(e.target.value)} className={inputCls} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-muted-foreground tracking-widest ml-1">Reason (optional, shown to clients)</label>
          <input type="text" maxLength={120} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Public holiday" className={inputCls} />
        </div>
        {error && <p className="text-xs font-medium text-red-400">{error}</p>}
        <button
          onClick={add}
          disabled={saving}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl gradient-bg text-white font-black text-xs tracking-[0.2em] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
          Block date{to && to > from ? "s" : ""}
        </button>
      </section>

      <section className="space-y-3">
        <h2 className="text-[10px] font-black tracking-[0.3em] text-primary">Upcoming blocked days</h2>
        {loading ? (
          <Loader2 className="animate-spin text-primary" />
        ) : upcoming.length === 0 ? (
          <div className="p-6 rounded-2xl border border-dashed border-border text-sm text-muted-foreground flex items-center gap-3">
            <CalendarOff size={18} /> No blocked days. Clients can book any future date.
          </div>
        ) : (
          upcoming.map((i) => (
            <div key={i.id} className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-border bg-foreground/[0.03]">
              <div className="min-w-0">
                <div className="text-sm font-black">{pretty(i.blocked_date)}</div>
                {i.reason && <div className="text-xs text-muted-foreground truncate">{i.reason}</div>}
              </div>
              <button onClick={() => remove(i.id)} aria-label="Unblock date" className="p-2 rounded-xl text-foreground/40 hover:text-red-400 hover:bg-red-400/10 transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
        {past.length > 0 && (
          <p className="text-[11px] text-muted-foreground pt-2">{past.length} past blocked day{past.length === 1 ? "" : "s"} hidden.</p>
        )}
      </section>
    </div>
  );
}

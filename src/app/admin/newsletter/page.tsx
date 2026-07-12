"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Mail, Search, Download, Trash2, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Subscriber = {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
};

export default function AdminNewsletterPage() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchSubscribers() {
    if (authLoading || !user || user.role !== "admin") return;

    try {
      const res = await fetch("/api/admin/newsletter");
      if (!res.ok) throw new Error("Failed to fetch subscribers");
      const data = await res.json();
      setSubscribers(data.subscribers || []);
    } catch (err) {
      console.error("Newsletter fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSubscribers();
  }, [user, authLoading]);

  const filtered = useMemo(() => {
    if (!query.trim()) return subscribers;
    const q = query.toLowerCase();
    return subscribers.filter((s) => s.email.toLowerCase().includes(q));
  }, [subscribers, query]);

  async function handleRemove(id: string) {
    if (!confirm("Remove this subscriber? They will stop receiving newsletter emails.")) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error("Newsletter remove error:", err);
    } finally {
      setDeletingId(null);
    }
  }

  function exportCsv() {
    const rows = [["Email", "Status", "Subscribed On"]];
    for (const s of filtered) {
      rows.push([s.email, s.is_active ? "Active" : "Unsubscribed", new Date(s.created_at).toISOString()]);
    }
    const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const activeCount = subscribers.filter((s) => s.is_active).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">Loading subscribers…</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2 tracking-tighter uppercase">Newsletter</h1>
          <p className="text-muted-foreground font-bold uppercase text-[9px] sm:text-[10px] tracking-widest">
            {subscribers.length} total &middot; {activeCount} active
          </p>
        </div>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search email…"
              className="w-full pl-10 pr-4 py-3 rounded-2xl glass border border-border text-xs font-bold outline-none focus:border-primary/40 transition-all"
            />
          </div>
          <button
            onClick={exportCsv}
            disabled={filtered.length === 0}
            className="px-6 py-3 rounded-2xl gradient-bg text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </header>

      <div className="rounded-[28px] sm:rounded-[48px] glass border border-border overflow-hidden shadow-huge bg-background/40 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-48 -mt-48" />

        <div className="overflow-x-auto relative z-10 scrollbar-hide">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-foreground/2">
                <th className="px-5 sm:px-10 py-6 sm:py-8 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 whitespace-nowrap">Email</th>
                <th className="px-5 sm:px-10 py-6 sm:py-8 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 whitespace-nowrap">Status</th>
                <th className="px-5 sm:px-10 py-6 sm:py-8 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 whitespace-nowrap">Subscribed</th>
                <th className="px-5 sm:px-10 py-6 sm:py-8 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-bold">
              {filtered.map((s, i) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-foreground/3 transition-all"
                >
                  <td className="px-5 sm:px-10 py-4 sm:py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                        <Mail size={16} />
                      </div>
                      <span className="text-sm truncate">{s.email}</span>
                    </div>
                  </td>
                  <td className="px-5 sm:px-10 py-4 sm:py-6">
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 border ${
                      s.is_active ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-foreground/5 text-foreground/40 border-foreground/10"
                    }`}>
                      {s.is_active ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                      {s.is_active ? "Active" : "Unsubscribed"}
                    </div>
                  </td>
                  <td className="px-5 sm:px-10 py-4 sm:py-6 text-sm tabular-nums text-foreground/40 whitespace-nowrap">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 sm:px-10 py-4 sm:py-6">
                    <button
                      onClick={() => handleRemove(s.id)}
                      disabled={deletingId === s.id}
                      className="p-3 rounded-2xl bg-red-400/5 text-red-400/40 hover:text-red-400 hover:bg-red-400/10 transition-all border border-transparent hover:border-red-400/20 disabled:opacity-40"
                      title="Remove subscriber"
                    >
                      {deletingId === s.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-20 sm:p-40 text-center flex flex-col items-center justify-center">
            <Mail size={64} className="text-foreground/10 mb-6" />
            <div className="text-xl sm:text-2xl font-black mb-2 opacity-40">
              {subscribers.length === 0 ? "No subscribers yet" : "No subscribers match your search"}
            </div>
            <div className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
              {subscribers.length === 0 ? "New homepage sign-ups will appear here." : "Try a different search term."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Plus, Loader2, ExternalLink, Eye, Search, QrCode } from "lucide-react";

type Letter = {
  id: string;
  recipient_name: string;
  recipient_phone: string | null;
  theme: string;
  tier: string;
  status: string;
  qr_identifier: string;
  unfurled_count: number | null;
  created_by_admin: boolean;
  created_at: string;
  sender_email: string | null;
  sender_name: string | null;
  wants_scannable: boolean;
  scannable_status: string | null;
};

const statusStyles: Record<string, string> = {
  draft: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  published: "bg-green-500/10 text-green-400 border-green-500/20",
  archived: "bg-foreground/5 text-foreground/40 border-foreground/10",
};

export default function AdminLettersPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/admin/letters")
      .then((r) => r.json())
      .then((data) => setLetters(data.letters || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const filtered = letters.filter((l) => {
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      if (
        !l.recipient_name?.toLowerCase().includes(q) &&
        !l.sender_email?.toLowerCase().includes(q) &&
        !l.qr_identifier.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">
            <Mail size={14} />
            Digital Letters
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-none">
            Letter <span className="gradient-text italic">Operations</span>
          </h1>
          <p className="text-foreground/40 mt-3 font-medium text-sm">
            Manage every published letter, augment drafts, or create one on behalf of a client.
          </p>
        </div>
        <Link
          href="/admin/letters/new"
          className="px-6 py-4 rounded-2xl gradient-bg text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
        >
          <Plus size={16} />
          New Letter
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by recipient, sender email, or code…"
            className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium outline-none focus:border-primary/40"
          />
        </div>
        <div className="flex gap-2">
          {["all", "draft", "published", "archived"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                statusFilter === s
                  ? "bg-primary text-white"
                  : "bg-foreground/5 text-foreground/40 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-foreground/40">
          <Loader2 className="animate-spin" size={20} />
          <span className="text-sm font-bold">Loading letters…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-foreground/10 rounded-3xl">
          <Mail className="text-foreground/20 mx-auto mb-4" size={32} />
          <p className="text-foreground/40 font-medium">No letters match the current filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((l) => (
            <div
              key={l.id}
              className="p-5 rounded-2xl border border-foreground/10 bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        statusStyles[l.status] || statusStyles.draft
                      }`}
                    >
                      {l.status}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">
                      {l.tier} · {l.theme}
                    </span>
                    {l.created_by_admin && (
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary">
                        Admin-created
                      </span>
                    )}
                    {l.wants_scannable && (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        l.scannable_status === "shipped"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : l.scannable_status === "printed"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}>
                        <QrCode size={8} />
                        {l.scannable_status || "pending"}
                      </span>
                    )}
                  </div>
                  <div className="font-black text-base truncate">{l.recipient_name}</div>
                  <div className="text-xs text-foreground/40 truncate">
                    From: {l.sender_email || l.sender_name || "—"}{" "}
                    · Code: <span className="font-mono text-primary/70">{l.qr_identifier}</span>{" "}
                    · {l.unfurled_count ?? 0} views
                  </div>
                </div>
                <div className="flex gap-2">
                  {l.status === "published" && (
                    <a
                      href={`/letter/${l.qr_identifier}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl border border-foreground/10 hover:bg-foreground/5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                    >
                      <Eye size={12} />
                      View
                      <ExternalLink size={10} />
                    </a>
                  )}
                  <Link
                    href={`/admin/letters/${l.id}`}
                    className="px-4 py-2 rounded-xl gradient-bg text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

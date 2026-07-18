"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PhoneCall, Calendar, Clock, ChevronRight, CheckCircle2, XCircle, AlertCircle, Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import CallerCallModal from "@/components/caller/CallerCallModal";

export default function CallerCalls() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [calls, setCalls] = useState<any[]>([]);
  const [selectedCall, setSelectedCall] = useState<any | null>(null);
  const [query, setQuery] = useState("");
  const [pendingOnly, setPendingOnly] = useState(false);

  async function fetchCalls() {
    if (authLoading || !user || user.role !== 'caller') return;

    try {
      const res = await fetch("/api/caller/calls");
      if (!res.ok) throw new Error("Failed to fetch calls");
      const data = await res.json();
      setCalls(data.calls || []);
    } catch (err) {
      console.error("Caller calls fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCalls();
  }, [user, authLoading]);

  const filteredCalls = useMemo(() => {
    return calls.filter((call) => {
      if (pendingOnly && call.status !== 'scheduled') return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        call.recipient_name?.toLowerCase().includes(q) ||
        call.recipient_phone?.toLowerCase().includes(q) ||
        call.occasion_type?.toLowerCase().includes(q)
      );
    });
  }, [calls, query, pendingOnly]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 className="text-green-500" size={12} />;
      case 'failed': return <XCircle className="text-red-500" size={12} />;
      default: return <AlertCircle className="text-amber-500" size={12} />;
    }
  };

  if (loading && !calls.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">Loading your calls…</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-foreground">My Calls</h1>
          <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mt-1">Calls assigned to you</p>
        </div>
        <button
          onClick={() => setPendingOnly((v) => !v)}
          className={`px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${
            pendingOnly ? 'bg-primary text-white border-primary' : 'bg-foreground/5 border-foreground/10 text-foreground/40'
          }`}
        >
          Scheduled Only
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/20" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by recipient, phone, or occasion..."
          className="w-full pl-12 pr-5 py-4 rounded-2xl bg-foreground/5 border border-foreground/10 text-sm font-bold text-foreground outline-none focus:border-primary transition-all placeholder:text-foreground/20"
        />
      </div>

      {filteredCalls.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
          <PhoneCall size={40} className="text-foreground/10" />
          <div className="text-sm font-black text-foreground/40 uppercase tracking-widest">No calls assigned yet</div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCalls.map((call) => (
            <motion.button
              key={call.id}
              onClick={() => setSelectedCall(call)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-between gap-4 p-5 rounded-3xl bg-foreground/5 border border-foreground/10 hover:border-primary/30 transition-all text-left"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white shadow-lg shrink-0">
                  <PhoneCall size={20} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-black text-foreground truncate">{call.recipient_name}</div>
                  <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Calendar size={10} />{new Date(call.occasion_date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock size={10} />{call.scheduled_slot}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border bg-foreground/5 border-foreground/10">
                  {getStatusIcon(call.status)}
                  {call.status}
                </div>
                <ChevronRight size={16} className="text-foreground/20" />
              </div>
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedCall && (
          <CallerCallModal
            call={selectedCall}
            isOpen={!!selectedCall}
            onClose={() => setSelectedCall(null)}
            onUpdate={fetchCalls}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

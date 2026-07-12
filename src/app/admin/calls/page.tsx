"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PhoneCall, Search, Calendar, Clock, ChevronRight, CheckCircle2, XCircle, AlertCircle, User, Phone, UserCheck, UserCog, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import CallManagementModal from "@/components/admin/CallManagementModal";


export default function AdminCalls() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [calls, setCalls] = useState<any[]>([]);
  const [staff, setStaff] = useState<{ id: string; full_name: string; role: string }[]>([]);
  const [selectedCall, setSelectedCall] = useState<any | null>(null);
  const [query, setQuery] = useState("");
  const [unassignedOnly, setUnassignedOnly] = useState(false);

  async function fetchCalls() {
    if (authLoading || !user || user.role !== 'admin') return;

    try {
      const res = await fetch("/api/admin/calls");
      if (!res.ok) throw new Error("Failed to fetch calls");
      const data = await res.json();
      setCalls(data.calls || []);
    } catch (err) {
      console.error("Calls fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchStaff() {
    if (authLoading || !user || user.role !== 'admin') return;

    try {
      const res = await fetch("/api/admin/staff");
      if (!res.ok) throw new Error("Failed to fetch staff");
      const data = await res.json();
      setStaff(data.staff || []);
    } catch (err) {
      console.error("Staff fetch error:", err);
    }
  }

  useEffect(() => {
    fetchCalls();
    fetchStaff();
  }, [user, authLoading]);

  const filteredCalls = useMemo(() => {
    return calls.filter((call) => {
      if (unassignedOnly && call.assigned_to) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        call.recipient_name?.toLowerCase().includes(q) ||
        call.recipient_phone?.toLowerCase().includes(q) ||
        call.profiles?.full_name?.toLowerCase().includes(q) ||
        call.assigned_staff?.full_name?.toLowerCase().includes(q)
      );
    });
  }, [calls, query, unassignedOnly]);

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
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">Loading calls…</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black mb-1 sm:mb-2 text-foreground uppercase tracking-tighter">Calls</h1>
          <p className="text-foreground/40 font-black uppercase text-[8px] sm:text-[10px] tracking-[0.2em]">Every call booking and its delivery status.</p>
        </div>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="relative flex-1 sm:w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-foreground/5 border border-foreground/10 rounded-xl sm:rounded-2xl py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 text-xs sm:text-sm outline-none focus:border-primary transition-all font-bold text-foreground placeholder:text-foreground/30"
              placeholder="Search by recipient, phone, booker, or staff…"
            />
          </div>
          <button
            onClick={() => setUnassignedOnly((v) => !v)}
            className={`px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all border whitespace-nowrap ${
              unassignedOnly
                ? "bg-primary text-white border-primary"
                : "bg-foreground/5 border-foreground/10 text-foreground/40 hover:text-foreground"
            }`}
          >
            Unassigned only
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {filteredCalls.length > 0 ? filteredCalls.map((call, i) => (
          <motion.div
            key={call.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 sm:p-8 rounded-[24px] sm:rounded-[40px] bg-foreground/[0.03] border border-foreground/5 hover:border-primary/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[50px] rounded-full group-hover:bg-primary/10 transition-all -mr-24 -mt-24" />
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
              <div className="flex items-center gap-4 sm:gap-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[16px] sm:rounded-3xl bg-foreground/5 border border-foreground/10 flex items-center justify-center text-primary shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <PhoneCall size={20} className="sm:size-7" />
                </div>
                <div>
                   <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-tighter">{call.recipient_name}</h3>
                      <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                        call.status === 'delivered' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                        call.status === 'failed' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                        'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                         {getStatusIcon(call.status)}
                         {call.status}
                      </div>
                   </div>
                    <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 sm:gap-y-3">
                       <div className="flex items-center gap-1.5 sm:gap-2 text-foreground/40 font-black uppercase text-[8px] sm:text-[10px] tracking-widest">
                          <Phone size={12} className="sm:size-[14px] text-primary/60" />
                          {call.recipient_phone}
                       </div>
                       <div className="flex items-center gap-1.5 sm:gap-2 text-foreground/40 font-black uppercase text-[8px] sm:text-[10px] tracking-widest border-l border-foreground/5 pl-4 sm:pl-6">
                          <Calendar size={12} className="sm:size-[14px] text-secondary/60" />
                          {new Date(call.occasion_date).toLocaleDateString()}
                       </div>
                       <div className="flex items-center gap-1.5 sm:gap-2 text-foreground/40 font-black uppercase text-[8px] sm:text-[10px] tracking-widest border-l border-foreground/5 pl-4 sm:pl-6">
                          <Clock size={12} className="sm:size-[14px] text-primary/60" />
                          {call.scheduled_slot} Slot
                       </div>
                    </div>
                </div>
              </div>

               <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                  <div className="w-full sm:w-auto p-3 sm:p-4 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center gap-3 sm:gap-4">
                     <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                        <UserCheck size={16} className="sm:size-[18px]" />
                     </div>
                     <div>
                        <div className="text-[8px] sm:text-[9px] font-black text-foreground/20 uppercase tracking-widest">Booked By</div>
                        <div className="text-[11px] sm:text-xs font-black text-foreground">{call.profiles?.full_name || "Anonymous"}</div>
                     </div>
                  </div>
                  <div className={`w-full sm:w-auto p-3 sm:p-4 rounded-2xl border flex items-center gap-3 sm:gap-4 ${
                    call.assigned_staff ? "bg-primary/5 border-primary/10" : "bg-foreground/5 border-foreground/10"
                  }`}>
                     <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${
                       call.assigned_staff ? "bg-primary/10 text-primary" : "bg-foreground/10 text-foreground/30"
                     }`}>
                        <UserCog size={16} className="sm:size-[18px]" />
                     </div>
                     <div>
                        <div className="text-[8px] sm:text-[9px] font-black text-foreground/20 uppercase tracking-widest">Assigned To</div>
                        <div className={`text-[11px] sm:text-xs font-black ${call.assigned_staff ? "text-foreground" : "text-foreground/30"}`}>
                          {call.assigned_staff?.full_name || "Unassigned"}
                        </div>
                     </div>
                  </div>
                  <button
                    onClick={() => setSelectedCall(call)}
                    className="w-full sm:w-auto px-6 py-4 sm:px-10 sm:py-5 rounded-2xl bg-primary text-white font-black text-[9px] sm:text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 sm:gap-3"
                  >
                    View & Manage
                    <ChevronRight size={16} className="sm:size-[18px]" />
                  </button>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="flex flex-col items-center justify-center py-20 px-8 rounded-[40px] border-2 border-dashed border-foreground/5 bg-foreground/[0.02] text-center">
             <ShieldCheck size={48} className="text-foreground/10 mb-4" />
             <div className="text-xl font-black text-foreground uppercase tracking-tighter">
               {calls.length === 0 ? "No calls yet" : unassignedOnly ? "No unassigned calls" : "No calls match your search"}
             </div>
             <div className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mt-2">
               {calls.length === 0 ? "Scheduled calls will appear here." : unassignedOnly ? "Every call has been assigned to a staff member." : "Try a different name or phone number."}
             </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedCall && (
          <CallManagementModal
            call={selectedCall}
            isOpen={!!selectedCall}
            onClose={() => setSelectedCall(null)}
            onUpdate={fetchCalls}
            staff={staff}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.9-2.9" />
      <path d="M18 12h4" />
      <path d="m16.2 16.2 2.9 2.9" />
      <path d="M12 18v4" />
      <path d="m4.9 19.1 2.9-2.9" />
      <path d="M2 12h4" />
      <path d="m4.9 4.9 2.9 2.9" />
    </svg>
  );
}

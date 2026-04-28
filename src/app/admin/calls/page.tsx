"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PhoneCall, Search, Filter, Calendar, Clock, ChevronRight, CheckCircle2, XCircle, AlertCircle, User, Phone, UserCheck, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import CallManagementModal from "@/components/admin/CallManagementModal";


export default function AdminCalls() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [calls, setCalls] = useState<any[]>([]);
  const [selectedCall, setSelectedCall] = useState<any | null>(null);

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

  useEffect(() => {
    fetchCalls();
  }, [user, authLoading]);

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
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Loading Engagement Data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 italic text-white uppercase tracking-tighter">Call <span className="gradient-text italic">Management</span></h1>
          <p className="text-white/40 font-black uppercase text-[10px] tracking-[0.2em]">Operational Console for platform engagements.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
            <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:border-primary transition-all font-bold text-white placeholder:text-white/10" placeholder="Search call history..." />
          </div>
          <button className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-white/20 hover:text-primary transition-all">
            <Filter size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {calls.length > 0 ? calls.map((call, i) => (
          <motion.div
            key={call.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[40px] bg-white/[0.03] border border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[50px] rounded-full group-hover:bg-primary/10 transition-all -mr-24 -mt-24" />
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <PhoneCall size={28} />
                </div>
                <div>
                   <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{call.recipient_name}</h3>
                      <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                        call.status === 'delivered' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                        call.status === 'failed' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                        'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                         {getStatusIcon(call.status)}
                         {call.status}
                      </div>
                   </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                       <div className="flex items-center gap-2 text-white/40 font-black uppercase text-[10px] tracking-widest">
                          <Phone size={14} className="text-primary/60" />
                          {call.recipient_phone}
                       </div>
                       <div className="flex items-center gap-2 text-white/40 font-black uppercase text-[10px] tracking-widest border-l border-white/5 pl-6">
                          <Calendar size={14} className="text-secondary/60" />
                          {new Date(call.occasion_date).toLocaleDateString()}
                       </div>
                       <div className="flex items-center gap-2 text-white/40 font-black uppercase text-[10px] tracking-widest border-l border-white/5 pl-6">
                          <Clock size={14} className="text-primary/60" />
                          {call.scheduled_slot} Slot
                       </div>
                    </div>
                </div>
              </div>

               <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-full sm:w-auto p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                        <UserCheck size={18} />
                     </div>
                     <div>
                        <div className="text-[9px] font-black text-white/20 uppercase tracking-widest">Booked By</div>
                        <div className="text-xs font-black text-white">{call.profiles?.full_name || "Anonymous"}</div>
                     </div>
                  </div>
                  <button 
                    onClick={() => setSelectedCall(call)}
                    className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    View & Manage
                    <ChevronRight size={18} />
                  </button>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="flex flex-col items-center justify-center py-20 px-8 rounded-[40px] border-2 border-dashed border-white/5 bg-white/[0.02] text-center">
             <ShieldCheck size={48} className="text-white/10 mb-4" />
             <div className="text-xl font-black text-white italic uppercase tracking-tighter">No Active Engagements</div>
             <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-2">All scheduled calls will appear here.</div>
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

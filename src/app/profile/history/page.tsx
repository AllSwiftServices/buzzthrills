"use client";

import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Calendar, Clock, ChevronRight, Search, Filter, Loader2, Play, FileText, AlertTriangle, User, MessageSquare, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

export default function HistoryPage() {
  const { user } = useAuth();

  if (!user) return null;

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setHistory(data.history || []);
        }
      } catch (error) {
        console.error("History Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 sm:mb-12">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl sm:text-4xl md:text-5xl font-black mb-2 tracking-tighter uppercase italic"
            >
              Thrills <span className="gradient-text italic">History</span>
            </motion.h1>
            <p className="text-muted-foreground font-black uppercase text-[9px] sm:text-xs tracking-widest pl-1 leading-none">Relive your most heroic surprises.</p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full bg-foreground/5 border border-border rounded-xl sm:rounded-2xl py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 outline-none focus:border-primary transition-all text-xs sm:text-sm font-black tracking-tight"
                />
             </div>
             <button className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl glass border border-border text-muted-foreground hover:text-primary transition-all shrink-0 active:scale-95">
                <Filter size={18} className="sm:size-5" />
             </button>
          </div>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
               <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Retrieving Logs...</div>
            </div>
          ) : history.length > 0 ? history.map((item, i) => (
            <div key={item.id} className="relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                className={`group p-6 sm:p-8 rounded-[40px] border transition-all cursor-pointer relative overflow-hidden ${
                  expandedId === item.id 
                    ? 'bg-accent/5 border-primary/30 shadow-huge shadow-primary/5' 
                    : 'glass border-border hover:border-primary/20 hover:bg-foreground/[0.02]'
                }`}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-all -mr-32 -mt-32" />
                
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[24px] gradient-bg flex items-center justify-center text-white shadow-2xl shadow-primary/20 group-hover:scale-105 transition-transform shrink-0">
                      <Phone size={24} />
                    </div>
                    <div>
                      <div className="font-black text-xl sm:text-2xl tracking-tighter uppercase italic leading-tight group-hover:text-primary transition-colors">{item.occasion_type}</div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                        <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-1.5">
                           <User size={12} className="text-primary/60" />
                           To: {item.recipient_name}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-1.5 pl-4 border-l border-border">
                           <Calendar size={12} className="text-secondary/60" />
                           {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      item.status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      item.status === 'failed' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                      'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {item.status}
                    </div>
                    <div className={`p-3 rounded-full transition-all ${expandedId === item.id ? 'bg-primary text-white rotate-180' : 'bg-foreground/5 text-muted-foreground'}`}>
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 32 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      className="overflow-hidden relative z-10"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border/50">
                         {/* Outcome Section */}
                         <div className="space-y-6">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                  <FileText size={12} className="text-primary" />
                                  Engagement Outcome
                               </label>
                               <div className="p-6 rounded-[32px] bg-foreground/5 border border-border min-h-[120px]">
                                  {item.status === 'delivered' ? (
                                     item.recording_url ? (
                                        <div className="space-y-4">
                                           <div className="text-sm font-medium text-foreground/80 leading-relaxed italic">
                                              "Our agent successfully delivered your message. You can listen to the full interaction below."
                                           </div>
                                           <a 
                                              href={item.recording_url} 
                                              target="_blank"
                                              className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                                              onClick={(e) => e.stopPropagation()}
                                           >
                                              <Play size={18} />
                                              Play Voice Proof
                                           </a>
                                        </div>
                                     ) : (
                                        <div className="text-xs font-bold text-muted-foreground italic">Voice proof is being processed...</div>
                                     )
                                  ) : item.status === 'failed' ? (
                                     <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-red-500">
                                           <AlertTriangle size={16} />
                                           <span className="text-[10px] font-black uppercase tracking-widest">Delivery Failure</span>
                                        </div>
                                        <div className="text-sm font-medium text-red-500/80 leading-relaxed italic">
                                           {item.failure_reason || "Unfortunately, we were unable to complete this engagement as scheduled."}
                                        </div>
                                     </div>
                                  ) : (
                                     <div className="flex flex-col items-center justify-center py-6 text-center">
                                        <Loader2 size={24} className="text-amber-500 animate-spin mb-3" />
                                        <div className="text-xs font-black uppercase tracking-widest text-amber-500/60">Preparation in Progress...</div>
                                     </div>
                                  )}
                               </div>
                            </div>
                         </div>

                         {/* Details & Notes Section */}
                         <div className="space-y-6">
                            {item.admin_notes && (
                               <div className="space-y-3">
                                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                     <MessageSquare size={12} className="text-secondary" />
                                     Notes from our Agent
                                  </label>
                                  <div className="p-6 rounded-[32px] bg-secondary/5 border border-secondary/10">
                                     <p className="text-sm font-medium text-foreground/80 leading-relaxed italic">
                                        "{item.admin_notes}"
                                     </p>
                                  </div>
                               </div>
                            )}

                            <div className="space-y-3">
                               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Original Booking Message</label>
                               <div className="p-6 rounded-[32px] bg-foreground/2 border border-border">
                                  <p className="text-xs font-medium text-muted-foreground/60 leading-relaxed italic">
                                     "{item.custom_message || "No specific message provided."}"
                                  </p>
                               </div>
                            </div>
                         </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )) : (
            <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-[48px] bg-foreground/2">
               <Calendar size={48} className="text-foreground/5 mb-4" />
               <div className="text-xs font-black uppercase tracking-widest opacity-20">No engagements found in your history.</div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

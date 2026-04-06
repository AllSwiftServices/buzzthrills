"use client";

import { motion } from "framer-motion";
import { PhoneCall, Search, Filter, Calendar, Clock, ChevronRight, CheckCircle2, XCircle, AlertCircle, User, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getSupabase } from "@/lib/supabase";

export default function AdminCalls() {
  const { user, accessToken, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [calls, setCalls] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCalls() {
      if (authLoading || !user || user.role !== 'admin') return;
      
      const authenticatedSupabase = getSupabase(accessToken);

      const { data, error } = await authenticatedSupabase
        .from('calls')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setCalls(data);
      setLoading(false);
    }

    fetchCalls();
  }, [user, authLoading, accessToken]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 className="text-green-500" size={16} />;
      case 'failed': return <XCircle className="text-red-500" size={16} />;
      default: return <AlertCircle className="text-amber-500" size={16} />;
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2">Thrill <span className="gradient-text">Operations</span></h1>
          <p className="text-muted-foreground font-bold tracking-tight">Coordinating the delivery of high-fidelity surprises.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:border-primary transition-all font-bold" placeholder="Search mission..." />
          </div>
          <button className="p-3.5 rounded-2xl glass border border-white/10 text-white/40 hover:text-primary transition-all">
            <Filter size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {calls.map((call, i) => (
          <motion.div
            key={call.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[40px] glass border border-white/10 hover:border-primary/20 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[50px] rounded-full group-hover:bg-primary/10 transition-all -mr-24 -mt-24" />
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform">
                  <PhoneCall size={28} />
                </div>
                <div>
                   <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-black">{call.recipient_name}</h3>
                      <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                        call.status === 'delivered' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                        call.status === 'failed' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                        'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                         {getStatusIcon(call.status)}
                         {call.status}
                      </div>
                   </div>
                   <div className="flex flex-wrap items-center gap-6 text-sm">
                      <div className="flex items-center gap-2 text-white/40 font-bold">
                         <Phone size={14} className="text-primary" />
                         {call.recipient_phone}
                      </div>
                      <div className="flex items-center gap-2 text-white/40 font-bold border-l border-white/10 pl-6">
                         <Calendar size={14} className="text-secondary" />
                         {new Date(call.occasion_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-white/40 font-bold border-l border-white/10 pl-6">
                         <Clock size={14} className="text-primary" />
                         {call.scheduled_slot} Slot
                      </div>
                   </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                 <div className="w-full sm:w-auto p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white shrink-0">
                       <User size={18} />
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Assigned Agent</div>
                       <div className="text-xs font-black">Agent Alpha-9</div>
                    </div>
                 </div>
                 <button className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                    Manage Mission
                    <ChevronRight size={18} />
                 </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

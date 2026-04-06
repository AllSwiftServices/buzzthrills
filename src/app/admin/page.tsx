"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Phone, 
  ShoppingCart, 
  UserMinus, 
  MapPin, 
  Tag, 
  ChevronRight, 
  Search, 
  Loader2, 
  AlertTriangle, 
  ArrowUpRight, 
  Activity, 
  Globe, 
  Zap, 
  Clock, 
  ShieldCheck,
  Calendar,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { user, accessToken, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({ analytics: {}, calls: [], pendingCount: 0 });

  useEffect(() => {
    async function fetchStats() {
      if (authLoading || !user || user.role !== 'admin') return;
      
      try {
        const res = await fetch("/api/admin/dashboard");
        if (!res.ok) throw new Error("Dashboard Intelligence Failure");
        
        const data = await res.json();
        setData({ 
          analytics: data.analytics || {}, 
          calls: data.calls || [], 
          pendingCount: data.pendingCount || 0 
        });
      } catch (error) {
        console.error("Dashboard Data Failure:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [user, authLoading, accessToken]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-8">
        <Loader2 className="text-primary animate-spin" size={64} />
        <div className="text-sm font-black uppercase tracking-[0.5em] animate-pulse">Syncing Metrics...</div>
      </div>
    );
  }

  const { analytics, calls, pendingCount } = data;

  const stats = [
    { label: "Calls Delivered", value: analytics.total_calls_delivered || 0, trend: "+12.4%", icon: <Phone className="text-primary" size={24} />, trendUp: true },
    { label: "Active Clients", value: analytics.total_users || 0, trend: "+8.1%", icon: <Users className="text-secondary" size={24} />, trendUp: true },
    { label: "Churn Rate", value: analytics.churned_clients || 0, trend: "-2.4%", icon: <Activity className="text-amber-500" size={24} />, trendUp: false },
    { label: "Pending Bookings", value: analytics.unfinished_bookings || 0, trend: "Critical", icon: <Clock className="text-primary" size={24} />, trendUp: true },
  ];

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tighter uppercase italic text-white">Operations <span className="gradient-text italic">Overview</span></h1>
          <p className="text-white/40 font-bold tracking-tight">Real-time status of your platform engagements and growth.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-6 px-6 py-4 rounded-2xl glass border border-white/5">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Network Online</span>
              </div>
              <div className="w-px h-4 bg-white/5" />
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/40">7 Agents Active</span>
              </div>
           </div>
        </div>
      </header>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-10 rounded-[56px] glass border border-white/10 flex flex-col gap-8 group hover:border-primary/20 transition-all cursor-pointer overflow-hidden relative shadow-huge bg-black/20"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/20 transition-all duration-700" />
            
            <div className="flex justify-between items-start relative z-10">
               <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shadow-xl shadow-white/5 group-hover:scale-110 transition-transform">
                 {stat.icon}
               </div>
               <div className="flex items-center gap-1 text-green-500 font-black text-[10px] italic tracking-widest">
                  {stat.trend} <ArrowUpRight size={12} />
               </div>
            </div>

            <div className="relative z-10">
              <div className="text-4xl font-black mb-1 tabular-nums tracking-tighter group-hover:scale-105 transition-transform origin-left">{stat.value}</div>
              <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] font-mono">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-12 p-12 rounded-[64px] glass border border-white/10 shadow-huge bg-black/20 relative overflow-hidden h-fit">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-black italic tracking-tighter uppercase">Recent <span className="gradient-text italic">History</span></h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-1">Live status of current call engagements</p>
            </div>
            <button 
              onClick={() => router.push('/admin/calls')}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
            >
               View All History
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {calls.length > 0 ? calls.map((call: any, i: number) => (
              <motion.div 
                key={call.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-8 rounded-[48px] bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-white/10 transition-all group cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-16 h-16 rounded-[24px] bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-xl shadow-huge group-hover:scale-110 transition-transform duration-500">
                    {call.recipient_name[0]}
                  </div>
                  <div>
                    <div className="font-black text-lg tracking-tight group-hover:text-primary transition-colors">{call.recipient_name}</div>
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-0.5">{call.recipient_phone}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                   <div className="flex flex-col gap-1">
                      <div className="text-[10px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
                         <Clock size={12} />
                         {call.scheduled_slot} Profile
                      </div>
                      <div className="text-xs font-black text-primary/60 italic">{call.occasion_type}</div>
                   </div>
                   <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/5 ${
                    call.status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                    call.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-primary/10 text-primary border-primary/20 hover:animate-pulse'
                  }`}>
                    {call.status}
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="lg:col-span-3 text-center py-20 bg-white/2 border-2 border-dashed border-white/5 rounded-[48px]">
                <ShieldCheck size={64} className="mx-auto text-white/5 mb-6" />
                <div className="text-sm font-black text-white/10 uppercase tracking-[0.4em] italic uppercase">System Operational. No pending tasks.</div>
              </div>
            )}
          </div>
        </div>

        {/* Tactical Intelligence Overlays */}
        <div className="lg:col-span-7 p-12 rounded-[64px] glass border border-white/10 shadow-huge bg-black/20 h-full relative overflow-hidden">
           <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/2 blur-[100px] rounded-full -ml-48 -mt-48" />
           <div className="flex items-center gap-4 mb-10 relative z-10">
              <Globe className="text-secondary" size={24} />
              <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Global <span className="text-secondary italic">Presence</span></h3>
           </div>
           
           <div className="space-y-10 relative z-10 px-4">
            {[
              { label: "Lagos Territory", count: "1,242", reach: "82%", icon: <MapPin size={18} />, color: "bg-primary" },
              { label: "London Region", count: "412", reach: "42%", icon: <Globe size={18} />, color: "bg-secondary" },
              { label: "New York Hub", count: "356", reach: "28%", icon: <MapPin size={18} />, color: "bg-amber-400" },
              { label: "Corporate HQ", count: "84", reach: "18%", icon: <Zap size={18} />, color: "bg-green-500" },
            ].map((seg, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-4 text-sm font-black uppercase tracking-[0.2em] text-white/80 group-hover:text-white transition-colors">
                    {seg.icon}
                    {seg.label}
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="text-[10px] text-white/20 font-black tracking-widest">{seg.count} CLIENTS</span>
                     <span className="text-xs font-black text-secondary tabular-nums italic">{seg.reach}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 group-hover:border-secondary/20 transition-all">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: seg.reach }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: i * 0.1 }}
                    className={`h-full ${seg.color} shadow-huge opacity-80 group-hover:opacity-100 transition-opacity`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-8">
           <motion.div 
             whileHover={{ scale: 1.02 }}
             onClick={() => router.push('/admin/offers')}
             className="p-10 rounded-[64px] gradient-bg shadow-huge flex flex-col items-center justify-center text-center relative overflow-hidden group cursor-pointer flex-1"
           >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-[2s]" />
              <div className="relative z-10">
                 <div className="w-20 h-20 rounded-[32px] bg-white/20 flex items-center justify-center mx-auto mb-8 shadow-huge backdrop-blur-xl group-hover:rotate-12 transition-transform">
                    <Tag size={32} className="text-white fill-current opacity-80" />
                 </div>
                 <h3 className="text-4xl font-black mb-4 tracking-tighter uppercase italic leading-none">Promotion <span className="text-white/40 italic">Manager</span></h3>
                 <p className="text-white/70 font-bold tracking-tight text-[10px] mb-8 leading-relaxed max-w-[200px] mx-auto uppercase tracking-widest">Create and manage client engagement campaigns.</p>
                 <div className="inline-flex items-center gap-3 px-6 py-3 bg-white text-black font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-huge">
                    Access Portal <ChevronRight size={18} />
                 </div>
              </div>
           </motion.div>

           <motion.div 
             whileHover={{ scale: 1.02 }}
             onClick={() => router.push('/admin/crm')}
             className="p-10 rounded-[56px] glass border border-white/10 shadow-huge bg-black/50 flex items-center justify-between group cursor-pointer"
           >
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-[24px] bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-xl shadow-secondary/5">
                    <Users size={24} />
                 </div>
                 <div>
                    <div className="text-2xl font-black italic tracking-tighter uppercase leading-none">Client <span className="gradient-text italic">Directory</span></div>
                    <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">Full database of registered members</div>
                 </div>
              </div>
              <ChevronRight size={24} className="text-white/10 group-hover:text-white group-hover:translate-x-1 transition-all" />
           </motion.div>
        </div>
      </div>
    </div>
  );
}

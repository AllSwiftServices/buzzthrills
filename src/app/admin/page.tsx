"use client";

import { motion } from "framer-motion";
import {
  Users,
  Phone,
  MapPin,
  Tag,
  ChevronRight,
  Loader2,
  Activity,
  Globe,
  Clock,
  ShieldCheck,
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
    { label: "Calls Delivered", value: analytics.total_calls_delivered || 0, icon: <Phone className="text-primary" size={24} /> },
    { label: "Active Clients", value: analytics.total_users || 0, icon: <Users className="text-secondary" size={24} /> },
    { label: "Cancelled Subscriptions", value: analytics.churned_clients || 0, icon: <Activity className="text-amber-500" size={24} /> },
    { label: "Pending Bookings", value: analytics.unfinished_bookings || 0, icon: <Clock className="text-primary" size={24} /> },
  ];

  return (
    <div className="space-y-8 sm:space-y-12 pb-20">
      <header>
        <h1 className="text-3xl sm:text-4xl font-black mb-2 tracking-tighter uppercase text-foreground">Dashboard</h1>
        <p className="text-foreground/40 font-bold tracking-tight">Overview of bookings, clients, and pending work.</p>
      </header>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 sm:p-8 lg:p-10 rounded-[24px] sm:rounded-[40px] lg:rounded-[56px] glass border border-foreground/10 flex flex-col gap-4 sm:gap-6 lg:gap-8 group hover:border-primary/20 transition-all overflow-hidden relative shadow-huge bg-foreground/5"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/20 transition-all duration-700" />

            <div className="relative z-10">
               <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-2xl bg-foreground/5 flex items-center justify-center shadow-xl shadow-white/5 group-hover:scale-110 transition-transform">
                 {stat.icon}
               </div>
            </div>

            <div className="relative z-10">
              <div className="text-2xl sm:text-4xl font-black mb-1 tabular-nums tracking-tighter group-hover:scale-105 transition-transform origin-left">{stat.value}</div>
              <div className="text-[9px] sm:text-[10px] font-black text-foreground/40 uppercase tracking-widest">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-12 p-5 sm:p-10 md:p-12 rounded-[28px] sm:rounded-[64px] glass border border-foreground/10 shadow-huge bg-foreground/5 relative overflow-hidden h-fit">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 sm:mb-10">
            <div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tighter uppercase">Recent Calls</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mt-1">Latest call bookings and their status</p>
            </div>
            <button
              onClick={() => router.push('/admin/calls')}
              className="self-start sm:self-auto px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-foreground/5 border border-foreground/5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-foreground/10 transition-all"
            >
               View all calls
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {calls.length > 0 ? calls.map((call: any, i: number) => (
              <motion.div 
                key={call.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-5 sm:p-8 rounded-[24px] sm:rounded-[48px] bg-foreground/5 border border-foreground/5 hover:border-primary/20 hover:bg-foreground/10 transition-all group cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[16px] sm:rounded-[24px] bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-base sm:text-xl shadow-huge group-hover:scale-110 transition-transform duration-500">
                    {call.recipient_name?.[0] || "?"}
                  </div>
                  <div>
                    <div className="font-black text-sm sm:text-lg tracking-tight group-hover:text-primary transition-colors">{call.recipient_name}</div>
                    <div className="text-[9px] sm:text-[10px] text-foreground/40 font-bold uppercase tracking-widest mt-0.5">{call.recipient_phone}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-foreground/5">
                   <div className="flex flex-col gap-1">
                      <div className="text-[10px] font-black text-foreground/40 uppercase tracking-widest flex items-center gap-2">
                         <Clock size={12} />
                         {call.scheduled_slot}
                      </div>
                      {call.occasion_type && (
                        <div className="text-xs font-black text-primary/60">{call.occasion_type}</div>
                      )}
                   </div>
                   <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-foreground/5 ${
                    call.status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                    call.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-primary/10 text-primary border-primary/20 hover:animate-pulse'
                  }`}>
                    {call.status}
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="lg:col-span-3 text-center py-20 bg-foreground/2 border-2 border-dashed border-foreground/5 rounded-[48px]">
                <ShieldCheck size={64} className="mx-auto text-foreground/10 mb-6" />
                <div className="text-sm font-black text-foreground/30 uppercase tracking-widest">No calls booked yet.</div>
              </div>
            )}
          </div>
        </div>

        {/* Client regions */}
        <div className="lg:col-span-7 p-5 sm:p-8 lg:p-12 rounded-[28px] lg:rounded-[64px] glass border border-foreground/10 shadow-huge bg-foreground/5 h-full relative overflow-hidden">
           <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/2 blur-[100px] rounded-full -ml-48 -mt-48" />
           <div className="flex items-center gap-4 mb-8 sm:mb-10 relative z-10">
              <Globe className="text-secondary" size={24} />
              <h3 className="text-xl sm:text-2xl font-black tracking-tighter uppercase leading-none">Client Regions</h3>
           </div>

           {analytics.geoSummary && analytics.geoSummary.length > 0 ? (
             <div className="space-y-8 sm:space-y-10 relative z-10 px-0 sm:px-4">
              {analytics.geoSummary.map((seg: any, i: number) => {
                const total = analytics.total_users || 1;
                const reach = Math.round((seg.count / total) * 100);

                return (
                  <div key={i} className="group">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-4 text-sm font-black uppercase tracking-[0.2em] text-foreground/80">
                        {i === 0 ? <Globe size={18} /> : <MapPin size={18} />}
                        {seg.label}
                      </div>
                      <div className="flex items-center gap-4">
                         <span className="text-[10px] text-foreground/40 font-black tracking-widest">{seg.count} clients</span>
                         <span className="text-xs font-black text-secondary tabular-nums">{reach}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-foreground/5 rounded-full overflow-hidden border border-foreground/5 group-hover:border-secondary/20 transition-all">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${reach}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: i * 0.1 }}
                        className={`h-full ${i % 2 === 0 ? 'bg-primary' : 'bg-secondary'} shadow-huge opacity-80 group-hover:opacity-100 transition-opacity`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
           ) : (
             <div className="text-center py-16 relative z-10">
               <MapPin size={40} className="mx-auto text-foreground/10 mb-4" />
               <div className="text-sm font-black text-foreground/30 uppercase tracking-widest">No client location data yet.</div>
             </div>
           )}
        </div>

        <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6 lg:gap-8">
           <motion.div
             whileHover={{ scale: 1.02 }}
             onClick={() => router.push('/admin/offers')}
             className="p-6 sm:p-8 lg:p-10 rounded-[28px] lg:rounded-[64px] gradient-bg shadow-huge flex flex-col items-center justify-center text-center relative overflow-hidden group cursor-pointer flex-1"
           >
              <div className="absolute top-0 right-0 w-64 h-64 bg-foreground/10 blur-[80px] rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-[2s]" />
              <div className="relative z-10">
                 <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[28px] sm:rounded-[32px] bg-foreground/20 flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-huge backdrop-blur-xl group-hover:rotate-12 transition-transform">
                    <Tag size={32} className="text-foreground fill-current opacity-80" />
                 </div>
                 <h3 className="text-2xl sm:text-4xl font-black mb-3 sm:mb-4 tracking-tighter uppercase leading-none">Promotions</h3>
                 <p className="text-foreground/70 font-bold text-[10px] mb-6 sm:mb-8 leading-relaxed max-w-[200px] mx-auto uppercase tracking-widest">Create and manage discounts and campaigns.</p>
                 <div className="inline-flex items-center gap-3 px-6 py-3 bg-foreground text-background font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-huge">
                    Open Promotions <ChevronRight size={18} />
                 </div>
              </div>
           </motion.div>

           <motion.div
             whileHover={{ scale: 1.02 }}
             onClick={() => router.push('/admin/crm')}
             className="p-5 sm:p-6 lg:p-10 rounded-[28px] lg:rounded-[56px] glass border border-foreground/10 shadow-huge bg-foreground/5 flex items-center justify-between group cursor-pointer"
           >
              <div className="flex items-center gap-4 sm:gap-6">
                 <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[20px] sm:rounded-[24px] bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-xl shadow-secondary/5 shrink-0">
                    <Users size={24} />
                 </div>
                 <div>
                    <div className="text-lg sm:text-2xl font-black tracking-tighter uppercase leading-none">Clients</div>
                    <div className="text-[9px] font-black text-foreground/40 uppercase tracking-widest mt-1">Every registered member</div>
                 </div>
              </div>
              <ChevronRight size={24} className="text-foreground/20 group-hover:text-foreground group-hover:translate-x-1 transition-all shrink-0" />
           </motion.div>
        </div>
      </div>
    </div>
  );
}

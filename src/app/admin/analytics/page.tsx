"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PhoneCall,
  Users,
  Clock,
  XCircle,
  Globe,
  MapPin,
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminAnalytics() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [geoSummary, setGeoSummary] = useState<{ label: string; count: number }[]>([]);

  useEffect(() => {
    async function fetchStats() {
      if (authLoading || !user || user.role !== 'admin') return;

      try {
        const res = await fetch("/api/admin/analytics");
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const data = await res.json();
        // Merge analytics view with live counts as fallback
        setStats({
          total_calls_delivered: data.analytics?.total_calls_delivered ?? data.totalCalls,
          total_users: data.analytics?.total_users ?? data.totalUsers,
          pending_calls: data.analytics?.pending_calls ?? data.pendingCalls,
          active_subs: data.analytics?.active_subs ?? data.activeSubs,
          ...data.analytics,
        });
        setGeoSummary(data.geoSummary || []);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [user, authLoading]);

  const metrics = [
    { label: "Calls Delivered", value: stats?.total_calls_delivered ?? 0, icon: <PhoneCall size={24} />, color: "text-primary" },
    { label: "Registered Users", value: stats?.total_users ?? 0, icon: <Users size={24} />, color: "text-secondary" },
    { label: "Pending Bookings", value: stats?.pending_calls ?? 0, icon: <Clock size={24} />, color: "text-amber-400" },
    { label: "Cancelled Subscriptions", value: stats?.churned_clients ?? 0, icon: <XCircle size={24} />, color: "text-red-400" },
  ];

  const totalGeo = geoSummary.reduce((sum, g) => sum + g.count, 0) || 1;

  return (
    <div className="space-y-8 sm:space-y-12">
      <header>
        <h1 className="text-3xl sm:text-4xl font-black mb-2 tracking-tighter">Analytics</h1>
        <p className="text-muted-foreground text-sm font-medium tracking-tight">Platform totals and where your clients are.</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 sm:p-8 rounded-[24px] sm:rounded-[48px] glass border border-border shadow-huge bg-background/40 group hover:border-primary/20 transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-all" />

            <div className="relative z-10">
              <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-foreground/5 flex items-center justify-center ${metric.color} shadow-lg shadow-foreground/5 mb-4 sm:mb-6`}>
                {metric.icon}
              </div>
               <div className="text-2xl sm:text-4xl font-black mb-1 tabular-nums group-hover:scale-110 transition-transform origin-left">{metric.value}</div>
                <div className="text-[9px] sm:text-[10px] font-black text-foreground/40 tracking-widest">{metric.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Client Regions */}
        <div className="lg:col-span-12 p-5 sm:p-10 rounded-[28px] sm:rounded-[64px] glass border border-border shadow-huge bg-background/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 blur-[100px] sm:blur-[120px] rounded-full -mr-48 -mt-48" />

          <div className="flex justify-between items-center mb-8 sm:mb-10 relative z-10">
             <div>
                <h2 className="text-xl sm:text-2xl font-black mb-1">Client Regions</h2>
                <p className="text-xs text-muted-foreground font-medium tracking-widest">Where your registered clients are located.</p>
             </div>
             <Globe className="text-secondary/20 hidden sm:block" size={32} />
          </div>

          {geoSummary.length > 0 ? (
            <div className="flex flex-wrap gap-3 sm:gap-6 relative z-10">
               {geoSummary.map((geo, i) => {
                 const pct = Math.round((geo.count / totalGeo) * 100);
                 return (
                    <div key={geo.label} className="w-40 sm:w-44 shrink-0 p-4 sm:p-6 rounded-3xl bg-foreground/5 border border-border group hover:border-secondary/20 transition-all text-center">
                       <div className="text-lg sm:text-xl font-black mb-1">{pct}%</div>
                       <div className="text-[9px] sm:text-[10px] font-black text-foreground/40 tracking-widest truncate" title={geo.label}>{geo.label}</div>
                       <div className="mt-4 w-full h-1 bg-foreground/5 rounded-full overflow-hidden">
                         <motion.div
                           initial={{ width: 0 }}
                           animate={{ width: `${pct}%` }}
                           transition={{ delay: 0.3 + i * 0.1, duration: 1.2 }}
                           className="h-full bg-secondary shadow-lg shadow-secondary/40"
                         />
                      </div>
                   </div>
                 );
               })}
            </div>
          ) : (
            <div className="text-center py-16 relative z-10">
              <MapPin size={40} className="mx-auto text-foreground/10 mb-4" />
              <div className="text-sm font-black text-foreground/30 tracking-widest">No client location data yet.</div>
            </div>
          )}
        </div>

        {/* Call volume */}
        <div className="lg:col-span-12 p-5 sm:p-10 rounded-[28px] sm:rounded-[48px] glass border border-border shadow-huge bg-background/40 h-full">
            <div className="flex items-center gap-4 mb-8 sm:mb-10">
               <TrendingUp className="text-primary" size={24} />
               <h2 className="text-xl sm:text-2xl font-black tracking-tighter">Call Volume</h2>
            </div>
            <div className="h-48 sm:h-64 flex items-center justify-center border border-dashed border-border rounded-[24px] sm:rounded-[32px] bg-foreground/2 text-foreground/30 font-bold tracking-widest text-xs sm:text-sm text-center px-6">
               Chart coming soon
            </div>
        </div>
      </div>
    </div>
  );
}

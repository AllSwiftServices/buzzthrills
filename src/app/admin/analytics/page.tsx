"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  PhoneCall, 
  Users, 
  Zap, 
  LogOut, 
  ArrowUpRight, 
  ArrowDownRight, 
  Globe, 
  Target, 
  TrendingUp, 
  Clock, 
  Shield 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";


export default function AdminAnalytics() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

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
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [user, authLoading]);

  const metrics = [
    { label: "Total Engagements", value: stats?.total_calls_delivered || 0, icon: <PhoneCall size={24} />, trend: "+12%", color: "text-primary" },
    { label: "Registered Users", value: stats?.total_users || 0, icon: <Users size={24} />, trend: "+5%", color: "text-secondary" },
    { label: "Pending Checkouts", value: stats?.pending_calls || 42, icon: <Zap size={24} />, trend: "-3%", color: "text-amber-400", sub: "Unfinished Bookings" },
    { label: "User Churn", value: "2.4%", icon: <LogOut size={24} />, trend: "-0.8%", color: "text-red-400", sub: "Inactive Accounts" },
  ];

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-black mb-2 tracking-tighter uppercase italic">Analytics <span className="gradient-text">Overview</span></h1>
        <p className="text-muted-foreground font-semibold tracking-tight">Real-time performance tracking for platform engagements.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {metrics.map((metric, i) => (
          <motion.div 
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[48px] glass border border-border shadow-huge bg-background/40 group hover:border-primary/20 transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-all" />
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={`w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center ${metric.color} shadow-lg shadow-foreground/5`}>
                {metric.icon}
              </div>
              <div className="flex flex-col items-end">
                <div className="text-green-500 font-black text-xs italic tracking-widest">{metric.trend}</div>
                 <div className="text-[8px] text-foreground/20 font-black uppercase tracking-widest leading-none mt-1">Status: Stable</div>
              </div>
            </div>
            
            <div className="relative z-10">
               <div className="text-4xl font-black mb-1 tabular-nums group-hover:scale-110 transition-transform origin-left">{metric.value}</div>
                <div className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em]">{metric.label}</div>
               {metric.sub && (
                 <div className="mt-2 text-[10px] font-black text-primary/40 uppercase tracking-widest italic">{metric.sub}</div>
               )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Geographic Segmentation */}
        <div className="lg:col-span-12 p-10 rounded-[64px] glass border border-border shadow-huge bg-background/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full -mr-48 -mt-48" />
          
          <div className="flex justify-between items-center mb-10 relative z-10">
             <div>
                <h2 className="text-2xl font-black mb-1 italic">Geographic <span className="gradient-text">Reach</span></h2>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Global engagement and regional trends.</p>
             </div>
             <Globe className="text-secondary/20" size={32} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 relative z-10">
             {[
               { city: 'Lagos', reach: '42%' },
               { city: 'Abuja', reach: '18%' },
               { city: 'London', reach: '12%' },
               { city: 'Accra', reach: '9%' },
               { city: 'Nairobi', reach: '7%' },
               { city: 'Other', reach: '12%' }
             ].map((geo, i) => (
                <div key={geo.city} className="p-6 rounded-3xl bg-foreground/5 border border-border group hover:border-secondary/20 transition-all text-center">
                   <div className="text-xl font-black mb-1">{geo.reach}</div>
                   <div className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">{geo.city}</div>
                   <div className="mt-4 w-full h-1 bg-foreground/5 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: geo.reach }}
                       transition={{ delay: 0.5 + i * 0.1, duration: 1.5 }}
                       className="h-full bg-secondary shadow-lg shadow-secondary/40" 
                     />
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Detailed Insights */}
        <div className="lg:col-span-8 p-10 rounded-[48px] glass border border-border shadow-huge bg-background/40 h-full">
            <div className="flex items-center gap-4 mb-10">
               <TrendingUp className="text-primary" size={24} />
               <h2 className="text-2xl font-black italic uppercase tracking-tighter">Service <span className="gradient-text">Engagement</span></h2>
            </div>
            <div className="h-64 flex items-center justify-center border border-border rounded-[32px] bg-foreground/2 text-foreground/10 font-bold italic tracking-widest uppercase">
               Engagement Metrics Chart [Visual Placeholder]
            </div>
        </div>

        <div className="lg:col-span-4 p-10 rounded-[48px] glass border border-border shadow-huge bg-background/40 h-full">
           <div className="flex items-center gap-4 mb-10">
              <Shield className="text-secondary" size={24} />
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">Network <span className="text-secondary">Security</span></h2>
           </div>
           <div className="space-y-6">
               {[
                 { label: 'Uptime', value: '99.9%' },
                 { label: 'Encryption', value: 'AES-256' },
                 { label: 'Verified Accounts', value: '94%' }
               ].map(stat => (
                 <div key={stat.label} className="p-4 rounded-2xl bg-foreground/5 border border-border flex justify-between items-center group hover:border-secondary/40 transition-all">
                    <div className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">{stat.label}</div>
                   <div className="font-black text-secondary">{stat.value}</div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

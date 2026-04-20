"use client";

import { motion } from "framer-motion";
import { Users, PhoneCall, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LiveStatsWidget() {
  const [stats, setStats] = useState({ 
    total_calls: 1250, 
    active_members: 480 
  });

  useEffect(() => {
    async function fetchLiveStats() {
      const { data, error } = await supabase
        .from('analytics_summary')
        .select('total_calls_delivered, total_users')
        .single();
      
      if (data) {
        setStats({
          total_calls: Math.max(1250, data.total_calls_delivered),
          active_members: Math.max(480, data.total_users)
        });
      }
    }

    fetchLiveStats();
    
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchLiveStats, 1000 * 60 * 5);
    return () => clearInterval(interval);
  }, []);

  const items = [
    { label: "Thrills Delivered", value: stats.total_calls.toLocaleString(), icon: <PhoneCall size={18} />, color: "text-primary" },
    { label: "Community Members", value: stats.active_members.toLocaleString(), icon: <Users size={18} />, color: "text-secondary" },
    { label: "Platform Reach", value: "Global", icon: <Globe size={18} />, color: "text-amber-400" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 py-8 px-8 glass border border-border rounded-[48px] shadow-2xl relative overflow-hidden bg-background/40 group hover:border-primary/20 transition-all">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-all" />
      
      {items.map((item, i) => (
        <motion.div 
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-4 relative z-10"
        >
          <div className={`w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center ${item.color} shadow-lg shadow-foreground/5`}>
             {item.icon}
          </div>
          <div>
             <div className="text-2xl font-black tracking-tighter tabular-nums">{item.value}+</div>
             <div className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em]">{item.label}</div>
          </div>
          {i < items.length - 1 && (
            <div className="hidden lg:block w-px h-8 bg-foreground/10 ml-8" />
          )}
        </motion.div>
      ))}

      <div className="flex items-center gap-2 pl-4 lg:pl-12 border-l border-foreground/10">
         <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-lg shadow-green-500/40 animate-pulse" />
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
         </div>
         <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest whitespace-nowrap">Live Network Active</span>
      </div>
    </div>
  );
}

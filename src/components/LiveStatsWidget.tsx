"use client";

import { motion } from "framer-motion";
import { Users, PhoneCall, Globe, Heart, ShieldCheck, Smile } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LiveStatsWidget() {
  const [stats, setStats] = useState({ 
    total_calls: 1250, 
    hearts_touched: 24500,
    happy_families: 98,
    care: "24/7"
  });

  useEffect(() => {
    async function fetchLiveStats() {
      // Fetch total count of calls from the database
      const { count, error } = await supabase
        .from('calls')
        .select('*', { count: 'exact', head: true });
      
      if (count !== null) {
        setStats(prev => ({
          ...prev,
          // Base of 1,250 + actual orders from DB
          total_calls: 1250 + count,
          // Proportionally increase hearts touched (example: 20 per call)
          hearts_touched: 24500 + (count * 20)
        }));
      }
    }

    fetchLiveStats();
    
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchLiveStats, 1000 * 60 * 5);
    return () => clearInterval(interval);
  }, []);

  const items = [
    { label: "Calls Delivered", value: `${stats.total_calls.toLocaleString()}+`, icon: <PhoneCall size={20} />, color: "text-primary" },
    { label: "Hearts Touched", value: `${(stats.hearts_touched / 1000).toFixed(1)}k+`, icon: <Heart size={20} />, color: "text-secondary" },
    { label: "Happy Families", value: `${stats.happy_families}%`, icon: <Smile size={20} />, color: "text-green-500" },
    { label: "Professional Care", value: stats.care, icon: <ShieldCheck size={20} />, color: "text-amber-500" },
  ];

  return (
    <div className="w-full py-12 px-8 lg:px-16 glass border border-border rounded-[64px] shadow-huge relative overflow-hidden bg-background/40 group hover:border-primary/20 transition-all duration-700">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full -mr-48 -mt-48 group-hover:bg-primary/10 transition-all duration-1000" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 blur-[80px] rounded-full -ml-32 -mb-32 group-hover:bg-secondary/10 transition-all duration-1000" />
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
        {items.map((item, i) => (
          <motion.div 
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="flex flex-col items-center lg:items-start gap-4"
          >
            <div className={`w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center ${item.color} shadow-xl shadow-foreground/5 group-hover:scale-110 transition-transform duration-500`}>
               {item.icon}
            </div>
            <div className="text-center lg:text-left">
               <div className="text-3xl lg:text-4xl font-black tracking-tighter tabular-nums mb-1 italic font-serif gradient-text">{item.value}</div>
               <div className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] italic font-serif">{item.label}</div>
            </div>
            {i < items.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 right-[-16px] w-px h-16 bg-foreground/5 -translate-y-1/2" />
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-foreground/5 flex items-center justify-center lg:justify-between gap-6">
         <div className="flex items-center gap-3">
            <div className="relative">
               <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/40 animate-pulse" />
               <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
            </div>
            <span className="text-[9px] font-black text-foreground/30 uppercase tracking-[0.3em] italic font-serif">Live Network Node Active</span>
         </div>
         <div className="hidden lg:flex items-center gap-2 text-[9px] font-black text-foreground/20 uppercase tracking-[0.3em] italic font-serif">
            Real-time fulfillment synchronization active
         </div>
      </div>
    </div>
  );
}

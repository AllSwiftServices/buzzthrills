"use client";

import { motion } from "framer-motion";
import { PhoneCall, Globe, SmilePlus, Layers } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LiveStatsWidget() {
  const [callCount, setCallCount] = useState(1250);

  useEffect(() => {
    async function fetchLiveStats() {
      const { count } = await supabase
        .from("calls")
        .select("*", { count: "exact", head: true });
      if (count !== null) {
        setCallCount(1250 + count);
      }
    }
    fetchLiveStats();
    const interval = setInterval(fetchLiveStats, 1000 * 60 * 5);
    return () => clearInterval(interval);
  }, []);

  const items = [
    {
      label: "Calls Delivered",
      value: `${callCount.toLocaleString()}+`,
      icon: <PhoneCall size={20} />,
      color: "text-primary",
    },
    {
      label: "Genuine Reactions",
      value: "98%",
      icon: <SmilePlus size={20} />,
      color: "text-secondary",
    },
    {
      label: "Call Styles",
      value: "15+",
      icon: <Layers size={20} />,
      color: "text-green-500",
    },
    {
      label: "Worldwide Voice Reach",
      value: "Global",
      icon: <Globe size={20} />,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="w-full py-8 sm:py-12 px-6 sm:px-10 lg:px-16 glass border border-border rounded-[32px] sm:rounded-[64px] shadow-huge relative overflow-hidden bg-background/40 group hover:border-primary/20 transition-all duration-700">
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
            <div
              className={`w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center ${item.color} shadow-xl shadow-foreground/5 group-hover:scale-110 transition-transform duration-500`}
            >
              {item.icon}
            </div>
            <div className="text-center lg:text-left">
              <div className="text-3xl lg:text-4xl font-black tracking-tighter tabular-nums mb-1 font-serif gradient-text">
                {item.value}
              </div>
              <div className="text-[10px] font-black text-foreground/40 tracking-[0.2em] font-serif">
                {item.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

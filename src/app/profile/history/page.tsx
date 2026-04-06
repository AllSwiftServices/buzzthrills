"use client";

import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Phone, Calendar, Clock, ChevronRight, Search, Filter } from "lucide-react";

export default function HistoryPage() {
  const { user } = useAuth();

  if (!user) return null;

  const history = [
    { id: 1, type: "Celebratory Call", recipient: "Mom", date: "Oct 24, 2026", status: "Delivered", icon: <Phone size={20} /> },
    { id: 2, type: "Digital Letter", recipient: "Adesua", date: "Oct 22, 2026", status: "Delivered", icon: <Calendar size={20} /> },
    { id: 3, type: "Prank Call", recipient: "Tunde", date: "Oct 12, 2026", status: "Failed", icon: <Phone size={20} /> },
    { id: 4, type: "Standard Call", recipient: "Sarah", date: "Sep 30, 2026", status: "Delivered", icon: <Phone size={20} /> },
    { id: 5, type: "Orbit Plan", recipient: "Self", date: "Sep 15, 2026", status: "Delivered", icon: <Clock size={20} /> },
  ];

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

        <div className="space-y-4">
          {history.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] glass border border-border hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden active:scale-[0.98]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-2xl rounded-full group-hover:bg-primary/10 transition-all" />
              
              <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-foreground/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="font-black text-sm sm:text-lg tracking-tighter uppercase italic truncate">{item.type}</div>
                    <div className="text-[9px] sm:text-sm text-muted-foreground font-black uppercase tracking-widest truncate">Sent to: <span className="text-foreground/80 font-black italic">{item.recipient}</span> • {item.date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                  <div className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest ${
                    item.status === 'Delivered' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}>
                    {item.status}
                  </div>
                  <ChevronRight size={16} className="sm:size-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all underline-offset-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

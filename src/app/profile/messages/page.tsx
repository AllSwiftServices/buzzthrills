"use client";

import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, ShieldCheck, Zap, Phone, Mail } from "lucide-react";
import { useState } from "react";

export default function MessagesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'agents' | 'support'>('agents');

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto h-[70vh] flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 sm:mb-12">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl sm:text-4xl md:text-5xl font-black mb-2 italic uppercase tracking-tighter"
            >
              Support <span className="gradient-text italic">Channels</span>
            </motion.h1>
            <p className="text-muted-foreground text-[9px] sm:text-[10px] font-black uppercase tracking-widest pl-1 leading-none">Direct link to your dedicated support team.</p>
          </div>
          
          <div className="flex p-1.5 bg-foreground/5 rounded-2xl border border-border">
            <button 
              onClick={() => setActiveTab('agents')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'agents' ? 'bg-background shadow-lg text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Service Team
            </button>
            <button 
              onClick={() => setActiveTab('support')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'support' ? 'bg-background shadow-lg text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Billing
            </button>
          </div>
        </div>

        <div className="flex-1 rounded-[32px] sm:rounded-[40px] glass border border-border overflow-hidden flex flex-col md:flex-row shadow-huge min-h-[500px]">
          {/* Sidebar */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-border bg-foreground/2">
            <div className="p-4 sm:p-6 border-b border-border font-black italic uppercase tracking-tighter text-sm sm:text-base">Active Channels</div>
            <div className="p-2 space-y-2 overflow-x-auto md:overflow-x-visible flex md:flex-col gap-2 md:gap-0 pb-4 md:pb-2">
            <div className="p-8 text-center">
              <div className="text-[10px] font-black uppercase tracking-widest opacity-20">No active support tickets.</div>
            </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-background/40 relative">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-black text-xs ring-4 ring-primary/10">DT</div>
                <div>
                  <div className="font-bold text-sm">Delivery Support Team</div>
                  <div className="text-[10px] text-green-500 font-black uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Operational
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-4 sm:space-y-6">
               <div className="flex-1 flex flex-col items-center justify-center opacity-20 p-12 text-center">
                  <Mail size={48} className="mb-4" />
                  <div className="text-sm font-black uppercase tracking-[0.2em]">Select a channel to begin secure transmission.</div>
               </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-border bg-background/60 backdrop-blur-xl">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="w-full bg-foreground/5 border border-border rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-4 sm:pl-6 pr-14 sm:pr-16 outline-none focus:border-primary transition-all text-xs sm:text-sm font-black tracking-tight"
                />
                <button className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                   <Send size={16} className="sm:size-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

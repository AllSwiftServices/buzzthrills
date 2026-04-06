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
              {[
                { name: "Delivery Team", msg: "Call scheduled for Mom 🎁", time: "2m", active: true, icon: <ShieldCheck size={18} /> },
                { name: "Digital Services", msg: "Digital scroll delivered!", time: "1h", active: false, icon: <Zap size={18} /> },
                { name: "Billing & Plans", msg: "Invoice BT-2938 processed.", time: "yesterday", active: false, icon: <Phone size={18} /> }
              ].map((channel, i) => (
                <div key={i} className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl flex items-center gap-3 sm:gap-4 cursor-pointer transition-all shrink-0 md:shrink-1 min-w-[200px] md:min-w-0 ${
                  channel.active ? 'bg-primary/10 border border-primary/20 shadow-lg' : 'hover:bg-foreground/5'
                }`}>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${
                    channel.active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-foreground/10 text-muted-foreground'
                  }`}>
                    {channel.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-bold text-sm truncate">{channel.name}</div>
                      <div className="text-[10px] text-muted-foreground font-black uppercase">{channel.time}</div>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{channel.msg}</div>
                  </div>
                </div>
              ))}
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
               <div className="flex justify-start">
                  <div className="max-w-[90%] sm:max-w-[80%] p-4 sm:p-5 rounded-[24px] sm:rounded-3xl rounded-tl-none bg-foreground/5 text-xs sm:text-sm italic font-black tracking-tight leading-relaxed">
                    Hello! Your scheduled "Magic Morning" call for Mom is locked in for 10:00 AM tomorrow. Any last-minute details we should add? 
                    <div className="text-[9px] text-foreground/40 font-black mt-2 uppercase tracking-widest">Delivery Team • 10:04 AM</div>
                  </div>
               </div>

               <div className="flex justify-end">
                  <div className="max-w-[90%] sm:max-w-[80%] p-4 sm:p-5 rounded-[24px] sm:rounded-3xl rounded-tr-none gradient-bg text-white shadow-huge text-xs sm:text-sm font-bold tracking-tight leading-relaxed">
                    Sounds perfect! Just make sure they ask about the 'hidden gift' under the stairs. 🎁
                    <div className="text-[9px] text-white/60 font-black mt-2 uppercase tracking-widest">You • 10:12 AM</div>
                  </div>
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

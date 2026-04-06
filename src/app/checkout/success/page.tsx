"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, ArrowRight, Share2, Download, Zap, Calendar } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

export default function CheckoutSuccess() {
  const [orderRef, setOrderRef] = useState("");

  useEffect(() => {
    // Generate a tactical order reference
    setOrderRef(`BZ-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
    
    // Launch celebratory confetti
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00FF88', '#00E0FF', '#7000FF']
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]">
      <div className="absolute inset-x-0 h-px w-full bg-linear-to-r from-transparent via-primary/50 to-transparent top-0" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl glass p-10 md:p-16 rounded-[64px] border border-white/10 shadow-huge text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32" />
        
        <div className="relative z-10">
           <motion.div 
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ type: "spring", damping: 12, delay: 0.2 }}
             className="w-24 h-24 rounded-[32px] bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/10"
           >
              <CheckCircle2 size={48} className="text-green-500" />
           </motion.div>

           <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">Mission <span className="gradient-text">Accepted.</span></h1>
           <p className="text-muted-foreground font-bold tracking-tight mb-12 max-w-md mx-auto text-lg leading-relaxed">
             Your high-fidelity thrill has been funded and logged. Our specialist squad is currently coordinating the execution.
           </p>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/5 text-left group hover:border-primary/20 transition-all">
                 <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Order Pulse</div>
                 <div className="font-black text-lg font-mono text-primary group-hover:scale-105 transition-transform origin-left">{orderRef}</div>
              </div>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/5 text-left group hover:border-secondary/20 transition-all">
                 <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Status</div>
                 <div className="font-black text-lg flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                    <Zap size={18} className="text-secondary animate-pulse" />
                    Tactical Setup
                 </div>
              </div>
           </div>

           <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/profile"
                className="px-8 py-5 rounded-[32px] gradient-bg text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                Track In Dashboard
                <ArrowRight size={18} />
              </Link>
              <button className="px-8 py-5 rounded-[32px] glass border border-white/10 text-white/60 hover:text-white font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                <Download size={18} />
                Mission Receipt
              </button>
           </div>

           <div className="mt-12 pt-12 border-t border-white/5 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                 <ShieldCheck size={14} />
                 End-to-End Tactical Encryption
              </div>
              <div className="flex gap-4">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                 ))}
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
}

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
    <div className="min-h-screen bg-background flex items-center justify-center p-6 bg-[url('/grid.svg')] bg-center mask-[linear-gradient(180deg,white,rgba(255,255,255,0))]">
      <div className="absolute inset-x-0 h-px w-full bg-linear-to-r from-transparent via-primary/50 to-transparent top-0" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl glass p-10 md:p-16 rounded-[64px] border border-border shadow-huge text-center relative overflow-hidden"
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

           <h1 className="text-5xl md:text-8xl font-medium mb-4 tracking-tight font-serif italic leading-none">Mission <br className="xs:hidden" /><span className="gradient-text italic">Accepted.</span></h1>
           <p className="text-muted-foreground font-medium italic font-serif text-lg md:text-xl mb-12 max-w-sm mx-auto leading-relaxed">
             Your order is confirmed. We&apos;re already on it!
           </p>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              <div className="p-8 rounded-[32px] bg-primary/5 border border-border text-left group hover:border-primary/20 transition-all shadow-xl shadow-primary/5">
                 <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Order Pulse</div>
                 <div className="font-black text-2xl font-mono text-primary group-hover:scale-105 transition-transform origin-left tracking-tight">{orderRef}</div>
              </div>
              <div className="p-8 rounded-[32px] bg-secondary/5 border border-border text-left group hover:border-secondary/20 transition-all shadow-xl shadow-secondary/5">
                 <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Status</div>
                 <div className="font-black text-xl flex items-center gap-2 group-hover:translate-x-2 transition-transform text-secondary">
                    <Zap size={20} className="fill-current animate-pulse text-amber-400" />
                    Tactical Setup
                 </div>
              </div>
           </div>

           <div className="flex flex-col gap-4 justify-center">
              <Link 
                href="/profile"
                className="px-10 py-6 rounded-[32px] bg-primary text-white font-black text-sm uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10">Track Your Order</span>
                <ArrowRight size={20} className="relative z-10" />
              </Link>
              <button className="px-10 py-6 rounded-[32px] glass border border-border text-foreground font-black text-xs uppercase tracking-widest hover:bg-foreground/5 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                <Download size={20} />
                Download Receipt
              </button>
           </div>

           <div className="mt-12 pt-12 border-t border-border flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em]">
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

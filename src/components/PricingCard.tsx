"use client";

import { motion } from "framer-motion";
import { Check, Zap, Star, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PricingCardProps {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  icon: React.ReactNode;
  gradient: string;
  delay?: number;
}

export default function PricingCard({ 
  name, 
  price, 
  description, 
  features, 
  isPopular, 
  icon, 
  gradient,
  delay = 0 
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={`relative group rounded-[48px] p-8 md:p-10 flex flex-col h-full bg-black/20 glass border transition-all duration-500 overflow-hidden ${
        isPopular ? "border-primary/50 shadow-huge shadow-primary/10 ring-1 ring-primary/20 scale-[1.02] z-10" : "border-white/10 hover:border-white/20"
      }`}
    >
      {/* Background Glow */}
      <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity rounded-full -mr-32 -mt-32 ${gradient}`} />
      
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute top-8 right-8 z-20">
          <div className="flex items-center gap-1 px-4 py-2 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
            <Zap size={12} className="fill-current" />
            Most Popular
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-10 relative z-10">
        <div className={`w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6 shadow-xl ${isPopular ? "text-primary" : "text-white/40"}`}>
          {icon}
        </div>
        <h3 className="text-3xl font-black mb-3 tracking-tighter uppercase italic">{name}</h3>
        <p className="text-muted-foreground font-bold text-sm tracking-tight leading-relaxed">{description}</p>
      </div>

      {/* Pricing */}
      <div className="mb-10 relative z-10">
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-black tracking-tighter italic">₦{price}</span>
          <span className="text-muted-foreground font-black text-xs uppercase tracking-widest">/ Month</span>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4 mb-12 flex-1 relative z-10">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className={`mt-1.5 w-4 h-4 rounded-full flex items-center justify-center ${isPopular ? "bg-primary/20 text-primary" : "bg-white/5 text-white/20"}`}>
              <Check size={10} strokeWidth={4} />
            </div>
            <span className="text-white/80 font-bold text-sm tracking-tight">{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="relative z-10 pt-4">
        <Link 
          href="/auth" 
          className={`w-full py-5 rounded-[28px] font-black italic uppercase tracking-[0.15em] text-sm shadow-huge active:scale-95 transition-all flex items-center justify-center gap-3 group/btn ${
            isPopular ? "gradient-bg text-white" : "bg-white/5 text-white hover:bg-white/10"
          }`}
        >
          {name === "Corporate" ? "Inquire Mission" : "Deploy Perks"}
          <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

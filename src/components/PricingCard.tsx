"use client";

import { motion } from "framer-motion";
import { Check, Zap, Star, Shield, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface PricingCardProps {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  icon: React.ReactNode;
  gradient: string;
  cycle: 'monthly' | 'annual';
  delay?: number;
}

export default function PricingCard({ 
  id,
  name, 
  price, 
  description, 
  features, 
  isPopular, 
  icon, 
  gradient,
  cycle,
  delay = 0 
}: PricingCardProps) {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={`relative group rounded-[40px] sm:rounded-[48px] p-6 sm:p-8 md:p-10 flex flex-col h-full glass border transition-all duration-500 overflow-hidden ${
        isPopular ? "border-primary/50 shadow-huge shadow-primary/10 ring-1 ring-primary/20 scale-[1.02] sm:scale-[1.03] z-10" : "border-border hover:border-foreground/20"
      }`}
    >
      {/* Background Glow */}
      <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity rounded-full -mr-32 -mt-32 ${gradient}`} />
      
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute top-8 right-8 z-20">
          <div className="flex items-center gap-1 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm backdrop-blur-md border border-primary/20">
            <Star size={12} className="fill-current" />
            Most Loved
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-10 relative z-10">
        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-foreground/5 flex items-center justify-center mb-4 sm:mb-6 shadow-xl ${isPopular ? "text-primary" : "text-foreground/40"}`}>
          {icon}
        </div>
        <h3 className="text-2xl sm:text-3xl font-medium mb-2 sm:mb-3 tracking-tight font-serif italic text-primary">{name}</h3>
        <p className="text-muted-foreground font-medium text-xs sm:text-sm tracking-tight leading-relaxed">{description}</p>
      </div>

      {/* Pricing */}
      <div className="mb-10 relative z-10">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl sm:text-5xl font-medium tracking-tight font-serif">₦{price}</span>
          <span className="text-muted-foreground font-semibold text-[10px] sm:text-xs uppercase tracking-widest">/ Month</span>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-12 flex-1 relative z-10">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start gap-4">
              <Check strokeWidth={3} className="w-[10px] h-[10px] sm:w-3 sm:h-3 text-primary" />
            <span className="text-foreground/80 font-medium text-xs sm:text-sm tracking-tight">{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="relative z-10 pt-4">
        <button 
          onClick={() => {
            const checkoutUrl = `/checkout?plan=${id}&cycle=${cycle}`;
            if (user) {
              router.push(checkoutUrl);
            } else {
              router.push(`/auth?redirect=checkout&plan=${id}&cycle=${cycle}`);
            }
          }}
          className={`w-full py-5 rounded-[28px] font-semibold tracking-wide text-sm shadow-huge active:scale-95 transition-all flex items-center justify-center gap-3 group/btn ${
            isPopular ? "gradient-bg text-white" : "bg-foreground/5 text-foreground hover:bg-foreground/10"
          }`}
        >
          {name === "Corporate" ? "Create a Business Moment" : "Share the Joy"}
          <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
        </button>
      </div>

    </motion.div>
  );
}

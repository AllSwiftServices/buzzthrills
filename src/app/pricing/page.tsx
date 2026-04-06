"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";
import { motion } from "framer-motion";
import { Zap, Shield, Star, Users, ArrowRight, Check, Minus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: "lite",
      name: "Lite",
      price: billingCycle === 'monthly' ? "15,000" : "12,000",
      description: "Ideal for individuals sending their first surprise.",
      features: [
        "5 Surprise Calls / month",
        "Unlimited Digital Letters",
        "Standard Delivery (24-48h)",
        "Morning/Afternoon Slots",
        "Email Support"
      ],
      icon: <Star size={32} />,
      gradient: "from-blue-500/20 via-cyan-500/10 to-transparent"
    },
    {
      id: "plus",
      name: "Plus",
      price: billingCycle === 'monthly' ? "45,000" : "36,000",
      description: "The standard choice for personal celebrations and small groups.",
      features: [
        "15 Surprise Calls / month",
        "Holographic Digital Letters",
        "Express Delivery (Under 12h)",
        "All Time Slots (Inc. Night)",
        "Priority Support Channel",
        "2 Free Custom Deliveries"
      ],
      isPopular: true,
      icon: <Zap size={32} />,
      gradient: "from-primary/30 via-secondary/10 to-transparent"
    },
    {
      id: "orbit",
      name: "Orbit",
      price: billingCycle === 'monthly' ? "120,000" : "98,000",
      description: "Unlimited access for high-volume personal or business requirements.",
      features: [
        "Unlimited Surprise Calls",
        "Video Digital Letters",
        "Bypass All Scheduling Restrictions",
        "Dedicated Account Support Agent",
        "Custom Recording Studio Access",
        "Exclusive Merch Early Access"
      ],
      icon: <Shield size={32} />,
      gradient: "from-purple-500/30 via-pink-500/10 to-transparent"
    }
  ];

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <Header />
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[40%] right-[10%] w-[30vw] h-[30vw] bg-secondary/10 blur-[100px] rounded-full" />
      </div>

      <section className="pt-40 pb-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-border text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-8"
            >
              <Zap size={14} className="fill-current" />
              Service Options
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter italic uppercase leading-none"
            >
              Choose Your <span className="gradient-text italic">Plan</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg md:text-xl font-bold max-w-2xl mx-auto tracking-tight leading-relaxed mb-12"
            >
              Choose the service tier that matches your requirements. From personal celebrations to corporate gifting, we've optimized your experience.
            </motion.p>

            {/* Billing Toggle */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-6 mb-16"
            >
              <span className={`text-xs font-black uppercase tracking-widest transition-colors ${billingCycle === 'monthly' ? 'text-foreground' : 'text-foreground/40'}`}>Monthly</span>
              <button 
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="w-16 h-8 rounded-full glass border border-border p-1 relative group cursor-pointer transition-all hover:border-primary/50"
              >
                <div className={`w-6 h-6 rounded-full gradient-bg transition-all duration-300 shadow-xl ${billingCycle === 'annual' ? 'translate-x-8' : 'translate-x-0'}`} />
              </button>
              <div className="flex items-center gap-3">
                 <span className={`text-xs font-black uppercase tracking-widest transition-colors ${billingCycle === 'annual' ? 'text-foreground' : 'text-foreground/40'}`}>Annual Billing</span>
                 <div className="px-2 py-1 bg-green-500/10 text-green-500 border border-green-500/20 text-[9px] font-black uppercase tracking-widest rounded-md animate-bounce">
                    Save 20%
                 </div>
              </div>
            </motion.div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 px-4 items-stretch">
            {plans.map((plan, i) => (
              <PricingCard key={plan.id} {...plan} delay={0.4 + (i * 0.1)} />
            ))}
          </div>

          {/* Corporate / Custom Tier */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 md:p-16 rounded-[64px] glass border border-border shadow-huge bg-background/40 flex flex-col lg:flex-row items-center justify-between gap-12 mb-24 relative overflow-hidden group"
          >
             <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full -mr-48 -mt-48 pointer-events-none group-hover:scale-110 transition-transform duration-[2s]" />
             
             <div className="relative z-10 text-center lg:text-left">
                <div className="w-16 h-16 rounded-3xl bg-foreground/5 flex items-center justify-center mx-auto lg:mx-0 mb-8 text-primary shadow-xl">
                   <Users size={32} />
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase italic leading-none">Buzz <span className="gradient-text italic">Corporate</span></h2>
                <p className="text-muted-foreground font-bold text-lg max-w-xl tracking-tight leading-relaxed uppercase text-[10px] tracking-widest">Bulk employee birthdays, corporate rewards, and custom company branding. Designed for professional high-fidelity engagement.</p>
             </div>

             <div className="relative z-10 w-full lg:w-auto">
                <button className="w-full lg:w-auto px-12 py-6 bg-foreground text-background font-black rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-huge flex items-center justify-center gap-3 uppercase text-sm tracking-widest italic">
                   Contact Sales
                   <ArrowRight size={20} />
                </button>
             </div>
          </motion.div>

          {/* FAQ Section Placeholder */}
          <div className="max-w-4xl mx-auto text-center">
             <h3 className="text-2xl font-black mb-12 italic uppercase tracking-tighter">Frequent <span className="gradient-text">Questions</span></h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                {[
                  { q: "Can I upgrade mid-billing cycle?", a: "Yes, clients can upgrade their service plan anytime. The new perks manifest instantly." },
                  { q: "What is Express Delivery?", a: "Orders placed with Express are prioritized by our operations team for priority delivery." },
                  { q: "How are calls scheduled?", a: "You select a delivery window (Morning, Afternoon, Evening) and our agents coordinate the communication." },
                  { q: "What is the Cancellation policy?", a: "Unused calls roll over if cancelled 48h before the scheduled window." }
                ].map((item, i) => (
                  <div key={i} className="p-8 rounded-[32px] bg-foreground/5 border border-border hover:border-primary/20 transition-all">
                    <div className="font-black text-foreground mb-3 text-sm uppercase tracking-wide italic">{item.q}</div>
                    <p className="text-foreground/60 font-bold text-sm tracking-tight leading-relaxed">{item.a}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

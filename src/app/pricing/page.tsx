"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Sparkles, Star, Heart, ArrowRight, Check, MessageCircle, Crown, Info } from "lucide-react";
import Link from "next/link";
import { CALL_SERVICES, ICON_MAP } from "@/lib/pricing_config";

const categories = [
  {
    name: "Personal Connections",
    description: "One-off surprises to brighten someone's day.",
    services: [
      CALL_SERVICES.celebratory,
      CALL_SERVICES.appreciatory,
      CALL_SERVICES.apology,
      CALL_SERVICES.request,
      CALL_SERVICES.encouragement,
      CALL_SERVICES.shoot_your_shot,
      CALL_SERVICES.period_care,
      CALL_SERVICES.silent_vent
    ]
  },
  {
    name: "Ongoing Care",
    description: "Subscription-based services for consistent connection.",
    services: [
      CALL_SERVICES.royal_checkup,
      CALL_SERVICES.self_love,
      CALL_SERVICES.lullaby
    ]
  },
  {
    name: "Specialized & Business",
    description: "Premium media and corporate solutions.",
    services: [
      CALL_SERVICES.video_shoutout,
      CALL_SERVICES.company_calls
    ]
  }
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <Header />
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[40%] right-[10%] w-[30vw] h-[30vw] bg-secondary/10 blur-[100px] rounded-full" />
      </div>

      <section className="pt-24 sm:pt-32 md:pt-40 pb-12 sm:pb-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-24 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-border text-primary text-[10px] font-bold uppercase tracking-[0.4em] mb-8"
            >
              <Sparkles size={14} className="fill-current" />
              Service Catalog & Pricing
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-8xl font-medium mb-8 tracking-tight font-serif leading-none"
            >
              Transparent <span className="gradient-text italic">Pricing</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg sm:text-xl font-medium max-w-2xl mx-auto tracking-tight leading-relaxed"
            >
              No hidden fees. No complicated bundles. Just heartfelt connections delivered with professional care. Choose the service that fits your story.
            </motion.p>
          </div>

          {/* Pricing Categories */}
          <div className="space-y-32">
            {categories.map((cat, catIdx) => (
              <div key={cat.name} className="relative">
                <div className="mb-12">
                   <h2 className="text-3xl sm:text-5xl font-medium font-serif italic mb-4">{cat.name}</h2>
                   <p className="text-muted-foreground font-medium">{cat.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {cat.services.map((service, i) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="glass border border-border rounded-[48px] p-8 flex flex-col h-full group hover:border-primary/30 transition-all duration-500 hover:shadow-huge"
                    >
                      <div className="flex justify-between items-start mb-8">
                         <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                             {(() => { const Icon = ICON_MAP[service.icon] || Star; return <Icon size={24} />; })()}
                         </div>
                         <Link 
                           href={`/book?type=${service.id}`}
                           className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                         >
                            {service.basePrice > 0 ? `₦${service.basePrice.toLocaleString()}` : "Contract"}
                         </Link>
                      </div>

                      <h3 className="text-2xl font-bold mb-4 tracking-tight">{service.name}</h3>
                      <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8 flex-grow">
                        {service.description}
                      </p>

                      <Link href={`/book?type=${service.id}`} className="space-y-4 mb-8 block hover:bg-foreground/5 p-4 -mx-4 rounded-3xl transition-colors">
                         {service.tiers.map(tier => (
                            <div key={tier.variant} className="flex justify-between items-center text-xs font-bold border-b border-border/50 pb-3 last:border-0">
                               <span className="text-foreground/60 uppercase tracking-widest">{tier.label}</span>
                               <span className={tier.price === service.basePrice ? "text-primary" : "text-foreground"}>
                                  {tier.price > 0 ? `₦${tier.price.toLocaleString()}` : "Inquire"}
                               </span>
                            </div>
                         ))}
                      </Link>

                      <Link 
                        href={`/book?type=${service.id}`}
                        className="w-full py-5 gradient-bg rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-95 transition-all"
                      >
                        Book Service
                        <ArrowRight size={16} />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Corporate / Custom Tier */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 p-8 sm:p-12 md:p-16 rounded-[48px] sm:rounded-[64px] glass border border-border shadow-huge bg-background/40 flex flex-col lg:flex-row items-center justify-between gap-12 mb-16 sm:mb-24 relative overflow-hidden group"
          >
             <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full -mr-48 -mt-48 pointer-events-none group-hover:scale-110 transition-transform duration-[2s]" />
             
             <div className="relative z-10 text-center lg:text-left">
                 <div className="w-16 h-16 rounded-3xl bg-foreground/5 flex items-center justify-center mx-auto lg:mx-0 mb-8 text-primary shadow-xl">
                    <Heart size={32} />
                 </div>
                 <h2 className="text-4xl md:text-5xl font-medium mb-4 tracking-tight font-serif italic text-primary">Corporate <span className="gradient-text italic">Connections</span></h2>
                 <p className="text-muted-foreground font-medium text-lg max-w-xl tracking-tight leading-relaxed">Meaningful connection at scale. Celebrate your employees and partners with custom heartfelt experiences that reflect your brand&apos;s human side.</p>
             </div>

             <div className="relative z-10 w-full lg:w-auto">
                 <Link href="/corporate" className="w-full lg:w-auto px-12 py-6 bg-foreground text-background font-semibold rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-huge flex items-center justify-center gap-3 text-sm tracking-widest">
                    Create a Consultation
                    <ArrowRight size={20} />
                 </Link>
             </div>
          </motion.div>

          {/* Guarantee / Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
             {[
               { title: "No Surprises", desc: "The price you see is the price you pay. All taxes and platform fees included.", icon: <Info size={24} /> },
               { title: "Flexible Rescheduling", desc: "Life happens. Reschedule any one-off call with 24h notice at no cost.", icon: <Check size={24} /> },
               { title: "Safe & Secure", desc: "All transactions are processed through Paystack, ensuring 100% data security.", icon: <Crown size={24} /> }
             ].map((item, i) => (
                <div key={i} className="p-10 rounded-[40px] glass border border-border flex flex-col items-center text-center">
                   <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">{item.icon}</div>
                   <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                   <p className="text-muted-foreground text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
             ))}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}

"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubscriptionTiers from "@/components/SubscriptionTiers";
import { motion } from "framer-motion";
import { Sparkles, Heart, ArrowRight, Check, Crown, Info } from "lucide-react";
import Link from "next/link";



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

          {/* Subscription Plans */}
          <SubscriptionTiers />



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
              <Link href="/corporate" className="w-full lg:w-auto px-8 py-4 sm:px-12 sm:py-6 bg-foreground text-background font-semibold rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-huge flex items-center justify-center gap-3 text-sm tracking-widest">
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
              <div key={i} className="p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] glass border border-border flex flex-col items-center text-center">
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

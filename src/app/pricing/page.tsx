"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubscriptionTiers from "@/components/SubscriptionTiers";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Check, PhoneCall, FileText, Info, Shield, AlertCircle } from "lucide-react";
import Link from "next/link";

const oneOffCalls = [
  { name: "Celebratory Call", desc: "Birthdays, milestones, achievements", from: 3500 },
  { name: "Apology Call", desc: "Heartfelt reconciliation delivered by a Thriller", from: 4000 },
  { name: "Affirmation Call", desc: "Midday pick-me-up and encouragement", from: 3000 },
  { name: "Period Care Call", desc: "Comfort and warmth when she needs it most", from: 3500 },
  { name: "Prank Call", desc: "Light-hearted fun & laughter", from: 2500 },
  { name: "Music Thrill", desc: "Personalized song delivery experience", from: 3000 },
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
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-border text-primary text-[10px] font-bold tracking-[0.4em] mb-8"
            >
              <Sparkles size={14} className="fill-current" />
              Plans & Pricing
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-8xl font-medium mb-8 tracking-tight font-serif leading-none"
            >
              Choose Your <span className="gradient-text">Buzzthrills</span> Plan
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg sm:text-xl font-medium max-w-2xl mx-auto tracking-tight leading-relaxed"
            >
              Transparent Pricing. No hidden fees. No complicated bundles. Just pure human connection handled with absolute excellence. Choose the subscription that fits your story.
            </motion.p>
          </div>

          {/* Subscription Plans */}
          <SubscriptionTiers />

          {/* One-off Calls */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24 mb-16"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-border text-primary text-[10px] font-bold tracking-[0.4em] mb-8">
                <PhoneCall size={14} />
                Pay-As-You-Go
              </div>
              <h2 className="text-3xl sm:text-5xl font-medium font-serif tracking-tight leading-none mb-4">
                One-off <span className="gradient-text">Call Options</span>
              </h2>
              <p className="text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed">
                No commitment needed. Book a single heartfelt call for any occasion, any time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {oneOffCalls.map((call, i) => (
                <motion.div
                  key={call.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-6 sm:p-8 rounded-[28px] glass border border-border bg-background/40 hover:border-primary/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <PhoneCall size={20} />
                  </div>
                  <h3 className="font-black text-lg tracking-tight mb-1">{call.name}</h3>
                  <p className="text-sm text-muted-foreground font-medium mb-4 leading-relaxed">{call.desc}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black gradient-text tracking-tighter">₦{call.from.toLocaleString()}</span>
                    <span className="text-[10px] font-black text-muted-foreground tracking-widest">from</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/book"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-3xl gradient-bg text-white font-bold text-base sm:text-xl hover:scale-105 active:scale-95 transition-all shadow-huge"
              >
                Book a One-off Call
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>

          {/* Digital Letters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 mb-16 p-8 sm:p-12 md:p-16 rounded-[48px] sm:rounded-[64px] glass border border-border shadow-huge bg-background/40 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 blur-[100px] rounded-full -mr-48 -mt-48 pointer-events-none group-hover:scale-110 transition-transform duration-[2s]" />

            <div className="relative z-10 text-center lg:text-left">
              <div className="w-16 h-16 rounded-3xl bg-accent/10 text-accent flex items-center justify-center mx-auto lg:mx-0 mb-8 shadow-xl">
                <FileText size={32} />
              </div>
              <h2 className="text-4xl md:text-5xl font-medium mb-4 tracking-tight font-serif">
                Premium <span className="gradient-text">Digital Letters</span>
              </h2>
              <p className="text-muted-foreground font-medium text-lg max-w-xl tracking-tight leading-relaxed">
                Beautifully formatted, emotionally resonant digital scrolls with optional voice narration. Available as a standalone purchase or as part of any subscription plan.
              </p>
              <ul className="mt-6 space-y-2">
                {["Animated scroll with your heartfelt words", "Optional professional voice narration", "Permanent shareable QR code link", "WhatsApp/Email instant delivery"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <Check size={14} className="text-primary shrink-0" />
                    <span className="text-foreground/70 font-medium">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative z-10 w-full lg:w-auto">
              <Link
                href="/digital-letters"
                className="w-full lg:w-auto px-8 py-4 sm:px-12 sm:py-6 bg-foreground text-background font-semibold rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-huge flex items-center justify-center gap-3 text-sm tracking-widest"
              >
                Create a Digital Letter
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>



          {/* Guarantee / Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { title: "No Surprises", desc: "The price you see is the price you pay. All taxes and platform fees included.", icon: <Info size={24} /> },
              { title: "Flexible Rescheduling", desc: "Life happens. Reschedule any one-off call with 24h notice at no cost.", icon: <Check size={24} /> },
              { title: "Safe & Secure", desc: "All transactions are processed through Paystack, ensuring 100% data security.", icon: <Shield size={24} /> },
            ].map((item, i) => (
              <div key={i} className="p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] glass border border-border flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">{item.icon}</div>
                <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Refund Policy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24 p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-amber-500/20 bg-amber-500/5 flex items-start gap-4"
          >
            <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-black text-sm tracking-widest text-amber-600 mb-2">Refund Policy</div>
              <p className="text-foreground/70 font-medium text-sm leading-relaxed">
                Due to the live, human-led nature of our services, <strong>full refunds are not provided</strong> if a recipient is unavailable or does not answer. In these instances, we issue a <strong>partial refund of up to 60%</strong>. Refunds are only applicable where the fault does not originate from the client&apos;s end.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      <Footer />
    </main>
  );
}

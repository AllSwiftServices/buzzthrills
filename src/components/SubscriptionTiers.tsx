"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { PLAN_LIST, PLAN_ICONS, type BillingCycle } from "@/lib/plans";
import { useAuth } from "@/context/AuthContext";

export default function SubscriptionTiers() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlan() {
      if (!user) return;
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.subscription?.status === "active") {
            setCurrentPlan(data.subscription.plan.toLowerCase());
          }
        }
      } catch (e) {
        console.error("Failed to fetch plan status", e);
      }
    }
    fetchPlan();
  }, [user]);

  const tieredPlans = PLAN_LIST.filter((p) => !p.isCustom);
  const corporate = PLAN_LIST.find((p) => p.isCustom);

  return (
    <section className="mb-32">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-border text-primary text-[10px] font-bold uppercase tracking-[0.4em] mb-8"
        >
          <Sparkles size={14} className="fill-current" />
          Monthly Subscriptions
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-medium mb-6 tracking-tight font-serif leading-none"
        >
          Choose Your <span className="gradient-text italic">Buzzthrills</span> Plan
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-base sm:text-lg font-medium max-w-2xl mx-auto tracking-tight leading-relaxed"
        >
          A bundle of heartfelt calls every month. Premium add-ons like prank and music thrills are included on every plan.
        </motion.p>

        <div className="inline-flex items-center gap-1 p-1 rounded-full glass border border-border mt-10">
          {(["monthly", "annual"] as BillingCycle[]).map((c) => (
            <button
              key={c}
              onClick={() => setCycle(c)}
              className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                cycle === c
                  ? "gradient-bg text-white shadow-xl shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c === "monthly" ? "Monthly" : "Annual · Save 5%"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {tieredPlans.map((plan, i) => {
          const Icon = PLAN_ICONS[plan.iconName];
          const price = cycle === "annual" ? plan.annualPrice : plan.monthlyPrice;
          const isCurrentPlan = currentPlan === plan.id;
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative glass border rounded-[40px] p-8 flex flex-col h-full transition-all duration-500 ${
                plan.popular && !isCurrentPlan
                  ? "border-primary/60 shadow-huge shadow-primary/10 md:scale-[1.03]"
                  : "border-border hover:border-primary/30 hover:shadow-huge"
              } ${isCurrentPlan ? "border-primary ring-2 ring-primary/50" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-bg px-4 py-1.5 rounded-full text-[9px] font-black text-white uppercase tracking-[0.2em] shadow-lg shadow-primary/20">
                  Most Popular
                </div>
              )}
              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg">
                  Current Plan
                </div>
              )}

              <div className="flex items-center gap-4 mb-6 mt-2">
                <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center text-primary">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight italic">{plan.name}</h3>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">
                    {plan.totalCalls} calls / month
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8">
                {plan.tagline}
              </p>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black gradient-text tracking-tighter">
                    ₦{price.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    / month
                  </span>
                </div>
                {cycle === "annual" && (
                  <p className="text-[9px] font-black text-green-500 uppercase tracking-widest mt-2">
                    Billed ₦{(price * 12).toLocaleString()} yearly · 5% saved ✨
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-10 flex-grow">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check size={16} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/80 font-medium leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>

              {isCurrentPlan ? (
                <div
                  className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all bg-green-500/10 text-green-500 cursor-default"
                >
                  <Check size={16} />
                  Active Plan
                </div>
              ) : (
                <Link
                  href={`/checkout?plan=${plan.id}&cycle=${cycle}`}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 ${
                    plan.popular
                      ? "gradient-bg text-white shadow-xl shadow-primary/20"
                      : "bg-foreground text-background"
                  }`}
                >
                  Choose {plan.name.replace("Buzz ", "")}
                  <ArrowRight size={16} />
                </Link>
              )}

              <p className="mt-6 text-[10px] font-bold text-muted-foreground italic text-center leading-relaxed">
                {plan.perfectFor}
              </p>
            </motion.div>
          );
        })}
      </div>

      {corporate && (() => {
        const Icon = PLAN_ICONS[corporate.iconName];
        const isCurrentPlan = currentPlan === corporate.id;
        return (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`p-8 sm:p-12 rounded-[40px] glass border bg-background/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative overflow-hidden ${
              isCurrentPlan ? "border-primary ring-2 ring-primary/50" : "border-border"
            }`}
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full -mr-48 -mt-48 pointer-events-none" />
            {isCurrentPlan && (
              <div className="absolute top-0 right-0 bg-green-500 text-white px-6 py-2 rounded-bl-3xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg z-20">
                Current Plan
              </div>
            )}
            <div className="relative z-10 flex-grow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight italic">{corporate.name}</h3>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">
                    Custom Pricing from ₦100,000 / month
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground font-medium text-base max-w-2xl tracking-tight leading-relaxed mb-6">
                {corporate.tagline}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {corporate.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check size={16} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/80 font-medium">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            {isCurrentPlan ? (
              <div
                className="shrink-0 px-10 py-5 font-black text-xs uppercase tracking-[0.2em] rounded-2xl flex items-center gap-3 relative z-10 bg-green-500/10 text-green-500 cursor-default"
              >
                <Check size={18} />
                Active Plan
              </div>
            ) : (
              <Link
                href="/corporate"
                className="shrink-0 px-10 py-5 bg-foreground text-background font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-huge flex items-center gap-3 relative z-10"
              >
                Talk to Sales
                <ArrowRight size={18} />
              </Link>
            )}
          </motion.div>
        );
      })()}
    </section>
  );
}

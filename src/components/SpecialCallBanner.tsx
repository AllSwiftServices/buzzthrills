"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

type SpecialCall = {
  id: string;
  title: string;
  description: string;
  occasion_emoji: string;
  price: number;
  currency: string;
  active: boolean;
  call_date: string | null;
};

export default function SpecialCallBanner() {
  const [specialCall, setSpecialCall] = useState<SpecialCall | null>(null);
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchSpecialCall() {
      try {
        const res = await fetch("/api/special-calls");
        if (!res.ok) return;
        const data = await res.json();
        if (data.specialCall) {
          setSpecialCall(data.specialCall);
          // Slight delay so the stagger reveal feels intentional
          setTimeout(() => setVisible(true), 100);
        }
      } catch {
        // Non-fatal — if API fails, banner simply won't render
      }
    }
    fetchSpecialCall();
  }, []);

  function handleClick() {
    if (!specialCall) return;
    const params = new URLSearchParams({
      specialCallId: specialCall.id,
      occasion: specialCall.title,
      price: String(specialCall.price),
    });
    router.push(`/book?${params.toString()}`);
  }

  if (!specialCall) return null;

  const formattedDate =
    specialCall.call_date
      ? new Date(specialCall.call_date + "T00:00:00").toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 32, scale: 0.97 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="py-6 px-6 relative z-20"
        >
          <div className="max-w-6xl mx-auto">
            <button
              onClick={handleClick}
              className="group w-full relative overflow-hidden rounded-[32px] sm:rounded-[48px] p-[2px] focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
              aria-label={`Book the ${specialCall.title} special call`}
            >
              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-[32px] sm:rounded-[48px] gradient-bg opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-[spin_6s_linear_infinite]" />
              <div className="absolute inset-0 rounded-[32px] sm:rounded-[48px] gradient-bg opacity-60 blur-xl group-hover:opacity-80 transition-all duration-700" />

              {/* Inner card */}
              <div className="relative rounded-[30px] sm:rounded-[46px] bg-background dark:bg-background overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/8 blur-[80px] rounded-full -mr-32 -mt-32 group-hover:bg-primary/15 transition-all duration-700 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/8 blur-[60px] rounded-full -ml-24 -mb-24 group-hover:bg-accent/15 transition-all duration-700 pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 p-6 sm:p-8 md:p-10">
                  {/* Emoji badge */}
                  <motion.div
                    animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-[24px] sm:rounded-[32px] bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 flex items-center justify-center text-4xl sm:text-5xl shadow-xl shrink-0 group-hover:scale-110 transition-transform duration-500"
                  >
                    {specialCall.occasion_emoji}
                  </motion.div>

                  {/* Text content */}
                  <div className="flex-1 text-center md:text-left">
                    {/* Badge row */}
                    <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start mb-3">
                      <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full gradient-bg text-white text-[9px] font-black tracking-[0.25em] shadow-lg shadow-primary/30">
                        <Sparkles size={10} className="fill-current" />
                        Special Occasion
                      </div>
                      {formattedDate && (
                        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 text-[9px] font-black tracking-widest text-foreground/60">
                          <Clock size={10} />
                          {formattedDate}
                        </div>
                      )}
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter mb-2 leading-tight">
                      {specialCall.title}
                    </h2>

                    {specialCall.description && (
                      <p className="text-muted-foreground font-medium text-sm sm:text-base font-serif leading-relaxed max-w-xl">
                        {specialCall.description}
                      </p>
                    )}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                    <div className="text-center md:text-right">
                      <div className="text-[9px] font-black tracking-widest text-foreground/30 mb-1">Fixed Price</div>
                      <div className="text-3xl sm:text-4xl font-black tracking-tighter gradient-text">
                        ₦{specialCall.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-3 px-7 py-3.5 rounded-2xl gradient-bg text-white font-black text-[10px] tracking-widest shadow-xl shadow-primary/30 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-primary/40 transition-all duration-300">
                      Book This Call
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

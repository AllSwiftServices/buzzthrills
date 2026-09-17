/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Clock, Check } from "lucide-react";
import { useRouter } from "next/navigation";

type PriceOption = {
  title: string;
  price: number;
};

type SpecialCall = {
  id: string;
  title: string;
  description: string;
  occasion_emoji: string;
  image_url?: string | null;
  price: number;
  currency: string;
  price_options?: PriceOption[] | null;
  active: boolean;
  call_date: string | null;
};

export default function SpecialCallBanner() {
  const [specialCall, setSpecialCall] = useState<SpecialCall | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchSpecialCall() {
      try {
        const res = await fetch("/api/special-calls");
        if (!res.ok) return;
        const data = await res.json();
        if (data.specialCall) {
          setSpecialCall(data.specialCall);
          setTimeout(() => {
            setVisible(true);

            // Check if user arrived via direct link (e.g. from WhatsApp, socials, or #special-calls)
            if (typeof window !== "undefined") {
              const checkAndScroll = () => {
                const hash = window.location.hash;
                const search = window.location.search;
                if (hash === "#special-calls" || search.includes("special")) {
                  setTimeout(() => {
                    const el = document.getElementById("special-calls");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "center" });
                      setHighlighted(true);
                      setTimeout(() => setHighlighted(false), 3500);
                    }
                  }, 250);
                }
              };

              checkAndScroll();
              window.addEventListener("hashchange", checkAndScroll);
              return () => window.removeEventListener("hashchange", checkAndScroll);
            }
          }, 100);
        }
      } catch {
        // Non-fatal — if API fails, banner simply won't render
      }
    }
    fetchSpecialCall();
  }, []);

  if (!specialCall) return null;

  const hasMultipleOptions =
    specialCall.price_options && Array.isArray(specialCall.price_options) && specialCall.price_options.length > 0;

  const currentOption =
    hasMultipleOptions && specialCall.price_options![selectedOptionIndex]
      ? specialCall.price_options![selectedOptionIndex]
      : { title: specialCall.title, price: specialCall.price };

  function handleBook(optIndex?: number) {
    if (!specialCall) return;
    const idx = optIndex !== undefined ? optIndex : selectedOptionIndex;
    const chosen =
      hasMultipleOptions && specialCall.price_options![idx]
        ? specialCall.price_options![idx]
        : { title: specialCall.title, price: specialCall.price };

    const params = new URLSearchParams({
      specialCallId: specialCall.id,
      occasion: specialCall.title,
      price: String(chosen.price),
      package: chosen.title,
    });
    router.push(`/book?${params.toString()}`);
  }

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
          id="special-calls"
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 32, scale: 0.97 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="py-6 px-6 relative z-20 scroll-mt-24"
        >
          <div className="max-w-6xl mx-auto">
            <div
              className={`group w-full relative overflow-hidden rounded-[32px] sm:rounded-[48px] p-[2px] focus:outline-none transition-all duration-700 ${
                highlighted ? "ring-4 ring-primary ring-offset-4 ring-offset-background scale-[1.015] shadow-2xl shadow-primary/30" : ""
              }`}
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
                  {/* Visual: Flyer Image or Emoji badge */}
                  {specialCall.image_url ? (
                    <div className="relative shrink-0 group-hover:scale-105 transition-transform duration-500">
                      <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-[24px] sm:rounded-[32px] overflow-hidden border border-primary/25 bg-foreground/5 shadow-2xl relative">
                        <img
                          src={specialCall.image_url}
                          alt={specialCall.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {specialCall.occasion_emoji && (
                        <div className="absolute -bottom-2 -right-2 w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-background/90 backdrop-blur-md border border-primary/30 flex items-center justify-center text-lg sm:text-xl shadow-xl">
                          {specialCall.occasion_emoji}
                        </div>
                      )}
                    </div>
                  ) : (
                    <motion.div
                      animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-[24px] sm:rounded-[32px] bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 flex items-center justify-center text-4xl sm:text-5xl shadow-xl shrink-0 group-hover:scale-110 transition-transform duration-500"
                    >
                      {specialCall.occasion_emoji}
                    </motion.div>
                  )}

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

                    {/* 3 Price Options Chooser */}
                    {hasMultipleOptions && (
                      <div className="mt-5 pt-4 border-t border-foreground/10">
                        <div className="text-[9px] font-black tracking-widest uppercase text-foreground/40 mb-2.5 flex items-center gap-1.5 justify-center md:justify-start">
                          <Sparkles size={11} className="text-primary" />
                          <span>Choose Package:</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {specialCall.price_options!.map((opt, oIdx) => {
                            const isSelected = selectedOptionIndex === oIdx;
                            return (
                              <button
                                type="button"
                                key={oIdx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOptionIndex(oIdx);
                                }}
                                className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between gap-1 relative overflow-hidden focus:outline-none ${
                                  isSelected
                                    ? "bg-primary/15 border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                                    : "bg-foreground/[0.03] border-foreground/10 hover:border-primary/40 hover:bg-foreground/[0.06]"
                                }`}
                              >
                                {isSelected && (
                                  <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full gradient-bg flex items-center justify-center">
                                    <Check size={10} className="text-white" strokeWidth={3} />
                                  </div>
                                )}
                                <div className="text-[11px] font-black tracking-tight text-foreground line-clamp-1 pr-4">
                                  {opt.title}
                                </div>
                                <div className="text-base sm:text-lg font-black gradient-text tracking-tighter">
                                  ₦{opt.price.toLocaleString()}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                    <div className="text-center md:text-right">
                      <div className="text-[9px] font-black tracking-widest text-foreground/30 mb-1">
                        {hasMultipleOptions ? "Selected Package" : "Fixed Price"}
                      </div>
                      <div className="text-3xl sm:text-4xl font-black tracking-tighter gradient-text">
                        ₦{currentOption.price.toLocaleString()}
                      </div>
                      {hasMultipleOptions && (
                        <div className="text-[10px] font-bold text-foreground/50 max-w-[180px] truncate mt-0.5">
                          {currentOption.title}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleBook()}
                      className="inline-flex items-center gap-3 px-7 py-3.5 rounded-2xl gradient-bg text-white font-black text-[10px] tracking-widest shadow-xl shadow-primary/30 hover:scale-105 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
                    >
                      Book This Call
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

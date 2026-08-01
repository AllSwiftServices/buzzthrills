"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, ArrowRight, Download, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

type BookingSummary = {
  reference: string;
  isSubscription: boolean;
  serviceName: string;
  variantLabel: string;
  amount: number;
  remaining?: number;
  isExpress?: boolean;
  isInternational?: boolean;
  recipients?: Array<{ name: string; phone: string; occasion: string; date: string; time: string }>;
  createdAt?: string;
};

export default function CheckoutSuccess() {
  const [summary, setSummary] = useState<BookingSummary | null>(null);
  const [fallbackRef, setFallbackRef] = useState("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("buzzthrills:lastBooking");
      if (raw) {
        setSummary(JSON.parse(raw) as BookingSummary);
      } else {
        setFallbackRef(`BZ-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
      }
    } catch {
      setFallbackRef(`BZ-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
    }

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00FF88', '#00E0FF', '#7000FF'],
    });
  }, []);

  const reference = summary?.reference || fallbackRef;
  const handleDownloadReceipt = () => {
    window.print();
  };

  const formatDate = (iso?: string) => {
    if (!iso) return new Date().toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" });
    try {
      return new Date(iso).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" });
    } catch {
      return iso;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 bg-[url('/grid.svg')] bg-center">
      <div className="absolute inset-x-0 h-px w-full bg-linear-to-r from-transparent via-primary/50 to-transparent top-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl glass p-8 md:p-14 rounded-[40px] md:rounded-[64px] border border-border shadow-huge text-center relative overflow-hidden print:hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32" />

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, delay: 0.2 }}
            className="w-16 h-16 md:w-20 md:h-20 rounded-[24px] md:rounded-[32px] bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-2xl shadow-green-500/20"
          >
            <CheckCircle2 size={32} className="text-green-500 md:w-10 md:h-10" />
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-medium mb-4 tracking-tight font-serif italic leading-none">
            Booking <br className="xs:hidden" />
            <span className="gradient-text italic">Confirmed.</span>
          </h1>
          <p className="text-muted-foreground font-medium italic font-serif text-base md:text-lg mb-8 md:mb-12 max-w-sm mx-auto leading-relaxed">
            We&apos;ve got it from here — your surprise is being prepared with love.
          </p>

          <div className="grid grid-cols-1 gap-3 mb-10 md:mb-12">
            <div className="p-6 md:p-8 rounded-[24px] md:rounded-[32px] bg-primary/[0.08] border border-primary/20 text-left group hover:border-primary/40 transition-all shadow-xl shadow-primary/5">
              <div className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 md:mb-2">Reference</div>
              <div className="font-black text-xl md:text-2xl font-mono text-primary group-hover:scale-105 transition-transform origin-left tracking-tight">{reference}</div>
            </div>
            <div className="p-6 md:p-8 rounded-[24px] md:rounded-[32px] bg-secondary/[0.08] border border-secondary/20 text-left group hover:border-secondary/40 transition-all shadow-xl shadow-secondary/5">
              <div className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 md:mb-2">Status</div>
              <div className="font-black text-lg md:text-xl flex items-center gap-2 group-hover:translate-x-2 transition-transform text-secondary">
                <Zap size={18} className="fill-current animate-pulse text-amber-400" />
                Preparing Your Surprise
              </div>
            </div>
            {summary && (
              <div className="p-6 md:p-8 rounded-[24px] md:rounded-[32px] bg-foreground/[0.04] border border-border text-left">
                <div className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Summary</div>
                <div className="space-y-1.5 text-sm font-bold">
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Service</span>
                    <span className="text-right">{summary.serviceName}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Package</span>
                    <span className="text-right">{summary.variantLabel}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Recipients</span>
                    <span className="text-right">{summary.recipients?.length ?? 1}</span>
                  </div>
                  <div className="flex justify-between gap-3 pt-2 border-t border-border mt-2">
                    <span className="text-muted-foreground">{summary.isSubscription ? "Charged" : "Paid"}</span>
                    <span className="text-right text-primary">
                      {summary.isSubscription
                        ? "Deducted from subscription"
                        : `₦${summary.amount.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 md:gap-4 justify-center">
            <Link
              href="/profile"
              className="px-8 py-5 md:px-10 md:py-6 rounded-2xl md:rounded-[32px] bg-primary text-white font-black text-xs md:text-sm uppercase tracking-[0.2em] shadow-[0_15px_40px_rgba(var(--primary-rgb),0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10">View My Bookings</span>
              <ArrowRight size={18} className="relative z-10 md:w-5 md:h-5" />
            </Link>
            <button
              onClick={handleDownloadReceipt}
              className="px-8 py-5 md:px-10 md:py-6 rounded-2xl md:rounded-[32px] glass border border-border text-foreground font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-foreground/5 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <Download size={18} className="md:w-5 md:h-5" />
              Download Receipt
            </button>
          </div>

          <div className="mt-10 md:mt-12 pt-10 md:pt-12 border-t border-border flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em]">
              <ShieldCheck size={14} />
              Secured End-to-End
            </div>
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Print-only receipt */}
      <div className="hidden print:block print:fixed print:inset-0 print:bg-white print:text-black print:p-12 print:font-sans">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-8">
            <div>
              <div className="text-3xl font-black">Buzzthrills</div>
              <div className="text-xs uppercase tracking-widest text-neutral-500 mt-1">Booking Receipt</div>
            </div>
            <div className="text-right text-xs">
              <div className="font-bold">{formatDate(summary?.createdAt)}</div>
              <div className="text-neutral-500">Ref: {reference}</div>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4">Booking Details</h2>
          <table className="w-full text-sm mb-8">
            <tbody>
              <tr className="border-b border-neutral-200">
                <td className="py-2 text-neutral-500">Service</td>
                <td className="py-2 text-right font-bold">{summary?.serviceName ?? "—"}</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="py-2 text-neutral-500">Package</td>
                <td className="py-2 text-right font-bold">{summary?.variantLabel ?? "—"}</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="py-2 text-neutral-500">Express Delivery</td>
                <td className="py-2 text-right font-bold">{summary?.isExpress ? "Yes" : "No"}</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="py-2 text-neutral-500">International Recipient</td>
                <td className="py-2 text-right font-bold">{summary?.isInternational ? "Yes" : "No"}</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="py-2 text-neutral-500">Recipients</td>
                <td className="py-2 text-right font-bold">{summary?.recipients?.length ?? 1}</td>
              </tr>
            </tbody>
          </table>

          {summary?.recipients && summary.recipients.length > 0 && (
            <>
              <h2 className="text-xl font-bold mb-4">Recipients</h2>
              <table className="w-full text-sm mb-8 border border-neutral-200">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="text-left p-2 font-bold">Name</th>
                    <th className="text-left p-2 font-bold">Phone</th>
                    <th className="text-left p-2 font-bold">Occasion</th>
                    <th className="text-left p-2 font-bold">Date</th>
                    <th className="text-left p-2 font-bold">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.recipients.map((r, i) => (
                    <tr key={i} className="border-t border-neutral-200">
                      <td className="p-2">{r.name}</td>
                      <td className="p-2">{r.phone}</td>
                      <td className="p-2">{r.occasion}</td>
                      <td className="p-2">{r.date}</td>
                      <td className="p-2 capitalize">{r.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          <h2 className="text-xl font-bold mb-4">Payment</h2>
          <table className="w-full text-sm mb-8">
            <tbody>
              {summary?.isSubscription ? (
                <tr className="border-b-2 border-black">
                  <td className="py-3 font-bold">Charged</td>
                  <td className="py-3 text-right font-bold">Deducted from active subscription</td>
                </tr>
              ) : (
                <tr className="border-b-2 border-black">
                  <td className="py-3 font-bold">Total Paid</td>
                  <td className="py-3 text-right font-bold">₦{(summary?.amount ?? 0).toLocaleString()}</td>
                </tr>
              )}
            </tbody>
          </table>

          <p className="text-xs text-neutral-500 mt-12">
            Thank you for booking with Buzzthrills. For questions about this receipt, contact us at hello@buzzthrillsprime.com.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mail, ShieldCheck, ArrowRight, Zap, CheckCircle2, Loader2, Sparkles, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after 10 seconds of platform exploration
    const timer = setTimeout(() => setIsVisible(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email, is_active: true }]);

    if (error && error.code !== '23505') { // Ignore unique constraint errors
       setStatus("error");
    } else {
       setStatus("success");
       // Track conversion logic here (e.g., Pixel/GA4)
       console.log("Superhero joined the squad!", { email, source: "homepage_popup" });
       setTimeout(() => setIsVisible(false), 3000);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl">
             <motion.div
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="w-full max-w-lg glass p-10 md:p-14 rounded-[56px] border border-border shadow-huge relative overflow-hidden text-center"
             >
                <button 
                  onClick={() => setIsVisible(false)}
                  className="absolute top-8 right-8 text-foreground/20 hover:text-foreground transition-all p-2 rounded-xl"
                >
                  <X size={20} />
                </button>

                <div className="absolute top-0 left-0 w-full h-2 gradient-bg opacity-40 shadow-huge animate-pulse" />
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
                
                <div className="relative z-10">
                   <div className="w-20 h-20 rounded-[32px] bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-primary/10">
                      <Sparkles size={36} className="text-primary animate-pulse" />
                   </div>

                   <h3 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter leading-none">
                      Join the <span className="gradient-text">Squad.</span>
                   </h3>
                   <p className="text-muted-foreground font-bold tracking-tight mb-12 text-lg leading-relaxed">
                      Get early access to holiday deals, tactical mission flyers, and community-exclusive discounts.
                   </p>

                   {status === "success" ? (
                     <motion.div 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="p-8 rounded-[32px] bg-green-500/10 border border-green-500/20 text-green-500 flex flex-col items-center gap-4 shadow-xl"
                     >
                        <CheckCircle2 size={40} className="animate-bounce" />
                        <div className="font-black text-xl italic">Identity Verified. Welcome Home.</div>
                     </motion.div>
                   ) : (
                     <form onSubmit={handleJoin} className="space-y-6">
                        <div className="relative group">
                           <Mail size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                           <input 
                             type="email"
                             required
                             value={email}
                             onChange={(e) => setEmail(e.target.value)}
                             placeholder="Your superhero email..."
                             className="w-full bg-foreground/5 border border-border rounded-[28px] py-6 pl-16 pr-8 focus:border-primary transition-all shadow-xl font-bold outline-none"
                           />
                        </div>
                        <button 
                          disabled={status === "loading"}
                          className="w-full py-6 rounded-[32px] gradient-bg text-white font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                          {status === "loading" ? <Loader2 size={24} className="animate-spin text-white" /> : (
                            <>
                              Claim Early Access
                              <ArrowRight size={20} />
                            </>
                          )}
                        </button>
                     </form>
                   )}

                   <div className="mt-12 flex items-center justify-center gap-4 text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em] whitespace-nowrap">
                      <ShieldCheck size={14} />
                      Tactical Encryption Active
                      <div className="flex gap-1.5 ml-2">
                         {[1, 2, 3].map(i => (
                            <div key={i} className="w-1 h-1 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                         ))}
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Static Section Version (Non-Popup) */}
      <section className="py-24 max-w-6xl mx-auto px-6">
         <div className="p-12 md:p-20 rounded-[64px] glass border border-border shadow-huge relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 bg-background/40 group hover:border-primary/20 transition-all">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-48 -mt-48" />
            
            <div className="max-w-xl relative z-10 text-center md:text-left">
               <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6">
                  Ready to <span className="gradient-text tracking-tighter">Initiate?</span>
               </h3>
               <p className="text-muted-foreground font-bold text-xl tracking-tight leading-relaxed">
                  Join 12,000+ superheroes receiving mission updates, early deals, and high-fidelity thrill reports.
               </p>
            </div>

            <div className="w-full max-w-sm relative z-10">
               <form onSubmit={handleJoin} className="space-y-4">
                  <div className="relative group">
                     <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                     <input 
                       type="email"
                       required
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       placeholder="hero@buzzthrills.com"
                       className="w-full bg-foreground/5 border border-border rounded-[24px] py-5 pl-14 pr-6 focus:border-primary transition-all outline-none font-bold"
                     />
                  </div>
                  <button 
                    disabled={status === "loading"}
                    className="w-full py-5 rounded-[24px] gradient-bg text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    Initiate Access
                    <Zap size={16} />
                  </button>
               </form>
                <div className="mt-4 text-[10px] font-black text-foreground/20 uppercase tracking-widest text-center">No Spam. Pure Thrill.</div>
            </div>
         </div>
      </section>
    </>
  );
}

"use client";

import { motion } from "framer-motion";
import { Mail, Heart, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email, is_active: true }]);

    if (error && error.code !== '23505') {
       setStatus("error");
    } else {
       setStatus("success");
    }
  };

  return (
    <>
      <section className="py-24 max-w-6xl mx-auto px-6">
         <div className="p-7 sm:p-12 md:p-20 rounded-[32px] sm:rounded-[64px] glass border border-border shadow-huge relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12 bg-background/40 group hover:border-primary/20 transition-all">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-48 -mt-48" />
            
            <div className="max-w-xl relative z-10 text-center md:text-left">
               <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6">
                  Join the <span className="gradient-text tracking-tighter">Superheroes.</span>
               </h3>
               <p className="text-muted-foreground font-bold text-xl tracking-tight leading-relaxed">
                  Never miss a moment worth celebrating. Enjoy timely reminders, heartfelt stories, exclusive community perks, and member-only surprises.
               </p>
            </div>

            <div className="w-full max-w-sm relative z-10">
               {status === "success" ? (
                 <motion.div
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="p-6 rounded-[24px] bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center gap-3 font-black text-sm"
                 >
                    <CheckCircle2 size={22} />
                    You're on the list!
                 </motion.div>
               ) : (
                 <form onSubmit={handleJoin} className="space-y-4">
                    {status === "error" && (
                      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3 text-sm font-bold">
                        <AlertCircle size={16} className="shrink-0" />
                        Something went wrong. Please try again.
                      </div>
                    )}
                    <div className="relative group">
                       <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                       <input
                         type="email"
                         required
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         placeholder="your@email.com"
                         className="w-full bg-foreground/5 border border-border rounded-[24px] py-5 pl-14 pr-6 focus:border-primary transition-all outline-none font-bold"
                       />
                    </div>
                    <button
                      disabled={status === "loading"}
                      className="w-full py-5 rounded-[24px] gradient-bg text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {status === "loading" ? <Loader2 size={18} className="animate-spin" /> : (
                        <>
                          Join our Community
                          <Heart size={16} />
                        </>
                      )}
                    </button>
                 </form>
               )}
                <div className="mt-4 text-[10px] font-black text-foreground/20 uppercase tracking-widest text-center">No Spam. Pure Care.</div>
            </div>
         </div>
      </section>
    </>
  );
}

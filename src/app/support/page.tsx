"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import { HelpCircle, Mail, MessageSquare, Phone, Plus, Minus, Send, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    category: "General",
    questions: [
      { q: "What is BuzzThrills?", a: "BuzzThrills is a premium surprise service that sends emotional calls, messages, and digital products to your loved ones on your behalf." },
      { q: "Is it a recording or a real person?", a: "For our 'Surprise Calls', a real human Superhero host makes the call to ensure a genuine emotional connection." },
      { q: "Can I schedule calls in advance?", a: "Yes, you can schedule calls months in advance using our dashboard." }
    ]
  },
  {
    category: "Pricing & Plans",
    questions: [
      { q: "Do you offer refunds?", a: "We offer full refunds if a call is not initiated within your chosen time slot." },
      { q: "Can I upgrade my plan later?", a: "Absolutely! You can upgrade your Buzz Plan at any time from your profile." }
    ]
  }
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<string | null>("General-0");

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 font-outfit pb-20">
      <Header />
      
      {/* Hero */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">
              How Can We <br />
              <span className="gradient-text">Help You</span>?
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Direct WhatsApp", value: "+234 800 BUZZ", icon: <MessageSquare className="text-green-500" /> },
            { title: "Email Support", value: "hello@buzzthrillsprime.com", icon: <Mail className="text-primary" /> },
            { title: "Voice Support", value: "Available 24/7", icon: <Phone className="text-accent" /> }
          ].map((opt, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="p-8 rounded-[32px] glass border border-border flex flex-col items-center text-center hover:scale-105 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center mb-6 shadow-inner">
                  {opt.icon}
                </div>
                <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">{opt.title}</div>
                <div className="font-bold text-lg">{opt.value}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQs & Contact Form */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* FAQ Column */}
          <div>
            <Reveal direction="left">
              <h2 className="text-3xl font-black mb-12 flex items-center gap-3">
                <HelpCircle size={32} className="text-primary" />
                Frequently Asked <span className="gradient-text">Questions</span>
              </h2>
              
              <div className="space-y-12">
                {faqs.map((cat, catIdx) => (
                  <div key={catIdx}>
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6 pl-4 border-l-2 border-primary">
                      {cat.category}
                    </div>
                    <div className="space-y-4">
                      {cat.questions.map((faq, faqIdx) => {
                        const id = `${cat.category}-${faqIdx}`;
                        const isOpen = openIndex === id;
                        return (
                          <div key={id} className="rounded-3xl border border-border overflow-hidden">
                            <button 
                              onClick={() => setOpenIndex(isOpen ? null : id)}
                              className="w-full p-6 flex justify-between items-center text-left hover:bg-foreground/5 transition-colors"
                            >
                              <span className="font-bold">{faq.q}</span>
                              <div className="text-primary">
                                {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                              </div>
                            </button>
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <div className="p-6 pt-0 text-muted-foreground text-sm leading-relaxed border-t border-border/10">
                                    {faq.a}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                         );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Contact Form Column */}
          <div>
            <Reveal direction="right">
              <div className="p-10 rounded-[40px] glass border border-border shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                <h3 className="text-2xl font-black mb-2 relative z-10">Send us a <span className="gradient-text">Message</span></h3>
                <p className="text-muted-foreground mb-8 text-sm relative z-10">Our Superheroes respond faster than a speeding bullet.</p>
                
                <form className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" placeholder="Your Name" className="w-full bg-foreground/5 border border-border rounded-2xl p-4 outline-none focus:border-primary transition-all" />
                    <input type="email" placeholder="Email Address" className="w-full bg-foreground/5 border border-border rounded-2xl p-4 outline-none focus:border-primary transition-all" />
                  </div>
                  <input type="text" placeholder="Subject" className="w-full bg-foreground/5 border border-border rounded-2xl p-4 outline-none focus:border-primary transition-all" />
                  <textarea rows={5} placeholder="How can we help?" className="w-full bg-foreground/5 border border-border rounded-2xl p-4 outline-none focus:border-primary transition-all resize-none" />
                  <button className="w-full py-5 rounded-2xl gradient-bg text-white font-black text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                    Send Message
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}

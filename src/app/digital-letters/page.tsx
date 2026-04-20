"use client";

import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import { Mail, Volume2, QrCode, Share2, Heart, Star, Sparkles, Send, Zap, MessageSquareQuote } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DigitalLettersPage() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 font-outfit pb-20 overflow-hidden">
      <Header />
      
      {/* Hero */}
      <section className="pt-32 sm:pt-40 pb-12 sm:pb-24 px-6 relative">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent/10 blur-[120px] rounded-full gpu-accelerated opacity-40 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-accent/20 mb-8 text-[10px] font-bold text-accent uppercase tracking-[0.4em] italic">
              <Sparkles size={14} className="fill-current" />
              Digital Experience Artifacts
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-medium mb-8 tracking-tight font-serif leading-none">
              Words That <br className="hidden sm:block" />
              <span className="gradient-text italic">Live Forever</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto mb-12 font-serif italic text-xl">
              The modern way to say something timeless. Combine beautiful typography, animated scroll technology, and personal voice recordings into a single digital artifact.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/book" className="px-12 py-6 rounded-3xl gradient-bg text-white font-bold text-xl hover:scale-105 transition-all shadow-huge flex items-center justify-center gap-3 active:scale-95">
                Create an Artifact
                <Send size={24} />
              </Link>
              <Link href="#preview" className="px-12 py-6 rounded-3xl glass font-bold text-xl hover:bg-foreground/5 transition-all border border-border flex items-center justify-center active:scale-95 gap-2 group">
                Watch Demo
                <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                   <Share2 size={20} />
                </motion.div>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Animated Scroll", desc: "A narrative experience that reveals your message bit-by-bit, building emotional anticipation.", icon: <Sparkles size={24} /> },
            { title: "Voice Integration", desc: "Attach a professional or personal recorded message that plays as they journey through the letter.", icon: <Volume2 size={24} /> },
            { title: "Legacy Archiving", desc: "Every artifact is hosted on a permanent, private link. A timeless gift they can revisit for years.", icon: <QrCode size={24} /> }
          ].map((f, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="p-10 rounded-[48px] glass border border-border h-full flex flex-col items-start group hover:bg-background transition-all hover:border-primary/20 duration-500 hover:shadow-huge">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-lg">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">{f.title}</h3>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Preview Section */}
      <section id="preview" className="py-24 px-4 sm:px-6 relative z-10 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <Reveal direction="left">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full -z-10 animate-pulse" />
                <h2 className="text-4xl md:text-5xl font-medium mb-8 tracking-tight font-serif italic">Not Just a <span className="gradient-text italic">Message</span>. <br />A Digital Artifact.</h2>
                <p className="text-lg text-muted-foreground leading-relaxed font-serif italic mb-10">
                  Standard texts vanish in the noise. Our digital artifacts are built to be kept. Every letter is a handcrafted experience that the recipient can revisit whenever they need a reminder of how much they mean to you.
                </p>
                
                <div className="space-y-8 pt-10">
                  {[
                    { title: "Animated Reveal", desc: "Smooth CSS-driven scroll unrolling animation for that premium physical unboxing feel.", icon: <MessageSquareQuote className="text-primary" /> },
                    { title: "Emotional Voiceover", desc: "Embed professional narration or your own voice notes that sync with the reading experience.", icon: <Volume2 className="text-secondary" /> },
                    { title: "QR Card Support", desc: "Optional physical delivery of a collectible card that unlocks the digital experience.", icon: <Zap className="text-amber-400" /> }
                  ].map((feature, i) => (
                    <div key={i} className="flex gap-6 items-start group">
                      <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center shrink-0 border border-border group-hover:border-primary/20 transition-all duration-500 shadow-sm">
                        {feature.icon}
                      </div>
                      <div>
                        <div className="text-lg font-bold mb-1 tracking-tight">{feature.title}</div>
                        <div className="text-sm text-muted-foreground font-medium leading-relaxed">{feature.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal direction="right">
              <div className="relative p-2 glass border border-border rounded-[64px] shadow-huge overflow-hidden group bg-background/40">
                <div className="absolute inset-0 gradient-bg opacity-5 group-hover:opacity-10 transition-opacity duration-1000" />
                <div className="aspect-[3/4] rounded-[56px] bg-background/50 border border-border flex flex-col items-center justify-center p-12 text-center relative z-10">
                  <div className="w-24 h-24 bg-accent/20 backdrop-blur-xl rounded-full flex items-center justify-center mb-8 animate-bounce shadow-huge border border-white/30">
                    <Volume2 size={40} className="text-accent" />
                  </div>
                  <div className="text-2xl font-medium mb-4 font-serif italic tracking-tight">Artifact <span className="gradient-text italic">Demo</span></div>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed px-4">Interact with a sample artifact to feel the premium scroll and voice-over integration.</p>
                  <button className="mt-10 px-10 py-4 rounded-2xl glass font-bold text-xs uppercase tracking-widest border border-border hover:bg-foreground/5 transition-all active:scale-95 shadow-xl">
                    Launch Preview
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <Reveal>
          <div className="max-w-4xl mx-auto p-16 sm:p-24 rounded-[64px] glass border border-border shadow-huge relative overflow-hidden group">
            <div className="absolute inset-0 gradient-bg opacity-5 group-hover:opacity-10 transition-opacity duration-1000" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 blur-[100px] rounded-full -mr-48 -mb-48" />
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium mb-12 relative z-10 tracking-tight font-serif italic">Words Mean <br className="hidden sm:block" /><span className="gradient-text italic">Everything.</span></h2>
            <Link href="/book" className="inline-block px-12 py-6 gradient-bg text-white font-bold text-xl rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-huge relative z-10">
              Pick Your Theme
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

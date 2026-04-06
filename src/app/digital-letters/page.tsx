"use client";

import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import { Mail, Volume2, QrCode, Share2, Heart, Star, Sparkles, Send, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DigitalLettersPage() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 font-outfit pb-20">
      <Header />
      
      {/* Hero */}
      <section className="pt-32 sm:pt-40 pb-12 sm:pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent/10 blur-[120px] rounded-full gpu-accelerated opacity-40 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-accent/20 mb-6 sm:mb-8 text-[10px] sm:text-xs font-black text-accent uppercase tracking-widest italic">
              Digital Experience
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 sm:mb-8 tracking-tighter uppercase italic leading-none">
              Letters That <br className="hidden sm:block" />
              <span className="gradient-text italic">Come Alive</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-bold max-w-2xl mx-auto mb-8 sm:mb-12 tracking-tight leading-relaxed uppercase">
              The modern way to say something timeless. Combine beautiful typography, animated scroll technology, and personal voice recordings into a single digital gift.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/book?plan=digital-letter" className="px-8 sm:px-10 py-4 sm:py-5 rounded-3xl gradient-bg text-white font-black text-lg sm:text-xl hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95">
                Send a Letter Now
                <Send size={20} className="sm:size-6" />
              </Link>
              <Link href="#preview" className="px-8 sm:px-10 py-4 sm:py-5 rounded-3xl glass font-black text-lg sm:text-xl hover:bg-foreground/5 transition-all border border-border flex items-center justify-center active:scale-95">
                Watch Demo
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-12 sm:py-24 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            { title: "Animated Scroll", desc: "A narrative experience that reveals your message bit-by-bit.", icon: <Sparkles size={24} /> },
            { title: "Voice Integration", desc: "Attach a recorded message that plays as they read the letter.", icon: <Volume2 size={24} /> },
            { title: "QR Code Delivery", desc: "Surprise them with a physical card that leads to a digital masterpiece.", icon: <QrCode size={24} /> }
          ].map((f, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="p-8 rounded-[40px] glass border border-border h-full flex flex-col items-start group hover:bg-background transition-all hover:border-primary/20">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-black italic uppercase tracking-tighter mb-4">{f.title}</h3>
                <p className="text-muted-foreground font-semibold text-sm leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Preview Section */}
      <section id="preview" className="py-12 sm:py-24 px-4 sm:px-6 relative z-10 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-center">
            <Reveal direction="left">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-[80px] sm:blur-[120px] rounded-full -z-10 animate-pulse" />
                <h2 className="text-3xl sm:text-4xl font-black mb-6 sm:mb-8 tracking-tighter uppercase italic">Not Just a <span className="gradient-text italic">Message</span>. <br />An Artifact.</h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-bold tracking-tight">
                  Standard messages vanish. Our digital letters are built to be kept. Every letter is hosted on a unique, permanent link that the recipient can revisit whenever they need a reminder of how much they mean to you.
                </p>
                
                <div className="space-y-6 sm:space-y-8 pt-8 sm:pt-10">
                  {[
                    { title: "Animated Reveal", desc: "Smooth CSS-driven scroll unrolling animation for that premium physical feel.", icon: <Star className="text-primary" /> },
                    { title: "Voice Integration", desc: "Embed professional or personal voice notes that play upon opening.", icon: <Volume2 className="text-secondary" /> },
                    { title: "Smart Sharing", desc: "Instant generic link delivery via WhatsApp, Email, or SMS with QR support.", icon: <Zap className="text-amber-400" /> }
                  ].map((feature, i) => (
                    <div key={i} className="flex gap-4 sm:gap-6 items-start">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-foreground/5 flex items-center justify-center shrink-0 border border-border group-hover:border-primary/20 transition-all">
                        {feature.icon}
                      </div>
                      <div>
                        <div className="font-black text-sm sm:text-base uppercase tracking-tight">{feature.title}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground font-semibold leading-relaxed">{feature.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal direction="right">
              <div className="relative p-4 sm:p-6 glass border border-border rounded-[40px] sm:rounded-[48px] shadow-huge overflow-hidden group">
                <div className="absolute inset-0 gradient-bg opacity-5 group-hover:opacity-10 transition-opacity" />
                <div className="aspect-[3/4] rounded-[28px] sm:rounded-[32px] bg-background/50 border border-border flex flex-col items-center justify-center p-6 sm:p-12 text-center relative z-10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent/20 backdrop-blur-xl rounded-full flex items-center justify-center mb-6 sm:mb-8 animate-bounce shadow-xl">
                    <Volume2 size={32} className="text-accent" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 tracking-tighter uppercase italic">Letter <span className="gradient-text italic">Demo</span></div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-bold tracking-tight px-4 sm:px-0">Interact with a sample letter to feel the premium scroll and voice-over integration.</p>
                  <button className="mt-8 px-8 py-3 rounded-2xl glass font-black text-xs uppercase tracking-widest border border-border hover:bg-foreground/5 transition-all active:scale-95">
                    Launch Preview
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Sharing / Delivery Section */}
      <section className="py-12 sm:py-24 px-6 bg-muted/30 border-y border-border">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <h3 className="text-2xl sm:text-3xl font-black mb-8 sm:mb-12 uppercase italic tracking-tighter">Flexible <span className="gradient-text italic">Delivery</span> Options</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {[
                { title: "Instant Digital Link", desc: "Send it directly via WhatsApp or Email. Perfect for immediate surprises.", icon: <Share2 size={24} />, color: "primary" },
                { title: "Premium QR Card", desc: "We deliver a physical card with a custom QR code that unlocks the letter experience.", icon: <QrCode size={24} />, color: "accent" }
              ].map((opt, i) => (
                <div key={i} className="p-8 sm:p-10 rounded-[32px] sm:rounded-[40px] glass border border-border flex flex-col items-center hover:bg-background transition-all group">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform`}>
                    {opt.icon}
                  </div>
                  <h4 className="text-lg sm:text-xl font-black mb-2 uppercase tracking-tighter italic">{opt.title}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground font-semibold">{opt.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-24 px-6 text-center">
        <Reveal>
          <div className="max-w-3xl mx-auto p-10 sm:p-16 rounded-[40px] sm:rounded-[48px] glass border border-border shadow-huge relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/10 blur-[100px] rounded-full -mr-32 -mb-32" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 relative z-10 tracking-tighter uppercase italic">Words Last <br className="hidden sm:block" /><span className="gradient-text italic">Forever.</span></h2>
            <Link href="/book" className="inline-block px-10 sm:px-12 py-5 sm:py-6 gradient-bg text-white font-black text-lg sm:text-xl rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 relative z-10">
              Pick Your Theme
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

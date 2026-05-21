"use client";

import { Phone, Check, Volume2, ArrowRight, Sparkles, Mail } from "lucide-react";
import Header from "@/components/Header";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import WallOfJoy from "@/components/WallOfJoy";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import Footer from "@/components/Footer";
import LiveStatsWidget from "@/components/LiveStatsWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 antialiased overflow-x-hidden transition-colors duration-300">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden isolate">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full gpu-accelerated opacity-60 dark:bg-primary/20" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full gpu-accelerated opacity-60 dark:bg-accent/20" />

        <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
          <Reveal>
            <div className="flex items-center gap-2 px-6 py-2 rounded-full glass border border-primary/20 mb-8 text-[10px] font-bold text-primary uppercase tracking-[0.4em]">
              <Sparkles size={14} className="fill-current" />
              <span>HEARTFELT CONNECTIONS — 1,250+ FAMILIES CONNECTED</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-medium mb-8 tracking-tight font-serif leading-none">
              Never Forget a <br className="hidden sm:block" />
              <span className="gradient-text italic">Heartfelt Moment</span> Again.
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mb-12 italic font-serif leading-relaxed">
              We help you bridge the distance with the magic of surprise calls, genuine moments of connection, and timeless digital letters.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/book" className="px-8 py-4 sm:px-12 sm:py-6 rounded-3xl gradient-bg text-white font-bold text-base sm:text-xl hover:scale-105 active:scale-95 transition-all shadow-huge flex items-center justify-center gap-3">
                Send a Surprise
                <ArrowRight size={20} />
              </Link>
              <Link href="/pricing" className="px-8 py-4 sm:px-12 sm:py-6 rounded-3xl glass font-bold text-base sm:text-xl hover:bg-foreground/5 transition-all border border-border flex items-center justify-center">
                Explore 13+ Services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-24 px-6 relative z-20">
        <div className="max-w-6xl mx-auto">
          <Reveal>
             <LiveStatsWidget />
          </Reveal>
        </div>
      </section>


      {/* Digital Letter Feature Teaser Section - Light background contrast */}
      <section id="digital-letter" className="py-24 px-6 relative bg-background overflow-hidden border-t border-border">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-20">
          <div className="flex-1">
            <Reveal direction="left">
              <div className="relative p-2 glass border border-border rounded-[32px] sm:rounded-[64px] aspect-[4/5] overflow-hidden group shadow-huge bg-background/40">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 text-center z-20">
                  <div className="w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center mx-auto mb-8 border border-white/20 group-hover:bg-primary/20 transition-all cursor-pointer shadow-huge">
                    <Volume2 className="text-white" size={40} />
                  </div>
                  <div className="text-[10px] font-black tracking-[0.4em] uppercase text-white/80 mb-4">Digital Experience</div>
                  <div className="text-4xl font-medium font-serif italic text-white leading-tight">Animated Scroll & <br />Voice Message</div>
                </div>
                <div className="w-full h-full gradient-bg opacity-10" />
              </div>
            </Reveal>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <Reveal direction="right">
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8 text-[10px] font-bold text-accent uppercase tracking-[0.4em]">
                <Sparkles size={14} />
                Exclusive Letter
              </div>
              <h2 className="text-4xl md:text-6xl font-medium mb-8 tracking-tight leading-none font-serif italic">
                The <span className="gradient-text italic">Digital Scroll</span> Letter.
              </h2>
              <p className="text-xl text-muted-foreground mb-12 leading-relaxed font-serif italic">
                Write from the heart, and we&apos;ll arrange your words on a beautiful animated scroll. Include your own voice or let our professional narrators bring your message to life.
              </p>
              
              <ul className="space-y-6 mb-12">
                {[
                  "Generated custom QR code/link letter",
                  "Professional voiceover integration",
                  "Instant delivery via WhatsApp/Email",
                  "Permanent digital hosting for keepsakes"
                ].map(item => (
                  <li key={item} className="flex items-center gap-6 group">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                      <Check size={12} strokeWidth={4} />
                    </div>
                    <span className="text-foreground/80 font-medium italic font-serif">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/digital-letters" className="inline-flex px-8 py-4 sm:px-12 sm:py-6 rounded-3xl gradient-bg text-white font-bold text-base sm:text-xl hover:scale-105 active:scale-95 transition-all shadow-huge">
                Create Your Letter
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <WallOfJoy />

      {/* Footer */}
      <Footer />
    </main>
  );
}

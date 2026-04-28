"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { Heart, Sparkles, Star, Users, Smile, Globe } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const values = [
    { title: "Heart-Centered", desc: "Every call and message is crafted with genuine emotion and professional care.", icon: <Heart size={20} /> },
    { title: "Personal Service", desc: "Our hosts are trained to deliver thrills with professional excellence.", icon: <Smile size={20} /> },
    { title: "Reliability", desc: "We never miss a date. Consistency is our brand promise to your family.", icon: <Globe size={20} /> },
    { title: "Community", desc: "Building a culture of appreciation and thoughtfulness across Nigeria.", icon: <Users size={14} /> }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 font-outfit pb-20 overflow-hidden">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full gpu-accelerated opacity-40 dark:bg-primary/20 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-primary/20 mb-8 text-[10px] font-bold text-primary uppercase tracking-[0.4em]">
              <Star size={14} className="fill-current" />
              Our Connection Journey
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-medium mb-8 tracking-tight font-serif leading-none">
              A Culture of <br />
              <span className="gradient-text italic text-primary">Connection</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto italic font-serif opacity-80">
               "We started BuzzThrills because life gets busy, but the people we love shouldn&apos;t pay the price for our schedules."
            </p>
          </Reveal>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-6 bg-muted/20 border-y border-border">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <Reveal direction="left">
            <div className="relative aspect-square rounded-[64px] glass border border-border overflow-hidden shadow-huge bg-background/40">
              <div className="absolute inset-0 gradient-bg opacity-5" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={120} className="text-primary opacity-10 animate-pulse" />
              </div>
              <div className="absolute bottom-10 left-10 right-10 p-8 glass rounded-[40px] border-border bg-background/50 text-center shadow-2xl">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3">Our Vision</div>
                <div className="text-2xl font-medium font-serif italic text-primary">To turn every notification into a core memory.</div>
              </div>
            </div>
          </Reveal>
          
          <div className="space-y-12">
            <Reveal direction="right">
              <h2 className="text-4xl md:text-5xl font-medium mb-12 font-serif italic tracking-tight">The Human <span className="gradient-text italic">Philosophy</span></h2>
              <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                BuzzThrills isn&apos;t just a messaging service. We are a team of professional Heartfelt Connection Agents dedicated to the art of the surprise.
              </p>
              <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                Whether it&apos;s a celebratory morning call, a midday affirmation, or a late-night lullaby, we bring the human touch to technological convenience.
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-10">
                {values.map((v, i) => (
                  <div key={i} className="flex flex-col gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
                      {v.icon}
                    </div>
                    <div>
                      <div className="font-bold text-lg tracking-tight mb-2">{v.title}</div>
                      <div className="text-sm text-muted-foreground font-medium leading-relaxed">{v.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats / Numbers */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto rounded-[64px] p-16 glass border border-border text-center overflow-hidden relative shadow-huge">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 blur-[100px] rounded-full -ml-32 -mb-32" />
          <Reveal>
            <h3 className="text-3xl font-medium mb-16 font-serif italic tracking-tight">BuzzThrills by the <span className="gradient-text">Numbers</span></h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 sm:gap-20">
              {[
                { label: "Hearts Connected", value: "24.5k" },
                { label: "Hearts Rekindled", value: "12k+" },
                { label: "Nigerian Cities", value: "36" },
                { label: "Shared Joy", value: "5k+" }
              ].map((stat, i) => (
                <div key={i} className="relative group">
                  <div className="text-5xl font-black gradient-text mb-4 tracking-tighter group-hover:scale-110 transition-transform">{stat.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">{stat.label}</div>
                  {i < 3 && <div className="hidden md:block absolute top-1/2 right-[-10px] lg:right-[-40px] w-px h-12 bg-border -translate-y-1/2 opacity-50" />}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 text-center">
        <Reveal>
          <div className="max-w-4xl mx-auto p-16 sm:p-24 rounded-[64px] glass border border-border bg-foreground/2 relative overflow-hidden group shadow-huge">
            <div className="absolute inset-0 gradient-bg opacity-5 group-hover:opacity-10 transition-opacity duration-1000" />
            <h2 className="text-4xl sm:text-6xl font-medium mb-12 font-serif italic relative z-10">Start <span className="gradient-text italic">Connecting</span> Now.</h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
              <Link href="/book" className="px-12 py-6 rounded-3xl gradient-bg text-white font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-huge">
                Send a Surprise
              </Link>
              <Link href="/support" className="px-12 py-6 rounded-3xl glass font-bold text-xl hover:bg-foreground/5 transition-all border border-border flex items-center justify-center">
                Contact Support
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
      <Footer />
    </main>
  );
}

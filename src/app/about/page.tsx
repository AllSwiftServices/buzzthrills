"use client";

import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import { Heart, Shield, Star, Users, Zap } from "lucide-react";

export default function AboutPage() {
  const values = [
    { title: "Heart-Centered", desc: "Every call and message is crafted with genuine emotion and care.", icon: <Heart size={20} /> },
    { title: "Superhero Service", desc: "Our hosts are trained to deliver thrills with professional excellence.", icon: <Zap size={20} /> },
    { title: "Reliability", desc: "We never miss a date. Consistency is our superpower.", icon: <Shield size={20} /> },
    { title: "Community", desc: "Building a culture of appreciation and thoughtfulness across Nigeria.", icon: <Users size={14} /> }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 font-outfit pb-20">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full gpu-accelerated opacity-40 dark:bg-primary/20 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/20 mb-8 text-xs font-bold text-primary uppercase tracking-widest">
              Our Story
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-8 tracking-tight leading-none">
              Our <span className="gradient-text">Superhero</span> Story.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto italic">
               "We started BuzzThrills because life gets busy, but the people we love shouldn't pay the price for our schedules."
            </p>
          </Reveal>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <Reveal direction="left">
            <div className="relative aspect-square rounded-[40px] glass border border-border overflow-hidden shadow-2xl">
              <div className="absolute inset-0 gradient-bg opacity-10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Star size={120} className="text-primary opacity-20" />
              </div>
              <div className="absolute bottom-8 left-8 right-8 p-6 glass rounded-3xl border-border bg-background/50">
                <div className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Our Mission</div>
                <div className="text-xl font-bold">To turn every notification into a core memory.</div>
              </div>
            </div>
          </Reveal>
          
          <div className="space-y-8">
            <Reveal direction="right">
              <h2 className="text-4xl font-black mb-6">Our <span className="gradient-text">Superhero</span> Philosophy</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                BuzzThrills isn't just an automated reminder service. We are a team of professional hosts, voice actors, and "Superheroes" dedicated to the art of the surprise.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether it's a celebratory morning call, a midday affirmation, or a late-night prank ordered by a best friend, we bring the human touch to technological convenience.
              </p>
              
              <div className="grid grid-cols-2 gap-6 pt-8">
                {values.map((v, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white">
                      {v.icon}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{v.title}</div>
                      <div className="text-xs text-muted-foreground leading-tight">{v.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats / Numbers */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto rounded-[40px] p-12 glass border border-border text-center overflow-hidden relative">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 blur-[100px] rounded-full -ml-32 -mb-32" />
          <Reveal>
            <h3 className="text-2xl font-bold mb-12">BuzzThrills by the Numbers</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Hearts Buzzed", value: "24.5k" },
                { label: "Superhero Hosts", value: "150+" },
                { label: "Nigerian Cities", value: "36" },
                { label: "Successful Pranks", value: "5k+" }
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-4xl font-black gradient-text mb-2">{stat.value}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 text-center">
        <Reveal>
          <h2 className="text-4xl font-black mb-8">Ready to join the <span className="gradient-text">Squad</span>?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-5 rounded-2xl gradient-bg text-white font-black text-xl hover:scale-105 transition-all shadow-xl shadow-primary/20">
              Start Your Plan
            </button>
            <button className="px-10 py-5 rounded-2xl glass font-bold text-xl hover:bg-foreground/5 transition-all border border-border">
              Contact Support
            </button>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

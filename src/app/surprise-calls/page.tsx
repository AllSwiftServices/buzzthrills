"use client";

import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import { Phone, Calendar, Heart, Shield, Star, Music, Mic2, Smile } from "lucide-react";
import Link from "next/link";

export default function SurpriseCallsPage() {
  const categories = [
    { title: "Celebratory", desc: "Birthdays, anniversaries, graduations, and more.", icon: <Star size={24} />, color: "bg-primary/20 text-primary" },
    { title: "Affirmations", desc: "A boost of confidence when they need it most.", icon: <Heart size={24} />, color: "bg-accent/10 text-accent" },
    { title: "Pranks", desc: "Good-natured fun to lighten up their day.", icon: <Smile size={24} />, color: "bg-green-500/10 text-green-500" },
    { title: "Custom", desc: "Your script, our voice. Make it unforgettable.", icon: <Mic2 size={24} />, color: "bg-secondary/20 text-secondary" }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 font-outfit pb-20">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full gpu-accelerated opacity-40 dark:bg-primary/20 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/20 mb-8 text-xs font-bold text-primary uppercase tracking-widest">
              Most Popular Service
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black mb-8 tracking-tight leading-none">
              The Magic of a <br className="hidden sm:block" />
              <span className="gradient-text">Surprise Call</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12 uppercase text-[10px] tracking-widest leading-none">
              Transform those missed moments into lasting core memories with a voice that cares. Our expert team delivers emotions, not just messages.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/book?plan=one-off" className="px-10 py-5 rounded-3xl gradient-bg text-white font-black text-xl hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                Send a Call Now
                <Phone size={24} />
              </Link>
              <Link href="#how-it-works" className="px-10 py-5 rounded-3xl glass font-bold text-xl hover:bg-foreground/5 transition-all border border-border">
                How It Works
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-6 bg-muted/30 border-y border-border">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="p-8 rounded-[40px] glass border border-border h-full flex flex-col items-center text-center group hover:bg-background transition-all">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${cat.color}`}>
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{cat.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{cat.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Showcase Section */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <Reveal direction="left">
            <div className="relative p-1 glass border border-border rounded-[48px] aspect-square overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 gradient-bg opacity-10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-2xl rounded-full flex items-center justify-center animate-pulse cursor-pointer">
                  <Mic2 size={40} className="text-white" />
                </div>
              </div>
              <div className="absolute top-8 left-8 right-8 p-6 glass rounded-3xl border-border">
                <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Live Demo</div>
                <div className="text-lg font-bold">Listen to a Sample Professional Greeting</div>
              </div>
            </div>
          </Reveal>
          
          <div className="space-y-12">
            <Reveal direction="right">
              <h2 className="text-4xl font-black mb-8 italic uppercase tracking-tighter">The <span className="gradient-text italic">Service</span> Process</h2>
              <div className="space-y-8">
                {[
                  { step: "01", title: "Schedule Your Slot", desc: "Choose a date and time that would mean the most to your recipient." },
                  { step: "02", title: "Select Voice Tone", desc: "From high-energy hype hosts to warm, soothing voices—pick the perfect match." },
                  { step: "03", title: "Custom Scripting", desc: "Give us the details. We'll handle the professional formatting and delivery." },
                  { step: "04", title: "Professional Delivery", desc: "Our account agents make the call live, ensuring a unique and emotional result." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="text-3xl font-black text-primary/30 group-hover:text-primary transition-colors">{step.step}</div>
                    <div>
                      <div className="text-xl font-bold mb-2">{step.title}</div>
                      <div className="text-muted-foreground">{step.desc}</div>
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
        <div className="max-w-4xl mx-auto p-12 glass border border-primary/10 rounded-[40px] text-center">
          <Reveal>
            <h3 className="text-3xl font-black mb-12">Why People <span className="gradient-text">Buzz</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { label: "Successful Calls", value: "98.4%" },
                { label: "Engagements Delivered", value: "24k+" },
                { label: "Average Rating", value: "4.9/5" }
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-5xl font-black gradient-text mb-2">{stat.value}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 px-6 text-center">
        <Reveal>
          <div className="max-w-3xl mx-auto p-8 sm:p-16 rounded-[48px] gradient-bg text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -ml-32 -mt-32" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 relative z-10">Make Someone Smile <br className="hidden sm:block" />Today.</h2>
            <Link href="/book" className="inline-block px-12 py-6 bg-white text-black font-black text-xl rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl relative z-10">
              Pick Your Plan
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

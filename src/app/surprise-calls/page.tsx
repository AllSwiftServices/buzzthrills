"use client";

import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import { Phone, Calendar, Heart, MessageCircle, Star, Music, Mic2, Sun, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function SurpriseCallsPage() {
  const categories = [
    { title: "Celebratory", desc: "Celebrate milestones worth remembering with a joyous professional shoutout.", icon: <Star size={24} />, color: "bg-primary/20 text-primary" },
    { title: "Appreciatory", desc: "Say thank you in a way that truly resonates with their heart.", icon: <Heart size={24} />, color: "bg-pink-500/10 text-pink-500" },
    { title: "Apology", desc: "For when you need the perfect words to bridge the distance.", icon: <MessageCircle size={24} />, color: "bg-blue-500/10 text-blue-500" },
    { title: "Encouragement", desc: "Uplift their spirits and send motivation when they need it most.", icon: <Sun size={24} />, color: "bg-amber-500/10 text-amber-500" }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 font-outfit pb-20 overflow-hidden">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full gpu-accelerated opacity-40 dark:bg-primary/20 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-primary/20 mb-8 text-[10px] font-bold text-primary uppercase tracking-[0.4em]">
              <Sparkles size={14} className="fill-current" />
              Our Signature Experience
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-8xl font-medium mb-8 tracking-tight leading-none font-serif">
              The Magic of a <br className="hidden sm:block" />
              <span className="gradient-text italic">Surprise Call</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12 italic font-serif">
              Transform distance into lasting core memories with a voice that cares. Our expert team delivers genuine emotions, not just messages.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/book" className="px-12 py-6 rounded-3xl gradient-bg text-white font-bold text-xl hover:scale-105 transition-all shadow-huge flex items-center justify-center gap-3">
                Send a Call Now
                <Phone size={24} />
              </Link>
              <Link href="#how-it-works" className="px-12 py-6 rounded-3xl glass font-bold text-xl hover:bg-foreground/5 transition-all border border-border flex items-center justify-center gap-2 group">
                How It Works
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="p-10 rounded-[48px] glass border border-border h-full flex flex-col items-center text-center group hover:border-primary/20 transition-all duration-500 hover:shadow-huge bg-background/40">
                <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl ${cat.color}`}>
                  {cat.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">{cat.title}</h3>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">{cat.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Showcase Section */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <Reveal direction="left">
            <div className="relative p-2 glass border border-border rounded-[64px] aspect-square overflow-hidden group shadow-huge bg-background/40">
              <div className="absolute inset-0 gradient-bg opacity-5 group-hover:opacity-10 transition-opacity duration-1000" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-white/20 backdrop-blur-2xl rounded-full flex items-center justify-center animate-pulse cursor-pointer shadow-2xl border border-white/30">
                  <Mic2 size={48} className="text-white" />
                </div>
              </div>
              <div className="absolute top-10 left-10 right-10 p-8 glass rounded-[40px] border-border text-center shadow-2xl">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3">Live Demo</div>
                <div className="text-xl font-medium font-serif italic tracking-tight text-primary">Listen to a Sample Professional Greeting</div>
              </div>
            </div>
          </Reveal>
          
          <div className="space-y-12">
            <Reveal direction="right">
              <h2 className="text-4xl md:text-5xl font-medium mb-12 font-serif italic tracking-tight">The Service <span className="gradient-text italic">Journey</span></h2>
              <div className="space-y-10">
                {[
                  { step: "01", title: "Schedule Your Slot", desc: "Choose a date and time that would mean the most to your recipient. We handle the time-zone coordination." },
                  { step: "02", title: "Select Voice Tone", desc: "From high-energy hype hosts to warm, soothing voices—pick the perfect match for the occasion." },
                  { step: "03", title: "Custom Scripting", desc: "Give us the heartfelt details. We'll handle the professional flow and delivery to ensure a core memory." },
                  { step: "04", title: "Professional Delivery", desc: "Our account agents make the call live, ensuring a unique, interactive and emotional experience." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="text-4xl font-black text-primary/10 group-hover:text-primary/100 transition-colors duration-500 font-serif italic">{step.step}</div>
                    <div className="pt-2">
                      <div className="text-2xl font-bold mb-2 tracking-tight">{step.title}</div>
                      <div className="text-muted-foreground font-medium leading-relaxed">{step.desc}</div>
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
        <div className="max-w-4xl mx-auto p-16 glass border border-primary/10 rounded-[64px] text-center shadow-huge relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -mr-32 -mt-32" />
          <Reveal>
            <h3 className="text-3xl font-medium mb-16 font-serif italic tracking-tight">Why People <span className="gradient-text">Trust Us</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-20">
              {[
                { label: "Successful Deliveries", value: "98.4%" },
                { label: "Hearts Connected", value: "24.5k+" },
                { label: "Average Joy Rating", value: "4.9/5" }
              ].map((stat, i) => (
                <div key={i} className="relative">
                  <div className="text-5xl font-black gradient-text mb-4 tracking-tighter">{stat.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic px-4">{stat.label}</div>
                  {i < 2 && <div className="hidden md:block absolute top-1/2 right-[-40px] w-px h-12 bg-border -translate-y-1/2" />}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 px-6 text-center">
        <Reveal>
          <div className="max-w-4xl mx-auto p-16 sm:p-24 rounded-[64px] glass border border-border shadow-huge relative overflow-hidden group">
            <div className="absolute inset-0 gradient-bg opacity-5 group-hover:opacity-10 transition-opacity duration-1000" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full -ml-48 -mt-48" />
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium mb-12 relative z-10 tracking-tight font-serif italic">Make Someone Smile <br className="hidden sm:block" />Today.</h2>
            <Link href="/book" className="inline-flex px-12 py-6 gradient-bg text-white font-bold text-xl rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-huge relative z-10">
              Book a Surprise
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

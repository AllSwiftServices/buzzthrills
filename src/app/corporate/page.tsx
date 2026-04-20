"use client";

import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import { Briefcase, Users, TrendingUp, Zap, Sparkles, Building2, Presentation, ArrowRight, Heart, Globe } from "lucide-react";
import Link from "next/link";

export default function CorporatePage() {
  const corporateBenefits = [
    { title: "Team Morale", desc: "Show your team they're seen with personalized professional affirmation calls.", icon: <Zap size={24} /> },
    { title: "Smart Onboarding", desc: "Automated 'Welcome' calls for new hires that create an immediate sense of belonging.", icon: <Users size={24} /> },
    { title: "Retention Strategy", desc: "Unique 'Engagement Artifacts' linked to performance milestones and anniversaries.", icon: <Heart size={24} /> },
    { title: "B2B Gifting", desc: "Elevate your client experience with a curated professional voice that speaks your brand.", icon: <Globe size={24} /> }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 font-outfit pb-20 overflow-hidden">
      <Header />
      
      {/* Hero */}
      <section className="pt-40 pb-24 px-6 relative text-center">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full gpu-accelerated opacity-40 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-primary/20 mb-8 text-[10px] font-bold text-primary uppercase tracking-[0.4em]">
              <Sparkles size={14} className="fill-current" />
              Corporate Solutions
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-8xl font-medium mb-8 tracking-tight font-serif leading-none">
              Buzz for <br className="hidden sm:block" />
              <span className="gradient-text italic">Business</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg md:text-2xl text-muted-foreground font-serif italic max-w-2xl mx-auto mb-12 opacity-80">
              Scale the human touch in your organization. From team-wide live affirmations to bespoke client surprises, we help businesses create emotional stickiness.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/support" className="px-12 py-6 rounded-3xl gradient-bg text-white font-bold text-xl hover:scale-105 transition-all shadow-huge flex items-center justify-center gap-3 active:scale-95">
                Request a Demo
                <ArrowRight size={24} />
              </Link>
              <Link href="#solutions" className="px-12 py-6 rounded-3xl glass font-bold text-xl hover:bg-foreground/5 transition-all border border-border flex items-center justify-center active:scale-95">
                Our Solutions
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Corporate Grid */}
      <section id="solutions" className="py-24 px-6 bg-muted/20 border-y border-border">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {corporateBenefits.map((benefit, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="p-10 rounded-[48px] glass border border-border h-full flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-8 group hover:border-primary/20 transition-all duration-500 bg-background/40">
                <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary shrink-0 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 tracking-tight">{benefit.title}</h3>
                  <p className="text-muted-foreground font-medium text-sm leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <Reveal direction="left">
            <div className="space-y-10">
              <h2 className="text-4xl md:text-5xl font-medium mb-12 font-serif italic tracking-tight leading-tight">Scale Your <span className="gradient-text italic">Emotional</span> Intelligence.</h2>
              <p className="text-xl text-muted-foreground font-serif italic leading-relaxed opacity-80">
                Traditional perks are common. What isn&apos;t common is a personalized call from a professional agent thanking an employee for their hard work on a project launch.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
                {[
                  { label: "Dashboard Control", desc: "Manage bulk orders across your entire headcount with our streamlined tools.", icon: <Presentation size={18} /> },
                  { label: "Bespoke Branding", desc: "Custom scripts and tones that align 100% with your corporate identity.", icon: <Building2 size={18} /> }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center shrink-0 border border-border">
                      {item.icon}
                    </div>
                    <div className="font-bold text-lg tracking-tight">{item.label}</div>
                    <div className="text-sm text-muted-foreground font-medium leading-relaxed">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal direction="right">
            <div className="relative aspect-[4/5] rounded-[64px] glass border border-border overflow-hidden group shadow-huge bg-background/40">
              <div className="absolute inset-0 gradient-bg opacity-5 group-hover:opacity-10 transition-opacity duration-1000" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center pointer-events-none">
                <div className="w-24 h-24 mb-10 text-primary shadow-huge flex items-center justify-center bg-white/10 backdrop-blur-3xl rounded-full border border-white/20">
                  <Briefcase size={40} />
                </div>
                <h3 className="text-3xl font-medium mb-4 font-serif italic tracking-tight">Enterprise <span className="gradient-text italic">Tiers</span></h3>
                <p className="text-sm text-muted-foreground font-medium max-w-xs mx-auto mb-10 leading-relaxed">Customizable contract-based packages for teams of 50 to 5,000.</p>
                <Link href="/support" className="px-10 py-5 bg-foreground text-background font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest pointer-events-auto shadow-xl">
                  Get a Custom Quote
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Corporate Call to Action */}
      <section className="py-24 px-6 text-center">
        <Reveal>
          <div className="max-w-4xl mx-auto p-16 sm:p-24 rounded-[64px] glass border border-border shadow-huge relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full -mr-48 -mt-48" />
            <h2 className="text-4xl sm:text-6xl font-medium mb-12 relative z-10 tracking-tight font-serif italic leading-tight">Modernize Your <br className="hidden sm:block" />Culture.</h2>
            <Link href="/support" className="inline-flex px-12 py-6 gradient-bg text-white font-bold text-xl rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-huge relative z-10 items-center gap-3">
              Book a Strategy Call
              <ArrowRight size={24} />
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

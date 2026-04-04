"use client";

import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import { Briefcase, Users, TrendingUp, Zap, Sparkles, Building2, Presentation, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CorporatePage() {
  const corporateBenefits = [
    { title: "Boost Morale", desc: "Show your team they're seen with personalized affirmation calls.", icon: <Zap size={24} /> },
    { title: "Bulk Onboarding", desc: "Automated 'Welcome Squad' calls for new hires across the country.", icon: <Users size={24} /> },
    { title: "Retention Strategy", desc: "Unique 'Thrills' linked to performance milestones and anniversaries.", icon: <TrendingUp size={24} /> },
    { title: "B2B Gifting", desc: "Elevate your client gifts with a voice that speaks your brand.", icon: <Sparkles size={24} /> }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 font-outfit pb-20">
      <Header />
      
      {/* Hero */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden text-center">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full gpu-accelerated opacity-40 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/20 mb-8 text-xs font-bold text-primary uppercase tracking-widest">
              BuzzThrills Enterprise
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tight leading-[1]">
              Culture Is Your <br />
              <span className="gradient-text">Greatest Spark</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12">
              Scale the human touch in your organization. From team-wide affirmations to client surprises, we help businesses create emotional stickiness.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/support" className="px-10 py-5 rounded-3xl gradient-bg text-white font-black text-xl hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                Request a Demo
                <ArrowRight size={24} />
              </Link>
              <Link href="#solutions" className="px-10 py-5 rounded-3xl glass font-bold text-xl hover:bg-foreground/5 transition-all border border-border">
                Our Solutions
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Corporate Grid */}
      <section id="solutions" className="py-24 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {corporateBenefits.map((benefit, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="p-10 rounded-[40px] glass border border-border h-full flex items-start gap-8 group hover:bg-background transition-all">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed italic">{benefit.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <Reveal direction="left">
            <div className="space-y-8">
              <h2 className="text-4xl font-black mb-8 leading-tight">Scale Your <span className="gradient-text">Human Resource</span> Engagement.</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Traditional perks like gym memberships and fruit bowls are common. What isn't common is a personalized call from a "Superhero" thanking an employee for their hard work on a project launch.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                {[
                  { label: "Dashboard Control", desc: "Manage bulk orders across your entire headcount easily.", icon: <Presentation size={18} /> },
                  { label: "Bespoke Branding", desc: "Custom scripts that align 100% with your brand voice.", icon: <Building2 size={18} /> }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white">
                      {item.icon}
                    </div>
                    <div className="font-bold text-sm">{item.label}</div>
                    <div className="text-xs text-muted-foreground leading-tight">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal direction="right">
            <div className="relative aspect-[4/5] rounded-[48px] glass border border-border overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 gradient-bg opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-24 h-24 mb-8 text-primary shadow-2xl flex items-center justify-center bg-white/20 backdrop-blur-2xl rounded-full">
                  <Briefcase size={40} />
                </div>
                <h3 className="text-3xl font-black mb-4">Enterprise Tiers</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">Customizable packages for teams of 50 to 5,000.</p>
                <button className="mt-8 px-10 py-4 bg-foreground text-background font-black rounded-2xl hover:scale-105 active:scale-95 transition-all">
                  Get a Custom Quote
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Corporate Call to Action */}
      <section className="py-24 px-6 text-center">
        <Reveal>
          <div className="max-w-4xl mx-auto p-16 rounded-[48px] gradient-bg text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32" />
            <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10">Modernize Your <br />Culture.</h2>
            <Link href="/support" className="inline-block px-12 py-6 bg-white text-black font-black text-xl rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl relative z-10 flex items-center gap-3">
              Book a Strategy Call
              <ArrowRight size={20} />
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

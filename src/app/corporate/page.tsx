"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import {
  Briefcase, Users, TrendingUp, Zap, Sparkles, Building2,
  Presentation, ArrowRight, Heart, Globe, Check, Calendar, Quote
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// ─── Replace this URL with your real Calendly/scheduling link ───────────────
const CALENDLY_URL = "https://calendly.com/buzzthrills"; // TODO: update with real link
// ────────────────────────────────────────────────────────────────────────────

const b2bSolutions = [
  {
    title: "Team Morale & Wellness",
    desc: "Show your team they are genuinely seen with personalized, professional affirmation and mental check-in calls that protect your workforce's daily energy.",
    icon: <Heart size={24} />,
  },
  {
    title: "Streamlined Onboarding",
    desc: "Ditch the boring automated welcome emails. Kick off day one with a live, high-energy voice call for new hires that builds an immediate sense of belonging.",
    icon: <Users size={24} />,
  },
  {
    title: "Milestone Recognition",
    desc: "Send unique, beautifully formatted Digital Letters and custom milestone voice experiences linked to employee work anniversaries, promotions, and performance breakthroughs.",
    icon: <TrendingUp size={24} />,
  },
  {
    title: "Client & Partner Loyalty",
    desc: "Elevate your account management. Replace cold corporate notifications with a curated, professional voice calling your premium clients to celebrate their special dates, birthdays, and milestones while appreciating their partnership.",
    icon: <Globe size={24} />,
  },
];

const features = [
  {
    label: "Centralized Dashboard Control",
    desc: "Manage bulk orders, upload schedules, and coordinate major employee campaigns across your entire headcount with our streamlined portal tools.",
    icon: <Presentation size={18} />,
  },
  {
    label: "Bespoke Branding & Delivery",
    desc: "Work with our creative team to craft custom scripts, tailored vocal tones, and official digital layouts that beautifully blend your company logo with the signature high-energy magic of the Buzzthrills brand.",
    icon: <Building2 size={18} />,
  },
  {
    label: "Flexible Enterprise Tiers",
    desc: "Contract-based, customizable packages engineered seamlessly to scale for teams of 50 to 5,000+ employees.",
    icon: <Briefcase size={18} />,
  },
];

export default function CorporatePage() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 font-outfit pb-20 overflow-hidden">
      <Header />

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 relative text-center">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full gpu-accelerated opacity-40 pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-primary/20 mb-8 text-[10px] font-bold text-primary tracking-[0.4em]">
              <Sparkles size={14} className="fill-current" />
              Workplace Culture & Client Loyalty at Scale
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-medium mb-8 tracking-tight font-serif leading-none">
              Buzz for <br className="hidden sm:block" />
              <span className="gradient-text">Business</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg md:text-2xl text-muted-foreground font-serif max-w-3xl mx-auto mb-4 opacity-80 leading-relaxed">
              Foster employee retention and build deep client loyalty through professional, human-led voice experiences and digital letters.
            </p>
            <p className="text-base md:text-lg text-muted-foreground font-medium max-w-3xl mx-auto mb-12 leading-relaxed">
              From team-wide live affirmations to tailored client recognition campaigns, we help businesses protect team drive, combat burnout, and elevate culture, seamlessly combining your company&apos;s brand identity with our signature warmth and high-energy touch.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 sm:px-12 sm:py-6 rounded-3xl gradient-bg text-white font-bold text-base sm:text-xl hover:scale-105 transition-all shadow-huge flex items-center justify-center gap-3 active:scale-95"
              >
                <Calendar size={20} />
                Book a Consultation Call
              </a>
              <Link
                href="#solutions"
                className="px-8 py-4 sm:px-12 sm:py-6 rounded-3xl glass font-bold text-base sm:text-xl hover:bg-foreground/5 transition-all border border-border flex items-center justify-center active:scale-95"
              >
                Our B2B Solutions
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <p className="text-[10px] font-medium text-foreground/30 tracking-[0.3em] mt-6">
              Custom Pricing from ₦100,000 / month
            </p>
          </Reveal>
        </div>
      </section>

      {/* B2B Solutions Grid */}
      <section id="solutions" className="py-24 px-6 bg-muted/20 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-border text-primary text-[10px] font-bold tracking-[0.4em] mb-6">
                <Zap size={14} />
                Our B2B Solutions
              </div>
              <h2 className="text-3xl sm:text-5xl font-medium font-serif tracking-tight leading-none">
                Built for <span className="gradient-text">Modern Teams</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {b2bSolutions.map((benefit, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] glass border border-border h-full flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 sm:gap-8 group hover:border-primary/20 transition-all duration-500 bg-background/40">
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
        </div>
      </section>

      {/* Power of Emotional Intelligence Quote */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          <Reveal direction="left">
            <div className="space-y-10">
              <h2 className="text-4xl md:text-5xl font-medium mb-6 font-serif tracking-tight leading-tight">
                The Power of <span className="gradient-text">Emotional Intelligence</span>
              </h2>

              {/* Quote block */}
              <div className="relative p-8 rounded-[28px] glass border border-border bg-background/40">
                <Quote size={40} className="text-primary/20 absolute top-6 left-6" />
                <p className="text-lg font-serif leading-relaxed text-foreground/80 pl-8 pt-6">
                  Traditional corporate perks are common, easily forgotten, and rarely drive retention. What builds loyalty is an unexpected, personalized phone call or premium digital letter from our professional Thrillers, thanking an employee for their hard work on a project launch.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 pt-4">
                {features.map((item, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center shrink-0 border border-border">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-bold text-lg tracking-tight mb-1">{item.label}</div>
                      <div className="text-sm text-muted-foreground font-medium leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal direction="right">
            <div className="relative aspect-[4/5] rounded-[32px] sm:rounded-[64px] glass border border-border overflow-hidden group shadow-huge bg-background/40">
              <div className="absolute inset-0 gradient-bg opacity-5 group-hover:opacity-10 transition-opacity duration-1000" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center pointer-events-none">
                <div className="w-24 h-24 mb-8 text-primary shadow-huge flex items-center justify-center bg-white/10 backdrop-blur-3xl rounded-full border border-white/20">
                  <Briefcase size={40} />
                </div>
                <h3 className="text-3xl font-medium mb-4 font-serif tracking-tight">Enterprise <span className="gradient-text">Tiers</span></h3>
                <p className="text-sm text-muted-foreground font-medium max-w-xs mx-auto mb-8 leading-relaxed">
                  Customizable contract-based packages for teams of 50 to 5,000+ employees.
                </p>
                <ul className="text-left space-y-3 w-full max-w-xs pointer-events-auto">
                  {[
                    "Invoiced billing & flexible contracts",
                    "Dedicated account manager",
                    "Custom brand voice & scripts",
                    "Automated milestone calendar",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <Check size={14} className="text-primary shrink-0" />
                      <span className="text-foreground/70 font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Calendly / Scheduling Section */}
      <section className="py-24 px-6 bg-muted/20 border-y border-border">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-primary/20 mb-8 text-[10px] font-bold text-primary tracking-[0.4em]">
              <Calendar size={14} className="fill-current" />
              Schedule a Call
            </div>
            <h2 className="text-4xl sm:text-5xl font-medium mb-6 font-serif tracking-tight">
              Modernize Your <span className="gradient-text">Culture</span> Today.
            </h2>
            <p className="text-muted-foreground font-medium text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
              Pick a convenient time below for a quick 15-minute strategy call with our culture team to map out your organization&apos;s milestone calendar.
            </p>

            {/* Calendly embed placeholder */}
            <div className="w-full min-h-[400px] rounded-[32px] glass border-2 border-dashed border-primary/20 flex flex-col items-center justify-center p-12 bg-background/40 gap-6">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center">
                <Calendar size={36} />
              </div>
              <div className="text-[10px] font-black text-primary tracking-[0.4em]">
                Scheduling Widget
              </div>
              <p className="text-foreground/40 font-medium text-sm max-w-sm text-center leading-relaxed">
                Calendly embed will appear here once the booking link is configured.
              </p>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl gradient-bg text-white font-bold text-sm tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Calendar size={16} />
                Open Scheduling Page
                <ArrowRight size={16} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 text-center">
        <Reveal>
          <div className="max-w-4xl mx-auto p-8 sm:p-16 rounded-[32px] sm:rounded-[64px] glass border border-border shadow-huge relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full -mr-48 -mt-48" />
            <h2 className="text-4xl sm:text-6xl font-medium mb-6 relative z-10 tracking-tight font-serif leading-tight">
              Ready to Elevate <br className="hidden sm:block" />Your Team Culture?
            </h2>
            <p className="text-muted-foreground font-medium text-lg mb-12 max-w-xl mx-auto relative z-10 leading-relaxed">
              Join progressive companies already using Buzzthrills to appreciate their people and clients at scale.
            </p>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex px-8 py-4 sm:px-12 sm:py-6 gradient-bg text-white font-bold text-base sm:text-xl rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-huge relative z-10 items-center gap-3"
            >
              <Calendar size={20} />
              Book a Strategy Call
              <ArrowRight size={24} />
            </a>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}

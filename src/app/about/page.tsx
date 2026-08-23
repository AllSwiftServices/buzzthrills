"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { Heart, Sparkles, Star, Users, Mic2, FileText, Globe, Phone, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const lifeValues = [
  {
    letter: "L",
    word: "Love",
    desc: "We operate from a deep desire to make people feel valued and cherished.",
    icon: <Heart size={22} />,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    letter: "I",
    word: "Intentionality",
    desc: "Every word is thoughtfully curated. We believe that happiness and thoughtfulness shouldn't be expensive; it is the thoughts that count truly.",
    icon: <Star size={22} />,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    letter: "F",
    word: "Faith",
    desc: "Our work is rooted in a higher purpose to heal hearts and uplift spirits.",
    icon: <Sparkles size={22} />,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    letter: "E",
    word: "Excellence",
    desc: "Every customer interaction is delivered with quality, professional excellence, and absolute care.",
    icon: <Globe size={22} />,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
];

const audiences = [
  {
    title: "Long-Distance & Intimacy",
    desc: "Couples and families keeping love alive across international borders and broken time zones.",
    icon: <Globe size={20} />,
  },
  {
    title: "Healing & Rekindling",
    desc: "Partners and friends delivering the deep sincerity and emotional weight required to heal an argument and mend a fractured bond.",
    icon: <Heart size={20} />,
  },
  {
    title: "Celebration & Hype",
    desc: "Turning birthdays, milestones, and achievements into high-energy, unforgettable core memories.",
    icon: <Sparkles size={20} />,
  },
  {
    title: "Comfort & Support",
    desc: "Providing midday affirmations or soothing voice experiences for the lonely, anxious, or overwhelmed.",
    icon: <Star size={20} />,
  },
  {
    title: "Corporate & Culture",
    desc: "HR managers, founders, and team leads looking to combat workplace burnout, appreciate dedicated staff, and build unshakeable client loyalty.",
    icon: <Users size={20} />,
  },
];

export default function AboutPage() {
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
              Our Story
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-medium mb-8 tracking-tight font-serif leading-none">
              A Culture of <br />
              <span className="gradient-text italic">Connection</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto italic font-serif opacity-80">
              &ldquo;We started BuzzThrills because life gets busy, but the people we love shouldn&apos;t pay the price for our schedules.&rdquo;
            </p>
          </Reveal>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-24 px-6 bg-muted/20 border-y border-border">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-primary/20 mb-8 text-[10px] font-bold text-primary uppercase tracking-[0.4em]">
              <Heart size={14} className="fill-current" />
              Our Mission
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <blockquote className="text-xl sm:text-2xl md:text-3xl font-medium font-serif italic leading-relaxed text-foreground/90 border-l-4 border-primary pl-8">
              &ldquo;We are on a mission to deliver personalized, emotion-filled and memorable phone calls and digital letter experiences that uplift, celebrate, and connect people deeply to at least 1 billion people&apos;s faces, one call at a time, one digital experience at a time. Every message and voice is designed to make someone feel seen, loved, appreciated, valued and cherished.&rdquo;
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Our Connection Journey */}
      <section className="py-24 px-6 relative">
        <div className="absolute top-1/2 right-0 w-[40%] h-[80%] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal direction="left">
            <div>
              <h2 className="text-4xl md:text-5xl font-medium mb-10 font-serif italic tracking-tight leading-tight">
                Our <span className="gradient-text italic">Connection</span> Journey
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed font-medium">
                <p>
                  Buzzthrills started with a simple, powerful goal: to help everyday people put smiles on faces and create unforgettable memories through an affordable surprise service. We believed, and still believe, that true thoughtfulness shouldn&apos;t break the bank, because it truly is the thoughts that count.
                </p>
                <p>
                  From those grassroots beginnings in 2022, we have completely metamorphosed. We realized that as life gets busy, the people who drive your personal life and your business shouldn&apos;t pay the price for a hectic schedule.
                </p>
                <p>
                  Modern life has become fast, fragmented, and increasingly digital. Text messages get buried, automated notifications are ignored, and standard corporate emails lack real human connection. Because of this, Buzzthrills evolved into a premium communication platform designed to bring unfiltered human emotion, presence, and positive energy back to relationships, both personal and professional.
                </p>
                <p>
                  Today, we act as an intentional bridge for long-distance partners, families, and organizations alike. We use the raw psychological power of the human voice and thoughtfully curated digital written words to alter moods, build deep loyalty, mend fractures, and create unforgettable core memories.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal direction="right">
            <div className="relative aspect-square rounded-[32px] sm:rounded-[64px] glass border border-border overflow-hidden shadow-huge bg-background/40">
              <div className="absolute inset-0 gradient-bg opacity-5" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={120} className="text-primary opacity-10 animate-pulse" />
              </div>
              <div className="absolute bottom-10 left-10 right-10 p-8 glass rounded-[40px] border-border bg-background/50 text-center shadow-2xl">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3">Our Vision</div>
                <div className="text-xl font-medium font-serif italic text-primary leading-snug">
                  To turn every notification into a core memory.
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* We Give L.I.F.E. */}
      <section className="py-24 px-6 bg-muted/20 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-primary/20 mb-8 text-[10px] font-bold text-primary uppercase tracking-[0.4em]">
                <Sparkles size={14} className="fill-current" />
                Core Values
              </div>
              <h2 className="text-4xl sm:text-6xl font-medium font-serif italic tracking-tight leading-none">
                We Give <span className="gradient-text italic">L.I.F.E.</span>
              </h2>
              <p className="text-muted-foreground text-lg font-medium max-w-2xl mx-auto mt-6 leading-relaxed">
                Every experience we engineer, whether for an individual or an entire corporate team, is executed under our original core values.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lifeValues.map((v, i) => (
              <motion.div
                key={v.letter}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[32px] glass border border-border hover:border-primary/30 transition-all group bg-background/40"
              >
                <div className="text-6xl font-black gradient-text tracking-tighter font-serif italic mb-4 group-hover:scale-110 transition-transform origin-left">
                  {v.letter}
                </div>
                <div className={`w-12 h-12 rounded-2xl ${v.bg} ${v.color} flex items-center justify-center mb-4`}>
                  {v.icon}
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-3">{v.word}</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Communication Mediums */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-primary/20 mb-8 text-[10px] font-bold text-primary uppercase tracking-[0.4em]">
                <Mic2 size={14} />
                How We Deliver
              </div>
              <h2 className="text-4xl sm:text-5xl font-medium font-serif italic tracking-tight leading-none">
                Our Communication <span className="gradient-text italic">Mediums</span>
              </h2>
              <p className="text-muted-foreground text-lg font-medium max-w-2xl mx-auto mt-6 leading-relaxed">
                We have stripped away automated AI scripts and robotic recordings. Instead, Buzzthrills utilizes a real, trained team of Callers (our Thrillers) to execute impact across two core delivery systems.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Reveal direction="left">
              <div className="p-8 sm:p-10 rounded-[32px] glass border border-border bg-background/40 h-full group hover:border-primary/30 transition-all">
                <div className="w-16 h-16 rounded-[20px] bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Phone size={28} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight italic mb-4">
                  Specialized Voice Experiences
                </h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  From high-energy celebratory milestone calls and sensitive relationship apologies to dedicated workplace appreciation campaigns, we deliver live, human voice experiences that connect people deeply across any telephone line globally.
                </p>
              </div>
            </Reveal>
            <Reveal direction="right">
              <div className="p-8 sm:p-10 rounded-[32px] glass border border-border bg-background/40 h-full group hover:border-primary/30 transition-all">
                <div className="w-16 h-16 rounded-[20px] bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <FileText size={28} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight italic mb-4">
                  Premium Digital Letters
                </h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  For moments that require permanence, we design and deliver high-impact Digital Letters: beautifully formatted, emotionally resonant written messages built for deep encouragement, romantic intimacy, or official corporate recognition that recipients can hold onto forever.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-24 px-6 bg-muted/20 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-primary/20 mb-8 text-[10px] font-bold text-primary uppercase tracking-[0.4em]">
                <Users size={14} />
                Our Community
              </div>
              <h2 className="text-4xl sm:text-5xl font-medium font-serif italic tracking-tight leading-none">
                Who We <span className="gradient-text italic">Serve</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {audiences.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 sm:p-8 rounded-[28px] glass border border-border bg-background/40 hover:border-primary/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {a.icon}
                </div>
                <h3 className="font-black text-lg uppercase tracking-tight mb-3">{a.title}</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <Reveal>
          <div className="max-w-4xl mx-auto p-8 sm:p-16 rounded-[32px] sm:rounded-[64px] glass border border-border bg-foreground/2 relative overflow-hidden group shadow-huge">
            <div className="absolute inset-0 gradient-bg opacity-5 group-hover:opacity-10 transition-opacity duration-1000" />
            <h2 className="text-4xl sm:text-6xl font-medium mb-4 font-serif italic relative z-10">
              Spread Positive Vibes
            </h2>
            <p className="text-xl text-muted-foreground font-serif italic mb-12 relative z-10">
              Book a Surprise Call today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
              <Link
                href="/book"
                className="px-8 py-4 sm:px-12 sm:py-6 rounded-3xl gradient-bg text-white font-bold text-base sm:text-xl hover:scale-105 active:scale-95 transition-all shadow-huge text-center flex items-center justify-center gap-3"
              >
                Book a Surprise Call
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/support"
                className="px-8 py-4 sm:px-12 sm:py-6 rounded-3xl glass font-bold text-base sm:text-xl hover:bg-foreground/5 transition-all border border-border flex items-center justify-center"
              >
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

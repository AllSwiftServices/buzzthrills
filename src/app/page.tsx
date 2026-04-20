"use client";

import { Phone, Check, Volume2, Star, ArrowRight, Heart, Sparkles, MessageCircle, Sun } from "lucide-react";
import Header from "@/components/Header";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import BookingSection from "@/components/BookingSection";
import WallOfJoy from "@/components/WallOfJoy";
import TestimonialCarousel from "@/components/TestimonialCarousel";

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
              We help you bridge the distance with the magic of surprise calls, genuine moments of connection, and timeless digital artifacts.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/book" className="px-12 py-6 rounded-3xl gradient-bg text-white font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-huge flex items-center justify-center gap-3">
                Send a Surprise
                <ArrowRight size={24} />
              </Link>
              <Link href="/pricing" className="px-12 py-6 rounded-3xl glass font-bold text-xl hover:bg-foreground/5 transition-all border border-border flex items-center justify-center">
                Explore 13+ Services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-24 px-6 relative z-10 bg-muted/20 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 px-4">
            <h2 className="text-4xl sm:text-6xl font-medium mb-6 font-serif italic tracking-tight">Nurturing <span className="gradient-text italic">Connections</span></h2>
            <p className="text-muted-foreground text-lg font-medium max-w-xl mx-auto">From one-off celebrations to ongoing care, choose the perfect path to show you care.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {[
               { title: "Celebratory", icon: <Star />, color: "bg-primary/10 text-primary", desc: "Birthdays, anniversaries, and milestones." },
               { title: "Royal Check-up", icon: <Heart />, color: "bg-red-500/10 text-red-500", desc: "Monthly wellness calls for aged parents." },
               { title: "Appreciatory", icon: <Sparkles />, color: "bg-amber-500/10 text-amber-500", desc: "Simply saying thank you to those who matter." },
               { title: "Period Care", icon: <Sun />, color: "bg-pink-500/10 text-pink-500", desc: "Supportive calls during her monthly cycle." }
             ].map((serv, i) => (
               <Reveal key={serv.title} delay={i * 0.1}>
                 <div className="p-10 rounded-[48px] glass border border-border h-full flex flex-col group hover:border-primary/20 transition-all duration-500 bg-background/40">
                   <div className={`w-16 h-16 rounded-2xl ${serv.color} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                      {serv.icon}
                   </div>
                   <h3 className="text-2xl font-bold mb-4 tracking-tight">{serv.title}</h3>
                   <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8 flex-grow">{serv.desc}</p>
                   <Link href={`/book?type=${serv.title.toLowerCase().replace(' ', '_')}`} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:gap-3 transition-all">
                      Choose Service
                      <ArrowRight size={14} />
                   </Link>
                 </div>
               </Reveal>
             ))}
          </div>

          <div className="mt-16 text-center">
             <Link href="/pricing" className="inline-flex items-center gap-3 px-10 py-5 rounded-3xl glass border-primary/20 text-primary font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all">
                View All 13 Services
                <ArrowRight size={16} />
             </Link>
          </div>
        </div>
      </section>

      {/* One-off Booking Section */}
      <BookingSection />

      {/* Digital Letter Feature Teaser Section - Light background contrast */}
      <section id="digital-letter" className="py-24 px-6 relative bg-background overflow-hidden border-t border-border">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1">
            <Reveal direction="left">
              <div className="relative p-2 glass border border-border rounded-[64px] aspect-[4/5] overflow-hidden group shadow-huge bg-background/40">
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
                Exclusive Artifact
              </div>
              <h2 className="text-4xl md:text-6xl font-medium mb-8 tracking-tight leading-none font-serif italic">
                The <span className="gradient-text italic">Digital Scroll</span> Artifact.
              </h2>
              <p className="text-xl text-muted-foreground mb-12 leading-relaxed font-serif italic">
                Write from the heart, and we&apos;ll arrange your words on a beautiful animated scroll. Include your own voice or let our professional narrators bring your message to life.
              </p>
              
              <ul className="space-y-6 mb-12">
                {[
                  "Generated custom QR code/link artifact",
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

              <Link href="/digital-letters" className="inline-flex px-12 py-6 rounded-3xl gradient-bg text-white font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-huge">
                Create Your Artifact
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <WallOfJoy />

      {/* Social Proof Stats */}
      <section className="py-24 px-6 glass border-y border-border bg-background/50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {[
            { value: "1,250+", label: "Calls Delivered" },
            { value: "24.5k+", label: "Hearts Touched" },
            { value: "98%", label: "Happy Families" },
            { value: "24/7", label: "Professional Care" }
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <div className="relative">
                <div className="text-5xl font-medium font-serif gradient-text mb-2 tracking-tighter italic">{stat.value}</div>
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">{stat.label}</div>
                {i < 3 && <div className="hidden lg:block absolute top-1/2 right-[-24px] w-px h-10 bg-border -translate-y-1/2 opacity-50" />}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-border bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16 relative z-10">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-8 text-3xl font-black italic tracking-tighter">
              <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Phone size={24} />
              </div>
              BUZZ<span className="gradient-text italic">THRILLS</span>
            </div>
            <p className="text-muted-foreground leading-relaxed font-medium">
              The number one surprise call and emotional message service in Nigeria. We help you stay connected with the people who matter most.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16 text-sm">
            <div className="flex flex-col gap-6">
              <div className="font-black uppercase tracking-[0.2em] text-[10px] text-primary">Services</div>
              <Link href="/surprise-calls" className="font-medium hover:text-primary transition-colors">Surprise Calls</Link>
              <Link href="/digital-letters" className="font-medium hover:text-primary transition-colors">Digital Artifacts</Link>
              <Link href="/corporate" className="font-medium hover:text-primary transition-colors">Business Solutions</Link>
            </div>
            <div className="flex flex-col gap-6">
              <div className="font-black uppercase tracking-[0.2em] text-[10px] text-primary">Company</div>
              <Link href="/about" className="font-medium hover:text-primary transition-colors">Our Story</Link>
              <Link href="/support" className="font-medium hover:text-primary transition-colors">Help Center</Link>
              <Link href="/pricing" className="font-medium hover:text-primary transition-colors">Price List</Link>
            </div>
            <div className="flex flex-col gap-6">
              <div className="font-black uppercase tracking-[0.2em] text-[10px] text-primary">Legal</div>
              <Link href="/privacy" className="font-medium hover:text-primary transition-colors">Privacy</Link>
              <Link href="/terms" className="font-medium hover:text-primary transition-colors">Terms</Link>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-24 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic text-center sm:text-left">
          <span>© 2026 BuzzThrills Prime. All rights reserved.</span>
          <span>Designed with ❤️ for genuine connection.</span>
        </div>
      </footer>
    </main>
  );
}

"use client";

import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import { Mail, Volume2, QrCode, Share2, Heart, Star, Sparkles, Send } from "lucide-react";
import Link from "next/link";

export default function DigitalLettersPage() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 font-outfit pb-20">
      <Header />
      
      {/* Hero */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent/10 blur-[120px] rounded-full gpu-accelerated opacity-40 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-accent/20 mb-8 text-xs font-bold text-accent uppercase tracking-widest">
              Digital Experience
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tight leading-[1]">
              Letters That <br />
              <span className="gradient-text">Come Alive</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12">
              The modern way to say something timeless. Combine beautiful typography, animated scroll technology, and personal voice recordings into a single digital gift.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/book?plan=digital-letter" className="px-10 py-5 rounded-3xl gradient-bg text-white font-black text-xl hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                Send a Letter Now
                <Send size={24} />
              </Link>
              <Link href="#preview" className="px-10 py-5 rounded-3xl glass font-bold text-xl hover:bg-foreground/5 transition-all border border-border">
                Watch Demo
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Animated Scroll", desc: "A narrative experience that reveals your message bit-by-bit.", icon: <Sparkles size={24} /> },
            { title: "Voice Integration", desc: "Attach a recorded message that plays as they read the letter.", icon: <Volume2 size={24} /> },
            { title: "QR Code Delivery", desc: "Surprise them with a physical card that leads to a digital masterpiece.", icon: <QrCode size={24} /> }
          ].map((f, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="p-8 rounded-[40px] glass border border-border h-full flex flex-col items-start group hover:bg-background transition-all">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Product Demo */}
      <section id="preview" className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <Reveal direction="left">
            <div className="space-y-8">
              <h2 className="text-4xl font-black mb-8">Not Just a <span className="gradient-text">Message</span>. <br />An Artifact.</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Standard text messages vanish in minutes. Our digital letters are built to be kept. Every letter is hosted on a unique, permanent link that the recipient can revisit whenever they need a reminder of how much they mean to you.
              </p>
              
              <div className="space-y-6 pt-4">
                {[
                  { title: "Personal Branding", desc: "Choose from dozens of premium themes, fonts, and background animations." },
                  { title: "Privacy First", desc: "Protected by unique tokens that ensure only your intended recipient can view it." },
                  { title: "Instant Delivery", desc: "Send via WhatsApp, Email, or SMS the second it's ready." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl gradient-bg flex-shrink-0 flex items-center justify-center text-white">
                      <Star size={18} />
                    </div>
                    <div>
                      <div className="font-bold">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal direction="right">
            <div className="relative p-6 glass border border-border rounded-[48px] shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 gradient-bg opacity-5 group-hover:opacity-10 transition-opacity" />
              <div className="aspect-[3/4] rounded-[32px] bg-foreground/5 border border-border flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-accent/20 backdrop-blur-xl rounded-full flex items-center justify-center mb-8 animate-bounce">
                  <Volume2 size={32} className="text-accent" />
                </div>
                <div className="text-2xl font-black mb-4">Letter Demo</div>
                <p className="text-sm text-muted-foreground">Interact with a sample letter to feel the premium scroll and voice-over integration.</p>
                <button className="mt-8 px-8 py-3 rounded-2xl glass font-bold text-sm border-border hover:bg-foreground/5 transition-all">
                  Launch Interactive Preview
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Sharing / Delivery Section */}
      <section className="py-24 px-6 bg-muted/30 border-y border-border">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <h3 className="text-3xl font-black mb-12">Flexible <span className="gradient-text">Delivery</span> Options</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-10 rounded-[40px] glass border border-border flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                  <Share2 size={24} />
                </div>
                <h4 className="text-xl font-bold mb-2">Instant Digital Link</h4>
                <p className="text-sm text-muted-foreground">Send it directly via WhatsApp or Email. Perfect for immediate surprises.</p>
              </div>
              <div className="p-10 rounded-[40px] glass border border-border flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 text-accent">
                  <QrCode size={24} />
                </div>
                <h4 className="text-xl font-bold mb-2">Superhero QR Card</h4>
                <p className="text-sm text-muted-foreground">We deliver a physical card with a custom QR code that unlocks the letter experience.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <Reveal>
          <div className="max-w-3xl mx-auto p-16 rounded-[48px] glass border border-border shadow-2xl relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/10 blur-[100px] rounded-full -mr-32 -mb-32" />
            <h2 className="text-4xl md:text-5xl font-black mb-8 relative z-10 group-hover:scale-105 transition-transform duration-500">Words Last <br />Forever.</h2>
            <Link href="/book?plan=letter" className="inline-block px-12 py-6 gradient-bg text-white font-black text-xl rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl relative z-10">
              Pick Your Theme
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

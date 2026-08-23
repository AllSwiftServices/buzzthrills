"use client";

import { Check, ArrowRight, Phone, Heart, Star, Globe, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Header from "@/components/Header";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import SpecialCallBanner from "@/components/SpecialCallBanner";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "dohnrii_best",
    callType: "Birthday Call",
    quote: "I honestly made a choice to stick to Buzzthrills from the first day I had a trial. Listening to the recorded call was awesome. Thank you for choosing to spread positive vibes in the midst of so much negativity.",
  },
  {
    id: 2,
    name: "Joy Oluchi",
    callType: "Encouragement Call",
    quote: "It's been 3 years of using and referring your services, and trust me, there's more to come… Thank you.",
  },
  {
    id: 3,
    name: "Sunday",
    callType: "Apology Call",
    quote: "Thank you for mending my relationship. She called me herself and started laughing, and she was really happy. She's willing to sort things out. Thank you Buzzthrills.",
  },
  {
    id: 4,
    name: "Chinenye",
    callType: "Valentine Call",
    quote: "The value of this call is worth more than its price… I'm not the one that was called but see how I'm blushing.",
  },
  {
    id: 5,
    name: "Rebecca",
    callType: "Valentine Call",
    quote: "You almost made a grown man shed tears. He loved it. You delivered excellently as always. Thank you for putting a smile on my baby's face.",
  },
];

export default function Home() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 antialiased overflow-x-hidden transition-colors duration-500 pb-0">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        {/* Background Radial Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[130px] rounded-full gpu-accelerated opacity-60 dark:bg-primary/20 pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/15 blur-[120px] rounded-full gpu-accelerated opacity-50 dark:bg-secondary/25 pointer-events-none" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          
          {/* Left Column: Heading and copy */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-6 text-[10px] sm:text-xs font-bold text-primary uppercase tracking-[0.25em]">
                REAL MOMENTS. REAL CONNECTIONS.
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
                Spreading Positive <br />
                Vibes, <span className="text-accent font-extrabold">One Call</span> <br />
                at a Time.
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed font-medium">
                Imagine never missing a special moment or date again, because we won&apos;t let you. We handle the remembering and the delivery of heartfelt surprise calls, scannable audio/visual letters, and beautiful love experiences, so your favorite people always feel deeply cherished.
              </p>
            </Reveal>

            <Reveal delay={0.3} className="w-full">
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 w-full">
                <Link
                  href="/book"
                  className="w-full sm:w-auto px-6 py-4 rounded-full gradient-bg text-white font-bold text-sm sm:text-base hover:scale-105 active:scale-95 transition-all shadow-huge flex items-center justify-center gap-2 whitespace-nowrap group"
                >
                  <Phone size={16} className="fill-current" />
                  Book a One-off Call
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/pricing"
                  className="w-full sm:w-auto px-6 py-4 rounded-full border-2 border-foreground/30 hover:border-primary text-foreground hover:text-primary font-bold text-sm sm:text-base transition-all whitespace-nowrap flex items-center justify-center"
                >
                  Join BuzzThrills Prime
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Image and floating vector doodles */}
          <div className="lg:col-span-5 relative flex items-center justify-center pt-8 lg:pt-0">
            <Reveal delay={0.2} direction="right">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 aspect-square overflow-visible">
                {/* Main image with subtle shadow */}
                <div className="w-full h-full rounded-[40px] overflow-hidden border-4 border-border/20 shadow-2xl relative bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/hero-phone.gif"
                    alt="Smiling customer talking on the phone"
                    className="w-full h-full object-cover scale-105"
                  />
                </div>

                {/* Vector Doodles (Absolute positioned overlays) */}
                {/* Spiral Doodle left */}
                <svg viewBox="0 0 100 100" className="absolute -top-10 -left-10 w-24 h-24 text-primary opacity-80 stroke-current fill-none stroke-[2.5]" aria-hidden="true">
                  <path d="M50,50 C30,30 20,60 40,70 C60,80 80,50 60,30 C40,10 10,40 30,70 C50,100 90,70 80,40 C70,10 20,20 10,60" />
                </svg>

                {/* Heart Speech Bubble Doodle right */}
                <div className="absolute top-12 -right-6 w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg transform rotate-12 border border-white/10" aria-hidden="true">
                  <Heart size={24} className="text-white fill-white" />
                  {/* Speech bubble tail */}
                  <div className="absolute -bottom-2 left-4 w-4 h-4 bg-primary transform rotate-45" />
                </div>

                {/* Star / Sparkle Doodle bottom-right */}
                <svg viewBox="0 0 24 24" className="absolute -bottom-6 -right-6 w-12 h-12 text-accent fill-none stroke-current stroke-[2]" aria-hidden="true">
                  <path d="M12 2L15 9L22 10L17 15L18 22L12 18L6 22L7 15L2 10L9 9L12 2Z" />
                </svg>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-16 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Calls Delivered", value: "1,250+", icon: <Phone size={20} /> },
                { label: "Genuine Reactions", value: "98%", icon: <Heart size={20} /> },
                { label: "Call Styles", value: "15+", icon: <Star size={20} /> },
                { label: "Voice Reach", value: "Global", icon: <Globe size={20} /> },
              ].map((stat, i) => (
                <div key={i} className="glass-card border border-border/40 rounded-3xl p-6 sm:p-8 flex flex-col items-center lg:items-start text-center lg:text-left transition-all duration-300 hover:border-primary/30">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-4 border border-primary/10">
                    {stat.icon}
                  </div>
                  <div className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Special Occasion Call Banner */}
      <SpecialCallBanner />

      {/* Digital Letter Feature Section */}
      <section id="digital-letter" className="py-24 px-6 relative bg-muted/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Digital letter text, checkboxes */}
          <div className="lg:col-span-7 text-left">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-6 text-[10px] font-bold text-primary uppercase tracking-widest">
                OUR SIGNATURE EXPERIENCE
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6">
                The Digital Scroll Letter
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed font-medium">
                Write from the heart, and we&apos;ll arrange your words on a beautiful animated scroll. Include your own voice or let our professional narrators bring your message to life.
              </p>

              {/* Checklist */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  "Custom QR code/link letter",
                  "Professional voiceover integration",
                  "Instant delivery via WhatsApp/Email",
                  "Permanent digital hosting",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-semibold text-foreground/80">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center bg-primary text-white scale-90 shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/digital-letters"
                className="inline-flex px-8 py-4 rounded-full gradient-bg text-white font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-huge"
              >
                Create Your Letter
              </Link>
            </Reveal>
          </div>

          {/* Right Column: Mailbox Illustration SVG */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <Reveal delay={0.2} direction="right">
              <div className="relative p-8 w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center">
                {/* Curved decorative accent line */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-primary/10 stroke-current fill-none stroke-[1.5] -z-10" aria-hidden="true">
                  <path d="M10,80 C30,20 70,20 90,80" />
                </svg>

                {/* Responsive Mailbox Vector Illustration */}
                <svg viewBox="0 0 200 200" className="w-56 h-56 sm:w-72 sm:h-72" aria-label="Mailbox illustration">
                  {/* Stand */}
                  <rect x="94" y="130" width="12" height="70" rx="3" fill="#5A0C7E" className="opacity-20" />
                  
                  {/* Box shadow base */}
                  <ellipse cx="100" cy="195" rx="30" ry="4" fill="black" className="opacity-10" />

                  {/* Mailbox base panel */}
                  <rect x="50" y="115" width="100" height="20" rx="4" fill="#360171" className="opacity-90 dark:fill-primary" />

                  {/* Main Mailbox Body */}
                  <path d="M50,115 L150,115 L150,85 C150,57.4 127.6,35 100,35 C72.4,35 50,57.4 50,85 Z" fill="#5A0C7E" />

                  {/* Mailbox door highlights (Front Flap) */}
                  <path d="M50,85 C50,57.4 72.4,35 100,35 C127.6,35 150,57.4 150,85 L150,115 L50,115 Z" fill="none" stroke="#8B1299" strokeWidth="2" className="opacity-40" />

                  {/* Mailbox opening panel */}
                  <ellipse cx="100" cy="85" rx="50" ry="30" fill="#360171" className="opacity-60" />

                  {/* Mailbox Handle */}
                  <rect x="92" y="118" width="16" height="6" rx="2" fill="#D9BE18" />

                  {/* Mailbox flag */}
                  <rect x="36" y="65" width="8" height="45" rx="2" fill="#D9BE18" transform="rotate(-25 36 65)" />
                  <rect x="18" y="38" width="22" height="16" rx="3" fill="#D9BE18" />

                  {/* Envelope inside */}
                  <g transform="translate(68, 70) rotate(-6)">
                    <rect x="0" y="0" width="64" height="42" rx="4" fill="#ffffff" stroke="#360171" strokeWidth="2.5" />
                    <path d="M0,0 L32,24 L64,0" fill="none" stroke="#360171" strokeWidth="2.5" />
                    {/* Tiny heart sticker */}
                    <path d="M32,26 C31,24 28,24 28,26 C28,28.5 32,31 32,31 C32,31 36,28.5 36,26 C36,24 33,24 32,26 Z" fill="#8B1299" />
                  </g>
                </svg>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">
              How It Works
            </h2>
            <p className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-16">
              Thoughtful. Simple. Seamless.
            </p>
          </Reveal>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {/* Curved Dotted Connecting Line for desktop */}
            <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-[40px] -z-10" aria-hidden="true">
              <svg className="w-full h-full text-primary/30 stroke-current fill-none stroke-[2.5]" strokeDasharray="6,6" viewBox="0 0 200 40">
                <path d="M0,20 C40,5 60,35 100,20 C140,5 160,35 200,20" />
              </svg>
            </div>

            {[
              { step: "1", title: "Choose Your Call", desc: "Pick a call type and share the details." },
              { step: "2", title: "We Make It Special", desc: "We personalize your message with care." },
              { step: "3", title: "They Feel Loved", desc: "We deliver the surprise. You make their day." },
            ].map((step, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-extrabold text-lg mb-6 shadow-md border border-white/10">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground font-semibold max-w-[240px] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Call Types Section */}
      <section className="py-24 px-6 bg-muted/20">
        <div className="max-w-6xl mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-16">
              Popular Call Types
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Birthday Calls", desc: "Make birthdays unforgettable", img: "/call-birthday.png" },
              { title: "Surprise Calls", desc: "Unexpected calls, big smiles", img: "/call-surprise.png" },
              { title: "Anniversary Calls", desc: "Celebrate love, beautifully", img: "/call-anniversary.png" },
              { title: "Motivation Calls", desc: "Encouragement when it matters", img: "/call-motivation.png" },
            ].map((card, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="glass-card border border-border/40 rounded-[32px] overflow-hidden p-3 flex flex-col h-full text-left transition-all duration-300 hover:border-primary/20 hover:scale-[1.02]">
                  {/* Card Image */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-muted">
                    <Image
                      src={card.img}
                      alt={card.title}
                      fill
                      sizes="(max-width: 640px) 130px, (max-width: 1024px) 180px, 260px"
                      className="object-cover"
                      priority
                    />
                  </div>
                  
                  {/* Card content */}
                  <div className="px-3 pb-3 flex-grow flex flex-col justify-end">
                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-1 truncate">
                      {card.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-semibold line-clamp-2">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section ("Ready to create someone's happy moment?") */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto bg-muted/40 dark:bg-muted/10 border border-border/40 rounded-[40px] p-8 sm:p-12 md:p-16 relative overflow-hidden">
          {/* Radial accent glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[90px] rounded-full -mr-36 -mt-36 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">

            {/* Phone image — shown above text on mobile, right column on desktop */}
            <div className="lg:col-span-5 lg:order-2 flex items-center justify-center relative">
              <Reveal delay={0.2} direction="right">
                <div className="relative flex items-center justify-center">
                  {/* Decorative spiral path */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-primary/15 stroke-current fill-none stroke-[1.5]" aria-hidden="true">
                    <path d="M50,10 C70,10 90,30 90,50 C90,70 70,90 50,90 C30,90 10,70 10,50" />
                  </svg>

                  {/* Bordered image container */}
                  <div className="relative w-44 h-44 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-3xl overflow-hidden border-2 border-primary/30 shadow-xl">
                    <Image
                      src="/vintage-phone.png"
                      alt="Vintage black rotary telephone"
                      fill
                      sizes="(max-width: 640px) 176px, (max-width: 1024px) 224px, 256px"
                      className="object-cover rounded-3xl"
                    />
                  </div>
                </div>
              </Reveal>
            </div>

            {/* CTA Left text & button */}
            <div className="lg:col-span-7 lg:order-1 text-left">
              <Reveal>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 leading-[1.1]">
                  Ready to create <br />
                  someone&apos;s happy <br />
                  moment?
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed font-semibold max-w-xl">
                  Whether it&apos;s a call, a letter, or a full surprise experience, we&apos;ve got you covered.
                </p>
                <Link
                  href="/book"
                  className="flex sm:inline-flex items-center justify-center px-8 py-5 rounded-full bg-accent hover:bg-accent/90 text-background font-black text-base sm:text-lg hover:scale-105 active:scale-95 transition-all shadow-lg gap-2 group"
                >
                  Book Your First Surprise Call
                </Link>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section id="testimonials" className="py-24 px-6 relative bg-muted/20">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Reveal>
            <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-6">
              <Quote size={24} className="fill-current" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-2">
              Real Moments, <br />
              <span className="gradient-text">Real Impact</span>
            </h2>
            <p className="text-sm font-semibold text-muted-foreground mb-12">
              Here&apos;s what our amazing community has to say.
            </p>
          </Reveal>

          {/* Testimonial Card Frame with outer Arrow controls */}
          <div className="relative flex items-center justify-center px-4 sm:px-12">
            
            {/* Left Nav Arrow Button */}
            <button
              onClick={prevTestimonial}
              className="absolute left-[-10px] sm:left-0 z-20 w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center text-foreground hover:bg-foreground/5 transition-all shadow-md"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Testimonial card contents */}
            <div className="w-full max-w-2xl min-h-[260px] p-8 sm:p-10 rounded-[32px] glass-card border border-border flex flex-col justify-between text-left relative overflow-hidden transition-all duration-300">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col justify-between h-full flex-grow"
                >
                  <div>
                    {/* Stars */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} size={14} className="fill-accent text-accent" />
                      ))}
                    </div>

                    {/* Quote text */}
                    <p className="text-base sm:text-lg font-medium leading-relaxed font-serif italic text-foreground/90 mb-8">
                      &ldquo;{testimonials[testimonialIndex].quote}&ldquo;
                    </p>
                  </div>

                  {/* Profile info */}
                  <div className="flex items-center gap-4 pt-6 border-t border-border/40">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary p-[2px] shadow-md shrink-0">
                      <div className="w-full h-full rounded-full bg-background flex items-center justify-center font-extrabold text-lg text-primary">
                        {testimonials[testimonialIndex].name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-sm">{testimonials[testimonialIndex].name}</div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">
                        {testimonials[testimonialIndex].callType}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Nav Arrow Button */}
            <button
              onClick={nextTestimonial}
              className="absolute right-[-10px] sm:right-0 z-20 w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center text-foreground hover:bg-foreground/5 transition-all shadow-md"
              aria-label="Next Testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${testimonialIndex === i ? "w-8 bg-primary" : "w-2 bg-foreground/15"}`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Join BuzzThrills Prime section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-xl mx-auto">
          <Reveal>
            <div className="glass-card border border-border/50 rounded-[40px] p-8 sm:p-12 flex flex-col items-center text-center relative overflow-hidden transition-all duration-500 hover:border-primary/20">
              
              {/* Crown Icon inside gradient rings */}
              <div className="w-20 h-20 rounded-full flex items-center justify-center p-[2px] bg-gradient-to-br from-primary/30 to-secondary/30 mb-8 relative">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center border border-border">
                  {/* Glowing inner elements */}
                  <div className="w-14 h-14 rounded-full flex items-center justify-center bg-primary/5 text-accent">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-accent text-accent" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 4L5 12L12 6L19 12L22 4L18 20H6L2 4Z" />
                    </svg>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                Join BuzzThrills Prime
              </h2>
              <p className="text-sm font-semibold text-muted-foreground mb-8 leading-relaxed max-w-sm">
                Unlock exclusive benefits and priority customer support.
              </p>

              {/* Checklist */}
              <ul className="space-y-4 mb-8 text-left w-full max-w-xs mx-auto">
                {[
                  "Priority booking",
                  "Never forget important dates (we remember for you)",
                  "Exclusive offers",
                  "Early access to new features",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-semibold text-foreground/80">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center bg-primary text-white scale-90 shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/pricing"
                className="w-full py-4 rounded-full gradient-bg text-white font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg block text-center"
              >
                Subscribe Now
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <NewsletterSignup />

      <Footer />
    </main>
  );
}

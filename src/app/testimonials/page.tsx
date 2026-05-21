"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { testimonials, TestimonialCard } from "@/components/WallOfJoy";
import { motion } from "framer-motion";
import { Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground font-outfit">
      <Header />

      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-8 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>

            <Reveal>
              <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter mb-6 leading-none">
                The Full <span className="gradient-text italic">Wall of Joy</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-xl text-muted-foreground max-w-2xl font-medium italic font-serif leading-relaxed">
                Real reactions, real reviews. The reason we keep doing what we do.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (index % 6) * 0.05 }}
                viewport={{ once: true }}
              >
                <TestimonialCard item={item} />
              </motion.div>
            ))}
          </div>

          <div className="mt-32 p-16 sm:p-24 rounded-[64px] gradient-bg text-white text-center shadow-huge relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter mb-12 leading-none">
                Ready to create <br />the next <span className="text-white/40">Story?</span>
              </h2>
              <Link
                href="/pricing"
                className="inline-flex px-8 py-4 sm:px-12 sm:py-6 bg-white text-black font-black text-lg sm:text-xl rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-huge items-center justify-center gap-3 whitespace-nowrap"
              >
                Start Your Thrill
                <Heart size={24} className="text-primary fill-current" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

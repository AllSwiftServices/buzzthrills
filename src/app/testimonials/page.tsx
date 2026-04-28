"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { screenshots } from "@/components/WallOfJoy";
import { motion } from "framer-motion";
import Image from "next/image";
import { MessageCircle, Star, Heart, ArrowLeft } from "lucide-react";
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
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-8 group">
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
                Explore hundreds of real reactions, smiles, and tears of joy. This is why we do what we do.
              </p>
            </Reveal>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
            {screenshots.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (index % 10) * 0.05 }}
                viewport={{ once: true }}
                className="break-inside-avoid"
              >
                <div className="group relative rounded-[2.5rem] overflow-hidden glass border border-border/50 hover:border-primary/30 transition-all duration-500 shadow-xl hover:shadow-huge hover:shadow-primary/5 bg-background/40 backdrop-blur-md">
                  <div className="relative aspect-[9/16] w-full bg-foreground/5 overflow-hidden">
                     <div className="absolute inset-0 flex items-center justify-center text-foreground/10 opacity-20">
                       <MessageCircle size={80} strokeWidth={1} />
                     </div>
                     
                     <Image 
                       src={item.image}
                       alt={`Testimonial screenshot`}
                       fill
                       className="object-contain opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700"
                     />

                     <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                        <div className="mb-2">
                          <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} className="fill-gold text-gold" />
                            ))}
                          </div>
                          <p className="text-foreground font-medium text-base leading-relaxed font-serif italic">
                            &ldquo;{item.quote}&rdquo;
                          </p>
                        </div>
                     </div>
                  </div>

                  <div className="p-6 border-t border-border/50">
                     <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-foreground/40 font-serif">Verified Experience</span>
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                           <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Success</span>
                        </div>
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-32 p-16 sm:p-24 rounded-[64px] gradient-bg text-white text-center shadow-huge relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative z-10">
               <h2 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter mb-12 leading-none">Ready to create <br />the next <span className="text-white/40">Story?</span></h2>
               <Link href="/pricing" className="inline-flex px-8 py-4 sm:px-12 sm:py-6 bg-white text-black font-black text-lg sm:text-xl rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-huge items-center justify-center gap-3 whitespace-nowrap">
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

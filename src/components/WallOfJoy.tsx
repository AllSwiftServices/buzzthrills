"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, MessageCircle, Star } from "lucide-react";
import Reveal from "./Reveal";

interface TestimonialScreenshot {
  id: number;
  image: string;
  author: string;
  quote: string;
  accent?: string;
}

const screenshots: TestimonialScreenshot[] = [
  {
    id: 1,
    image: "/testimonials/testimonial_1.png",
    author: "Chineye",
    quote: "The value of this call is more than the price... see how I'm blushing.",
    accent: "text-rose-500"
  },
  {
    id: 2,
    image: "/testimonials/testimonial_2.png",
    author: "Aunty Sonia",
    quote: "That was so sweeetttttt... See the way I'm smiling listening to the recording.",
    accent: "text-amber-500"
  },
  {
    id: 3,
    image: "/testimonials/testimonial_3.png",
    author: "Partner Feedback",
    quote: "D gift this morning was unexpected and it was actually a very good gift... professional delivery.",
    accent: "text-blue-500"
  },
  {
    id: 4,
    image: "/testimonials/testimonial_4.png",
    author: "DivineFavour",
    quote: "I must say I am glad I booked with you guys fr... He called and kept smiling.",
    accent: "text-emerald-500"
  },
  {
    id: 5,
    image: "/testimonials/testimonial_5.png",
    author: "Aunty Precious",
    quote: "See voiceeeeeeeeee... See me crying... Over excitement!",
    accent: "text-purple-500"
  },
  {
    id: 6,
    image: "/testimonials/testimonial_6.png",
    author: "BrightSunday Ana",
    quote: "Only one BuzzThrills... She called me herself and started laughing and was happy, really happy.",
    accent: "text-pink-500"
  },
  {
    id: 7,
    image: "/testimonials/testimonial_7.png",
    author: "Lizzy",
    quote: "Thank you so much for making him thrilled... He's still blushing!",
    accent: "text-rose-400"
  },
  {
    id: 8,
    image: "/testimonials/testimonial_8.jpg",
    author: "Nemi Otobor",
    quote: "You made me shed tears on the road... I don't want to send a VN because I'll burst out in tears.",
    accent: "text-indigo-500"
  },
  {
    id: 9,
    image: "/testimonials/testimonial_9.jpg",
    author: "Special Moment",
    quote: "You almost made a grown man shed tears... he loved it.",
    accent: "text-slate-500"
  },
  {
    id: 10,
    image: "/testimonials/testimonial_10.jpg",
    author: "Happy Parent",
    quote: "Thank you for putting a smile on my baby's face. Exellent delivery.",
    accent: "text-orange-500"
  },
  {
    id: 11,
    image: "/testimonials/testimonial_11.jpg",
    author: "Community Member",
    quote: "God bless you and keep promoting you. I wish I had more to say.",
    accent: "text-cyan-500"
  }
];

export default function WallOfJoy() {
  return (
    <section className="py-24 px-4 sm:px-6 bg-cream/30 dark:bg-black/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 px-4">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-border text-primary text-[10px] font-bold uppercase tracking-[0.4em] mb-8">
              <Heart size={14} className="fill-current" />
              Real Moments
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-medium mb-6 font-serif">
              The <span className="gradient-text italic">Wall of Joy</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-muted-foreground text-lg sm:text-xl font-medium max-w-2xl mx-auto tracking-tight font-serif italic">
              Authentic reactions from our community. These are the hearts we&apos;ve touched along the way.
            </p>
          </Reveal>
        </div>

        {/* Masonry-style grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 px-4">
          {screenshots.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="break-inside-avoid"
            >
              <div className="group relative rounded-[2rem] overflow-hidden glass border border-border/50 hover:border-primary/30 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-primary/5 bg-background/40 backdrop-blur-md">
                {/* Image Placeholder/Container */}
                <div className="relative aspect-[9/16] w-full bg-foreground/5 overflow-hidden">
                   {/* In a real scenario, we'd have the actual images here. 
                       For now, I'll use a stylized placeholder or simple Image component */}
                   <div className="absolute inset-0 flex items-center justify-center text-foreground/10 opacity-20 group-hover:scale-110 transition-transform duration-700">
                     <MessageCircle size={80} strokeWidth={1} />
                   </div>
                   
                   {/* 
                      Note to User: Place your screenshots in public/testimonials/ 
                      named testimonial_1.png through testimonial_10.png 
                   */}
                   <Image 
                     src={item.image}
                     alt={`Testimonial from ${item.author}`}
                     fill
                     className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                   />

                   {/* Overlay info */}
                   <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                      <div className="mb-2">
                        <div className="flex gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className="fill-gold text-gold" />
                          ))}
                        </div>
                        <p className="text-foreground font-medium text-sm leading-relaxed font-serif italic">
                          &ldquo;{item.quote}&rdquo;
                        </p>
                        <p className={`mt-3 text-[10px] font-bold uppercase tracking-widest ${item.accent}`}>
                          — {item.author}
                        </p>
                      </div>
                   </div>
                </div>

                {/* Visible Info Part */}
                <div className="p-5 border-t border-border/50">
                   <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40 font-serif">{item.author}</span>
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                         <span className="text-[9px] font-bold uppercase tracking-widest text-primary/60">Verified Love</span>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <Reveal delay={0.4}>
          <div className="mt-20 text-center">
            <p className="text-muted-foreground font-medium mb-8 font-serif italic">Want to create your own special moment?</p>
            <button className="px-10 py-5 gradient-bg rounded-3xl font-semibold text-lg text-white shadow-huge hover:scale-105 transition-all active:scale-95 group">
              Start Sharing Joy
              <Heart size={20} className="inline-ml-2 group-hover:scale-125 transition-transform ml-2" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

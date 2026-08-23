"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Quote, Star } from "lucide-react";
import Reveal from "./Reveal";

export interface Testimonial {
  id: number;
  name: string;
  callType: string;
  quote: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "dohrnii_best",
    callType: "Birthday Call",
    quote:
      "I honestly made a choice to stick to Buzzthrills from the first day I had a trial. Listening to the recorded call was awesome. Thank you for choosing to spread positive vibes in the midst of so much negativity.",
  },
  {
    id: 2,
    name: "Joy Oluchi",
    callType: "Encouragement Call",
    quote:
      "It's been 3 years of using and referring your services, and trust me, there's more to come… Thank you.",
  },
  {
    id: 3,
    name: "Sunday",
    callType: "Apology Call",
    quote:
      "Thank you for mending my relationship. She called me herself and started laughing, and she was really happy. She's willing to sort things out. Thank you Buzzthrills.",
  },
  {
    id: 4,
    name: "Chinenye",
    callType: "Valentine Call",
    quote:
      "The value of this call is worth more than its price… I'm not the one that was called but see how I'm blushing.",
  },
  {
    id: 5,
    name: "Rebecca",
    callType: "Valentine Call",
    quote:
      "You almost made a grown man shed tears. He loved it. You delivered excellently as always. Thank you for putting a smile on my baby's face.",
  },
];

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div className="group relative rounded-[2rem] glass border border-border/50 hover:border-primary/30 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-primary/5 bg-background/40 backdrop-blur-md p-8 flex flex-col h-full">
      <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
        <Quote size={48} className="text-primary" />
      </div>

      <div className="flex gap-1 mb-5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} className="fill-gold text-gold" />
        ))}
      </div>

      <p className="text-base sm:text-lg font-medium font-serif leading-relaxed text-foreground/85 mb-6 flex-grow">
        &ldquo;{item.quote}&rdquo;
      </p>

      <div className="pt-5 border-t border-border/60 flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5 shadow-lg shrink-0">
          <div className="w-full h-full rounded-full bg-background flex items-center justify-center font-black gradient-text">
            {item.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="min-w-0">
          <div className="font-bold text-sm truncate">{item.name}</div>
          <div className="text-[10px] font-bold tracking-[0.2em] text-primary/70 mt-0.5">
            {item.callType}
          </div>
        </div>
      </div>
    </div>
  );
}

export { TestimonialCard };

export default function WallOfJoy() {
  const displayed = testimonials;

  return (
    <section className="py-24 px-4 sm:px-6 bg-cream/30 dark:bg-black/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 px-4">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-border text-primary text-[10px] font-bold tracking-[0.4em] mb-8">
              <Heart size={14} className="fill-current" />
              Real Moments
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-medium mb-6 font-serif">
              The <span className="gradient-text">Wall of Joy</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-muted-foreground text-lg sm:text-xl font-medium max-w-2xl mx-auto tracking-tight font-serif">
              Authentic reactions from our community. These are the hearts we&apos;ve touched along the way.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {displayed.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <TestimonialCard item={item} />
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/testimonials"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-3xl glass border-primary/20 text-primary font-black tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all"
          >
            The Full Wall of Joy
            <Star size={16} />
          </Link>
        </div>

        <Reveal delay={0.4}>
          <div className="mt-20 text-center">
            <p className="text-muted-foreground font-medium mb-3 font-serif text-lg">
              Next up: Your own unforgettable moment.
            </p>
            <Link
              href="/book"
              className="inline-flex px-10 py-5 gradient-bg rounded-3xl font-semibold text-lg text-white shadow-huge hover:scale-105 transition-all active:scale-95 group items-center justify-center whitespace-nowrap"
            >
              Book Your First Surprise Call
              <Heart size={20} className="group-hover:scale-125 transition-transform ml-2" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

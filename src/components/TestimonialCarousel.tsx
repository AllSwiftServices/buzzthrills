"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

const testimonials = [
  {
    id: 1,
    name: "Tega B.",
    role: "Surprised Girlfriend",
    content: "I was literally in tears! The BuzzThrills squad called me with the most heartfelt message from my boyfriend. It made my whole month!",
    rating: 5,
    tag: "Birthday Thrill"
  },
  {
    id: 2,
    name: "Olumide S.",
    role: "Corporate Executive",
    content: "Used the Corporate Orbit plan for our team appreciation week. 50+ calls delivered flawlessly. The morale boost was massive.",
    rating: 5,
    tag: "Corporate Surge"
  },
  {
    id: 3,
    name: "Chioma E.",
    role: "Super Hero",
    content: "The digital letters are magic. My mom scanned the QR code and heard my voice note while reading the letter. Such a premium experience.",
    rating: 5,
    tag: "Digital Letter"
  }
];

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
           <div className="max-w-xl">
              <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4">Community Feedback</h2>
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6">
                 What the <span className="gradient-text">Squad</span> says.
              </h3>
              <p className="text-muted-foreground font-bold text-lg tracking-tight">
                 Real stories from real heroes who've experienced the high-fidelity thrill.
              </p>
           </div>
           
           <div className="flex gap-4">
              <button onClick={prev} className="w-14 h-14 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all active:scale-90 shadow-xl">
                 <ChevronLeft size={24} />
              </button>
              <button onClick={next} className="w-14 h-14 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all active:scale-90 shadow-xl">
                 <ChevronRight size={24} />
              </button>
           </div>
        </div>

        <div className="relative h-[400px] md:h-[350px]">
           <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center h-full">
                   {/* Feedback Content */}
                   <div className="lg:col-span-12 p-8 md:p-12 rounded-[56px] glass border border-white/10 shadow-huge relative flex flex-col justify-center overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[60px] rounded-full -mr-32 -mt-32" />
                      <Quote size={80} className="absolute top-12 left-12 text-white/[0.03] scale-150 rotate-12" />
                      
                      <div className="relative z-10">
                         <div className="flex items-center gap-2 mb-8">
                            {[...Array(testimonials[index].rating)].map((_, i) => (
                              <Star key={i} size={16} className="fill-primary text-primary" />
                            ))}
                            <div className="ml-4 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest italic">
                               {testimonials[index].tag}
                            </div>
                         </div>
                         
                         <p className="text-2xl md:text-3xl font-black tracking-tight leading-snug mb-8 max-w-4xl italic">
                            "{testimonials[index].content}"
                         </p>
                         
                         <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary p-0.5 shadow-xl">
                               <div className="w-full h-full rounded-[14px] bg-[#111] flex items-center justify-center font-black text-xl gradient-text">
                                  {testimonials[index].name.charAt(0)}
                               </div>
                            </div>
                            <div>
                               <div className="font-black text-lg">{testimonials[index].name}</div>
                               <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{testimonials[index].role}</div>
                            </div>
                         </div>
                      </div>

                      <div className="absolute bottom-12 right-12 opacity-0 group-hover:opacity-100 transition-opacity">
                         <MessageCircle size={32} className="text-primary/20" />
                      </div>
                   </div>
                </div>
              </motion.div>
           </AnimatePresence>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-3 mt-12">
           {testimonials.map((_, i) => (
             <button 
               key={i} 
               onClick={() => setIndex(i)}
               className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-12 bg-primary shadow-lg shadow-primary/40' : 'w-4 bg-white/10 hover:bg-white/20'}`} 
             />
           ))}
        </div>
      </div>
    </section>
  );
}

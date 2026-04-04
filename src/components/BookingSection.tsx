"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Heart, Zap, Sparkles, Gift, MessageSquare, Music, Video } from "lucide-react";

const oneOffCalls = [
  { type: "Celebratory", price: "2,000", options: ["Standard", "Prank (+1k)", "Music (+2k)", "Music+Prank (+3k)"], icon: <Star size={20} /> },
  { type: "Apology", price: "3,000", options: ["Standard", "Music (+2k)"], icon: <Heart size={20} /> },
  { type: "Period Care", price: "2,000", options: ["Standard", "Music (+1k)"], icon: <Zap size={20} /> },
  { type: "Self Love", price: "2,000", options: ["One-off", "Monthly (+8k)"], icon: <Sparkles size={20} /> },
  { type: "Shoot Your Shot", price: "3,000", icon: <Gift size={20} /> },
  { type: "Grief/Comfort", price: "4,000", icon: <MessageSquare size={20} /> },
  { type: "Lullaby Call", price: "3,000", icon: <Music size={20} /> },
  { type: "Video ShoutOut", price: "5,000", icon: <Video size={20} /> }
];

export default function BookingSection() {
  const [selectedCall, setSelectedCall] = useState<string | null>(null);

  return (
    <section id="one-off" className="py-24 px-4 sm:px-6 bg-background">
      <div className="max-w-6xl mx-auto rounded-[40px] p-6 sm:p-12 glass border-foreground/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[100px] rounded-full dark:bg-accent/20" />
        
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4">Book a <span className="gradient-text">One-off Call</span></h2>
          <p className="text-muted-foreground">The most affordable way to send a thoughtful surprise.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {oneOffCalls.map((call) => (
            <button
              key={call.type}
              onClick={() => setSelectedCall(call.type)}
              className={`p-6 rounded-3xl text-left transition-all duration-300 transform active:scale-95 ${
                selectedCall === call.type ? 'gradient-bg text-white' : 'glass border-foreground/5 hover:bg-foreground/10'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                selectedCall === call.type ? 'bg-white/20' : 'bg-primary/10 text-primary'
              }`}>
                {call.icon}
              </div>
              <div className="font-bold text-lg">{call.type}</div>
              <div className={selectedCall === call.type ? 'text-white/80 text-sm' : 'text-muted-foreground text-sm'}>
                From ₦{call.price}
              </div>
            </button>
          ))}
        </div>

        {selectedCall && (
          <motion.div 
            key={selectedCall}
            initial={{ height: 0, opacity: 0, scale: 0.95 }}
            animate={{ height: 'auto', opacity: 1, scale: 1 }}
            className="mt-12 p-8 rounded-3xl bg-foreground/5 border border-foreground/10 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-2">Selected: {selectedCall} Call</h3>
                <p className="text-muted-foreground">Fill in the details to customize your surprise.</p>
              </div>
              <button className="px-10 py-4 gradient-bg rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-xl shadow-primary/20">
                Book Now
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

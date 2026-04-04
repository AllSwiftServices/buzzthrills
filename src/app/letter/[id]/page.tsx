"use client";

import { motion } from "framer-motion";
import { Volume2, Share2, Download, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function DigitalLetter({ params }: { params: { id: string } }) {
  const [isUnfurled, setIsUnfurled] = useState(false);
  
  // Mock data for the demonstration
  const letterContent = {
    recipient: "Adewale",
    sender: "Tolani",
    message: "Happy Birthday my love! You've been the greatest blessing in my life this past year. Every moment with you is a treasure, and I can't wait to create a million more memories together. You are my sunshine, my moon, and my stars. Have the most amazing day ever! 🎂❤️",
    hasVoiceNote: true,
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsUnfurled(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-white overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

      {/* The Scroll Container */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-lg z-10"
      >
        {/* Top Roll */}
        <div className="h-10 bg-[#f4e4bc] rounded-t-xl shadow-xl flex items-center justify-center border-b border-black/10 relative z-20">
          <div className="w-full h-2 bg-black/5 mx-4 rounded-full" />
        </div>

        {/* The Paper / Content */}
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: isUnfurled ? 'auto' : 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#fcf5e5] text-black p-10 md:p-16 overflow-hidden shadow-2xl relative"
          style={{ minHeight: isUnfurled ? '400px' : '0px' }}
        >
          {/* Paper Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isUnfurled ? 1 : 0, y: isUnfurled ? 0 : 20 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="font-serif text-sm uppercase tracking-widest text-black/40 mb-8 font-bold">
              A Special Message for {letterContent.recipient}
            </div>

            <div className="font-serif text-2xl md:text-3xl italic leading-relaxed mb-12 text-[#2d2417] leading-loose">
              {letterContent.message}
            </div>

            <div className="flex flex-col items-end gap-2 pr-4 border-t border-black/5 pt-8">
              <span className="font-serif text-lg italic text-black/60">With love from,</span>
              <span className="font-serif text-2xl font-black text-black">{letterContent.sender}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Roll */}
        <div className="h-10 bg-[#f4e4bc] rounded-b-xl shadow-xl flex items-center justify-center border-t border-black/10 relative z-20">
          <div className="w-full h-2 bg-black/5 mx-4 rounded-full" />
        </div>
      </motion.div>

      {/* Controls / Floating Actions */}
      {isUnfurled && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 flex gap-4 z-20"
        >
          <button className="flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/10 transition-all font-bold">
            <Volume2 size={20} />
            Play Voice Message
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-full gradient-bg text-white font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            <Heart size={20} />
            Send Feedback
          </button>
        </motion.div>
      )}

      {/* Brand Watermark */}
      <div className="mt-20 opacity-40 text-sm flex items-center gap-2">
        <span>Sent via</span>
        <span className="font-black">BUZZ<span className="gradient-text">THRILLS</span></span>
      </div>

      <Link href="/" className="mt-8 text-xs text-muted-foreground hover:text-white transition-colors">
        Create your own digital surprise →
      </Link>
    </div>
  );
}

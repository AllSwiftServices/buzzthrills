"use client";

import { motion } from "framer-motion";
import BookingForm from "@/components/BookingForm";
import Header from "@/components/Header";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function BookingContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "one-off";

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <Header />
      
      <div className="max-w-4xl mx-auto text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-primary font-bold uppercase tracking-widest text-sm mb-4"
        >
          Securing Your Surprise
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black mb-6"
        >
          Book Your <span className="gradient-text">Buzz Thrills</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground max-w-2xl mx-auto"
        >
          Complete the form below to schedule your surprise calls. Our team of Superheroes will take it from here!
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <BookingForm planType={plan} />
      </motion.div>

      <div className="mt-20 text-center opacity-40 text-xs flex flex-col items-center gap-4">
        <div className="flex items-center gap-8">
          <span>Secure Checkout</span>
          <span>Paystack Partner</span>
          <span>24/7 Support</span>
        </div>
        <p>© 2026 BuzzThrills Prime. All rights reserved.</p>
      </div>
    </main>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center">Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}

"use client";

import { motion } from "framer-motion";
import BookingForm from "@/components/BookingForm";
import Header from "@/components/Header";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

function BookingContent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth?redirect=/book");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Verifying your account...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground pt-32 pb-20 px-6 transition-colors duration-500">
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
          Complete the form below to schedule your surprise calls. Our team of professionals will take it from here!
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <BookingForm />
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
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}

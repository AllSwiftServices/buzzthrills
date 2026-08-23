"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, CheckCircle, Mail, ArrowLeft } from "lucide-react";

export default function LetterProcessingPage() {
  const params = useParams();
  const id = params?.id as string;
  const [letter, setLetter] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/letters/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.letter) setLetter(data.letter);
      })
      .catch(() => {});
  }, [id]);

  // If letter is already published, redirect to share page
  useEffect(() => {
    if (letter?.status === "published") {
      window.location.href = `/digital-letters/share/${id}`;
    }
  }, [letter, id]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-20">
      <div className="w-full max-w-lg text-center space-y-8">
        {/* Animated icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto w-24 h-24 rounded-[32px] bg-primary/10 border-2 border-primary/20 flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <Clock size={40} className="text-primary" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-foreground">
            Your Letter is Being{" "}
            <span className="gradient-text">Crafted</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-sm mx-auto">
            Payment confirmed 🎉 Our team is personalising your letter
            {letter?.recipient_name ? ` for ${letter.recipient_name}` : ""}. We'll email you the share link as soon as it's ready.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-[28px] border border-border p-6 text-left space-y-4"
        >
          {[
            { icon: "✨", label: "Brief received", done: true },
            { icon: "✍️", label: "Crafting your letter content", done: false },
            { icon: "🎙️", label: "Recording voice-over (if requested)", done: false },
            { icon: "🔗", label: "Publishing & sending you the link", done: false },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm border-2 ${
                step.done
                  ? "bg-primary border-primary text-white"
                  : "border-border bg-muted text-muted-foreground"
              }`}>
                {step.done ? <CheckCircle size={14} /> : step.icon}
              </div>
              <span className={`text-sm font-medium ${step.done ? "text-foreground" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
        >
          <Mail size={16} className="text-primary" />
          <span>We'll notify you by email when your letter is live.</span>
        </motion.div>

        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}

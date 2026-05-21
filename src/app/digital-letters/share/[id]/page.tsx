"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import LetterShare from "@/components/LetterShare";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeft, ExternalLink, Loader2 } from "lucide-react";

export default function LetterSharePage() {
  const params = useParams();
  const id = params?.id as string;
  const [letter, setLetter] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/letters/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.letter) setLetter(data.letter);
        else setError(data.error || "Could not load letter");
      })
      .catch(() => setError("Network error"));
  }, [id]);

  if (error) {
    return (
      <main className="min-h-screen bg-background pt-32 px-6">
        <Header />
        <div className="max-w-xl mx-auto text-center py-20">
          <p className="text-red-400 font-bold">{error}</p>
          <Link href="/digital-letters/create" className="mt-6 inline-block text-primary font-bold text-sm">
            Start over
          </Link>
        </div>
      </main>
    );
  }

  if (!letter) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">Loading…</span>
      </main>
    );
  }

  const shareUrl = `${origin}/letter/${letter.qr_identifier}`;
  const whatsappText = encodeURIComponent(
    `I made you a digital letter ✨ Open it here: ${shareUrl}`
  );

  return (
    <main className="min-h-screen bg-background pt-28 pb-20 px-4">
      <Header />
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/30 mb-6">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-medium tracking-tight font-serif leading-none mb-3">
            Your Letter is <span className="gradient-text italic">Live</span>
          </h1>
          <p className="text-muted-foreground font-medium italic font-serif">
            Share this link with {letter.recipient_name} — they'll see your message animate to life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-foreground/5 p-8 rounded-[40px] border border-border space-y-6">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                Share URL
              </div>
              <div className="font-mono text-sm break-all text-primary bg-background/40 rounded-2xl p-4 border border-border">
                {shareUrl}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/?text=${whatsappText}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 rounded-2xl bg-green-500 text-white font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Send via WhatsApp
                <ExternalLink size={14} />
              </a>
              <Link
                href={`/letter/${letter.qr_identifier}`}
                target="_blank"
                className="w-full py-4 rounded-2xl glass border border-border font-black text-xs uppercase tracking-[0.2em] hover:bg-foreground/5 transition-all flex items-center justify-center gap-2"
              >
                Preview the Letter
                <ExternalLink size={14} />
              </Link>
            </div>

            <Link
              href="/profile"
              className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft size={14} />
              Back to dashboard
            </Link>
          </div>

          <div className="flex items-center justify-center">
            {origin && <LetterShare id={letter.qr_identifier} url={shareUrl} />}
          </div>
        </div>
      </div>
    </main>
  );
}

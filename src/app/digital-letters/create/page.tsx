"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import DigitalLetterForm from "@/components/DigitalLetterForm";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

function CreatePageContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth?redirect=digital-letters/create");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div className="text-sm font-black tracking-widest animate-pulse">Loading…</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-28 pb-20 px-4">
      <Header />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 px-4">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass border border-accent/20 mb-6 text-[10px] font-bold text-accent tracking-[0.4em]">
            Digital Letter
          </div>
          <h1 className="text-4xl sm:text-6xl font-medium tracking-tight font-serif leading-none">
            Craft Your <span className="gradient-text">Letter</span>
          </h1>
        </div>
        <DigitalLetterForm mode="user" />
      </div>
    </main>
  );
}

export default function CreateDigitalLetterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>}>
      <CreatePageContent />
    </Suspense>
  );
}

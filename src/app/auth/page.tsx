"use client";

import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col justify-center items-center px-6 relative overflow-hidden transition-colors duration-500 font-outfit">
      <Header />
      
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full gpu-accelerated opacity-40 dark:bg-primary/20 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/10 blur-[120px] rounded-full gpu-accelerated opacity-40 dark:bg-accent/20 pointer-events-none" />

      <div className="w-full py-20 relative z-10">
          <div className="flex flex-col items-center mb-12">
            <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-primary/30">
              <span className="text-3xl font-black text-white">B</span>
            </div>
          </div>

          <Suspense fallback={
            <div className="w-full max-w-md mx-auto p-8 rounded-[48px] glass border border-border shadow-3xl text-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 rounded-full gradient-bg opacity-50 mb-4" />
                <div className="h-4 bg-muted w-32 rounded-full mb-2" />
                <div className="h-8 bg-muted w-48 rounded-full" />
              </div>
            </div>
          }>
            <AuthForm />
          </Suspense>

       
      </div>
    </main>
  );
}

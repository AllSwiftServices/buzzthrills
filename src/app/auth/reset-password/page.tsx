"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import { Lock, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage({ type: 'success', text: "Password updated successfully!" });
      setTimeout(() => router.push("/auth"), 2000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col justify-center items-center px-6 relative overflow-hidden transition-colors duration-500 font-outfit">
      <Header />
      
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full gpu-accelerated opacity-40 dark:bg-primary/20 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/10 blur-[120px] rounded-full gpu-accelerated opacity-40 dark:bg-accent/20 pointer-events-none" />

      <div className="w-full max-w-md py-20 relative z-10">
        <Reveal>
          <div className="flex flex-col items-center mb-12">
            <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-primary/30">
              <span className="text-3xl font-black text-white">B</span>
            </div>
            <h2 className="text-3xl font-black mb-2 text-center">Set New Password</h2>
            <p className="text-muted-foreground text-sm text-center">
              Almost there! Type in your new secure password.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={handleReset} className="p-8 rounded-[32px] glass border border-border shadow-2xl bg-background/50 backdrop-blur-xl relative overflow-hidden">
            <div className="space-y-4">
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="password"
                  required
                  placeholder="New Password"
                  className="w-full bg-foreground/5 border border-border rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary focus:bg-background transition-all text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl text-xs font-bold ${
                    message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}
                >
                  {message.text}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl gradient-bg text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Update Password
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </main>
  );
}

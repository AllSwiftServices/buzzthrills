"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Globe, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        router.push("/profile");
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            },
          },
        });
        if (error) throw error;
        setMessage({ type: 'success', text: "Verification email sent! Please check your inbox." });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="p-8 rounded-[32px] glass border border-border shadow-2xl relative overflow-hidden bg-background/50 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full -mr-16 -mt-16" />
        
        <div className="text-center mb-8 relative z-10">
          <h2 className="text-3xl font-black mb-2">
            {isLogin ? "Welcome Back" : "Join the Squad"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isLogin ? "Your Superheroes are waiting to thrill you." : "Start sending surprises that people never forget."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="text"
                    required={!isLogin}
                    placeholder="Full Name"
                    className="w-full bg-foreground/5 border border-border rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary transition-all text-sm"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="email"
              required
              placeholder="Email Address"
              className="w-full bg-foreground/5 border border-border rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary transition-all text-sm"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="password"
              required
              placeholder="Password"
              className="w-full bg-foreground/5 border border-border rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary transition-all text-sm"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            className="w-full py-4 rounded-2xl gradient-bg text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {isLogin ? "Login Now" : "Create Account"}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px grow bg-border" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Or continue with</span>
            <div className="h-px grow bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-border hover:bg-foreground/5 transition-all text-sm font-bold">
              <Globe size={18} />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-border hover:bg-foreground/5 transition-all text-sm font-bold">
              <Globe size={18} />
              Outlook
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground relative z-10">
          {isLogin ? "New to the squad?" : "Already a Superhero?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-bold hover:underline"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
}

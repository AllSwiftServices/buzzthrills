"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Globe, Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthForm() {
  const { setAuth } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'verify' | 'reset'>('login');
  const [authType, setAuthType] = useState<'signup' | 'forgot'>('signup');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const redirectParams = {
    mode: searchParams.get('redirect'),
    plan: searchParams.get('plan'),
    cycle: searchParams.get('cycle')
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    newPassword: "",
    fullName: "",
    otp: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setMessage({ type: 'success', text: "New magic code sent! ✨" });
      startResendCooldown();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'login') {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });
        const data = await res.json();
        if (data.error) {
          if (data.unverified) {
             setMode('verify');
             setMessage({ type: 'success', text: "Please verify your email to continue." });
          } else {
             throw new Error(data.error);
          }
        } else {
           // Success — hard navigate to bypass stale service worker
           setAuth(data.user, data.accessToken);
           
           if (redirectParams.mode === 'checkout' && redirectParams.plan) {
             window.location.href = `/checkout?plan=${redirectParams.plan}&cycle=${redirectParams.cycle || 'monthly'}`;
           } else if (redirectParams.mode) {
             window.location.href = redirectParams.mode;
           } else {
             window.location.href = data.user.role === 'admin' ? '/admin' : '/profile';
           }
        }
      } else if (mode === 'signup') {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: formData.email, 
            password: formData.password, 
            fullName: formData.fullName 
          }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        
        setMode('verify');
        setMessage({ type: 'success', text: "Verification code sent! Check your inbox." });

      } else if (mode === 'forgot') {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setAuthType('forgot');
        setMode('verify');
        setMessage({ type: 'success', text: data.message });

      } else if (mode === 'verify') {
        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, code: formData.otp }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        if (authType === 'forgot') {
          setMode('reset');
          setMessage({ type: 'success', text: "Magic code verified! Set your new password." });
        } else {
          // Signup flow
          setAuth(data.user, data.accessToken);
          if (redirectParams.mode === 'checkout' && redirectParams.plan) {
            window.location.href = `/checkout?plan=${redirectParams.plan}&cycle=${redirectParams.cycle || 'monthly'}`;
          } else if (redirectParams.mode) {
             window.location.href = redirectParams.mode;
          } else {
            window.location.href = data.user.role === 'admin' ? '/admin' : '/profile';
          }
        }

      } else if (mode === 'reset') {
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, otp: formData.otp, newPassword: formData.newPassword }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setMessage({ type: 'success', text: "Password reset successful! Sign in now. ✨" });
        setTimeout(() => setMode('login'), 2000);

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
          <h2 className="text-3xl font-black mb-2 italic uppercase tracking-tighter">
            {mode === 'login' ? <><span className="gradient-text italic">Sign</span> In</> : mode === 'signup' ? <>Create <span className="gradient-text italic">Account</span></> : mode === 'forgot' ? <>Recover <span className="gradient-text italic">Account</span></> : mode === 'reset' ? <>Set <span className="gradient-text italic">New Password</span></> : <>Verify <span className="gradient-text italic">Email</span></>}
          </h2>
          <p className="text-muted-foreground text-sm">
            {mode === 'login' 
              ? "Sign in to continue sending surprises." 
              : mode === 'signup' 
                ? "Start sending surprises that people never forget."
                : mode === 'verify'
                  ? `Enter the verification code we sent to ${formData.email}`
                  : mode === 'reset'
                    ? "Enter your new strong password below."
                    : "Enter your email to receive a recovery link."
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <AnimatePresence mode="wait">
            {mode === 'signup' && (
              <motion.div
                key="signup-fields"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="relative group mb-4">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    className="w-full bg-foreground/5 border border-border rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary focus:bg-background transition-all text-sm"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </motion.div>
            )}

            {mode === 'verify' && (
              <motion.div
                key="verify-fields"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="relative group mb-4">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="6-Digit Magic Code"
                    className="w-full bg-foreground/5 border border-border rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary focus:bg-background transition-all text-center text-2xl font-black tracking-[1em]"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  />
                </div>
                <div className="text-center mb-4">
                  <button
                    type="button"
                    disabled={resendCooldown > 0}
                    onClick={handleResendOTP}
                    className={`text-xs font-bold transition-all ${
                      resendCooldown > 0 ? "text-muted-foreground opacity-50" : "text-primary hover:underline hover:scale-105 active:scale-95"
                    }`}
                  >
                    {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : "Didn't get it? Resend Code"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {(mode === 'login' || mode === 'signup' || mode === 'forgot') && (
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="email"
                required
                placeholder="Email Address"
                className="w-full bg-foreground/5 border border-border rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary focus:bg-background transition-all text-sm"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          )}

          {(mode === 'login' || mode === 'signup' || mode === 'reset') && (
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder={mode === 'reset' ? "New Password" : "Password"}
                className="w-full bg-foreground/5 border border-border rounded-2xl py-3.5 pl-12 pr-12 outline-none focus:border-primary focus:bg-background transition-all text-sm"
                value={mode === 'reset' ? formData.newPassword : formData.password}
                onChange={(e) => setFormData({ ...formData, [mode === 'reset' ? 'newPassword' : 'password']: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex justify-end">
              <button 
                type="button"
                onClick={() => setMode('forgot')}
                className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

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
            className="w-full py-4 rounded-2xl gradient-bg text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:hover:scale-100"
          >
             {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {mode === 'login' ? "Login Now" : mode === 'signup' ? "Create Account" : mode === 'verify' ? "Verify & Activate" : mode === 'reset' ? "Update Password" : "Send Magic Code"}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Social logins removed as per request */}

        <div className="mt-8 text-center text-sm text-muted-foreground relative z-10">
          {mode === 'forgot' ? (
            <button
              onClick={() => setMode('login')}
              className="text-primary font-bold hover:underline"
            >
              Back to Login
            </button>
          ) : (
            <>
              {mode === 'login' ? "New here?" : "Already have an account?"}{" "}
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-primary font-bold hover:underline"
              >
                {mode === 'login' ? "Sign Up" : "Log In"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

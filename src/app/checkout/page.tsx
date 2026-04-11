"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import { PAYSTACK_PUBLIC_KEY } from "@/lib/paystack";
import { motion } from "framer-motion";
import { Zap, Shield, Star, CreditCard, ChevronRight, Loader2 } from "lucide-react";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "lite";
  const cycle = searchParams.get("cycle") || "monthly";
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const prices = {
    lite: { monthly: 15000, annual: 14250, label: "Lite Plan", icon: <Star size={24} /> },
    plus: { monthly: 45000, annual: 42750, label: "Plus Plan", icon: <Zap size={24} /> },
    orbit: { monthly: 120000, annual: 114000, label: "Orbit Plan", icon: <Shield size={24} /> }
  };

  const selectedPlan = (plan.toLowerCase() as keyof typeof prices) || "lite";
  const planData = prices[selectedPlan];
  const amount = planData[cycle as 'monthly' | 'annual'];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/auth?redirect=checkout&plan=${plan}&cycle=${cycle}`);
    }
  }, [user, authLoading, router, plan, cycle]);

  const handlePayment = () => {
    if (!window.PaystackPop) {
      alert("Payment gateway loading...");
      return;
    }

    setLoading(true);

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: user?.email,
      amount: amount * (cycle === 'annual' ? 12 : 1) * 100, // Total for the period
      currency: "NGN",
      metadata: {
        plan: selectedPlan,
        cycle: cycle,
        user_id: user?.id,
        purchase_type: "subscription"
      },
      callback: function(response: any) {
        fetch(`/api/payments/verify?reference=${response.reference}`)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              router.push("/profile?success=true");
            } else {
              alert("Verification failed.");
            }
          })
          .catch(() => alert("Error verifying payment."))
          .finally(() => setLoading(false));
      },
      onClose: function() {
        setLoading(false);
      }
    });

    handler.openIframe();
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div className="text-sm font-black uppercase tracking-widest animate-pulse">Authenticating Checkout...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-6">
      <Header />
      
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-8 sm:p-12 rounded-[48px] border border-border shadow-huge relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full -mr-16 -mt-16" />
          
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center text-white shadow-xl">
              {planData.icon}
            </div>
            <div>
              <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none">{planData.label}</h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">{cycle} Billing Cycle</p>
            </div>
          </div>

          <div className="space-y-6 pt-10 border-t border-border">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-bold uppercase tracking-widest">Base Subscription</span>
              <span className="font-black">₦{amount.toLocaleString()} / mo</span>
            </div>
            <div className="flex justify-between items-center pt-6 border-t border-border mt-8">
              <span className="text-sm font-black uppercase tracking-[0.2em] italic">Total Due Now</span>
              <div className="text-right">
                <div className="text-3xl font-black gradient-text tracking-tighter">₦{(amount * (cycle === 'annual' ? 12 : 1)).toLocaleString()}</div>
                {cycle === 'annual' && <div className="text-[9px] font-black text-green-500 uppercase tracking-widest mt-1">Includes 5% Yearly Discount ✨</div>}
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full mt-12 py-6 rounded-[32px] gradient-bg text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <CreditCard size={18} />
                Secure Checkout
                <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
          
          <p className="mt-8 text-center text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">
            Secured by Paystack • 256-Bit Encryption
          </p>
        </motion.div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

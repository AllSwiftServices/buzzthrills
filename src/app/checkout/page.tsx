"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import { PAYSTACK_PUBLIC_KEY } from "@/lib/paystack";
import { motion } from "framer-motion";
import { CreditCard, ChevronRight, Loader2 } from "lucide-react";
import { SUBSCRIPTION_PLANS, PLAN_ICONS, getCycleMultiplier, type BillingCycle, type PlanId } from "@/lib/plans";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = (searchParams.get("plan") || "lite").toLowerCase();
  const cycleParam = (searchParams.get("cycle") || "monthly").toLowerCase();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const planId = (planParam in SUBSCRIPTION_PLANS ? planParam : "lite") as PlanId;
  const cycle: BillingCycle = cycleParam === "annual" ? "annual" : "monthly";
  const planData = SUBSCRIPTION_PLANS[planId];
  const Icon = PLAN_ICONS[planData.iconName];
  const amount = cycle === "annual" ? planData.annualPrice : planData.monthlyPrice;
  const totalDue = amount * getCycleMultiplier(cycle);

  useEffect(() => {
    if (planData.isCustom) {
      router.replace("/corporate");
      return;
    }
    if (!authLoading && !user) {
      router.push(`/auth?redirect=checkout&plan=${planId}&cycle=${cycle}`);
    }
  }, [user, authLoading, router, planId, cycle, planData.isCustom]);

  const handlePayment = async () => {
    if (!window.PaystackPop) {
      alert("Payment gateway loading...");
      return;
    }

    setLoading(true);

    try {
      // Dynamically fetch or create the Paystack plan code
      const planRes = await fetch("/api/payments/get-or-create-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, cycle })
      });
      const planDataResp = await planRes.json();
      
      if (!planDataResp.planCode) {
        alert("Failed to initialize billing plan. Please try again.");
        setLoading(false);
        return;
      }

      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: user?.email,
        amount: totalDue * 100, // Total for the period in kobo
        currency: "NGN",
        plan: planDataResp.planCode, // This enables auto-renewal on Paystack
        metadata: {
          plan: planId,
          cycle: cycle,
          user_id: user?.id,
          purchase_type: "subscription",
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
    } catch (e) {
      console.error(e);
      alert("An error occurred during checkout setup.");
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div className="text-sm font-black tracking-widest animate-pulse">Authenticating Checkout...</div>
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
              <Icon size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter leading-none">{planData.name}</h1>
              <p className="text-[10px] font-medium tracking-widest text-muted-foreground mt-2">{cycle} Billing Cycle · {planData.totalCalls} calls / mo</p>
            </div>
          </div>

          <div className="space-y-6 pt-10 border-t border-border">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-bold tracking-widest">Base Subscription</span>
              <span className="font-black">₦{amount.toLocaleString()} / mo</span>
            </div>
            <div className="flex justify-between items-center pt-6 border-t border-border mt-8">
              <span className="text-sm font-black tracking-[0.2em]">Total Due Now</span>
              <div className="text-right">
                <div className="text-3xl font-black gradient-text tracking-tighter">₦{totalDue.toLocaleString()}</div>
                {cycle === 'annual' && <div className="text-[9px] font-black text-green-500 tracking-widest mt-1">Includes 5% Yearly Discount ✨</div>}
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full mt-12 py-6 rounded-[32px] gradient-bg text-white font-black text-sm tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <CreditCard size={18} />
                Secure Checkout
                <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
          
          <p className="mt-8 text-center text-[9px] font-medium tracking-widest text-muted-foreground opacity-40">
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

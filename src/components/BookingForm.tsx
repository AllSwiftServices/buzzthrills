"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, User, Phone, Mail, Gift, Clock, CreditCard, Plus, Trash2, Zap, Loader2 } from "lucide-react";
import { PAYSTACK_PUBLIC_KEY } from "@/lib/paystack";
import { useAuth } from "@/context/AuthContext";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

type Step = "subscriber" | "recipients" | "preferences" | "payment";

function BookingContent({ planType = "one-off" }: { planType?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cycle = searchParams.get("cycle") || "monthly";
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("subscriber");
  const [isExpress, setIsExpress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [clientData, setClientData] = useState({ name: "", email: "", phone: "" });
  const [recipients, setRecipients] = useState([{ name: "", phone: "", occasion: "Birthday", date: "", time: "morning" }]);

  useEffect(() => {
    async function checkSubscription() {
      if (!user) return;
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        if (data.subscription?.status === 'active') {
          setSubscription(data.subscription);
        }
      } catch (e) {
        console.error("Sub check failure", e);
      }
    }
    checkSubscription();
  }, [user]);

  const isSubscriber = subscription?.status === 'active';

  const prices = {
    lite: { monthly: 15000, annual: 14250 },
    plus: { monthly: 45000, annual: 42750 },
    orbit: { monthly: 120000, annual: 114000 },
    corporate: { monthly: 250000, annual: 250000 },
    "one-off": { monthly: 15000, annual: 15000 }
  };

  const selectedPlan = (planType.toLowerCase() as keyof typeof prices) || "one-off";
  const planBasePrice = prices[selectedPlan]?.[cycle as 'monthly' | 'annual'] || 15000;
  const expressCharge = isExpress ? 2000 : 0;
  const totalPrice = planBasePrice + expressCharge;

  const addRecipient = () => {
    setRecipients([...recipients, { name: "", phone: "", occasion: "Birthday", date: "", time: "morning" }]);
  };

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const handlePaystackPayment = () => {
    if (!window.PaystackPop) {
      alert("Payment gateway is loading, please try again in a moment.");
      return;
    }

    if (!clientData.email) {
      alert("Please provide a valid email address.");
      setStep("subscriber");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: clientData.email,
      amount: totalPrice * 100, // Amount in kobo
      metadata: {
        plan: selectedPlan,
        cycle: cycle,
        user_id: user?.id,
        is_express: isExpress,
        client_name: clientData.name,
      },
      callback: function(response: any) {
        // Verify payment on server
        fetch(`/api/payments/verify?reference=${response.reference}`)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              router.push("/checkout/success");
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          })
          .catch(err => {
            console.error(err);
            alert("An error occurred during verification.");
          });
      },
      onClose: function() {
        alert("Payment cancelled.");
      }
    });

    handler.openIframe();
  };

  const handleSubscriberBooking = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients,
          preferences: recipients.map(r => ({ time: r.time })),
          isExpress,
          plan_id: subscription.id
        })
      });
      if (res.ok) {
        router.push("/checkout/success");
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (e) {
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === "subscriber") setStep("recipients");
    else if (step === "recipients") setStep("preferences");
    else if (step === "preferences") {
      if (isSubscriber) {
        handleSubscriberBooking();
      } else {
        setStep("payment");
      }
    }
    else if (step === "payment") {
       handlePaystackPayment();
    }
  };

  const prevStep = () => {
    if (step === "recipients") setStep("subscriber");
    else if (step === "preferences") setStep("recipients");
    else if (step === "payment") setStep("preferences");
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass p-6 sm:p-8 md:p-12 min-h-[500px] sm:min-h-[600px] flex flex-col border border-border shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 gradient-bg opacity-50" />
      
      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-8 md:mb-12 relative px-2">
        <div className="absolute top-1/2 left-0 w-full h-px bg-border -translate-y-1/2 z-0" />
        {(isSubscriber ? ["subscriber", "recipients", "preferences"] : ["subscriber", "recipients", "preferences", "payment"]).map((s, i, arr) => (
          <div 
            key={s} 
            className={`relative z-10 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-xs md:text-sm transition-all border-2 ${
              step === s ? 'gradient-bg border-transparent text-white scale-110 shadow-lg shadow-primary/20' : 
              i < arr.indexOf(step) ? 'bg-primary border-primary text-white' : 'bg-muted border-border text-muted-foreground'
            }`}
          >
            {i < arr.indexOf(step) ? <Check size={14} className="md:w-[18px] md:h-[18px]" /> : i + 1}
            
            {/* Step Label - Mobile Only (Hidden for space, but used for accessibility) */}
            <span className="sr-only">{s}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === "subscriber" && (
          <motion.div
            key="subscriber"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-grow space-y-8"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 tracking-tighter uppercase italic">Client <span className="gradient-text italic">Profile</span></h2>
              <p className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">Enter the details of the person placing this order.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Full Name</label>
                <div className="relative group">
                  <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    value={clientData.name}
                    onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                    className="w-full bg-foreground/5 border border-border rounded-[24px] py-5 pl-14 pr-6 focus:border-primary transition-all outline-none font-bold" 
                    placeholder="Hero Name" 
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Email Address</label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    type="email" 
                    value={clientData.email}
                    onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                    className="w-full bg-foreground/5 border border-border rounded-[24px] py-5 pl-14 pr-6 focus:border-primary transition-all outline-none font-bold" 
                    placeholder="hero@buzzthrills.com" 
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    type="tel" 
                    value={clientData.phone}
                    onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                    className="w-full bg-foreground/5 border border-border rounded-[24px] py-5 pl-14 pr-6 focus:border-primary transition-all outline-none font-bold" 
                    placeholder="+234 ..." 
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Preferred Frequency</label>
                <select className="w-full bg-foreground/5 border border-border rounded-[24px] py-4 sm:py-5 px-6 sm:px-8 focus:border-primary transition-all outline-none appearance-none font-bold cursor-pointer text-sm">
                  <option className="bg-background text-foreground">WhatsApp Channel</option>
                  <option className="bg-background text-foreground">Direct Email</option>
                  <option className="bg-background text-foreground">Phone Call</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {step === "recipients" && (
          <motion.div
            key="recipients"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-grow space-y-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 tracking-tighter uppercase italic">Recipient <span className="gradient-text italic">Details</span></h2>
                <p className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">Who are we celebrating today?</p>
              </div>
              <button 
                onClick={addRecipient}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl glass border-primary/20 text-primary text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/5"
              >
                <Plus size={16} />
                Add Recipient
              </button>
            </div>

            <div className="space-y-8 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
              {recipients.map((r, i) => (
                <div key={i} className="p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] bg-foreground/5 border border-border relative group hover:border-primary/20 transition-all">
                  {recipients.length > 1 && (
                    <button 
                      onClick={() => removeRecipient(i)}
                      className="absolute top-4 right-4 sm:top-6 sm:right-6 text-foreground/20 hover:text-red-400 transition-all p-2 rounded-xl hover:bg-red-400/10"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Recipient Name</label>
                       <input type="text" className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 focus:border-primary outline-none text-sm font-bold" placeholder="First Name / Nickname" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Phone Pulse</label>
                       <input type="tel" className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 focus:border-primary outline-none text-sm font-bold" placeholder="+234 ..." />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Occasion Type</label>
                       <select className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 focus:border-primary outline-none text-sm font-bold cursor-pointer">
                          <option className="bg-background text-foreground">Birthday</option>
                          <option className="bg-background text-foreground">Anniversary</option>
                          <option className="bg-background text-foreground">Appreciation</option>
                          <option className="bg-background text-foreground">Celebration</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Arrival Date</label>
                       <input type="date" className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 focus:border-primary outline-none text-sm font-bold" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === "preferences" && (
          <motion.div
            key="preferences"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-grow space-y-12"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 tracking-tighter uppercase italic">Service <span className="gradient-text italic">Preferences</span></h2>
              <p className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">Customize the timing and delivery details.</p>
            </div>

            <div className="grid grid-cols-1 gap-10">
              <div className="space-y-6">
                <label className="text-xs font-black text-primary uppercase tracking-[0.2em]">Service Time Window</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'morning', label: 'Morning', note: '06:00 - 11:00' },
                    { id: 'afternoon', label: 'Afternoon', note: '12:00 - 17:00' },
                    { id: 'night', label: 'Evening', note: '18:00 - 21:00' }
                  ].map(slot => (
                    <button 
                      key={slot.id}
                      onClick={() => setRecipients(recipients.map(r => ({ ...r, time: slot.id })))}
                      className={`p-6 rounded-3xl border-2 transition-all text-left group ${
                        recipients[0].time === slot.id ? 'bg-primary/10 border-primary shadow-xl shadow-primary/10 scale-105' : 'glass border-border hover:border-foreground/20'
                      }`}
                    >
                      <Clock size={20} className={recipients[0].time === slot.id ? 'text-primary' : 'text-foreground/20'} />
                      <div className="mt-4 font-black text-sm uppercase tracking-tighter">{slot.label}</div>
                      <div className="text-[10px] text-muted-foreground font-bold italic">{slot.note}</div>
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-muted-foreground font-bold italic bg-foreground/5 p-4 rounded-2xl inline-block px-6">
                   💡 Note: We recommend booking at least 48 hours in advance for guaranteed service delivery.
                </div>
              </div>

              <div 
                onClick={() => setIsExpress(!isExpress)}
                className={`p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border-2 cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group ${
                  isExpress ? 'bg-primary/10 border-primary shadow-2xl shadow-primary/20' : 'glass border-border hover:border-foreground/10'
                }`}
              >
                <div className="flex items-center gap-4 sm:gap-6">
                   <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[32px] flex items-center justify-center transition-all ${isExpress ? 'bg-primary text-white scale-110 sm:rotate-12' : 'bg-foreground/5 text-foreground/20'}`}>
                      <Zap size={24} className="sm:w-8 sm:h-8" />
                   </div>
                   <div>
                      <div className={`font-black text-lg sm:text-xl mb-1 transition-colors tracking-tight uppercase italic ${isExpress ? 'text-primary' : 'text-foreground'}`}>Priority <span className="gradient-text italic">Express</span>Delivery ✨</div>
                      <div className="text-muted-foreground font-black uppercase tracking-widest text-[9px] sm:text-[10px]">Skip the queue. Recipient contacted within 4 hours.</div>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <span className={`text-xl font-black italic transition-colors ${isExpress ? 'text-primary' : 'text-foreground/20'}`}>+₦2,000</span>
                   <div className={`w-14 h-8 rounded-full transition-all relative p-1 ${isExpress ? 'bg-primary' : 'bg-foreground/10'}`}>
                      <motion.div 
                        animate={{ x: isExpress ? 24 : 0 }}
                        className="w-6 h-6 rounded-full bg-white shadow-xl" 
                      />
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === "payment" && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-grow flex flex-col items-center justify-center text-center py-12"
          >
            <div className="w-24 h-24 rounded-[32px] gradient-bg flex items-center justify-center mb-10 shadow-huge animate-pulse relative">
               <div className="absolute inset-0 bg-primary blur-[40px] opacity-20" />
               <CreditCard size={36} className="text-white relative z-10" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4 tracking-tighter uppercase italic">Ready to <span className="gradient-text italic">Proceed?</span></h2>
            <p className="text-muted-foreground font-bold tracking-tight mb-8 sm:mb-12 max-w-sm leading-relaxed uppercase text-[9px] sm:text-[10px] tracking-widest sm:tracking-[0.2em]">
              Redirecting to Paystack for secure payment. You will receive an order confirmation email instantly.
            </p>
            
            <div className="w-full max-w-md p-6 sm:p-10 rounded-[48px] sm:rounded-[56px] glass border border-border shadow-3xl relative overflow-hidden text-left">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full -mr-16 -mt-16" />
               
               <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-center group">
                    <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Service Package ({planType})</span>
                    <span className="font-black text-lg">₦{planBasePrice.toLocaleString()}</span>
                  </div>
                  {isExpress && (
                    <div className="flex justify-between items-center text-primary">
                      <span className="font-black uppercase tracking-widest text-[10px]">Express Service</span>
                      <span className="font-black text-lg">+₦2,000</span>
                    </div>
                  )}
                  <div className="pt-6 border-t border-border flex justify-between items-center bg-foreground/2 -mx-6 -mb-6 p-6 sm:p-10 sm:-mx-10 sm:-mb-10 mt-8">
                    <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] italic">Total Amount</span>
                    <span className="text-2xl sm:text-3xl font-black gradient-text tracking-tighter">₦{totalPrice.toLocaleString()}</span>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 sm:mt-12 flex justify-between items-center pt-6 sm:pt-8 border-t border-border">
          <button 
            onClick={prevStep}
            disabled={step === "subscriber"}
            className={`flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-4 sm:py-5 rounded-[32px] font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all ${step === "subscriber" ? 'opacity-0 pointer-events-none' : 'glass border border-border hover:border-foreground/20 text-foreground/60 hover:text-foreground hover:scale-105 active:scale-95'}`}
          >
            <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Previous Step</span>
            <span className="xs:hidden">Back</span>
          </button>
          <button 
            onClick={nextStep}
            disabled={loading}
            className="flex items-center gap-2 sm:gap-3 px-8 sm:px-12 py-4 sm:py-5 rounded-[32px] gradient-bg text-white font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all group disabled:opacity-50"
          >
            <span className="group-hover:mr-2 transition-all">
              {loading ? "Processing..." : step === "payment" ? "Complete Payment" : isSubscriber && step === "preferences" ? "Confirm Surprise ✨" : "Next Step"}
            </span>
            {loading ? <Loader2 className="animate-spin" size={16} /> : (step !== "payment" && !(isSubscriber && step === "preferences") ? <ChevronRight size={18} className="sm:w-5 sm:h-5" /> : <Zap size={18} className="sm:w-5 sm:h-5 animate-pulse" />)}
          </button>
      </div>
    </div>
  );
}

export default function BookingForm(props: { planType?: string }) {
  return (
    <Suspense fallback={<div className="p-12 text-center font-black animate-pulse uppercase tracking-widest text-primary">Initializing Gear...</div>}>
      <BookingContent {...props} />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, User, Phone, Mail, Gift, Clock, CreditCard, Plus, Trash2 } from "lucide-react";

type Step = "subscriber" | "recipients" | "preferences" | "payment";

export default function BookingForm({ planType = "one-off" }: { planType?: string }) {
  const [step, setStep] = useState<Step>("subscriber");
  const [recipients, setRecipients] = useState([{ name: "", phone: "", occasion: "Birthday", date: "", time: "morning" }]);

  const addRecipient = () => {
    setRecipients([...recipients, { name: "", phone: "", occasion: "Birthday", date: "", time: "morning" }]);
  };

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (step === "subscriber") setStep("recipients");
    else if (step === "recipients") setStep("preferences");
    else if (step === "preferences") setStep("payment");
  };

  const prevStep = () => {
    if (step === "recipients") setStep("subscriber");
    else if (step === "preferences") setStep("recipients");
    else if (step === "payment") setStep("preferences");
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass p-8 md:p-12 min-h-[600px] flex flex-col border border-border">
      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-8 md:mb-12 relative px-2">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-border -translate-y-1/2 z-0" />
        {["subscriber", "recipients", "preferences", "payment"].map((s, i) => (
          <div 
            key={s} 
            className={`relative z-10 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all border-2 ${
              step === s ? 'gradient-bg border-transparent text-white scale-110 shadow-lg shadow-primary/20' : 
              i < ["subscriber", "recipients", "preferences", "payment"].indexOf(step) ? 'bg-primary border-primary text-white' : 'bg-muted border-border text-muted-foreground'
            }`}
          >
            {i < ["subscriber", "recipients", "preferences", "payment"].indexOf(step) ? <Check size={14} className="md:w-[18px] md:h-[18px]" /> : i + 1}
            
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
            className="flex-grow"
          >
            <h2 className="text-3xl font-black mb-8">Subscriber <span className="gradient-text">Information</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="text" className="w-full bg-foreground/5 border border-border rounded-2xl py-4 pl-12 pr-4 focus:border-primary transition-colors outline-none" placeholder="John Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="email" className="w-full bg-foreground/5 border border-border rounded-2xl py-4 pl-12 pr-4 focus:border-primary transition-colors outline-none" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Phone Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="tel" className="w-full bg-foreground/5 border border-border rounded-2xl py-4 pl-12 pr-4 focus:border-primary transition-colors outline-none" placeholder="+234 ..." />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Preferred Contact</label>
                <select className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 focus:border-primary transition-colors outline-none appearance-none">
                  <option className="bg-background text-foreground">WhatsApp</option>
                  <option className="bg-background text-foreground">Email</option>
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
            className="flex-grow"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black">Recipient <span className="gradient-text">Details</span></h2>
              <button 
                onClick={addRecipient}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass border-primary/20 text-primary text-sm font-bold"
              >
                <Plus size={16} />
                Add Recipient
              </button>
            </div>

            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 scrollbar-hide">
              {recipients.map((r, i) => (
                <div key={i} className="p-6 rounded-[32px] bg-white/5 border border-white/10 relative group">
                  {recipients.length > 1 && (
                    <button 
                      onClick={() => removeRecipient(i)}
                      className="absolute top-4 right-4 text-white/20 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" className="bg-foreground/5 border border-border rounded-xl py-3 px-4 focus:border-primary outline-none text-sm" placeholder="Recipient Name" />
                    <input type="tel" className="bg-foreground/5 border border-border rounded-xl py-3 px-4 focus:border-primary outline-none text-sm" placeholder="Phone Number" />
                    <select className="bg-foreground/5 border border-border rounded-xl py-3 px-4 focus:border-primary outline-none text-sm">
                      <option className="bg-background text-foreground">Birthday</option>
                      <option className="bg-background text-foreground">Anniversary</option>
                      <option className="bg-background text-foreground">Appreciation</option>
                      <option className="bg-background text-foreground">Prank</option>
                    </select>
                    <input type="date" className="bg-foreground/5 border border-border rounded-xl py-3 px-4 focus:border-primary outline-none text-sm" />
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
            className="flex-grow"
          >
            <h2 className="text-3xl font-black mb-8">Additional <span className="gradient-text">Preferences</span></h2>
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-white/60 uppercase tracking-widest">Call Anonymity</label>
                <div className="flex gap-4">
                  {["Anonymous", "Mention my name"].map(opt => (
                    <button key={opt} className="px-6 py-4 rounded-2xl glass border-border flex-1 font-bold hover:border-primary transition-all">
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 flex items-center justify-between">
                <div>
                  <div className="font-black text-lg text-primary">Express Delivery ✨</div>
                  <div className="text-sm text-muted-foreground italic">Deliver your surprise immediately.</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-primary">+₦2,000</span>
                  <div className="w-12 h-6 bg-foreground/10 rounded-full cursor-pointer relative">
                    <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-background transition-all shadow-lg" />
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
            className="flex-grow flex flex-col items-center justify-center text-center"
          >
            <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mb-8 shadow-2xl shadow-primary/40 animate-pulse">
              <CreditCard size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-black mb-4">Ready to <span className="gradient-text">Buzz?</span></h2>
            <p className="text-muted-foreground mb-12 max-w-md">
              Secure payment via Paystack. You'll receive a confirmation email immediately after payment is successful.
            </p>
            <div className="w-full p-8 rounded-[40px] glass border border-border mb-8 max-w-sm">
              <div className="flex justify-between mb-4">
                <span className="text-muted-foreground">Subscription ({planType})</span>
                <span className="font-bold">₦15,000</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t border-border pt-4">
                <span>Total</span>
                <span className="gradient-text tracking-tighter">₦15,000</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 flex justify-between">
        <button 
          onClick={prevStep}
          disabled={step === "subscriber"}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${step === "subscriber" ? 'opacity-0 pointer-events-none' : 'glass hover:bg-foreground/5 border-border'}`}
        >
          <ChevronLeft size={20} />
          Back
        </button>
        <button 
          onClick={nextStep}
          className="flex items-center gap-2 px-8 py-3 rounded-2xl gradient-bg text-white font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          {step === "payment" ? "Pay Now" : "Next Step"}
          {step !== "payment" && <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
}

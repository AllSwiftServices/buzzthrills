"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, User, Phone, Mail, Gift, Clock, CreditCard, Plus, Trash2, Zap } from "lucide-react";

type Step = "subscriber" | "recipients" | "preferences" | "payment";

export default function BookingForm({ planType = "one-off" }: { planType?: string }) {
  const [step, setStep] = useState<Step>("subscriber");
  const [isExpress, setIsExpress] = useState(false);
  const [recipients, setRecipients] = useState([{ name: "", phone: "", occasion: "Birthday", date: "", time: "morning" }]);

  const basePrice = planType === "plus" ? 25000 : planType === "orbit" ? 45000 : planType === "corporate" ? 100000 : 15000;
  const expressCharge = isExpress ? 2000 : 0;
  const totalPrice = basePrice + expressCharge;

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
    else if (step === "payment") {
       // Simulate redirect to Success Page
       window.location.href = "/checkout/success";
    }
  };

  const prevStep = () => {
    if (step === "recipients") setStep("subscriber");
    else if (step === "preferences") setStep("recipients");
    else if (step === "payment") setStep("preferences");
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass p-8 md:p-12 min-h-[600px] flex flex-col border border-border shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 gradient-bg opacity-50" />
      
      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-8 md:mb-12 relative px-2">
        <div className="absolute top-1/2 left-0 w-full h-px bg-border -translate-y-1/2 z-0" />
        {["subscriber", "recipients", "preferences", "payment"].map((s, i) => (
          <div 
            key={s} 
            className={`relative z-10 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-xs md:text-sm transition-all border-2 ${
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
            className="flex-grow space-y-8"
          >
            <div>
              <h2 className="text-4xl font-black mb-2">Superhero <span className="gradient-text">Identity</span></h2>
              <p className="text-muted-foreground font-bold tracking-tight">Tell us who is commissioning this mission.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Full Superhero Name</label>
                <div className="relative group">
                  <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input type="text" className="w-full bg-foreground/5 border border-border rounded-[24px] py-5 pl-14 pr-6 focus:border-primary transition-all outline-none font-bold" placeholder="Hero Name" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Heroic Email</label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input type="email" className="w-full bg-foreground/5 border border-border rounded-[24px] py-5 pl-14 pr-6 focus:border-primary transition-all outline-none font-bold" placeholder="hero@buzzthrills.com" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Phone Pulse</label>
                <div className="relative group">
                  <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input type="tel" className="w-full bg-foreground/5 border border-border rounded-[24px] py-5 pl-14 pr-6 focus:border-primary transition-all outline-none font-bold" placeholder="+234 ..." />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Preferred Frequency</label>
                <select className="w-full bg-foreground/5 border border-border rounded-[24px] py-5 px-8 focus:border-primary transition-all outline-none appearance-none font-bold cursor-pointer">
                  <option className="bg-background text-foreground">WhatsApp Channel</option>
                  <option className="bg-background text-foreground">Direct Email</option>
                  <option className="bg-background text-foreground">Secure Pulse Call</option>
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
                <h2 className="text-4xl font-black mb-2">Thrill <span className="gradient-text">Targets</span></h2>
                <p className="text-muted-foreground font-bold tracking-tight">Who are we surprising today?</p>
              </div>
              <button 
                onClick={addRecipient}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl glass border-primary/20 text-primary text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/5"
              >
                <Plus size={16} />
                Reserve Target
              </button>
            </div>

            <div className="space-y-8 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
              {recipients.map((r, i) => (
                <div key={i} className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 relative group hover:border-primary/20 transition-all">
                  {recipients.length > 1 && (
                    <button 
                      onClick={() => removeRecipient(i)}
                      className="absolute top-6 right-6 text-white/20 hover:text-red-400 transition-all p-2 rounded-xl hover:bg-red-400/10"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Target Name</label>
                       <input type="text" className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 focus:border-primary outline-none text-sm font-bold" placeholder="Target 001" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Phone Pulse</label>
                       <input type="tel" className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 focus:border-primary outline-none text-sm font-bold" placeholder="+234 ..." />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Celebration Logic</label>
                       <select className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 focus:border-primary outline-none text-sm font-bold cursor-pointer">
                          <option className="bg-background text-foreground">Mission: Birthday</option>
                          <option className="bg-background text-foreground">Mission: Anniversary</option>
                          <option className="bg-background text-foreground">Mission: Appreciation</option>
                          <option className="bg-background text-foreground">Mission: Random Smile</option>
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
              <h2 className="text-4xl font-black mb-2">Mission <span className="gradient-text">Procedures</span></h2>
              <p className="text-muted-foreground font-bold tracking-tight">Fine-tune the thrill execution details.</p>
            </div>

            <div className="grid grid-cols-1 gap-10">
              <div className="space-y-6">
                <label className="text-xs font-black text-primary uppercase tracking-[0.2em]">Mission Time Slot</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'morning', label: 'Morning Strike', note: '06:00 - 11:00' },
                    { id: 'afternoon', label: 'Mid-Day Surge', note: '12:00 - 17:00' },
                    { id: 'night', label: 'Evening Calm', note: '18:00 - 21:00' }
                  ].map(slot => (
                    <button 
                      key={slot.id}
                      onClick={() => setRecipients(recipients.map(r => ({ ...r, time: slot.id })))}
                      className={`p-6 rounded-3xl border-2 transition-all text-left group ${
                        recipients[0].time === slot.id ? 'bg-primary/10 border-primary shadow-xl shadow-primary/10 scale-105' : 'glass border-border hover:border-white/20'
                      }`}
                    >
                      <Clock size={20} className={recipients[0].time === slot.id ? 'text-primary' : 'text-white/20'} />
                      <div className="mt-4 font-black text-sm uppercase tracking-tighter">{slot.label}</div>
                      <div className="text-[10px] text-muted-foreground font-bold italic">{slot.note}</div>
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-muted-foreground font-bold italic bg-white/5 p-4 rounded-2xl inline-block px-6">
                   💡 Note: We recommend booking at least 48 hours in advance for guaranteed tactical success.
                </div>
              </div>

              <div 
                onClick={() => setIsExpress(!isExpress)}
                className={`p-8 rounded-[40px] border-2 cursor-pointer transition-all flex items-center justify-between group ${
                  isExpress ? 'bg-primary/10 border-primary shadow-2xl shadow-primary/20' : 'glass border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-6">
                   <div className={`w-16 h-16 rounded-[32px] flex items-center justify-center transition-all ${isExpress ? 'bg-primary text-white scale-110 rotate-12' : 'bg-white/5 text-white/20'}`}>
                      <Zap size={32} />
                   </div>
                   <div>
                      <div className={`font-black text-xl mb-1 transition-colors ${isExpress ? 'text-primary' : 'text-foreground'}`}>Tactical Express Delivery ✨</div>
                      <div className="text-sm text-muted-foreground font-bold tracking-tight">Skip the queue. Target reached within 4 hours.</div>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <span className={`text-xl font-black italic transition-colors ${isExpress ? 'text-primary' : 'text-white/20'}`}>+₦2,000</span>
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
            <h2 className="text-4xl font-black mb-4 tracking-tighter">Ready to <span className="gradient-text">Buzz?</span></h2>
            <p className="text-muted-foreground font-bold tracking-tight mb-12 max-w-sm leading-relaxed">
              Redirecting to Paystack for secure tactical funding. You will receive a mission confirmation email instantly.
            </p>
            
            <div className="w-full max-w-md p-10 rounded-[56px] glass border border-white/10 shadow-3xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full -mr-16 -mt-16" />
               
               <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-center group">
                    <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Mission Package ({planType})</span>
                    <span className="font-black text-lg">₦{basePrice.toLocaleString()}</span>
                  </div>
                  {isExpress && (
                    <div className="flex justify-between items-center text-primary">
                      <span className="font-black uppercase tracking-widest text-[10px]">Express Surge</span>
                      <span className="font-black text-lg">+₦2,000</span>
                    </div>
                  )}
                  <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                    <span className="text-sm font-black uppercase tracking-[0.2em] italic">Tactical Total</span>
                    <span className="text-3xl font-black gradient-text tracking-tighter">₦{totalPrice.toLocaleString()}</span>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 flex justify-between items-center pt-8 border-t border-white/5">
        <button 
          onClick={prevStep}
          disabled={step === "subscriber"}
          className={`flex items-center gap-3 px-8 py-5 rounded-[32px] font-black text-xs uppercase tracking-widest transition-all ${step === "subscriber" ? 'opacity-0 pointer-events-none' : 'glass border border-white/10 hover:border-white/20 text-white/60 hover:text-white hover:scale-105 active:scale-95'}`}
        >
          <ChevronLeft size={20} />
          Previous Phase
        </button>
        <button 
          onClick={nextStep}
          className="flex items-center gap-3 px-12 py-5 rounded-[32px] gradient-bg text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all group"
        >
          <span className="group-hover:mr-2 transition-all">{step === "payment" ? "Initiate Payment" : "Next Phase"}</span>
          {step !== "payment" ? <ChevronRight size={20} /> : <Zap size={20} className="animate-pulse" />}
        </button>
      </div>
    </div>
  );
}

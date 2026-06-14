"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, User, Phone, Mail, Gift, Clock, CreditCard, Plus, Trash2, Sparkles, Loader2, Star, Zap, PhoneCall, Globe, Heart, Music, Laugh, Crown, Calendar, Wand2 } from "lucide-react";
import { PAYSTACK_PUBLIC_KEY } from "@/lib/paystack";
import { useAuth } from "@/context/AuthContext";
import { CALL_SERVICES, CallService, CallVariant, ICON_MAP } from "@/lib/pricing_config";
import { getPlan } from "@/lib/plans";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

type Step = "type" | "subscriber" | "variant" | "recipients" | "message" | "preferences" | "payment";

const VARIANT_META: Record<CallVariant, { icon: any; blurb: string }> = {
  standard: { icon: Star, blurb: "The signature Buzzthrills delivery." },
  prank: { icon: Laugh, blurb: "Playful prank twist before the real moment." },
  music: { icon: Music, blurb: "A surprise jingle to set the mood." },
  both: { icon: Wand2, blurb: "Prank + music — the full thrill bundle." },
  special: { icon: Crown, blurb: "Custom premium touch, extended voice or theme." },
  "one-off": { icon: Zap, blurb: "A single, standalone surprise." },
  monthly: { icon: Calendar, blurb: "Delivered every month — set it and forget it." },
};

const TITLE_OPTIONS = ["", "Miss", "Mr.", "Mrs.", "Ms.", "Dr."] as const;
const GENDER_OPTIONS = ["", "Female", "Male", "Non-binary", "Prefer not to say"] as const;
const RELATIONSHIP_OPTIONS = ["Partner", "Friend", "Family", "Crush", "Client", "Self", "Other"] as const;
const SUPPORT_TONES = ["Soft & comforting", "Encouraging & uplifting", "Calm & reassuring"] as const;
const BOLDNESS_OPTIONS = ["Gentle", "Confident", "Very bold"] as const;
const SELF_LOVE_FOR_OPTIONS = ["For me", "For someone else"] as const;

type Recipient = {
  name: string;
  phone: string;
  occasion: string;
  date: string;
  time: string;
  title: string;
  gender: string;
  location: string;
  relationship: string;
  youCallThem: string;
  theyCallYou: string;
};

const emptyRecipient = (occasion: string): Recipient => ({
  name: "",
  phone: "",
  occasion,
  date: "",
  time: "morning",
  title: "",
  gender: "",
  location: "",
  relationship: "Friend",
  youCallThem: "",
  theyCallYou: "",
});

type CallMessage = {
  wishesMessage: string;
  sharedMoments: string;
  songRequest: string;
  prankBoundaries: string;
  requestText: string;
  requestSpecial: string;
  supportContext: string;
  supportTone: string[];
  shootGoal: string;
  shootBoldness: string;
  selfLoveFor: string;
  selfLoveAffirmations: string;
  lullabyVibe: string;
  videoOccasion: string;
  videoMustMention: string;
  avoidNotes: string;
  specialNotes: string;
};

const emptyCallMessage = (): CallMessage => ({
  wishesMessage: "",
  sharedMoments: "",
  songRequest: "",
  prankBoundaries: "",
  requestText: "",
  requestSpecial: "",
  supportContext: "",
  supportTone: [],
  shootGoal: "",
  shootBoldness: "Confident",
  selfLoveFor: "For me",
  selfLoveAffirmations: "",
  lullabyVibe: "",
  videoOccasion: "",
  videoMustMention: "",
  avoidNotes: "",
  specialNotes: "",
});

function defaultTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Lagos";
  } catch {
    return "Africa/Lagos";
  }
}

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const serviceId = searchParams.get("type") || "celebratory";
  const [currentServiceId, setCurrentServiceId] = useState(serviceId);
  const service = CALL_SERVICES[currentServiceId] || CALL_SERVICES.celebratory;

  // Special call params (from admin-created special call banner)
  const specialCallId = searchParams.get("specialCallId");
  const specialCallOccasion = searchParams.get("occasion");
  const specialCallPrice = searchParams.get("price") ? Number(searchParams.get("price")) : null;
  const isSpecialCall = !!specialCallId && specialCallPrice !== null;

  const [step, setStep] = useState<Step>(
    // If arriving from special call banner, skip type selection
    isSpecialCall || searchParams.get("type") ? "subscriber" : "type"
  );
  const [selectedVariant, setSelectedVariant] = useState<CallVariant>(service.tiers[0].variant);
  const [isExpress, setIsExpress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [clientData, setClientData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    location: "",
  });
  const [recipients, setRecipients] = useState<Recipient[]>([emptyRecipient(
    specialCallOccasion || service.name
  )]);
  const [callMessage, setCallMessage] = useState<CallMessage>(emptyCallMessage());
  const [timezone, setTimezone] = useState<string>(defaultTimezone());

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

  // Update occasion and variant when service changes
  useEffect(() => {
    setRecipients(r => r.map(item => ({ ...item, occasion: service.name })));
    setSelectedVariant(service.tiers[0].variant);
  }, [currentServiceId, service.name]);

  const isSubscriber = subscription?.status === 'active';
  const remainingCalls = isSubscriber
    ? Math.max(0, (subscription?.total_calls ?? 0) - (subscription?.calls_made ?? 0))
    : null;
  const overQuota = isSubscriber && remainingCalls !== null && recipients.length > remainingCalls;
  const subscriberPlan = isSubscriber ? getPlan(subscription?.plan) : null;

  const selectedTier = service.tiers.find(t => t.variant === selectedVariant) || service.tiers[0];
  const basePrice = isSpecialCall ? (specialCallPrice as number) : selectedTier.price;
  const expressCharge = !isSubscriber && isExpress && !isSpecialCall ? 2000 : 0;
  const totalPrice = basePrice + expressCharge;

  const addRecipient = () => {
    setRecipients([...recipients, emptyRecipient(service.name)]);
  };

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const handleRecipientChange = (index: number, field: keyof Recipient, value: string) => {
    const newRecipients = [...recipients];
    newRecipients[index] = { ...newRecipients[index], [field]: value };
    setRecipients(newRecipients);
  };

  const updateMessage = <K extends keyof CallMessage>(field: K, value: CallMessage[K]) => {
    setCallMessage((m) => ({ ...m, [field]: value }));
  };

  const toggleSupportTone = (tone: string) => {
    setCallMessage((m) => ({
      ...m,
      supportTone: m.supportTone.includes(tone)
        ? m.supportTone.filter((t) => t !== tone)
        : [...m.supportTone, tone],
    }));
  };

  // Which dynamic sub-sections render on the Message step
  const showsCelebratoryQs =
    currentServiceId === "celebratory" ||
    currentServiceId === "appreciatory" ||
    currentServiceId === "apology";
  const showsMusicQ = selectedVariant === "music" || selectedVariant === "both";
  const showsPrankQ = selectedVariant === "prank" || selectedVariant === "both";
  const showsRequestQ = currentServiceId === "request";
  const showsSupportQs = currentServiceId === "encouragement" || currentServiceId === "period_care";
  const showsShootQs = currentServiceId === "shoot_your_shot";
  const showsSelfLoveQs = currentServiceId === "self_love";
  const showsLullabyQ = currentServiceId === "lullaby";
  const showsVideoQs = currentServiceId === "video_shoutout";

  const buildBookingMetadata = () => ({
    sender: {
      name: clientData.name,
      email: clientData.email,
      phone: clientData.phone,
      gender: clientData.gender,
      location: clientData.location,
    },
    recipients: recipients.map((r) => ({
      name: r.name,
      title: r.title,
      gender: r.gender,
      location: r.location,
      relationship: r.relationship,
      youCallThem: r.youCallThem,
      theyCallYou: r.theyCallYou,
      phone: r.phone,
      date: r.date,
      time: r.time,
      occasion: r.occasion,
    })),
    timezone,
    message: callMessage,
    serviceId: service.id,
    variant: selectedVariant,
    isExpress,
  });

  const persistBookingSummary = (payload: {
    reference: string;
    isSubscription: boolean;
    serviceName: string;
    variantLabel: string;
    amount: number;
    remaining?: number;
  }) => {
    try {
      sessionStorage.setItem(
        "buzzthrills:lastBooking",
        JSON.stringify({
          ...payload,
          recipients: recipients.map((r) => ({
            name: r.name,
            phone: r.phone,
            occasion: r.occasion,
            date: r.date,
            time: r.time,
          })),
          isExpress,
          createdAt: new Date().toISOString(),
        })
      );
    } catch {
      // sessionStorage may be unavailable (private mode etc.) — non-fatal.
    }
  };

  const handleSubscriberBooking = async () => {
    for (const r of recipients) {
      if (!r.name || !r.phone || !r.date) {
        alert("Please complete all recipient details.");
        setStep("recipients");
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: service.id,
          variant: selectedVariant,
          recipients,
          isExpress,
          metadata: buildBookingMetadata(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Booking failed");
        return;
      }
      const reference = `BZ-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      persistBookingSummary({
        reference,
        isSubscription: true,
        serviceName: service.name,
        variantLabel: selectedTier.label,
        amount: 0,
        remaining: data.remaining,
      });
      router.push("/checkout/success");
    } catch (e) {
      console.error(e);
      alert("An error occurred while creating your booking.");
    } finally {
      setLoading(false);
    }
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

    // Basic Validation
    for (const r of recipients) {
      if (!r.name || !r.phone || !r.date) {
        alert("Please complete all recipient details.");
        setStep("recipients");
        return;
      }
    }

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: clientData.email,
      amount: totalPrice * 100, // Amount in kobo
      metadata: {
        service: service.id,
        variant: selectedVariant,
        user_id: user?.id,
        is_express: isExpress,
        client_name: clientData.name,
        recipients: recipients,
        booking: buildBookingMetadata(),
      },
      callback: function(response: any) {
        fetch(`/api/payments/verify?reference=${response.reference}`)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              persistBookingSummary({
                reference: response.reference,
                isSubscription: false,
                serviceName: service.name,
                variantLabel: selectedTier.label,
                amount: totalPrice,
              });
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

  const nextStep = () => {
    if (step === "type") {
      setStep("subscriber");
    }
    else if (step === "subscriber") {
      if (!clientData.name || !clientData.email) {
        alert("Please fill in your name and email.");
        return;
      }
      if (service.tiers.length > 1) setStep("variant");
      else setStep("recipients");
    }
    else if (step === "variant") setStep("recipients");
    else if (step === "recipients") {
      for (const r of recipients) {
        if (!r.name || !r.phone || !r.date || !r.relationship) {
          alert("Please fill in name, phone, relationship, and date for every recipient.");
          return;
        }
      }
      setStep("message");
    }
    else if (step === "message") {
      setStep("preferences");
    }
    else if (step === "preferences") {
      setStep("payment");
    }
    else if (step === "payment") {
      if (isSubscriber) {
        handleSubscriberBooking();
      } else {
        handlePaystackPayment();
      }
    }
  };

  const prevStep = () => {
    if (step === "subscriber") setStep("type");
    else if (step === "variant") setStep("subscriber");
    else if (step === "recipients") {
      if (service.tiers.length > 1) setStep("variant");
      else setStep("subscriber");
    }
    else if (step === "message") setStep("recipients");
    else if (step === "preferences") setStep("message");
    else if (step === "payment") setStep("preferences");
  };

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setClientData((prev) => ({
        ...prev,
        name: user.fullName || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  return (
    <div className="w-full max-w-4xl mx-auto glass p-6 sm:p-8 md:p-12 min-h-[500px] sm:min-h-[600px] flex flex-col border border-border shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 gradient-bg opacity-50" />
      
      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-6 md:mb-12 relative px-1 sm:px-2">
        <div className="absolute top-1/2 left-0 w-full h-px bg-border -translate-y-1/2 z-0" />
        {(["type", "subscriber", ...(service.tiers.length > 1 ? ["variant"] : []), "recipients", "message", "preferences", "payment"] as Step[]).map((s, i, arr) => {
          const isPast = arr.indexOf(step) > i;
          return (
            <button 
              key={s} 
              onClick={() => isPast && setStep(s)}
              disabled={!isPast}
              className={`relative z-10 w-6 h-6 xs:w-8 xs:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-[8px] xs:text-xs md:text-sm transition-all border-2 ${
                step === s ? 'gradient-bg border-transparent text-white scale-110 shadow-lg shadow-primary/20' : 
                isPast ? 'bg-primary border-primary text-white cursor-pointer hover:scale-110' : 'bg-muted border-border text-muted-foreground cursor-default'
              }`}
            >
              {isPast ? <Check className="w-3 h-3 xs:w-3.5 xs:h-3.5 md:w-[18px] md:h-[18px]" /> : i + 1}
              <span className="sr-only">{s}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {step === "type" && (
          <motion.div
            key="type"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-grow space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 tracking-tighter uppercase italic">Select <span className="gradient-text italic">Experience</span></h2>
                <p className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">What kind of thrill are we booking today?</p>
              </div>
              {isSubscriber && remainingCalls !== null && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 self-start sm:self-auto">
                  <Sparkles size={12} className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                    {remainingCalls} {remainingCalls === 1 ? "call" : "calls"} left this cycle
                  </span>
                </div>
              )}
            </div>

            <div className="max-h-[520px] overflow-y-auto pt-[2px] px-[2px] pr-2 custom-scrollbar space-y-8">
              {[
                {
                  key: "personal",
                  title: "Personal Surprises",
                  caption: "Quick one-off connections.",
                  ids: ["celebratory", "appreciatory", "apology", "request", "encouragement", "shoot_your_shot", "period_care", "silent_vent"],
                },
                {
                  key: "ongoing",
                  title: "Ongoing Care",
                  caption: "Recurring rituals & affirmations.",
                  ids: ["self_love", "royal_checkup", "lullaby"],
                },
                {
                  key: "premium",
                  title: "Premium & Specialized",
                  caption: "High-touch & branded experiences.",
                  ids: ["video_shoutout", "company_calls"],
                },
              ].map((cat) => (
                <div key={cat.key} className="space-y-3">
                  <div className="flex items-baseline justify-between gap-3 px-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/70">{cat.title}</h3>
                    <span className="text-[9px] font-bold italic text-muted-foreground/70">{cat.caption}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {cat.ids.map((id) => {
                      const s = CALL_SERVICES[id];
                      if (!s) return null;
                      const selected = currentServiceId === s.id;
                      const Icon = ICON_MAP[s.icon] || PhoneCall;
                      const onlyMonthly = s.tiers.length > 0 && s.tiers.every((t) => t.variant === "monthly");
                      const isCorporate = s.id === "company_calls";
                      const priceLabel = isCorporate
                        ? "Contact"
                        : isSubscriber
                        ? "Included"
                        : `From ₦${s.basePrice.toLocaleString()}`;

                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            if (isCorporate) {
                              router.push("/corporate");
                              return;
                            }
                            setCurrentServiceId(s.id);
                            setStep("subscriber");
                          }}
                          className={`relative p-4 sm:p-5 rounded-2xl sm:rounded-[28px] border-2 transition-all text-left group overflow-hidden ${
                            selected
                              ? "bg-primary/10 border-primary shadow-xl shadow-primary/10 scale-[1.01]"
                              : "glass border-border hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-lg"
                          }`}
                        >
                          {selected && (
                            <div className="absolute top-3 right-3 w-6 h-6 rounded-full gradient-bg flex items-center justify-center shadow-lg shadow-primary/30">
                              <Check size={12} className="text-white" strokeWidth={3} />
                            </div>
                          )}
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                                selected
                                  ? "gradient-bg text-white shadow-lg shadow-primary/20"
                                  : "bg-foreground/5 text-foreground/50 group-hover:bg-primary/10 group-hover:text-primary"
                              }`}
                            >
                              <Icon size={20} className="sm:size-[22px]" />
                            </div>
                            <div className="flex-grow min-w-0 pr-6">
                              <h4 className="font-black text-xs sm:text-sm uppercase tracking-tight truncate">{s.name}</h4>
                              <p className="text-[10px] sm:text-[11px] text-muted-foreground font-medium line-clamp-2 mt-1.5 leading-relaxed">
                                {s.description}
                              </p>
                              <div className="flex items-center gap-2 mt-3 flex-wrap">
                                <span
                                  className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                                    isCorporate
                                      ? "bg-foreground/10 text-foreground/80"
                                      : isSubscriber
                                      ? "bg-primary/15 text-primary"
                                      : "bg-foreground/5 text-foreground/70"
                                  }`}
                                >
                                  {priceLabel}
                                </span>
                                {onlyMonthly && !isCorporate && (
                                  <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-secondary/15 text-secondary">
                                    Monthly
                                  </span>
                                )}
                                {!onlyMonthly && !isCorporate && s.tiers.length > 1 && (
                                  <span className="text-[9px] font-bold italic text-muted-foreground">
                                    {s.tiers.length} packages
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === "subscriber" && (
          <motion.div
            key="subscriber"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-grow space-y-8"
          >
            {/* Special call badge */}
            {isSpecialCall && (
              <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-primary/10 border border-primary/20">
                <span className="text-2xl">{searchParams.get("occasion")?.match(/\p{Emoji}/u)?.[0] || "🎉"}</span>
                <div>
                  <div className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-0.5">Special Occasion Call</div>
                  <div className="font-black text-sm tracking-tight">{specialCallOccasion}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-[9px] font-black text-foreground/30 uppercase tracking-widest">Fixed Price</div>
                  <div className="text-xl font-black gradient-text tracking-tighter">₦{(specialCallPrice as number).toLocaleString()}</div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-white">
                  <Star size={20} />
               </div>
               <div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase italic leading-none">
                    {isSpecialCall ? specialCallOccasion : service.name}
                  </h2>
                  <p className="text-muted-foreground font-black uppercase text-[10px] tracking-widest mt-1">
                    {isSpecialCall ? `Fixed price: ₦${(specialCallPrice as number).toLocaleString()}` : `Starting from ₦${service.basePrice.toLocaleString()}`}
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Your Full Name</label>
                <div className="relative group">
                  <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={clientData.name}
                    onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                    className="w-full bg-foreground/5 border border-border rounded-[24px] py-5 pl-14 pr-6 focus:border-primary transition-all outline-none font-bold"
                    placeholder="Your Name"
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
                    placeholder="you@email.com"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">
                  Phone Number <span className="text-muted-foreground/60 normal-case font-bold italic">— optional, for feedback</span>
                </label>
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
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">
                  Gender <span className="text-muted-foreground/60 normal-case font-bold italic">— optional</span>
                </label>
                <div className="relative">
                  <select
                    value={clientData.gender}
                    onChange={(e) => setClientData({ ...clientData, gender: e.target.value })}
                    className="w-full bg-foreground/5 border border-border rounded-[24px] py-5 px-6 focus:border-primary transition-all outline-none font-bold appearance-none cursor-pointer"
                  >
                    <option value="">Prefer not to say</option>
                    {GENDER_OPTIONS.filter(Boolean).map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-3 md:col-span-2">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Your Location <span className="text-muted-foreground/60 normal-case font-bold italic">— state / country</span></label>
                <div className="relative group">
                  <Globe size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={clientData.location}
                    onChange={(e) => setClientData({ ...clientData, location: e.target.value })}
                    className="w-full bg-foreground/5 border border-border rounded-[24px] py-5 pl-14 pr-6 focus:border-primary transition-all outline-none font-bold"
                    placeholder="Lagos, Nigeria"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === "variant" && (
          <motion.div
            key="variant"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-grow space-y-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 tracking-tighter uppercase italic">Choose <span className="gradient-text italic">Package</span></h2>
                <p className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">Pick the level of thrill — every package keeps the heartfelt core.</p>
              </div>
              {isSubscriber && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 self-start sm:self-auto">
                  <Sparkles size={12} className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                    All packages included with {subscriberPlan?.name || "your plan"}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {service.tiers.map((tier, idx) => {
                const meta = VARIANT_META[tier.variant];
                const Icon = meta?.icon || Sparkles;
                const selected = selectedVariant === tier.variant;
                const basePrice = service.tiers[0]?.price ?? tier.price;
                const delta = tier.price - basePrice;
                const isBase = idx === 0 || delta === 0;
                const isRecommended = service.tiers.length >= 3 && idx === service.tiers.length - 1;

                return (
                  <button
                    key={tier.variant}
                    onClick={() => setSelectedVariant(tier.variant)}
                    className={`relative p-5 sm:p-6 rounded-[28px] border-2 transition-all text-left group overflow-hidden flex flex-col ${
                      selected
                        ? "bg-primary/10 border-primary shadow-xl shadow-primary/10 scale-[1.01]"
                        : "glass border-border hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-lg"
                    }`}
                  >
                    {selected && (
                      <div className="absolute top-4 right-4 w-7 h-7 rounded-full gradient-bg flex items-center justify-center shadow-lg shadow-primary/30 z-10">
                        <Check size={14} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                    {!selected && isRecommended && (
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-secondary/20 text-secondary text-[9px] font-black uppercase tracking-widest">
                        Most Loved
                      </div>
                    )}

                    <div className="flex items-start gap-4 mb-5">
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                          selected
                            ? "gradient-bg text-white shadow-lg shadow-primary/20"
                            : "bg-foreground/5 text-foreground/50 group-hover:bg-primary/10 group-hover:text-primary"
                        }`}
                      >
                        <Icon size={24} />
                      </div>
                      <div className="flex-grow min-w-0 pr-8">
                        <h4 className="font-black text-sm sm:text-base uppercase tracking-tight leading-tight">{tier.label}</h4>
                        {meta?.blurb && (
                          <p className="text-[11px] text-muted-foreground font-medium leading-relaxed mt-1.5 italic">
                            {meta.blurb}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-border/60 flex items-end justify-between gap-3">
                      {isSubscriber ? (
                        <div>
                          <div className="text-[9px] font-black uppercase tracking-widest text-primary">Included</div>
                          <div className="text-sm font-bold line-through text-muted-foreground/50 mt-0.5">
                            ₦{tier.price.toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Price</div>
                          <div className="text-2xl sm:text-[26px] font-black tracking-tighter mt-0.5">
                            ₦{tier.price.toLocaleString()}
                          </div>
                        </div>
                      )}
                      {!isSubscriber && (
                        <span
                          className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full whitespace-nowrap ${
                            isBase
                              ? "bg-foreground/5 text-foreground/60"
                              : "bg-primary/15 text-primary"
                          }`}
                        >
                          {isBase ? "Base" : `+₦${delta.toLocaleString()}`}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
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
              {selectedVariant !== 'monthly' && (
                <button
                  onClick={addRecipient}
                  disabled={isSubscriber && remainingCalls !== null && recipients.length >= remainingCalls}
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl glass border-primary/20 text-primary text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Plus size={16} />
                  Add Recipient
                </button>
              )}
            </div>

            {isSubscriber && remainingCalls !== null && (
              <div
                className={`p-5 rounded-3xl border-2 flex items-center justify-between gap-4 ${
                  overQuota
                    ? "border-red-400/40 bg-red-400/5"
                    : "border-primary/20 bg-primary/5"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${overQuota ? "bg-red-400/10 text-red-500" : "bg-primary/10 text-primary"}`}>
                    <Star size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Subscription Balance</div>
                    <div className="text-sm font-black mt-1">
                      {overQuota
                        ? `Only ${remainingCalls} call${remainingCalls === 1 ? "" : "s"} left this cycle — remove ${recipients.length - remainingCalls} recipient${recipients.length - remainingCalls === 1 ? "" : "s"} to continue.`
                        : `${remainingCalls} of ${subscription?.total_calls} calls remaining this cycle.`}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6 max-h-[560px] overflow-y-auto pr-4 custom-scrollbar">
              {recipients.map((r, i) => (
                <div key={i} className="p-4 sm:p-6 rounded-2xl sm:rounded-[32px] bg-foreground/5 border border-border relative hover:border-primary/20 transition-all">
                  {recipients.length > 1 && (
                    <button
                      onClick={() => removeRecipient(i)}
                      className="absolute top-4 right-4 sm:top-5 sm:right-5 text-foreground/20 hover:text-red-400 transition-all p-2 rounded-xl hover:bg-red-400/10 z-10"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}

                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70 mb-4">Recipient #{i + 1}</div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="space-y-2 md:col-span-3">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Title</label>
                      <select
                        value={r.title}
                        onChange={(e) => handleRecipientChange(i, 'title', e.target.value)}
                        className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-4 focus:border-primary outline-none text-sm font-bold appearance-none cursor-pointer"
                      >
                        <option value="">—</option>
                        {TITLE_OPTIONS.filter(Boolean).map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-9">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                      <input
                        type="text"
                        value={r.name}
                        onChange={(e) => handleRecipientChange(i, 'name', e.target.value)}
                        className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 focus:border-primary outline-none text-sm font-bold"
                        placeholder="First Name / Nickname"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-6">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Phone Number</label>
                      <input
                        type="tel"
                        value={r.phone}
                        onChange={(e) => handleRecipientChange(i, 'phone', e.target.value)}
                        className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 focus:border-primary outline-none text-sm font-bold"
                        placeholder="+234 ..."
                      />
                    </div>
                    <div className="space-y-2 md:col-span-6">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                        Gender <span className="text-muted-foreground/50 normal-case font-bold italic">— optional</span>
                      </label>
                      <select
                        value={r.gender}
                        onChange={(e) => handleRecipientChange(i, 'gender', e.target.value)}
                        className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 focus:border-primary outline-none text-sm font-bold appearance-none cursor-pointer"
                      >
                        <option value="">Prefer not to say</option>
                        {GENDER_OPTIONS.filter(Boolean).map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2 md:col-span-6">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Location <span className="text-muted-foreground/50 normal-case font-bold italic">— state / country</span></label>
                      <input
                        type="text"
                        value={r.location}
                        onChange={(e) => handleRecipientChange(i, 'location', e.target.value)}
                        className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 focus:border-primary outline-none text-sm font-bold"
                        placeholder="Lagos, Nigeria"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-6">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Your Relationship</label>
                      <select
                        value={r.relationship}
                        onChange={(e) => handleRecipientChange(i, 'relationship', e.target.value)}
                        className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 focus:border-primary outline-none text-sm font-bold appearance-none cursor-pointer"
                      >
                        {RELATIONSHIP_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2 md:col-span-6">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Preferred Date</label>
                      <input
                        type="date"
                        value={r.date}
                        onChange={(e) => handleRecipientChange(i, 'date', e.target.value)}
                        className="w-full min-w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 focus:border-primary outline-none text-sm font-bold block appearance-none"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-6">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Service Type</label>
                      <div className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 text-sm font-bold text-foreground/60">
                        {selectedVariant === 'monthly' ? "Monthly Subscription" : "One-Time Surprise"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border/50">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary/70 mb-3">Personal Connection <span className="text-muted-foreground/50 normal-case italic">— optional, helps us sound natural</span></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">What you call them</label>
                        <input
                          type="text"
                          value={r.youCallThem}
                          onChange={(e) => handleRecipientChange(i, 'youCallThem', e.target.value)}
                          className="w-full bg-foreground/5 border border-border rounded-2xl py-3.5 px-5 focus:border-primary outline-none text-sm font-bold"
                          placeholder="e.g. Sweetie, Bubu"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">What they call you</label>
                        <input
                          type="text"
                          value={r.theyCallYou}
                          onChange={(e) => handleRecipientChange(i, 'theyCallYou', e.target.value)}
                          className="w-full bg-foreground/5 border border-border rounded-2xl py-3.5 px-5 focus:border-primary outline-none text-sm font-bold"
                          placeholder="e.g. Baby, Big J"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === "message" && (
          <motion.div
            key="message"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-grow space-y-8"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 tracking-tighter uppercase italic">Tell Us About <span className="gradient-text italic">The Call</span></h2>
              <p className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">A few quick details so we sound like you — every field is optional unless marked.</p>
            </div>

            <div className="space-y-6 max-h-[560px] overflow-y-auto pr-4 custom-scrollbar">
              {showsCelebratoryQs && (
                <div className="p-5 sm:p-6 rounded-2xl sm:rounded-[28px] bg-foreground/5 border border-border space-y-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70">Your Message</div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground ml-1">What would you love to tell them?</label>
                    <textarea
                      value={callMessage.wishesMessage}
                      onChange={(e) => updateMessage("wishesMessage", e.target.value)}
                      rows={4}
                      className="w-full bg-foreground/5 border border-border rounded-2xl py-3.5 px-5 focus:border-primary outline-none text-sm font-medium resize-none"
                      placeholder="Your wishes, apology, appreciation, goodwill message…"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground ml-1">Any fun or special moments you&apos;ve shared? <span className="italic text-muted-foreground/60">— optional</span></label>
                    <textarea
                      value={callMessage.sharedMoments}
                      onChange={(e) => updateMessage("sharedMoments", e.target.value)}
                      rows={3}
                      className="w-full bg-foreground/5 border border-border rounded-2xl py-3.5 px-5 focus:border-primary outline-none text-sm font-medium resize-none"
                      placeholder="Inside jokes, memories, things that make them smile…"
                    />
                  </div>
                </div>
              )}

              {showsRequestQ && (
                <div className="p-5 sm:p-6 rounded-2xl sm:rounded-[28px] bg-foreground/5 border border-border space-y-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70">Your Request</div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground ml-1">What would you like us to help you ask or say on your behalf?</label>
                    <textarea
                      value={callMessage.requestText}
                      onChange={(e) => updateMessage("requestText", e.target.value)}
                      rows={4}
                      className="w-full bg-foreground/5 border border-border rounded-2xl py-3.5 px-5 focus:border-primary outline-none text-sm font-medium resize-none"
                      placeholder="The favour, ask, or message you want delivered…"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground ml-1">Has this person ever shown up for you in a special way you&apos;d like mentioned? <span className="italic text-muted-foreground/60">— optional</span></label>
                    <textarea
                      value={callMessage.requestSpecial}
                      onChange={(e) => updateMessage("requestSpecial", e.target.value)}
                      rows={3}
                      className="w-full bg-foreground/5 border border-border rounded-2xl py-3.5 px-5 focus:border-primary outline-none text-sm font-medium resize-none"
                      placeholder="A kind moment we can reference to soften the ask…"
                    />
                  </div>
                </div>
              )}

              {showsSupportQs && (
                <div className="p-5 sm:p-6 rounded-2xl sm:rounded-[28px] bg-foreground/5 border border-border space-y-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70">Support Context</div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground ml-1">What&apos;s been going on, and how can we best support them? <span className="italic text-muted-foreground/60">— gentle wording, optional</span></label>
                    <textarea
                      value={callMessage.supportContext}
                      onChange={(e) => updateMessage("supportContext", e.target.value)}
                      rows={4}
                      className="w-full bg-foreground/5 border border-border rounded-2xl py-3.5 px-5 focus:border-primary outline-none text-sm font-medium resize-none"
                      placeholder="Anything we should know to be sensitive…"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-muted-foreground ml-1">Should this call be more: <span className="italic text-muted-foreground/60">— pick any</span></label>
                    <div className="flex flex-wrap gap-2">
                      {SUPPORT_TONES.map((tone) => {
                        const active = callMessage.supportTone.includes(tone);
                        return (
                          <button
                            key={tone}
                            type="button"
                            onClick={() => toggleSupportTone(tone)}
                            className={`px-4 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest border-2 transition-all ${
                              active
                                ? "bg-primary/10 border-primary text-primary"
                                : "border-border text-foreground/60 hover:border-primary/40"
                            }`}
                          >
                            {active && <Check size={12} className="inline mr-1.5 -mt-0.5" strokeWidth={3} />}
                            {tone}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {showsShootQs && (
                <div className="p-5 sm:p-6 rounded-2xl sm:rounded-[28px] bg-foreground/5 border border-border space-y-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70">Your Shot</div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground ml-1">What are you hoping to ask or express?</label>
                    <textarea
                      value={callMessage.shootGoal}
                      onChange={(e) => updateMessage("shootGoal", e.target.value)}
                      rows={4}
                      className="w-full bg-foreground/5 border border-border rounded-2xl py-3.5 px-5 focus:border-primary outline-none text-sm font-medium resize-none"
                      placeholder="What you've been wanting to say…"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-muted-foreground ml-1">How bold should we be?</label>
                    <div className="flex flex-wrap gap-2">
                      {BOLDNESS_OPTIONS.map((opt) => {
                        const active = callMessage.shootBoldness === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => updateMessage("shootBoldness", opt)}
                            className={`px-4 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest border-2 transition-all ${
                              active
                                ? "bg-primary/10 border-primary text-primary"
                                : "border-border text-foreground/60 hover:border-primary/40"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {showsSelfLoveQs && (
                <div className="p-5 sm:p-6 rounded-2xl sm:rounded-[28px] bg-foreground/5 border border-border space-y-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70">Self Love</div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-muted-foreground ml-1">Is this for you or someone else?</label>
                    <div className="flex flex-wrap gap-2">
                      {SELF_LOVE_FOR_OPTIONS.map((opt) => {
                        const active = callMessage.selfLoveFor === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => updateMessage("selfLoveFor", opt)}
                            className={`px-4 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest border-2 transition-all ${
                              active
                                ? "bg-primary/10 border-primary text-primary"
                                : "border-border text-foreground/60 hover:border-primary/40"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground ml-1">What kind of affirmations would you love to hear? <span className="italic text-muted-foreground/60">— optional</span></label>
                    <textarea
                      value={callMessage.selfLoveAffirmations}
                      onChange={(e) => updateMessage("selfLoveAffirmations", e.target.value)}
                      rows={3}
                      className="w-full bg-foreground/5 border border-border rounded-2xl py-3.5 px-5 focus:border-primary outline-none text-sm font-medium resize-none"
                      placeholder="Themes, phrases, or areas of life to speak to…"
                    />
                  </div>
                </div>
              )}

              {showsLullabyQ && (
                <div className="p-5 sm:p-6 rounded-2xl sm:rounded-[28px] bg-foreground/5 border border-border space-y-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70">Lullaby Vibe</div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground ml-1">Any preferred song, hymn, or vibe? <span className="italic text-muted-foreground/60">— soft / humming / spoken words</span></label>
                    <textarea
                      value={callMessage.lullabyVibe}
                      onChange={(e) => updateMessage("lullabyVibe", e.target.value)}
                      rows={3}
                      className="w-full bg-foreground/5 border border-border rounded-2xl py-3.5 px-5 focus:border-primary outline-none text-sm font-medium resize-none"
                      placeholder="A song you love, a humming style, or just a calm voice…"
                    />
                  </div>
                </div>
              )}

              {showsVideoQs && (
                <div className="p-5 sm:p-6 rounded-2xl sm:rounded-[28px] bg-foreground/5 border border-border space-y-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70">Video Shoutout</div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground ml-1">What&apos;s the occasion?</label>
                    <input
                      type="text"
                      value={callMessage.videoOccasion}
                      onChange={(e) => updateMessage("videoOccasion", e.target.value)}
                      className="w-full bg-foreground/5 border border-border rounded-2xl py-3.5 px-5 focus:border-primary outline-none text-sm font-medium"
                      placeholder="Birthday, graduation, anniversary…"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground ml-1">Any words or names that must be mentioned? <span className="italic text-muted-foreground/60">— optional</span></label>
                    <textarea
                      value={callMessage.videoMustMention}
                      onChange={(e) => updateMessage("videoMustMention", e.target.value)}
                      rows={3}
                      className="w-full bg-foreground/5 border border-border rounded-2xl py-3.5 px-5 focus:border-primary outline-none text-sm font-medium resize-none"
                      placeholder="Names, nicknames, key phrases…"
                    />
                  </div>
                </div>
              )}

              {showsMusicQ && (
                <div className="p-5 sm:p-6 rounded-2xl sm:rounded-[28px] bg-secondary/5 border border-secondary/20 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-secondary">
                    <Music size={14} />
                    Music Thrills Selected
                  </div>
                  <label className="text-[11px] font-bold text-muted-foreground ml-1 block">What song would you like us to sing or play? <span className="italic text-muted-foreground/60">— song title + artist</span></label>
                  <input
                    type="text"
                    value={callMessage.songRequest}
                    onChange={(e) => updateMessage("songRequest", e.target.value)}
                    className="w-full bg-foreground/5 border border-border rounded-2xl py-3.5 px-5 focus:border-primary outline-none text-sm font-medium"
                    placeholder='e.g. "Happy" by Pharrell Williams'
                  />
                </div>
              )}

              {showsPrankQ && (
                <div className="p-5 sm:p-6 rounded-2xl sm:rounded-[28px] bg-amber-400/5 border border-amber-400/20 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">
                    <Laugh size={14} />
                    Prank Thrills Selected
                  </div>
                  <label className="text-[11px] font-bold text-muted-foreground ml-1 block">Any prank boundaries we should respect? <span className="italic text-muted-foreground/60">— keeps trust</span></label>
                  <textarea
                    value={callMessage.prankBoundaries}
                    onChange={(e) => updateMessage("prankBoundaries", e.target.value)}
                    rows={3}
                    className="w-full bg-foreground/5 border border-border rounded-2xl py-3.5 px-5 focus:border-primary outline-none text-sm font-medium resize-none"
                    placeholder="Topics, themes, or jokes to avoid…"
                  />
                </div>
              )}

              <div className="p-5 sm:p-6 rounded-2xl sm:rounded-[28px] bg-foreground/5 border border-border space-y-5">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70">Final Notes <span className="italic text-muted-foreground/60 normal-case">— optional</span></div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-muted-foreground ml-1">Is there anything you&apos;d like us to avoid or be extra mindful of?</label>
                  <textarea
                    value={callMessage.avoidNotes}
                    onChange={(e) => updateMessage("avoidNotes", e.target.value)}
                    rows={3}
                    className="w-full bg-foreground/5 border border-border rounded-2xl py-3.5 px-5 focus:border-primary outline-none text-sm font-medium resize-none"
                    placeholder="Sensitive topics, words to skip…"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-muted-foreground ml-1">Anything else you&apos;d like us to know to make this call special?</label>
                  <textarea
                    value={callMessage.specialNotes}
                    onChange={(e) => updateMessage("specialNotes", e.target.value)}
                    rows={3}
                    className="w-full bg-foreground/5 border border-border rounded-2xl py-3.5 px-5 focus:border-primary outline-none text-sm font-medium resize-none"
                    placeholder="Anything that helps us make this magical…"
                  />
                </div>
              </div>
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
                <label className="text-xs font-black text-primary uppercase tracking-[0.2em]">Best Time of Day for the Call</label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { id: 'morning', label: 'Morning', note: '07:00 - 11:00' },
                    { id: 'afternoon', label: 'Afternoon', note: '12:00 - 16:00' },
                    { id: 'evening', label: 'Evening', note: '17:00 - 19:00' },
                    { id: 'night', label: 'Night', note: '20:00 - 22:00' },
                  ].map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => setRecipients(recipients.map(r => ({ ...r, time: slot.id })))}
                      className={`p-5 rounded-3xl border-2 transition-all text-left group ${
                        recipients[0].time === slot.id ? 'bg-primary/10 border-primary shadow-xl shadow-primary/10 scale-[1.02]' : 'glass border-border hover:border-foreground/20'
                      }`}
                    >
                      <Clock size={18} className={recipients[0].time === slot.id ? 'text-primary' : 'text-foreground/20'} />
                      <div className="mt-3 font-black text-sm uppercase tracking-tighter">{slot.label}</div>
                      <div className="text-[10px] text-muted-foreground font-bold italic">{slot.note}</div>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] font-bold italic text-muted-foreground/70 ml-1">
                  Calls are made between 7:00am – 10:00pm.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-primary uppercase tracking-[0.2em]">Time Zone</label>
                <div className="relative group">
                  <Globe size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-foreground/5 border border-border rounded-[24px] py-4 pl-14 pr-6 focus:border-primary transition-all outline-none font-bold text-sm"
                    placeholder="Africa/Lagos"
                  />
                </div>
                <p className="text-[10px] font-bold italic text-muted-foreground/70 ml-1">
                  Auto-detected from your device — edit if you&apos;re booking for a different region.
                </p>
              </div>

              <div 
                onClick={() => setIsExpress(!isExpress)}
                className={`p-4 sm:p-8 rounded-2xl sm:rounded-[40px] border-2 cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 group ${
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
                   <span className={`text-xl font-black italic transition-colors ${isExpress ? 'text-primary' : 'text-foreground/20'}`}>
                     {isSubscriber ? "Included" : "+₦2,000"}
                   </span>
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
               {isSubscriber ? <Sparkles size={36} className="text-white relative z-10" /> : <CreditCard size={36} className="text-white relative z-10" />}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4 tracking-tighter uppercase italic">
              {isSubscriber ? <>Confirm Your <span className="gradient-text italic">Booking</span></> : <>Ready to <span className="gradient-text italic">Proceed?</span></>}
            </h2>
            <p className="text-muted-foreground font-bold mb-8 sm:mb-12 max-w-sm leading-relaxed uppercase text-[9px] sm:text-[10px] tracking-[0.2em]">
              {isSubscriber
                ? `These calls will be deducted from your ${subscriberPlan?.name || "subscription"}. We'll email you a confirmation.`
                : "Redirecting to Paystack for secure payment. You will receive an order confirmation email instantly."}
            </p>

            <div className="w-full max-w-md p-5 sm:p-10 rounded-[32px] sm:rounded-[56px] glass border border-border shadow-3xl relative overflow-hidden text-left">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full -mr-16 -mt-16" />

               <div className="space-y-4 sm:space-y-6 relative z-10">
                  {isSubscriber ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-bold uppercase tracking-widest text-[9px] sm:text-[10px]">Plan</span>
                        <span className="font-black text-base sm:text-lg">{subscriberPlan?.name || "Subscription"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-bold uppercase tracking-widest text-[9px] sm:text-[10px]">Service</span>
                        <span className="font-black text-base sm:text-lg">{service.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-bold uppercase tracking-widest text-[9px] sm:text-[10px]">Recipients</span>
                        <span className="font-black text-base sm:text-lg">{recipients.length}</span>
                      </div>
                      {isExpress && (
                        <div className="flex justify-between items-center text-primary">
                          <span className="font-black uppercase tracking-widest text-[9px] sm:text-[10px]">Express Delivery</span>
                          <span className="font-black text-base sm:text-lg">Included</span>
                        </div>
                      )}
                      <div className="pt-6 border-t border-border flex justify-between items-center bg-foreground/2 -mx-5 -mb-5 p-5 sm:p-10 sm:-mx-10 sm:-mb-10 mt-6 sm:mt-8">
                        <span className="text-[10px] sm:text-sm font-black uppercase tracking-[0.2em] italic">Calls Deducted</span>
                        <span className="text-xl sm:text-3xl font-black gradient-text tracking-tighter">
                          {recipients.length} of {subscription?.total_calls}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      {isSpecialCall && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground font-bold uppercase tracking-widest text-[9px] sm:text-[10px]">Occasion</span>
                          <span className="font-black text-base sm:text-lg">{specialCallOccasion}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground font-bold uppercase tracking-widest text-[9px] sm:text-[10px]">
                          {isSpecialCall ? "Special Call" : `Package (${selectedTier.label})`}
                        </span>
                        <span className="font-black text-base sm:text-lg">₦{basePrice.toLocaleString()}</span>
                      </div>
                      {isExpress && !isSpecialCall && (
                        <div className="flex justify-between items-center text-primary">
                          <span className="font-black uppercase tracking-widest text-[9px] sm:text-[10px]">Express Service</span>
                          <span className="font-black text-base sm:text-lg">+₦2,000</span>
                        </div>
                      )}
                      <div className="pt-6 border-t border-border flex justify-between items-center bg-foreground/2 -mx-5 -mb-5 p-5 sm:p-10 sm:-mx-10 sm:-mb-10 mt-6 sm:mt-8">
                        <span className="text-[10px] sm:text-sm font-black uppercase tracking-[0.2em] italic">Total Amount</span>
                        <span className="text-xl sm:text-3xl font-black gradient-text tracking-tighter">₦{totalPrice.toLocaleString()}</span>
                      </div>
                    </>
                  )}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 sm:mt-12 flex justify-between items-center pt-6 sm:pt-8 border-t border-border">
          <button 
            onClick={prevStep}
            disabled={step === "type"}
            className={`flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-4 sm:py-5 rounded-[32px] font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all ${step === "type" ? 'opacity-0 pointer-events-none' : 'glass border border-border hover:border-foreground/20 text-foreground/60 hover:text-foreground hover:scale-105 active:scale-95'}`}
          >
            <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Previous Step</span>
            <span className="xs:hidden">Back</span>
          </button>
          <button
            onClick={nextStep}
            disabled={loading || overQuota}
            className="flex items-center gap-2 sm:gap-3 px-8 sm:px-12 py-4 sm:py-5 rounded-[32px] gradient-bg text-white font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="group-hover:mr-2 transition-all">
              {loading ? "Processing..." : overQuota ? "Quota Exceeded" : step === "payment" ? (isSubscriber ? "Confirm Booking" : "Complete Payment") : "Next Step"}
            </span>
            {loading ? <Loader2 className="animate-spin" size={16} /> : (step !== "payment" ? <ChevronRight size={18} className="sm:w-5 sm:h-5" /> : <Sparkles size={18} className="sm:w-5 sm:h-5 animate-pulse" />)}
          </button>
      </div>
    </div>
  );
}

export default function BookingForm() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-black animate-pulse uppercase tracking-widest text-primary">Preparing Your Experience...</div>}>
      <BookingContent />
    </Suspense>
  );
}

import { Phone, Check, Volume2, Star } from "lucide-react";
import Header from "@/components/Header";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import BookingSection from "@/components/BookingSection";

export default function Home() {
  const plans = [
    { name: "Buzz Lite", price: "15,000", calls: "12", features: ["Custom messages", "Priority booking", "Thoughtful automation"], recommended: false },
    { name: "Buzz Plus", price: "25,000", calls: "20", features: ["Affirmations & Apologies", "Faster processing", "Custom messages"], recommended: true },
    { name: "Buzz Orbit", price: "50,000", calls: "30+", features: ["Voice notes", "Preferred caller", "VIP support", "Bonus calls"], recommended: false }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 antialiased overflow-x-hidden transition-colors duration-300">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden isolate">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full gpu-accelerated opacity-60 dark:bg-primary/20" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full gpu-accelerated opacity-60 dark:bg-accent/20" />

        <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
          <Reveal>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full glass border-primary/20 mb-8 text-sm font-semibold text-primary">
              <Star size={14} className="fill-current" />
              <span>BUZZTHRILLS PRIME — 1,250+ CUSTOMERS THRILLED</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight leading-[1.1]">
              Never Forget Any <br />
              <span className="gradient-text">Special Day</span> Again.
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              You never forget, because we never let you. Experience the magic of surprise calls, emotional messages, and corporate connections.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 rounded-2xl bg-foreground text-background font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-foreground/10">
                Get Started Now
              </button>
              <Link href="#one-off" className="px-8 py-4 rounded-2xl glass font-bold text-lg hover:bg-foreground/5 transition-all border border-border flex items-center justify-center">
                Book One-off Call
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Subscriptions Section */}
      <section id="plans" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your <span className="gradient-text">Buzz Plan</span></h2>
            <p className="text-muted-foreground">Select a plan that keeps you connected with your loved ones.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.1}>
                <div className={`relative p-8 rounded-3xl glass border-border h-full flex flex-col ${plan.recommended ? 'ring-2 ring-primary ring-offset-4 ring-offset-background' : ''}`}>
                  {plan.recommended && (
                    <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 px-4 py-1 gradient-bg rounded-full text-xs font-bold uppercase tracking-widest text-white shadow-lg">
                      Recommended
                    </div>
                  )}
                  <div className="mb-6 font-bold text-muted-foreground uppercase text-xs tracking-widest">
                    {plan.name}
                  </div>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-black">₦{plan.price}</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                  <div className="flex items-center gap-2 mb-8 p-3 rounded-2xl bg-foreground/5 border border-foreground/5">
                    <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                      <Phone className="text-white" size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-sm">{plan.calls} Surprise Calls</div>
                      <div className="text-xs text-muted-foreground">Monthly allocation</div>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-10 flex-grow">
                    {plan.features.map(feature => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Check size={12} className="text-primary" />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-4 rounded-2xl font-bold transition-all ${plan.recommended ? 'gradient-bg text-white shadow-lg shadow-primary/20' : 'bg-foreground text-background hover:shadow-xl hover:scale-[1.02]'}`}>
                    Subscribe Now
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* One-off Booking Section */}
      <BookingSection />

      {/* Digital Letter Feature Teaser Section - Light background contrast */}
      <section id="digital-letter" className="py-24 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <Reveal direction="left">
              <div className="relative p-1 glass border-border rounded-[40px] aspect-[4/5] overflow-hidden group shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 text-center z-20">
                  <div className="w-20 h-20 bg-foreground/10 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-6 border border-foreground/20 group-hover:bg-primary/20 transition-all cursor-pointer">
                    <Volume2 className="text-white" size={32} />
                  </div>
                  <div className="text-sm font-bold tracking-widest uppercase text-white/60 mb-2">Digital Experience</div>
                  <div className="text-3xl font-black text-white">Animated Scroll & <br />Voice Message</div>
                </div>
                <div className="w-full h-full gradient-bg opacity-20" />
              </div>
            </Reveal>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <Reveal direction="right">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6 text-xs font-bold text-accent uppercase tracking-widest">
                Exclusive Product
              </div>
              <h2 className="text-5xl font-black mb-6 tracking-tight leading-[1.1]">
                The <span className="gradient-text">Digital Scroll</span> Letter.
              </h2>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                Book a letter, and we'll arrange your words on a beautiful animated scroll. Include your own voice or let our professional hosts record it for you.
              </p>
              
              <ul className="space-y-6 mb-10">
                {[
                  "Generated custom QR code/link",
                  "Optional professional voiceover",
                  "Instant WhatsApp/Email delivery",
                  "Beautiful premium scroll animation"
                ].map(item => (
                  <li key={item} className="flex items-center gap-4 text-lg">
                    <div className="w-6 h-6 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0">
                      <Check size={14} className="text-white" />
                    </div>
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>

              <button className="px-10 py-5 rounded-3xl glass font-bold text-xl hover:bg-foreground/5 transition-all border border-border">
                Create Your Letter
              </button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-24 px-6 glass border-y border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { value: "1,250+", label: "Calls Delivered" },
            { value: "24k+", label: "Hearts Touched" },
            { value: "98%", label: "Happy Recipients" },
            { value: "24/7", label: "Always Buzzing" }
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <div>
                <div className="text-4xl lg:text-5xl font-black gradient-text mb-2">{stat.value}</div>
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Footer Teaser */}
      <footer className="py-20 px-6 border-t border-foreground/5 bg-background">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-6 text-2xl font-black">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                <Phone size={20} />
              </div>
              BUZZ<span className="gradient-text">THRILLS</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              The number one surprise call and emotional message subscription service in Nigeria. We help you never forget any special moment.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-sm">
            <div className="flex flex-col gap-4">
              <div className="font-bold uppercase tracking-widest text-xs text-white/40">Services</div>
              <Link href="#" className="hover:text-primary transition-colors">Surprise Calls</Link>
              <Link href="#" className="hover:text-primary transition-colors">Digital Letters</Link>
              <Link href="#" className="hover:text-primary transition-colors">Corporate</Link>
            </div>
            <div className="flex flex-col gap-4">
              <div className="font-bold uppercase tracking-widest text-xs text-white/40">Company</div>
              <Link href="#" className="hover:text-primary transition-colors">About Us</Link>
              <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
              <Link href="#" className="hover:text-primary transition-colors">FAQs</Link>
            </div>
            <div className="flex flex-col gap-4">
              <div className="font-bold uppercase tracking-widest text-xs text-white/40">Legal</div>
              <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-border text-center text-xs text-muted-foreground">
          © 2026 BuzzThrills Prime. All rights reserved. Made with ❤️ in Nigeria.
        </div>
      </footer>
    </main>
  );
}

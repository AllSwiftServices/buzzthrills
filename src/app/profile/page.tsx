"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import { Phone, Calendar, Star, Settings, LogOut, ChevronRight, Bell, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/auth");
      else setUser(user);
    });
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 font-outfit pb-20">
      <Header />
      
      <section className="pt-32 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Hero Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl md:text-5xl font-black mb-2"
              >
                Welcome Back, <span className="gradient-text">{user.user_metadata?.full_name || "Superhero"}</span>!
              </motion.h1>
              <p className="text-muted-foreground text-lg">Your next scheduled thrill is buzzing soon.</p>
            </div>
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl glass border border-red-500/20 text-red-500 font-bold hover:bg-red-500/10 transition-all text-sm"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Active Subscription Summary */}
              <div className="p-8 rounded-[40px] gradient-bg text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full group-hover:scale-125 transition-transform duration-700" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-white/80 font-bold uppercase tracking-widest text-xs">
                      <Zap size={14} className="fill-current" />
                      Active Plan
                    </div>
                    <div className="text-4xl font-black mb-1">Buzz Plus</div>
                    <div className="text-white/60 text-sm">12/20 Calls remaining this month</div>
                  </div>
                  <button className="px-8 py-4 bg-white text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl">
                    Add Calls 🎁
                  </button>
                </div>
              </div>

              {/* Recent History / Upcoming */}
              <div className="p-8 rounded-[40px] glass border border-border">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold italic">Recent <span className="gradient-text">Thrills</span></h3>
                  <button className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">View History</button>
                </div>
                <div className="space-y-4">
                  {[
                    { type: "Celebratory Call", status: "Delivered", date: "yesterday", recipient: "Mom" },
                    { type: "Digital Scroll Letter", status: "In Transit", date: "now", recipient: "Adesua" },
                    { type: "Prank Call", status: "Failed", date: "Oct 12", recipient: "Tunde (Busy)" }
                  ].map((thrill, i) => (
                    <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-foreground/5 hover:bg-foreground/10 transition-all border border-border/5 group">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white shadow-lg">
                          <Phone size={20} />
                        </div>
                        <div>
                          <div className="font-bold">{thrill.type}</div>
                          <div className="text-xs text-muted-foreground">To: {thrill.recipient} • {thrill.date}</div>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Stats / Settings */}
            <div className="space-y-8">
              <div className="p-8 rounded-[40px] glass border border-border">
                <h3 className="text-xl font-bold mb-6">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-3xl bg-foreground/5 border border-border/10">
                    <div className="text-2xl font-black">42</div>
                    <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Total Thrills</div>
                  </div>
                  <div className="p-4 rounded-3xl bg-foreground/5 border border-border/10">
                    <div className="text-2xl font-black">4.9</div>
                    <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Your Rating</div>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-[40px] glass border border-border">
                <h3 className="text-xl font-bold mb-6">Superhero Menu</h3>
                <nav className="flex flex-col gap-3">
                  {[
                    { label: "Notification Settings", icon: <Bell size={18} /> },
                    { label: "Payment Methods", icon: <Calendar size={18} /> },
                    { label: "Account Security", icon: <Settings size={18} /> },
                    { label: "Help & Support", icon: <Star size={18} /> }
                  ].map(item => (
                    <button key={item.label} className="flex items-center gap-3 w-full p-4 rounded-2xl hover:bg-foreground/5 transition-all text-sm font-bold">
                      <div className="text-primary">{item.icon}</div>
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

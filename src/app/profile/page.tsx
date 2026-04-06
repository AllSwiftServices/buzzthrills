"use client";

import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { 
  Phone, 
  Calendar, 
  Star, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Bell, 
  Zap, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function ProfilePage() {
  const { user, logout, accessToken, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    async function fetchProfileData() {
      if (authLoading || !user) return;
      
      try {
        setLoading(true);
        const res = await fetch("/api/user/profile");
        if (!res.ok) throw new Error("Profile Intelligence Failure");
        
        const data = await res.json();
        setHistory(data.history || []);
        setSubscription(data.subscription || null);
      } catch (error) {
        console.error("Profile Data Failure:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
           <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
           <div className="text-sm font-black uppercase tracking-[0.4em] animate-pulse">Syncing Identity...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) return null;

  const totalThrills = history.length; // Simplified for now, or fetch count

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black mb-2 tracking-tighter"
            >
              Welcome, <span className="gradient-text italic">{user.fullName || "Superhero"}</span>!
            </motion.h1>
            <p className="text-muted-foreground font-bold text-lg tracking-tight">Your next scheduled thrill is buzzing in the shadows.</p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl glass border border-red-500/20 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-500/10 transition-all shadow-xl"
          >
            <LogOut size={18} />
            Abort Mission
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Subscription Summary */}
            <div className="p-10 rounded-[56px] gradient-bg text-white shadow-huge relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                <div>
                  <div className="flex items-center gap-2 mb-4 text-white/80 font-black uppercase tracking-[0.3em] text-[10px]">
                    <Zap size={14} className="fill-current animate-pulse" />
                    Active Perks
                  </div>
                  <div className="text-5xl font-black mb-2 tracking-tighter uppercase italic">
                    {subscription ? subscription.plan : "LITE"} <span className="text-white/40">PLUS</span>
                  </div>
                  <div className="text-white/60 font-bold tracking-tight text-lg">
                    {subscription ? `${subscription.calls_made}/${subscription.total_calls}` : "0/1"} Calls remaining this month
                  </div>
                </div>
                <button 
                  onClick={() => router.push('/pricing')}
                  className="px-10 py-5 bg-white text-black font-black rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-huge flex items-center gap-2 uppercase text-xs tracking-widest"
                >
                  Upgrade Gear 🎁
                </button>
              </div>
            </div>

            {/* Recent History / Upcoming */}
            <div className="p-10 rounded-[56px] glass border border-white/10 shadow-huge bg-black/20">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black italic tracking-tighter uppercase">Recent <span className="gradient-text">Thrills</span></h3>
                <button 
                  onClick={() => router.push('/profile/history')}
                  className="text-[10px] font-black text-primary hover:underline uppercase tracking-[0.2em] italic"
                >
                  View Archive
                </button>
              </div>

              <div className="space-y-4">
                {history.length > 0 ? history.map((thrill, i) => (
                  <motion.div 
                    key={thrill.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-6 rounded-[32px] bg-white/5 hover:bg-white/10 transition-all border border-white/5 group cursor-pointer"
                  >
                    <div className="flex gap-6 items-center">
                      <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center text-white shadow-xl shadow-primary/20">
                         {thrill.status === 'delivered' ? <CheckCircle2 size={24} /> : thrill.status === 'pending' ? <Clock size={24} /> : <XCircle size={24} />}
                      </div>
                      <div>
                        <div className="font-black text-lg tracking-tight group-hover:text-primary transition-colors">{thrill.occasion_type}</div>
                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">To: {thrill.recipient_name} • {new Date(thrill.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/5 ${
                         thrill.status === 'delivered' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                       }`}>
                          {thrill.status}
                       </div>
                       <ChevronRight size={18} className="text-white/20 group-hover:translate-x-1 group-hover:text-white transition-all" />
                    </div>
                  </motion.div>
                )) : (
                  <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[40px]">
                     <Phone size={48} className="mx-auto text-white/5 mb-6 rotate-12" />
                     <div className="text-sm font-black text-white/10 uppercase tracking-[0.4em] italic uppercase">No Thrills Initiated.</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Stats / Settings */}
          <div className="space-y-8">
            <div className="p-10 rounded-[56px] glass border border-white/10 shadow-huge bg-black/50">
              <h3 className="text-2xl font-black mb-8 italic uppercase tracking-tighter">Tactical <span className="gradient-text">Stats</span></h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 rounded-[32px] bg-white/5 border border-white/5 hover:border-primary/20 transition-all">
                  <div className="text-4xl font-black mb-1 tabular-nums">{totalThrills}</div>
                  <div className="text-[9px] uppercase font-black text-white/20 tracking-[0.2em] leading-tight">Missions Initiated</div>
                </div>
                <div className="p-6 rounded-[32px] bg-white/5 border border-white/5 hover:border-secondary/20 transition-all">
                  <div className="text-4xl font-black mb-1 tabular-nums">5.0</div>
                  <div className="text-[9px] uppercase font-black text-white/20 tracking-[0.2em] leading-tight">Hero Rating</div>
                </div>
              </div>
            </div>

            <div className="p-10 rounded-[56px] glass border border-white/10 shadow-huge bg-black/20">
              <h3 className="text-2xl font-black mb-8 italic uppercase tracking-tighter">Mission Control</h3>
              <nav className="flex flex-col gap-4">
                {[
                  { label: "Identity Secure", icon: <Settings size={20} />, href: "/profile/settings" },
                  { label: "Gear & Funding", icon: <Calendar size={20} />, href: "/profile/payments" },
                  { label: "Notification Hub", icon: <Bell size={20} />, href: "/profile/messages" },
                  { label: "Intelligence", icon: <Star size={20} />, href: "/support" }
                ].map(item => (
                  <button 
                    key={item.label} 
                    onClick={() => router.push(item.href)}
                    className="flex items-center gap-5 w-full p-6 rounded-[28px] bg-white/5 hover:bg-white/10 hover:translate-x-2 transition-all text-xs font-black uppercase tracking-widest group"
                  >
                    <div className="text-muted-foreground group-hover:text-primary transition-colors">{item.icon}</div>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

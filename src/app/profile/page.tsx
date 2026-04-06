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
  Loader2,
  CreditCard
} from "lucide-react";
import Link from "next/link";
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
        
        if (res.status === 401) {
          // Session expired, AuthContext will handle redirect via refresh in useEffect
          return;
        }

        if (!res.ok) throw new Error("Profile Intelligence Failure");
        
        const data = await res.json();
        setHistory(data.history || []);
        setSubscription(data.subscription || null);
      } catch (error) {
        console.error("Profile Data Error:", error);
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
           <div className="text-sm font-black uppercase tracking-[0.4em] animate-pulse">Syncing Profile...</div>
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
              Welcome, <span className="gradient-text italic">{user.fullName || "Client"}</span>!
            </motion.h1>
            <p className="text-muted-foreground font-bold text-lg tracking-tight uppercase text-[10px] tracking-widest">Your scheduled platform engagements are active.</p>
          </div>
          <button 
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/auth";
            }}
            className="px-6 py-4 rounded-3xl glass border border-white/10 text-red-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={16} />
            Logout Session
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
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] italic flex items-center gap-2">
                    <Zap size={10} className="text-primary animate-pulse" />
                    Subscription Status
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
                    {subscription?.plan || 'Standard'} <span className="text-white/20">Plus</span>
                  </h2>
                  <p className="font-bold text-sm md:text-lg opacity-80 italic">
                    {subscription?.calls_made || 0}/{subscription?.total_calls || 1} Engagements remaining this month
                  </p>
                </div>
                <Link 
                  href="/pricing"
                  className="px-6 py-4 rounded-3xl bg-white text-black font-black text-xs md:text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-huge shrink-0"
                >
                  Upgrade Plan 🎁
                </Link>
              </div>
            </div>

            {/* Activity History */}
            <div className="p-10 rounded-[56px] bg-linear-to-br from-accent/5 via-accent/[0.02] to-transparent border border-accent/10 shadow-huge backdrop-blur-3xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[80px] rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-1000" />
               <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center justify-between mb-10 relative z-10">
                Activity <span className="gradient-text italic">History</span>
                <Link href="/profile/history" className="text-[9px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">View Log</Link>
              </h3>

              <div className="space-y-4">
                {history.length > 0 ? history.map((thrill, i) => (
                  <motion.div 
                    key={thrill.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-6 rounded-[32px] bg-white/5 hover:bg-accent/10 transition-all border border-white/5 group cursor-pointer relative z-10"
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
                  <div className="flex-1 rounded-[40px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center p-8 text-center bg-white/2">
                    <Phone size={48} className="text-white/5 mb-4" />
                    <div className="text-sm font-black uppercase tracking-[0.2em] opacity-10">No History recorded.</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Stats / Settings */}
          <div className="space-y-8">
            <div className="p-10 rounded-[56px] bg-linear-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-huge shadow-primary/5 backdrop-blur-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[60px] rounded-full -mr-24 -mt-24" />
                <h3 className="text-xl font-black italic uppercase tracking-tighter mb-8 relative z-10">Activity <span className="gradient-text italic">Stats</span></h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-[32px] bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center">
                    <div className="text-4xl font-black italic mb-1">{history.length}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-20">Total Calls</div>
                  </div>
                  <div className="p-6 rounded-[32px] bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center">
                    <div className="text-4xl font-black italic mb-1">5.0</div>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-20">Satisfaction</div>
                  </div>
                </div>
            </div>

            <div className="p-10 rounded-[56px] bg-linear-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-huge shadow-primary/5 backdrop-blur-3xl relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 blur-[60px] rounded-full -ml-24 -mb-24" />
              <h3 className="text-xl font-black italic uppercase tracking-tighter mb-4 relative z-10">Quick <span className="gradient-text italic">Menu</span></h3>
              <div className="space-y-3">
                {[
                  { icon: <Settings size={18} />, label: "Profile Settings", href: "/profile/settings" },
                  { icon: <CreditCard size={18} />, label: "Billing & Plans", href: "/profile/settings" },
                  { icon: <Bell size={18} />, label: "Notification Hub", href: "/profile/messages" },
                ].map((item, i) => (
                  <Link 
                    key={i}
                    href={item.href}
                    className="w-full p-6 rounded-[28px] bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-4 font-black uppercase tracking-widest text-[10px]">
                      <div className="text-white/20 group-hover:text-primary transition-colors">
                        {item.icon}
                      </div>
                      {item.label}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

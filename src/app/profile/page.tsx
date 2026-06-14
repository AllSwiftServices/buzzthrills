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
  CreditCard,
  Mail,
  ExternalLink,
  Eye,
  PenLine,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function ProfilePage() {
  const { user, logout, accessToken, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [letters, setLetters] = useState<any[]>([]);
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
        setLetters(data.letters || []);
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
              className="text-3xl sm:text-4xl md:text-6xl font-black mb-2 tracking-tighter uppercase italic"
            >
              Welcome, <span className="gradient-text italic">{user.fullName || "Client"}</span>!
            </motion.h1>
            <p className="text-muted-foreground font-black uppercase text-[9px] sm:text-[10px] tracking-widest pl-1">Manage your upcoming thrills and account details.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Subscription Summary */}
            <div className="p-6 sm:p-10 rounded-[40px] sm:rounded-[56px] gradient-bg text-white shadow-huge relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
              <div className="relative z-10 flex flex-wrap justify-between items-center gap-8 w-full">
                <div className="text-left w-full lg:w-auto flex-1 min-w-[280px]">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] italic flex items-center justify-start gap-2">
                      <Zap size={10} className="text-primary animate-pulse" />
                      Subscription Status
                    </span>
                    {subscription && (
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                        subscription.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {subscription.status}
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none my-2 sm:my-3">
                    {subscription?.plan || 'Member'}
                  </h2>
                  <p className="font-bold text-xs sm:text-sm md:text-lg opacity-80 italic">
                    {subscription?.status !== 'active' && subscription 
                      ? "Your plan has expired. Please renew to continue."
                      : `${subscription?.calls_made || 0}/${subscription?.total_calls || (subscription?.plan === 'Orbit' ? '∞' : subscription?.plan === 'Plus' ? 15 : 5)} Engagements remaining this month`
                    }
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 w-full lg:flex lg:flex-row lg:w-auto shrink-0 justify-start lg:justify-end">
                  <Link 
                    href="/book"
                    className="w-full lg:w-auto px-6 py-4 rounded-2xl lg:rounded-3xl bg-white text-black font-black text-[10px] sm:text-xs md:text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-huge flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <Star size={18} className="text-primary" />
                    Book a Call ✨
                  </Link>
                  {subscription && subscription.status !== 'active' ? (
                    <Link 
                      href={`/checkout?plan=${subscription.plan.toLowerCase()}&cycle=${subscription.billing_cycle || 'monthly'}`}
                      className="w-full lg:w-auto px-6 py-4 rounded-2xl lg:rounded-3xl bg-red-500 hover:bg-red-600 text-white border border-red-400 font-black text-[10px] sm:text-xs md:text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-huge flex items-center justify-center text-center leading-tight whitespace-nowrap"
                    >
                      Renew Plan
                    </Link>
                  ) : (
                    <Link 
                      href="/pricing"
                      className="w-full lg:w-auto px-6 py-4 rounded-2xl lg:rounded-3xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-black text-[10px] sm:text-xs md:text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all backdrop-blur-md flex items-center justify-center text-center leading-tight whitespace-normal"
                    >
                      Subscribe to Monthly Plans
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* ── Create a Digital Letter ── */}
            <Link
              href="/digital-letters"
              className="group block p-5 sm:p-8 rounded-[32px] sm:rounded-[40px] border-2 border-dashed border-primary/20 hover:border-primary/50 bg-primary/3 hover:bg-primary/6 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[60px] rounded-full -mr-24 -mt-24 group-hover:bg-primary/10 transition-colors duration-700" />
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center shadow-xl shadow-primary/20 shrink-0 group-hover:scale-105 transition-transform">
                  <PenLine size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">New</div>
                  <h3 className="text-lg sm:text-xl font-black italic uppercase tracking-tighter leading-tight">Create a <span className="gradient-text italic">Digital Letter</span></h3>
                  <p className="text-xs text-muted-foreground font-medium mt-1 leading-relaxed">Send a heartfelt animated scroll with your voice or video to someone special.</p>
                </div>
                <div className="shrink-0 w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  <ArrowRight size={16} className="text-primary group-hover:text-white transition-colors" />
                </div>
              </div>
            </Link>

            {/* Activity History */}
            <div className="p-4 sm:p-10 rounded-[32px] sm:rounded-[56px] bg-linear-to-br from-accent/5 via-accent/2 to-transparent border border-accent/10 shadow-huge backdrop-blur-3xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[80px] rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-1000" />
               
               <div className="flex items-center justify-between mb-8 sm:mb-10 relative z-10">
                 <Link href="/profile/history" className="group/title flex items-center gap-3">
                   <h3 className="text-lg sm:text-xl font-black italic uppercase tracking-tighter group-hover/title:text-primary transition-colors">
                    Activity <span className="gradient-text italic">History</span>
                   </h3>
                   <ChevronRight size={16} className="text-primary opacity-0 -translate-x-2 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all" />
                 </Link>
                  <Link 
                    href="/profile/history" 
                    className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-border text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all active:scale-95"
                  >
                    View Log
                  </Link>
               </div>
 
               <div className="flex flex-col gap-6">
                 {history.length > 0 ? history.map((thrill, i) => (
                   <Link key={thrill.id} href="/profile/history" className="block">
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-3 sm:p-6 rounded-[20px] sm:rounded-[32px] bg-foreground/5 hover:bg-accent/10 transition-all border border-border group cursor-pointer relative z-10"
                      >
                       <div className="flex gap-4 sm:gap-6 items-center">
                          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl gradient-bg flex items-center justify-center text-white shadow-xl shadow-primary/20 shrink-0">
                             {thrill.status === 'delivered' ? <CheckCircle2 size={18} className="sm:size-6" /> : thrill.status === 'pending' ? <Clock size={18} className="sm:size-6" /> : <XCircle size={18} className="sm:size-6" />}
                          </div>
                          <div>
                            <div className="font-black text-sm sm:text-lg tracking-tight group-hover:text-primary transition-colors">{thrill.occasion_type}</div>
                           <div className="text-[9px] sm:text-[10px] text-foreground/40 font-black uppercase tracking-widest mt-1">To: {thrill.recipient_name} • {new Date(thrill.created_at).toLocaleDateString()}</div>
                         </div>
                       </div>
                       <div className="flex items-center gap-3">
                           <div className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest border border-border ${
                             thrill.status === 'delivered' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                           }`}>
                              {thrill.status}
                           </div>
                          <ChevronRight size={18} className="text-foreground/20 group-hover:translate-x-1 group-hover:text-foreground transition-all" />
                       </div>
                     </motion.div>
                   </Link>
                 )) : (
                   <div className="flex-1 rounded-[40px] border-2 border-dashed border-border flex flex-col items-center justify-center p-8 text-center bg-foreground/2">
                     <Phone size={48} className="text-foreground/5 mb-4" />
                     <div className="text-sm font-black uppercase tracking-[0.2em] opacity-10">No History recorded.</div>
                   </div>
                 )}
               </div>
             </div>

            {/* My Digital Letters */}
            <div className="p-4 sm:p-10 rounded-[32px] sm:rounded-[56px] bg-linear-to-br from-primary/5 via-primary/2 to-transparent border border-primary/10 shadow-huge backdrop-blur-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-1000" />

              <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="text-lg sm:text-xl font-black italic uppercase tracking-tighter">
                  My Digital <span className="gradient-text italic">Letters</span>
                </h3>
                <Link
                  href="/digital-letters/create"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl gradient-bg text-white text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 hover:scale-105"
                >
                  + New Letter
                </Link>
              </div>

              {letters.length === 0 ? (
                <div className="rounded-[32px] border-2 border-dashed border-border flex flex-col items-center justify-center p-8 text-center bg-foreground/2">
                  <Mail size={40} className="text-foreground/10 mb-3" />
                  <div className="text-sm font-black uppercase tracking-[0.2em] opacity-20">No letters sent yet.</div>
                  <Link href="/digital-letters/create" className="mt-4 text-xs font-bold text-primary hover:underline">
                    Create your first digital letter →
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3 relative z-10">
                  {letters.map((letter, i) => {
                    const statusStyle =
                      letter.status === "published"
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : letter.status === "archived"
                        ? "bg-white/5 text-muted-foreground border-border"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20";
                    return (
                      <motion.div
                        key={letter.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-3 sm:p-5 rounded-[20px] sm:rounded-[28px] bg-foreground/5 border border-border hover:bg-accent/5 transition-all group"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <div className="w-10 h-10 rounded-2xl gradient-bg flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
                            <Mail size={16} />
                          </div>
                          <div className="min-w-0">
                            <div className="font-black text-sm truncate">{letter.recipient_name}</div>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${statusStyle}`}>
                                {letter.status}
                              </span>
                              <span className="text-[9px] text-muted-foreground font-bold capitalize">{letter.theme}</span>
                              {letter.status === "published" && (
                                <span className="text-[9px] text-muted-foreground font-bold flex items-center gap-1">
                                  <Eye size={10} />{letter.unfurled_count ?? 0} views
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {letter.status === "published" && (
                            <Link
                              href={`/digital-letters/share/${letter.id}`}
                              className="px-3 py-2 rounded-xl bg-foreground/5 border border-border hover:border-primary/30 text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5"
                            >
                              Share
                              <ExternalLink size={10} />
                            </Link>
                          )}
                          {letter.status === "draft" && (
                            <Link
                              href={`/digital-letters/create`}
                              className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-black uppercase tracking-widest transition-all"
                            >
                              Continue
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Stats / Settings */}
          <div className="space-y-8">
            <div className="p-10 rounded-[56px] bg-linear-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-huge shadow-primary/5 backdrop-blur-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[60px] rounded-full -mr-24 -mt-24" />
                <h3 className="text-xl font-black italic uppercase tracking-tighter mb-8 relative z-10">Activity <span className="gradient-text italic">Stats</span></h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-[32px] bg-foreground/5 border border-border flex flex-col items-center justify-center text-center col-span-2">
                    <div className="text-4xl font-black italic mb-1">{totalThrills}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-20">Recent Engagements</div>
                  </div>
                </div>
            </div>

            {/* Quick Tips or Announcements could go here */}
            <div className="p-10 rounded-[56px] bg-linear-to-br from-accent/10 via-accent/5 to-transparent border border-accent/20 shadow-huge backdrop-blur-3xl relative overflow-hidden group">
               <h3 className="text-xl font-black italic uppercase tracking-tighter mb-4 relative z-10">Quick <span className="gradient-text italic">Tip</span></h3>
               <p className="text-xs text-muted-foreground font-medium leading-relaxed relative z-10 italic opacity-80">
                 "A surprise call is a core memory in the making. Make sure to provide specific details about the recipient for the best experience."
               </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

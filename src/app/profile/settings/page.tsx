"use client";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, CreditCard, ChevronRight, Save, LogOut, Star, Sparkles, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const { user, logout, setAuth } = useAuth();
  const [activeSection, setActiveSection] = useState<'profile' | 'security' | 'billing'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Profile State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Billing State
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      
      // Fetch full profile data including phone and subscription
      fetch("/api/user/profile")
        .then(res => res.json())
        .then(data => {
          if (data.profile) {
            setFullName(data.profile.full_name || "");
            setPhone(data.profile.phone || "");
          }
          setSubscription(data.subscription);
        });
    }
  }, [user]);

  if (!user) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      if (activeSection === 'profile') {
        const res = await fetch("/api/user/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, phone })
        });
        const data = await res.json();
        if (data.success) {
          setAuth({ ...user, fullName }, null); // Update context (keep token)
          setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } else {
          setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
        }
      } else if (activeSection === 'security') {
        const res = await fetch("/api/user/security", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentPassword, newPassword })
        });
        const data = await res.json();
        if (data.success) {
          setMessage({ type: 'success', text: 'Password updated successfully!' });
          setCurrentPassword("");
          setNewPassword("");
        } else {
          setMessage({ type: 'error', text: data.error || 'Failed to update password' });
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const menuItems = [
    { id: 'profile', label: 'Account Profile', icon: <User size={18} /> },
    { id: 'security', label: 'Login & Security', icon: <Shield size={18} /> },
    { id: 'billing', label: 'Billing & Plans', icon: <CreditCard size={18} /> }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 uppercase tracking-tighter"
            >
              Account <span className="gradient-text">Settings</span>
            </motion.h1>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest pl-1">Manage your account credentials.</p>
          </div>
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-4 rounded-2xl font-bold text-sm text-center ${
              message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Menu */}
          <div className="lg:col-span-1 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold text-sm ${
                  activeSection === item.id 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                    : 'glass border border-border hover:bg-foreground/5 text-muted-foreground'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 p-4 rounded-2xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all font-bold text-sm"
            >
              <LogOut size={18} />
              Logout Session
            </button>
          </div>

          {/* Settings Content Area */}
          <div className="lg:col-span-3">
            <div className="p-8 md:p-12 rounded-[40px] glass border border-border bg-background/40 shadow-2xl relative overflow-hidden min-h-[500px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -mr-32 -mt-32" />
              
              <AnimatePresence mode="wait">
                {activeSection === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8 relative z-10"
                  >
                     <div className="flex items-center gap-6 mb-12">
                        <div className="w-24 h-24 rounded-[32px] gradient-bg flex items-center justify-center text-white text-3xl font-black ring-8 ring-primary/5 shadow-2xl">
                           {fullName?.[0] || email?.[0] || '?'}
                        </div>
                        <button
                          disabled
                          title="Custom avatars are coming soon."
                          className="text-[10px] font-black uppercase tracking-widest text-primary/50 cursor-not-allowed"
                        >
                          Change Profile Avatar
                        </button>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 outline-none focus:border-primary transition-all text-sm font-bold"
                          />
                       </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
                          <input
                            type="email" 
                            value={email}
                            disabled
                            className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 outline-none opacity-50 cursor-not-allowed text-sm font-bold"
                          />
                       </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Number</label>
                          <input 
                            type="tel" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+234 ..." 
                            className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 outline-none focus:border-primary transition-all text-sm font-bold"
                          />
                       </div>
                    </div>
                  </motion.div>
                )}

                {activeSection === 'security' && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8 relative z-10"
                  >
                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 flex items-center gap-4 mb-8">
                        <Shield size={24} className="text-primary" />
                        <div>
                            <div className="font-black text-[10px] uppercase tracking-tight">Password Protected</div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Your password is hashed and never stored in plain text.</div>
                        </div>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Password</label>
                          <input 
                            type="password" 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••" 
                            className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 outline-none focus:border-primary transition-all text-sm font-bold"
                          />
                       </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">New Password</label>
                           <input 
                             type="password" 
                             value={newPassword}
                             onChange={(e) => setNewPassword(e.target.value)}
                             placeholder="New Password" 
                             className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 outline-none focus:border-primary transition-all text-sm font-bold"
                           />
                        </div>
                    </div>
                  </motion.div>
                )}

                {activeSection === 'billing' && (
                  <motion.div
                    key="billing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8 relative z-10"
                  >
                    <div className="p-10 rounded-[40px] bg-primary text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                      
                      <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Current Active Plan</div>
                          <h3 className="text-4xl font-black uppercase tracking-tighter">
                            {subscription?.plan ? subscription.plan : 'No Active Plan'}
                          </h3>
                        </div>
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                          <Zap size={28} className="fill-current" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8 relative z-10">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Status</div>
                          <div className="text-sm font-bold uppercase">{subscription?.status || 'Inactive'}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Calls Remaining</div>
                          <div className="text-sm font-bold">{(subscription?.total_calls || 0) - (subscription?.calls_made || 0)} / {subscription?.total_calls || 0}</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-8 rounded-[32px] glass border border-border hover:border-primary/20 transition-all group">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Star size={20} />
                          </div>
                          <div className="font-black text-[10px] uppercase tracking-widest">Upgrade Account</div>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium mb-6">Unlock premium voices, more calls, and extended letters.</p>
                        <Link href="/pricing" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 hover:gap-3 transition-all w-fit">
                          View Plans <ChevronRight size={12} />
                        </Link>
                      </div>

                      <div className="p-8 rounded-[32px] glass border border-border hover:border-red-500/20 transition-all group">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Sparkles size={20} />
                          </div>
                          <div className="font-black text-[10px] uppercase tracking-widest">Cancel Plan</div>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium mb-6">We'll be sad to see you go. Your benefits continue until period end.</p>
                        <button
                          disabled
                          title="Cancelling from here is coming soon. Email support to cancel for now."
                          className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/50 flex items-center gap-2 cursor-not-allowed"
                        >
                          Manage Subscription <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
 
               {activeSection !== 'billing' && (
                 <div className="mt-12 pt-8 border-t border-border flex justify-end relative z-10">
                   <button 
                     onClick={handleSave}
                     disabled={isSaving}
                     className="w-full sm:w-auto flex items-center justify-center gap-3 bg-primary px-10 py-5 rounded-2xl text-white font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/30 disabled:opacity-50"
                   >
                     {isSaving ? <span className="animate-pulse">Syncing Changes...</span> : <><Save size={20} /> Save Details</>}
                   </button>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

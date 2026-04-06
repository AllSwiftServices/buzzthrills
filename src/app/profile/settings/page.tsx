"use client";

import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, Bell, CreditCard, ChevronRight, Save, LogOut } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<'profile' | 'security' | 'billing'>('profile');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const menuItems = [
    { id: 'profile', label: 'Identity & Info', icon: <User size={18} /> },
    { id: 'security', label: 'Shield & Security', icon: <Shield size={18} /> },
    { id: 'billing', label: 'Credit & Billing', icon: <CreditCard size={18} /> }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black mb-2"
            >
              Superhero <span className="gradient-text">Identity</span>
            </motion.h1>
            <p className="text-muted-foreground text-lg">Manage your mission credentials.</p>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary px-8 py-4 rounded-2xl text-white font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
          >
            {isSaving ? <span className="animate-pulse">Saving...</span> : <><Save size={18} /> Save Changes</>}
          </button>
        </div>

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
                          {user.fullName?.[0] || 'S'}
                       </div>
                       <button className="text-xs font-black uppercase tracking-widest text-primary hover:underline">Change Superhero Avatar</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Superhero Name</label>
                          <input 
                            type="text" 
                            defaultValue={user.fullName} 
                            className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 outline-none focus:border-primary transition-all text-sm font-bold"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Heroic Email</label>
                          <input 
                            type="email" 
                            defaultValue={user.email} 
                            disabled
                            className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 outline-none opacity-50 cursor-not-allowed text-sm font-bold"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Phone Pulse</label>
                          <input 
                            type="tel" 
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
                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 flex items-center justify-between mb-8">
                       <div className="flex items-center gap-4">
                          <Shield size={24} className="text-primary" />
                          <div>
                             <div className="font-black text-sm uppercase italic tracking-tight">Encryption Active</div>
                             <div className="text-xs text-muted-foreground">Your heroic data is secured with AES-256.</div>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Current Password</label>
                          <input 
                            type="password" 
                            placeholder="••••••••" 
                            className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 outline-none focus:border-primary transition-all text-sm font-bold"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">New Access Code</label>
                          <input 
                            type="password" 
                            placeholder="New Shield Key" 
                            className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 outline-none focus:border-primary transition-all text-sm font-bold"
                          />
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

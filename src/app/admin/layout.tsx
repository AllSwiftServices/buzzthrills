"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2, LayoutDashboard, PhoneCall, Users, Tag, BarChart3, LogOut, ShieldCheck, User, Mail } from "lucide-react";
import Link from "next/link";
import AdminBottomTabNav from "@/components/AdminBottomTabNav";
import ThemeToggle from "@/components/ThemeToggle";
import { motion } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push(user ? "/profile" : "/auth");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="text-primary animate-spin" size={40} />
      </div>
    );
  }

  const menuItems = [
    { href: "/admin",           icon: <LayoutDashboard size={18} />, label: "Overview" },
    { href: "/admin/calls",     icon: <PhoneCall size={18} />,       label: "Call History" },
    { href: "/admin/letters",   icon: <Mail size={18} />,            label: "Digital Letters" },
    { href: "/admin/crm",       icon: <Users size={18} />,           label: "Client Directory" },
    { href: "/admin/offers",    icon: <Tag size={18} />,             label: "Promotions" },
    { href: "/admin/analytics", icon: <BarChart3 size={18} />,       label: "Analytics" },
  ];

  return (
    <div className="h-screen bg-background text-foreground flex flex-col lg:flex-row overflow-hidden transition-colors duration-300">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:flex w-72 border-r border-border p-8 flex-col gap-10 bg-muted/30 backdrop-blur-3xl shrink-0 overflow-y-auto">
        {/* Brand + Theme toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <div className="text-sm font-black tracking-tighter gradient-text uppercase">Buzz Admin</div>
          </div>
          <ThemeToggle />
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm group ${
                  isActive
                    ? 'bg-primary text-white shadow-xl shadow-primary/10 scale-105'
                    : 'text-foreground/40 hover:text-foreground hover:bg-foreground/5'
                }`}
              >
                <span className={`${isActive ? 'text-white' : 'text-primary'}`}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="p-5 rounded-[28px] border border-primary/20 bg-primary/5">
            <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">System Status</div>
            <p className="text-xs text-muted-foreground leading-relaxed font-bold tracking-tight">
              All systems operational. Admin access confirmed.
            </p>
          </div>

          <button
            onClick={() => router.push("/profile")}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border border-primary/20 text-primary hover:bg-primary/10 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <User size={18} />
            Switch to Client View
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all font-bold text-sm"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto pb-32 lg:pb-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -mr-[250px] -mt-[250px] pointer-events-none" />
        <div className="p-6 md:p-12 relative z-10">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Bottom Nav - Mobile Only */}
      <AdminBottomTabNav />
    </div>
  );
}

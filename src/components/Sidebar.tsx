"use client";

import { User, Calendar, MessageSquare, Settings, ShieldCheck, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems = [
    { href: "/profile", icon: <User size={20} />, label: "Dashboard" },
    { href: "/profile/history", icon: <Calendar size={20} />, label: "Thrills History" },
    { href: "/profile/messages", icon: <MessageSquare size={20} />, label: "Support Hub" },
    { href: "/profile/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  if (user?.role === 'admin') {
    menuItems.splice(1, 0, { href: "/admin", icon: <ShieldCheck size={20} />, label: "Operator Console" });
  }

  return (
    <aside className="hidden md:flex flex-col w-72 h-[calc(100vh-120px)] sticky top-24 left-0 pb-12">
      <div className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className="relative group block"
            >
              <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5' 
                  : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
              }`}>
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest">
                  {item.label}
                </span>
                
                {isActive && (
                  <motion.div 
                    layoutId="activeSidebarTab"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="pt-8 border-t border-border/50">
        <button 
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/auth";
          }}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all duration-300 group"
        >
          <LogOut size={20} className="group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-widest">Logout</span>
        </button>
      </div>
    </aside>
  );
}

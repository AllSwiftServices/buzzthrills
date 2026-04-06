"use client";

import { User, Calendar, MessageSquare, Settings, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function BottomTabNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const tabs = [
    { href: "/profile", icon: <User size={20} />, label: "Profile" },
    { href: "/profile/history", icon: <Calendar size={20} />, label: "History" },
    { href: "/profile/messages", icon: <MessageSquare size={20} />, label: "Messages" },
    { href: "/profile/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  // Add Admin tab for authorized operators
  if (user?.role === 'admin') {
    tabs.splice(1, 0, { href: "/admin", icon: <ShieldCheck size={20} />, label: "Operations" });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
      <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background via-background/80 to-transparent pointer-events-none" />
      
      <div className="mx-4 mb-4 relative z-10">
        <div className="glass border border-border/20 rounded-[32px] p-2 flex items-center justify-around shadow-2xl backdrop-blur-3xl bg-background/50">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link 
                key={tab.href} 
                href={tab.href}
                className="relative p-3 flex flex-col items-center justify-center gap-1 group"
              >
                <motion.div
                  animate={{ 
                    scale: isActive ? 1.2 : 1,
                    color: isActive ? 'var(--primary)' : 'var(--muted-foreground)'
                  }}
                  className={`${isActive ? 'text-primary' : 'text-muted-foreground'} transition-colors group-active:scale-95`}
                >
                  {tab.icon}
                </motion.div>
                
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
                
                <span className={`text-[8px] font-black uppercase tracking-tight ${isActive ? 'text-primary opacity-100' : 'text-muted-foreground opacity-60'} transition-all`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

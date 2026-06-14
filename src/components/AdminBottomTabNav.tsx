"use client";

import { LayoutDashboard, PhoneCall, Users, BarChart3, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminBottomTabNav() {
  const pathname = usePathname();

  const tabs = [
    { href: "/admin",               icon: <LayoutDashboard size={20} />, label: "Overview" },
    { href: "/admin/calls",         icon: <PhoneCall size={20} />,       label: "Calls" },
    { href: "/admin/special-calls", icon: <Sparkles size={20} />,        label: "Special" },
    { href: "/admin/letters",       icon: <Mail size={20} />,            label: "Letters" },
    { href: "/admin/analytics",     icon: <BarChart3 size={20} />,       label: "Analytics" },
  ];

  const active = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden">
      <div className="mx-4 mb-4 relative z-10">
        <div className="glass border border-primary/20 rounded-[32px] p-2 flex items-center justify-around shadow-2xl backdrop-blur-3xl bg-foreground/5">
          {tabs.map((tab) => {
            const on = active(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="relative p-3 flex flex-col items-center justify-center gap-1 group"
              >
                <motion.div
                  animate={{
                    scale: on ? 1.2 : 1,
                    color: on ? "var(--primary)" : "var(--muted-foreground)",
                  }}
                  className={`${on ? "text-primary" : "text-muted-foreground"} transition-colors group-active:scale-95`}
                >
                  {tab.icon}
                </motion.div>

                {on && (
                  <motion.div
                    layoutId="adminActiveTab"
                    className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}

                <span className={`text-[8px] font-black uppercase tracking-tight ${on ? "text-primary opacity-100" : "text-muted-foreground opacity-60"} transition-all`}>
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

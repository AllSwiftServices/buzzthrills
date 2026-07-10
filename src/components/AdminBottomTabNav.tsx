"use client";

import { LayoutDashboard, PhoneCall, Mail, MoreHorizontal, X, User, LogOut, Users, Tag, BarChart3, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

// Primary tabs get direct one-tap access; everything else (plus account
// actions that used to only live in the desktop sidebar) lives in "More" so
// mobile admins aren't stuck without a way to reach Clients/Promotions,
// switch back to their client view, or sign out.
const primaryTabs = [
  { href: "/admin",         icon: <LayoutDashboard size={20} />, label: "Dashboard" },
  { href: "/admin/calls",   icon: <PhoneCall size={20} />,       label: "Calls" },
  { href: "/admin/letters", icon: <Mail size={20} />,            label: "Letters" },
];

const moreLinks = [
  { href: "/admin/crm",           icon: <Users size={18} />,     label: "Clients" },
  { href: "/admin/special-calls", icon: <Sparkles size={18} />,  label: "Special Calls" },
  { href: "/admin/offers",        icon: <Tag size={18} />,       label: "Promotions" },
  { href: "/admin/analytics",     icon: <BarChart3 size={18} />, label: "Analytics" },
];

export default function AdminBottomTabNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [showMore, setShowMore] = useState(false);

  const active = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  const inMore = moreLinks.some((l) => active(l.href));

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden">
        <div className="mx-4 mb-4 relative z-10">
          <div className="border border-primary/20 rounded-[28px] p-2 flex items-center justify-around shadow-2xl backdrop-blur-3xl bg-background/90">
            {primaryTabs.map((tab) => {
              const on = active(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="relative p-3 flex flex-col items-center justify-center gap-1 flex-1"
                >
                  <div className={`${on ? "text-primary" : "text-muted-foreground"} transition-colors`}>
                    {tab.icon}
                  </div>
                  {on && (
                    <motion.div
                      layoutId="adminActiveTab"
                      className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary"
                    />
                  )}
                  <span className={`text-[9px] font-bold ${on ? "text-primary" : "text-muted-foreground opacity-70"}`}>
                    {tab.label}
                  </span>
                </Link>
              );
            })}

            <button
              onClick={() => setShowMore(true)}
              className="relative p-3 flex flex-col items-center justify-center gap-1 flex-1"
            >
              <div className={`${inMore ? "text-primary" : "text-muted-foreground"} transition-colors`}>
                <MoreHorizontal size={20} />
              </div>
              {inMore && (
                <motion.div
                  layoutId="adminActiveTab"
                  className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary"
                />
              )}
              <span className={`text-[9px] font-bold ${inMore ? "text-primary" : "text-muted-foreground opacity-70"}`}>
                More
              </span>
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {showMore && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMore(false)}
              className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[120] rounded-t-[32px] bg-background border-t border-border p-6 pb-10 lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-foreground/60">More pages</h2>
                <button
                  onClick={() => setShowMore(false)}
                  className="p-2 rounded-full bg-foreground/5 text-foreground/50"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setShowMore(false)}
                    className={`flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-sm ${
                      active(link.href) ? "bg-primary text-white" : "bg-foreground/5 text-foreground/70"
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <button
                  onClick={() => { setShowMore(false); router.push("/profile"); }}
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl border border-primary/20 text-primary font-bold text-sm"
                >
                  <User size={18} />
                  Switch to client view
                </button>
                <button
                  onClick={() => { setShowMore(false); logout(); }}
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl border border-red-500/20 text-red-500 font-bold text-sm"
                >
                  <LogOut size={18} />
                  Sign out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

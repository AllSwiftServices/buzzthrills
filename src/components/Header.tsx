"use client";

import { Phone, User, Calendar, Menu, X, Home, BookOpen, CreditCard, Mail, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function Header() {
  const { user } = useAuth();
  const { resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll lock when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const mainLinks = [
    { href: "/",               label: "Home",            icon: <Home size={18} /> },
    { href: "/about",          label: "Our Story",       icon: <BookOpen size={18} /> },
    { href: "/pricing",        label: "Plans & Pricing", icon: <CreditCard size={18} /> },
    { href: "/digital-letters",label: "Digital Letters", icon: <Mail size={18} /> },
  ];

  const isDark = mounted && resolvedTheme === "dark";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const menuVariants = {
    closed: { opacity: 0, x: "100%" },
    open:   { opacity: 1, x: "0%", transition: { type: "spring" as const, damping: 28, stiffness: 300 } },
  };

  const itemVariants = {
    closed: { opacity: 0, x: 20 },
    open:   { opacity: 1, x: 0 },
  };

  return (
    <>
      <header
        style={{ transform: "translate3d(0, 0, 0)" } as React.CSSProperties}
        className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 flex items-center justify-between transition-all duration-500 overflow-visible ${
          !mounted
            ? "bg-white"
            : isDark
              ? "bg-black/20 backdrop-blur-xl border-white/10 mx-2 md:mx-4 mt-2 md:mt-4 rounded-2xl border shadow-2xl"
              : "bg-white border-border mx-2 md:mx-4 mt-2 md:mt-4 rounded-2xl border shadow-xl"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 relative z-10 group shrink-0">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
            <Phone size={16} className="text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight font-serif">
            Buzz<span className="gradient-text">Thrills</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-xl transition-all hover:text-primary ${
                isActive(link.href)
                  ? "text-primary bg-primary/8 font-semibold"
                  : "hover:bg-foreground/5"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Separator */}
          <div className="w-px h-5 bg-border mx-2" />

          {/* Dashboard */}
          <Link
            href={user ? "/profile" : "/auth"}
            className={`px-4 py-2 rounded-xl transition-all hover:text-primary flex items-center gap-2 ${
              isActive("/profile") || isActive("/auth")
                ? "text-primary bg-primary/8 font-semibold"
                : "hover:bg-foreground/5"
            }`}
          >
            <LayoutDashboard size={15} />
            Dashboard
          </Link>
        </nav>

        {/* Desktop Right — Book button + theme */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/book"
            className="px-5 py-2.5 rounded-xl gradient-bg text-white font-semibold text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Calendar size={15} />
            Book a Surprise Call
          </Link>
        </div>

        {/* Mobile right — theme + hamburger */}
        <div className="flex lg:hidden items-center gap-2 relative z-10">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className={`p-2 rounded-xl transition-all border shadow-lg ${
              isDark
                ? "bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10"
                : "bg-foreground/5 border-border/20 hover:bg-foreground/10"
            }`}
          >
            {isOpen ? <X size={20} className="text-primary" /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-xl lg:hidden"
            />

            {/* Slide-in drawer from right */}
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className={`fixed top-0 right-0 bottom-0 z-50 w-[80vw] max-w-sm flex flex-col lg:hidden shadow-2xl ${
                isDark ? "bg-black/95 border-l border-white/10" : "bg-white border-l border-border"
              }`}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border/40">
                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                  <div className="w-7 h-7 gradient-bg rounded-lg flex items-center justify-center">
                    <Phone size={14} className="text-white" />
                  </div>
                  <span className="text-lg font-semibold font-serif">
                    Buzz<span className="gradient-text">Thrills</span>
                  </span>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-foreground/5 transition-colors"
                >
                  <X size={18} className="text-foreground/50" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {mainLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    variants={itemVariants}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-semibold transition-all ${
                        isActive(link.href)
                          ? "text-primary bg-primary/10"
                          : "hover:bg-foreground/5 hover:text-primary"
                      }`}
                    >
                      <span className={isActive(link.href) ? "text-primary" : "text-foreground/40"}>
                        {link.icon}
                      </span>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Separator */}
                <div className="py-2">
                  <div className="h-px bg-border/60" />
                </div>

                {/* Dashboard */}
                <motion.div variants={itemVariants} transition={{ delay: mainLinks.length * 0.05 }}>
                  <Link
                    href={user ? "/profile" : "/auth"}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-semibold transition-all ${
                      isActive("/profile") || isActive("/auth")
                        ? "text-primary bg-primary/10"
                        : "hover:bg-foreground/5 hover:text-primary"
                    }`}
                  >
                    <span className="text-foreground/40"><LayoutDashboard size={18} /></span>
                    Dashboard
                    {!user && (
                      <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-foreground/30">
                        Sign in
                      </span>
                    )}
                  </Link>
                </motion.div>
              </nav>

              {/* Book CTA at the bottom */}
              <div className="px-4 pb-8 pt-4 border-t border-border/40">
                <Link
                  href="/book"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 rounded-2xl gradient-bg text-white font-bold text-base text-center shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Calendar size={18} />
                  Book a Surprise Call
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { User, Menu, X, Home, BookOpen, CreditCard, Mail, LayoutDashboard } from "lucide-react";
import Image from "next/image";
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

  useEffect(() => { setMounted(true); }, []);

  // Scroll lock when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => { setIsOpen(false); }, [pathname]);

  const mainLinks = [
    { href: "/",                matchPath: "/",                label: "Home",            icon: <Home size={14} /> },
    { href: "/about",           matchPath: "/about",           label: "Our Story",       icon: <BookOpen size={14} /> },
    { href: "/pricing",         matchPath: "/pricing",         label: "Plans & Pricing", icon: <CreditCard size={14} /> },
    { href: mounted ? (user ? "/digital-letters" : "/auth?redirect=/digital-letters/create") : "/digital-letters", matchPath: "/digital-letters", label: "Digital Letters", icon: <Mail size={14} /> },
  ];

  const isDark = mounted && resolvedTheme === "dark";

  const isActive = (matchPath: string) =>
    matchPath === "/" ? pathname === "/" : pathname.startsWith(matchPath);

  // Old-style menu: stagger children inward
  const menuVariants = {
    closed: { opacity: 0, scale: 0.95 },
    open: {
      opacity: 1,
      scale: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };
  const itemVariants = {
    closed: { opacity: 0, y: 16 },
    open:   { opacity: 1, y: 0 },
  };

  return (
    <>
      <header
        style={{ transform: "translate3d(0, 0, 0)" } as React.CSSProperties}
        className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 flex items-center justify-between transition-all duration-500 overflow-visible ${
          !mounted
            ? "bg-white"
            : isOpen
              ? isDark
                ? "bg-black/95 border-transparent"
                : "bg-white border-transparent"
              : isDark
                ? "bg-black/20 backdrop-blur-xl border-white/10 mx-2 md:mx-4 mt-2 md:mt-4 rounded-2xl border shadow-2xl"
                : "bg-white border-border mx-2 md:mx-4 mt-2 md:mt-4 rounded-2xl border shadow-xl"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 relative z-10 group shrink-0">
          {mounted ? (
            <Image
              src={isDark ? "/logo-dark.png" : "/logo-light.png"}
              alt="BuzzThrills"
              width={200}
              height={40}
              className="h-20 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
              priority
            />
          ) : (
            // SSR placeholder — same size, prevents layout shift
            <div className="h-20 w-[160px]" />
          )}
        </Link>

        {/* Desktop Nav — hidden below lg */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-xl transition-all hover:text-primary ${
                isActive(link.matchPath)
                  ? "text-primary font-semibold"
                  : "hover:bg-foreground/5"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Divider */}
          <div className="w-px h-4 bg-border mx-2" />

          <Link
            href={user ? "/profile" : "/auth"}
            className={`px-4 py-2 rounded-xl transition-all hover:text-primary flex items-center gap-1.5 ${
              isActive("/profile") || isActive("/auth")
                ? "text-primary font-semibold"
                : "hover:bg-foreground/5"
            }`}
          >
            <LayoutDashboard size={14} />
            Dashboard
          </Link>
        </nav>

        {/* Desktop Right */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href={user ? "/profile" : "/auth"}
            className="px-5 py-2.5 rounded-xl gradient-bg text-white font-semibold text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <User size={15} />
            {user ? "My Account" : "Log In / Get Started"}
          </Link>
        </div>

        {/* Mobile right */}
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

      {/* ── OLD-STYLE MOBILE MENU: full-screen centred overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Full-screen blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-background/90 backdrop-blur-3xl lg:hidden"
            />

            {/* Centred menu */}
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 z-45 flex flex-col items-center justify-center p-4 lg:hidden pointer-events-auto overflow-y-auto"
            >
              <div className="w-full max-w-sm flex flex-col items-center gap-8 py-20">

                {/* Main nav links — large display text */}
                <motion.div variants={itemVariants} className="flex flex-col items-center gap-3 w-full">
                  {mainLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-2xl sm:text-3xl font-black hover:text-primary transition-all py-1.5 text-center block w-full hover:scale-105 tracking-tight ${
                        isActive(link.matchPath) ? "text-primary" : ""
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>

                {/* Divider + secondary links */}
                <motion.div variants={itemVariants} className="w-full flex flex-col items-center gap-6">
                  <div className="w-16 h-px bg-primary/20" />

                  <div className="flex flex-col items-center gap-4 w-full">
                    {/* Dashboard */}
                    <Link
                      href={user ? "/profile" : "/auth"}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-xl font-bold py-1 group hover:text-primary transition-colors"
                    >
                      <LayoutDashboard
                        className="text-primary group-hover:scale-110 transition-transform"
                        size={22}
                      />
                      Dashboard
                    </Link>

                    {/* CTA button */}
                    <Link
                      href={user ? "/profile" : "/auth"}
                      onClick={() => setIsOpen(false)}
                      className="w-full max-w-[280px] py-4 rounded-2xl gradient-bg text-white font-bold text-xl text-center shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <User size={20} />
                      {user ? "My Account" : "Log In / Get Started"}
                    </Link>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

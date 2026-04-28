"use client";

import { Phone, User, ShoppingBag, Menu, X } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user } = useAuth();
  const { resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll lock implementation
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { href: "/about", label: "Our Story" },
    { href: "/pricing", label: "Pricing & Services" },
    { href: "/surprise-calls", label: "Surprise Calls" },
    { href: "/digital-letters", label: "Digital Artifacts" },
    { href: "/pricing", label: "Send a Surprise" },
  ];


  const menuVariants = {
    closed: { opacity: 0, scale: 0.95 },
    open: { 
      opacity: 1, 
      scale: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, y: 10 },
    open: { opacity: 1, y: 0 }
  };

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <>
      <header 
        style={{ transform: 'translate3d(0, 0, 0)' } as any}
        className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 flex items-center justify-between transition-all duration-500 overflow-visible ${
          !mounted ? 'bg-white' : 
          isOpen 
            ? (isDark ? 'bg-black/95 border-transparent' : 'bg-white border-transparent')
            : (isDark 
                ? 'bg-black/20 backdrop-blur-xl border-white/10 mx-2 md:mx-4 mt-2 md:mt-4 rounded-2xl border shadow-2xl' 
                : 'bg-white border-border mx-2 md:mx-4 mt-2 md:mt-4 rounded-2xl border shadow-xl')
        }`}
      >
        <Link href="/" className="flex items-center gap-2 relative z-60 group">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
            <Phone size={16} className="text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight font-serif">
            Buzz<span className="gradient-text">Thrills</span>
          </span>
        </Link>


        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4 relative z-60">
          <ThemeToggle />
          <div className="hidden sm:flex items-center gap-4">
            {user ? (
              <Link 
                href="/profile"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-semibold border ${
                  isDark 
                    ? 'bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10' 
                    : 'bg-foreground/5 border-transparent hover:bg-foreground/10 backdrop-blur-none'
                }`}
              >
                <User size={16} />
                Profile
              </Link>
            ) : (
              <Link 
                href="/auth"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-semibold border ${
                  isDark 
                    ? 'bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10' 
                    : 'bg-foreground/5 border-transparent hover:bg-foreground/10 backdrop-blur-none'
                }`}
              >
                <User size={16} />
                Login
              </Link>
            )}
              <Link 
                href="/pricing"
                className="px-5 py-2 rounded-xl gradient-bg text-white font-semibold text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                {user ? <ShoppingBag size={16} /> : null}
                {user ? "My Dashboard" : "Start Sharing"}
              </Link>

          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-xl transition-all border shadow-lg ${
              isDark 
                ? 'bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10' 
                : 'bg-foreground/5 border-border/20 hover:bg-foreground/10 backdrop-blur-none'
            }`}
          >
            {isOpen ? <X size={20} className="text-primary" /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay (Outside Header Bar) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Full Screen Blur Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-background/90 backdrop-blur-3xl md:hidden"
            />

            {/* Centered Menu Container */}
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 z-45 flex flex-col items-center justify-center p-6 md:hidden pointer-events-none"
            >
              <div className="w-full max-w-sm flex flex-col items-center gap-12 pointer-events-auto">
                <motion.div variants={itemVariants} className="flex flex-col items-center gap-6 w-full">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      onClick={() => setIsOpen(false)}
                      className="text-4xl font-black hover:text-primary transition-all py-2 text-center gradient-h-hover block w-full hover:scale-105"
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>

                <motion.div variants={itemVariants} className="w-full flex flex-col items-center gap-8">
                  <div className="w-24 h-px bg-primary/20" />
                  
                  <div className="flex flex-col items-center gap-6 w-full">
                    {user ? (
                      <Link 
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 text-2xl font-bold py-2 group"
                      >
                        <User className="text-primary group-hover:scale-110 transition-transform" size={28} />
                        My Dashboard
                      </Link>
                    ) : (
                      <Link 
                        href="/auth"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 text-2xl font-bold py-2 group"
                      >
                        <User className="text-primary group-hover:scale-110 transition-transform" size={28} />
                        Get Started
                      </Link>
                    )}
                    <Link 
                      href="/pricing"
                      onClick={() => setIsOpen(false)}
                      className="w-full max-w-xs py-5 rounded-3xl gradient-bg text-white font-semibold text-2xl text-center shadow-2xl shadow-primary/30 active:scale-95 transition-all"
                    >
                      {user ? "My Dashboard" : "Start Sharing Joy"}
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

"use client";

import { Phone, User, ShoppingBag, Menu, X } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { AnimatePresence, motion } from "framer-motion";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navLinks = [
    { href: "/about", label: "About Us" },
    { href: "/surprise-calls", label: "Surprise Calls" },
    { href: "/digital-letters", label: "Digital Letters" },
    { href: "/book", label: "Book Now" },
  ];

  return (
    <header 
      style={{ transform: 'translate3d(0, 0, 0)' } as any}
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 flex items-center justify-between glass mx-2 md:mx-4 mt-2 md:mt-4 overflow-visible"
    >
      <Link href="/" className="flex items-center gap-2 relative z-50">
        <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
          <Phone size={18} className="text-white" />
        </div>
        <span className="text-xl font-extrabold tracking-tight">
          BUZZ<span className="gradient-text">THRILLS</span>
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-primary transition-colors">
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2 md:gap-4 relative z-50">
        <ThemeToggle />
        <div className="hidden sm:flex items-center gap-4">
          {user ? (
            <Link 
              href="/profile"
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-foreground/5 transition-all text-sm font-semibold"
            >
              <User size={16} />
              Profile
            </Link>
          ) : (
            <Link 
              href="/auth"
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-foreground/5 transition-all text-sm font-semibold"
            >
              <User size={16} />
              Login
            </Link>
          )}
          <Link 
            href={user ? "/profile" : "/auth"}
            className="px-5 py-2 rounded-xl gradient-bg text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            {user ? <ShoppingBag size={16} /> : null}
            {user ? "My Dashboard" : "Get Started"}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-xl glass hover:bg-foreground/5 transition-all"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-[calc(100%+12px)] left-0 right-0 p-6 glass border border-border md:hidden flex flex-col gap-6 shadow-2xl rounded-[32px]"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-bold hover:text-primary transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex flex-col gap-4">
              {user ? (
                <Link 
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-lg font-bold py-2"
                >
                  <User className="text-primary" size={24} />
                  Mission Control
                </Link>
              ) : (
                <Link 
                  href="/auth"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-lg font-bold py-2"
                >
                  <User className="text-primary" size={24} />
                  Join the Squad
                </Link>
              )}
              <Link 
                href={user ? "/profile" : "/auth"}
                onClick={() => setIsOpen(false)}
                className="w-full py-4 rounded-2xl gradient-bg text-white font-black text-center shadow-xl shadow-primary/20"
              >
                {user ? "Go to Dashboard" : "Get Started Now"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

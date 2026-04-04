"use client";

import { motion } from "framer-motion";
import { Phone, User, ShoppingBag } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header 
      style={{ transform: 'translate3d(0, 0, 0)' } as any}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between glass mx-4 mt-4"
    >
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
          <Phone size={18} className="text-white" />
        </div>
        <span className="text-xl font-extrabold tracking-tight">
          BUZZ<span className="gradient-text">THRILLS</span>
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
        <Link href="/surprise-calls" className="hover:text-primary transition-colors">Surprise Calls</Link>
        <Link href="/digital-letters" className="hover:text-primary transition-colors">Digital Letters</Link>
        <Link href="/book" className="hover:text-primary transition-colors">Book Now</Link>
      </nav>

      <div className="flex items-center gap-4">
        <ThemeToggle />
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
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-foreground/5 transition-all text-sm font-semibold"
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
    </header>
  );
}

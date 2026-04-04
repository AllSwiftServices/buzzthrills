"use client";

import { motion } from "framer-motion";
import { Phone, BookOpen, User, Gift } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
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
        <Link href="#plans" className="hover:text-primary transition-colors">Subscriptions</Link>
        <Link href="#one-off" className="hover:text-primary transition-colors">One-off Booking</Link>
        <Link href="#digital-letter" className="hover:text-primary transition-colors">Digital Letters</Link>
      </nav>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-foreground/5 transition-all text-sm font-semibold">
          <User size={16} />
          Login
        </button>
        <button className="px-5 py-2 rounded-xl gradient-bg text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
          Get Started
        </button>
      </div>
    </header>
  );
}

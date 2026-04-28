"use client";

import { ReactNode, useEffect } from "react";
import Header from "@/components/Header";
import BottomTabNav from "./BottomTabNav";
import Sidebar from "./Sidebar";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="text-primary" size={40} />
        </motion.div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 font-outfit pb-24 md:pb-0">
      <Header />
      
      <div className="pt-32 px-4 md:px-6 max-w-7xl mx-auto pb-24 md:pb-12">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          <Sidebar />
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {user.role === 'admin' && (
        <Link 
          href="/admin"
          className="fixed top-24 right-6 z-50 p-4 rounded-2xl glass border border-primary/20 bg-primary/5 text-primary shadow-2xl hover:scale-110 active:scale-95 transition-all group flex items-center gap-3"
        >
          <ShieldCheck size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest pr-2 hidden sm:block">Admin Console</span>
        </Link>
      )}

      <BottomTabNav />
    </main>
  );
}

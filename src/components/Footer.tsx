"use client";

import { Phone, Mail, Globe, Send, MessageSquare, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from "@/components/Icons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Experiences",
      links: [
        { label: "Surprise Calls", href: "/surprise-calls" },
        { label: "Digital Letters", href: "/digital-letters" },
        { label: "Corporate Connections", href: "/corporate" },
        { label: "Plans & Sharing", href: "/pricing" },
      ]
    },
    {
      title: "Our Story",
      links: [
        { label: "Meet the Team", href: "/about" },
        { label: "Support Center", href: "/support" },
        { label: "Privacy & Trust", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ]
    }
  ];

  return (
    <footer className="relative pt-24 pb-12 overflow-hidden border-t border-border bg-background/80 backdrop-blur-3xl">
      {/* Background Decor */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-primary/5 blur-[120px] rounded-full translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[30vw] h-[30vw] bg-secondary/5 blur-[100px] rounded-full translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 md:gap-12 lg:gap-8 mb-20">
          {/* Brand Column */}
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-2 mb-8 group">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-huge">
                <Phone size={20} className="text-white" />
              </div>
              <span className="text-2xl font-semibold tracking-tight font-serif text-primary">
                Buzz<span className="text-foreground">Thrills</span>
              </span>
            </Link>
            <p className="text-foreground/80 font-medium text-lg md:text-xl tracking-tight leading-relaxed max-w-sm mb-10 italic font-serif">
              Creating heartfelt connections that bridge the distance. Sharing beautiful moments since 2024.
            </p>
            
            <div className="flex items-center gap-4">
              {[
                { icon: <InstagramIcon size={18} />, label: "Instagram", href: "https://instagram.com/Buzzthrills" },
                { icon: <FacebookIcon size={18} />, label: "Facebook", href: "https://facebook.com/Buzzthrills" },
                { icon: <WhatsAppIcon size={18} />, label: "WhatsApp", href: "https://wa.me/2349059388005" },
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.label}
                  className="w-10 h-10 rounded-xl bg-foreground/5 border border-border flex items-center justify-center text-foreground/40 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <div className="mt-8 space-y-4">
               <a 
                 href="tel:+2349059388005"
                 className="flex items-center gap-3 text-foreground/60 text-sm font-medium hover:text-primary transition-colors group"
               >
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone size={14} className="text-primary" />
                  </div>
                  09059388005
               </a>
               <a 
                 href="mailto:buzzthrills941@gmail.com"
                 className="flex items-center gap-3 text-foreground/60 text-sm font-medium hover:text-secondary transition-colors group"
               >
                  <div className="w-8 h-8 rounded-lg bg-secondary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail size={14} className="text-secondary" />
                  </div>
                  buzzthrills941@gmail.com
               </a>
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((column, i) => (
            <div key={i} className="lg:col-span-3">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60 mb-8 font-serif italic">
                {column.title}
              </h4>
              <ul className="space-y-4">
                {column.links.map((link, j) => (
                  <li key={j}>
                    <Link 
                      href={link.href} 
                      className="group flex items-center gap-2 text-foreground/70 hover:text-primary font-medium tracking-tight transition-all"
                    >
                      {link.label}
                      <ArrowUpRight size={14} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all text-primary" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Location / Status Column */}
          <div className="lg:col-span-1 border-l border-border lg:pl-8 flex flex-col justify-between items-center lg:items-end">
             <div className="flex flex-col items-center lg:items-end gap-1">
                <div className="text-[10px] font-semibold text-green-600 uppercase tracking-widest flex items-center gap-2 font-serif italic">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   Always here for you
                </div>
                 <div className="text-[9px] font-medium text-foreground/20 uppercase tracking-widest italic">Bridging hearts globally</div>
             </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
          <div className="text-[10px] font-medium text-foreground/30 uppercase tracking-[0.2em] italic font-serif">
            &copy; {currentYear} BuzzThrills Prime. All rights reserved.
          </div>
          
          <div className="flex items-center gap-12 text-[9px] font-medium text-foreground/20 uppercase tracking-widest italic font-serif">
             <div className="flex items-center gap-2">
                <ShieldCheck size={12} className="text-primary/20" />
                Purely Personal
             </div>
             <div className="flex items-center gap-2">
                <Activity size={12} className="text-secondary/60" />
                24,000+ Hearts Touched
             </div>
          </div>
        </div>

      </div>
    </footer>
  );
}

// Sub components used for bottom bar
function ShieldCheck({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function Activity({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

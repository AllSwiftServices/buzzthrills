"use client";

import { Phone, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { InstagramIcon, FacebookIcon, WhatsAppIcon, TikTokIcon } from "@/components/Icons";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  const footerLinks = [
    {
      title: "Explore",
      links: [
        { label: "Surprise Calls", href: "/surprise-calls" },
        { label: "Digital Letters", href: "/digital-letters" },
        { label: "Corporate Connections", href: "/corporate" },
        { label: "Plans & Subscriptions", href: "/pricing" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About BuzzThrills", href: "/about" },
        { label: "Support Centre", href: "/support" },
        { label: "Privacy & Trust", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="relative pt-20 pb-12 border-t border-border/40 bg-background">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Top Centered Section: Tagline, Socials, Contacts */}
        <div className="flex flex-col items-center text-center pb-16 border-b border-border/40">
          <p className="text-foreground/80 font-medium text-base mb-6 font-serif">
            Spreading positive vibes since 2022.
          </p>
          
          {/* Social Icons (Circles as in mockup) */}
          <div className="flex items-center gap-4 mb-8">
            {[
              { icon: <InstagramIcon size={18} />, label: "Instagram", href: "https://www.instagram.com/buzzthrills" },
              { icon: <TikTokIcon size={18} />, label: "TikTok", href: "https://www.tiktok.com/@callsurprisecompany" },
              { icon: <FacebookIcon size={18} />, label: "Facebook", href: "https://facebook.com/Buzzthrills" },
              { icon: <WhatsAppIcon size={18} />, label: "WhatsApp", href: "https://wa.me/message/MSQYBT5WIQ4XM1" },
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                title={social.label}
                className="w-10 h-10 rounded-full bg-foreground/5 border border-border flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary transition-all"
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Contact Details */}
          <div className="flex flex-col sm:flex-row gap-6 text-sm font-medium text-foreground/70">
            <a href="tel:+2349059388005" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone size={14} className="text-primary/70" />
              09059388005
            </a>
            <a href="mailto:hello@buzzthrills.com" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Mail size={14} className="text-primary/70" />
              hello@buzzthrills.com
            </a>
          </div>
        </div>

        {/* Middle Section: Logo column + Links column */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 py-16">
          {/* Brand Logo column */}
          <div className="md:col-span-6 flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              {mounted ? (
                <Image
                  src={isDark ? "/logo-dark.png" : "/logo-light.png"}
                  alt="BuzzThrills"
                  width={150}
                  height={35}
                  className="h-8 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
                />
              ) : (
                <div className="h-8 w-[150px]" />
              )}
            </Link>
            <p className="text-foreground/50 text-xs font-serif">
              Real moments. Real connections.
            </p>
          </div>

          {/* Links columns */}
          <div className="md:col-span-6 grid grid-cols-2 gap-8 text-center md:text-left">
            {footerLinks.map((column, i) => (
              <div key={i} className="flex flex-col items-center md:items-start">
                <h4 className="text-[10px] font-bold tracking-[0.3em] text-primary/80 mb-6 font-serif">
                  {column.title}
                </h4>
                <ul className="space-y-3.5">
                  {column.links.map((link, j) => (
                    <li key={j}>
                      <Link
                        href={link.href}
                        className="text-sm text-foreground/70 hover:text-primary font-medium tracking-tight transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section: Highlight Quote and Copyright */}
        <div className="pt-8 border-t border-border/40 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-accent font-serif text-center">
            ✦ No Distance Too Far. Human Voice. Real Impact. ✦
          </div>
          <div className="text-[10px] font-medium text-foreground/40 tracking-[0.1em] font-serif">
            &copy; {currentYear} BuzzThrills. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

import { LayoutDashboard, PhoneCall, Users, Tag, BarChart3, Mail, Sparkles, Send } from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

// Single source of truth for admin navigation so the desktop sidebar and the
// mobile nav can't silently drift out of sync with each other.
export const adminNavItems: AdminNavItem[] = [
  { href: "/admin",               icon: <LayoutDashboard size={18} />, label: "Dashboard" },
  { href: "/admin/calls",         icon: <PhoneCall size={18} />,       label: "Calls" },
  { href: "/admin/letters",       icon: <Mail size={18} />,            label: "Digital Letters" },
  { href: "/admin/special-calls", icon: <Sparkles size={18} />,        label: "Special Calls" },
  { href: "/admin/crm",           icon: <Users size={18} />,           label: "Clients" },
  { href: "/admin/offers",        icon: <Tag size={18} />,             label: "Promotions" },
  { href: "/admin/newsletter",    icon: <Send size={18} />,            label: "Newsletter" },
  { href: "/admin/analytics",     icon: <BarChart3 size={18} />,       label: "Analytics" },
];

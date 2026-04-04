"use client";

import { motion } from "framer-motion";
import { Users, PhoneCall, TrendingUp, ShoppingCart, UserMinus, MapPin, Calendar, Tag, ChevronRight, Search } from "lucide-react";
import { useState } from "react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { label: "Total Deliveries", value: "1,250", icon: <PhoneCall size={20} />, color: "text-blue-400" },
    { label: "Active Subs", value: "482", icon: <TrendingUp size={20} />, color: "text-green-400" },
    { label: "Unfinished Carts", value: "34", icon: <ShoppingCart size={20} />, color: "text-amber-400" },
    { label: "Churned Clients", value: "12", icon: <UserMinus size={20} />, color: "text-red-400" },
  ];

  const recentCalls = [
    { name: "John Wick", phone: "+2348012345678", plan: "Buzz Plus", status: "Scheduled", time: "Morning" },
    { name: "Bruce Wayne", phone: "+2349098765432", plan: "Buzz Orbit", status: "Pending", time: "Night" },
    { name: "Peter Parker", phone: "+2347011223344", plan: "One-off", status: "Delivered", time: "Afternoon" },
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 p-6 flex flex-col gap-8">
        <div className="text-xl font-black gradient-text mb-4">BUZZ ADMIN</div>
        
        <nav className="flex flex-col gap-2">
          {["Overview", "Manage Calls", "CRM & Data", "Special Offers", "Analytics"].map(item => (
            <button 
              key={item}
              onClick={() => setActiveTab(item.toLowerCase())}
              className={`text-left px-4 py-3 rounded-xl transition-all text-sm font-bold ${activeTab === item.toLowerCase() ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 rounded-2xl glass border-primary/20">
          <div className="text-xs font-bold text-primary uppercase mb-2">Superhero Logic</div>
          <p className="text-[10px] text-white/40 leading-tight">
            Remember to check upcoming slots for morning calls.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-grow p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-black">Dashboard <span className="gradient-text">Overview</span></h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input type="text" className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-primary" placeholder="Search callers..." />
            </div>
            <div className="w-10 h-10 rounded-full gradient-bg border-2 border-white/20" />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-[32px] glass border-white/5 flex flex-col gap-4"
            >
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl font-black">{stat.value}</div>
                <div className="text-xs font-bold text-white/40 uppercase tracking-widest">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Data Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Calls */}
          <div className="p-8 rounded-[40px] glass border-white/10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold">Upcoming <span className="gradient-text">Surprises</span></h3>
              <button className="text-xs font-bold text-primary hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {recentCalls.map((call, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      {call.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{call.name}</div>
                      <div className="text-xs text-white/40">{call.phone}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold uppercase text-primary">{call.plan}</div>
                    <div className="text-[10px] text-white/40">{call.time} Slot</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CRM Segmentation */}
          <div className="p-8 rounded-[40px] glass border-white/10">
            <h3 className="text-xl font-bold mb-8">Client <span className="gradient-text">Segmentation</span></h3>
            <div className="space-y-6">
              {[
                { label: "Lagos, Nigeria", count: "842", percentage: 70, icon: <MapPin size={14} /> },
                { label: "Abuja, Nigeria", count: "212", percentage: 40, icon: <MapPin size={14} /> },
                { label: "Corporate HR Team", count: "45", percentage: 20, icon: <Users size={14} /> },
                { label: "Mother's Day Offer", count: "112", percentage: 30, icon: <Tag size={14} /> },
              ].map((seg, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-white/80">
                      {seg.icon}
                      {seg.label}
                    </div>
                    <span className="text-xs text-white/40">{seg.count} total</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${seg.percentage}%` }}
                      className="h-full gradient-bg" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Special Offer Management Teaser */}
        <div className="mt-8 p-8 rounded-[40px] gradient-bg shadow-2xl shadow-primary/20 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black mb-2">Manage Special Offers 🎁</h3>
            <p className="text-white/80 max-w-md">Activate holiday deals like Mother's Day, Father's Day, or Community Merch directly from here.</p>
          </div>
          <button className="px-8 py-4 bg-white text-black font-black rounded-2xl flex items-center gap-2 hover:scale-105 transition-all">
            Update Offers
            <ChevronRight size={20} />
          </button>
        </div>
      </section>
    </main>
  );
}

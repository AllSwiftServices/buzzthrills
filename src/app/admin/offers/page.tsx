"use client";

import { motion } from "framer-motion";
import { 
  Tag, 
  Plus, 
  Calendar, 
  Star, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  Zap, 
  LayoutGrid, 
  Image as ImageIcon 
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";


export default function AdminOffers() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchOffers() {
      if (authLoading || !user || user.role !== 'admin') return;
      
      try {
        const res = await fetch("/api/admin/offers");
        if (!res.ok) throw new Error("Failed to fetch offers");
        const data = await res.json();
        setOffers(data.offers || []);
      } catch (err) {
        console.error("Offers fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOffers();
  }, [user, authLoading]);

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tighter uppercase italic">Promotion <span className="gradient-text">Manager</span></h1>
          <p className="text-muted-foreground font-bold tracking-tight uppercase text-[10px] tracking-widest">Manage platform-wide promotions and seasonal packages.</p>
        </div>
        
        <button className="w-full md:w-auto px-8 py-4 rounded-2xl gradient-bg text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
          <Plus size={20} />
          Create Campaign
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {offers.map((offer, i) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group relative rounded-[56px] overflow-hidden glass border border-border shadow-huge bg-background/40 hover:border-primary/20 transition-all"
          >
            {/* Banner Image / High-Fidelity Asset */}
            <div className="h-64 w-full relative overflow-hidden bg-background/40">
               {offer.banner_url ? (
                 <img 
                   src={offer.banner_url} 
                   alt={offer.title} 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                 />
               ) : (
                  <div className="absolute inset-0 gradient-bg opacity-10 group-hover:opacity-20 transition-opacity flex items-center justify-center">
                     <div className="text-foreground/5 font-black text-6xl italic uppercase tracking-tighter rotate-[-10deg]">No Asset</div>
                  </div>
               )}
               
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
               <div className="absolute top-8 right-8 flex gap-3">
                   <div className="p-3 rounded-2xl glass border border-border text-foreground/40 hover:text-primary hover:border-primary/40 transition-all cursor-pointer shadow-xl">
                      <ImageIcon size={18} />
                   </div>
                  <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl border ${
                    offer.is_active ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                    <Zap size={12} className={offer.is_active ? 'animate-pulse' : ''} />
                    {offer.is_active ? 'Active' : 'Draft'}
                  </div>
               </div>
            </div>

            <div className="p-10 relative z-10 -mt-12 group-hover:mt-[-56px] transition-all duration-500">
               <div className="p-8 rounded-[40px] glass border border-border shadow-huge bg-background/40 backdrop-blur-2xl">
                  <div className="flex justify-between items-start mb-6">
                     <div>
                       <h3 className="text-3xl font-black mb-2 tracking-tighter group-hover:text-primary transition-colors">{offer.title}</h3>
                       <p className="text-foreground/40 text-sm font-bold tracking-tight line-clamp-2 max-w-sm leading-relaxed">{offer.description}</p>
                     </div>
                     <div className="w-20 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-2xl shadow-huge tabular-nums">
                       {offer.discount_percent}%
                     </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mb-8">
                     <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/60 bg-primary/5 px-4 py-2 rounded-xl border border-primary/10 transition-all group-hover:scale-105">
                        <Calendar size={14} />
                        Seasonal
                     </div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/20 px-4 py-2 rounded-xl border border-border">
                         <Zap size={14} />
                         Premium
                      </div>
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-border">
                     <div className="flex items-center gap-3">
                        <button className="p-4 rounded-2xl bg-foreground/5 text-foreground/40 hover:text-foreground hover:bg-foreground/10 hover:scale-110 active:scale-95 transition-all shadow-xl">
                           <Edit3 size={18} />
                        </button>
                        <button className="p-4 rounded-2xl bg-red-400/5 text-red-400/20 hover:text-red-400 hover:bg-red-400/10 hover:scale-110 active:scale-95 transition-all border border-transparent hover:border-red-400/20 shadow-xl">
                           <Trash2 size={18} />
                        </button>
                     </div>
                     <button className="px-8 py-4 rounded-2xl border border-primary/40 text-primary hover:bg-primary hover:text-white font-black text-xs uppercase tracking-widest transition-all scale-95 group-hover:scale-100 shadow-huge shadow-primary/5 flex items-center gap-3">
                        Performance
                        <ChevronRight size={16} />
                     </button>
                  </div>
               </div>
            </div>
          </motion.div>
        ))}

        {!loading && offers.length === 0 && (
          <div className="lg:col-span-2 p-24 rounded-[48px] glass border border-dashed border-border flex flex-col items-center justify-center text-center group hover:border-primary/40 transition-all cursor-pointer bg-background/10">
              <Tag size={64} className="text-foreground/10 mb-6 group-hover:scale-110 transition-transform group-hover:text-primary/40" />
              <h3 className="text-2xl font-black mb-2 opacity-40 italic uppercase tracking-tighter">No Promotions Active</h3>
              <p className="text-foreground/20 font-black italic tracking-widest text-[9px] uppercase">Create your first promotion now.</p>
          </div>
        )}
      </div>
    </div>
  );
}

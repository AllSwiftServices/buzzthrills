"use client";

import { motion } from "framer-motion";
import {
  Tag,
  Plus,
  Edit3,
  Trash2,
  Zap,
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
    <div className="space-y-8 sm:space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2 tracking-tighter">Promotions</h1>
          <p className="text-muted-foreground font-medium text-[9px] sm:text-[10px] tracking-widest">Discounts and seasonal packages shown to clients.</p>
        </div>

        <button
          disabled
          title="Creating promotions from the dashboard is coming soon. Ask engineering to add one directly for now."
          className="w-full md:w-auto px-8 py-4 rounded-2xl gradient-bg text-white font-black text-xs tracking-[0.2em] shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
        >
          <Plus size={20} />
          Create promotion (coming soon)
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
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
                     <div className="text-foreground/10 font-black text-4xl tracking-tighter">No image</div>
                  </div>
               )}
               
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
               <div className="absolute top-8 right-8 flex gap-3">
                   <div className="p-3 rounded-2xl glass border border-border text-foreground/40 hover:text-primary hover:border-primary/40 transition-all cursor-pointer shadow-xl">
                      <ImageIcon size={18} />
                   </div>
                  <div className={`px-5 py-2 rounded-full text-[10px] font-black tracking-widest flex items-center gap-2 shadow-xl border ${
                    offer.is_active ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                    <Zap size={12} className={offer.is_active ? 'animate-pulse' : ''} />
                    {offer.is_active ? 'Active' : 'Draft'}
                  </div>
               </div>
            </div>

            <div className="p-5 sm:p-10 relative z-10 -mt-12 group-hover:mt-[-56px] transition-all duration-500">
               <div className="p-5 sm:p-8 rounded-[32px] sm:rounded-[40px] glass border border-border shadow-huge bg-background/40 backdrop-blur-2xl">
                  <div className="flex justify-between items-start gap-4 mb-6">
                     <div className="min-w-0">
                       <h3 className="text-xl sm:text-3xl font-black mb-2 tracking-tighter group-hover:text-primary transition-colors truncate">{offer.title}</h3>
                       <p className="text-foreground/40 text-sm font-medium line-clamp-2 max-w-sm leading-relaxed">{offer.description}</p>
                     </div>
                     <div className="w-16 h-12 sm:w-20 sm:h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-lg sm:text-2xl shadow-huge tabular-nums shrink-0">
                       {offer.discount_percent}%
                     </div>
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-border">
                     <div className="flex items-center gap-3">
                        <button
                          disabled
                          title="Editing promotions from the dashboard is coming soon."
                          className="p-4 rounded-2xl bg-foreground/5 text-foreground/20 shadow-xl opacity-60 cursor-not-allowed"
                        >
                           <Edit3 size={18} />
                        </button>
                        <button
                          disabled
                          title="Deleting promotions from the dashboard is coming soon."
                          className="p-4 rounded-2xl bg-red-400/5 text-red-400/20 shadow-xl opacity-60 cursor-not-allowed"
                        >
                           <Trash2 size={18} />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        ))}

        {!loading && offers.length === 0 && (
          <div className="lg:col-span-2 p-12 sm:p-24 rounded-[48px] glass border border-dashed border-border flex flex-col items-center justify-center text-center bg-background/10">
              <Tag size={64} className="text-foreground/10 mb-6" />
              <h3 className="text-xl sm:text-2xl font-black mb-2 opacity-40 tracking-tighter">No promotions yet</h3>
              <p className="text-foreground/30 font-medium tracking-widest text-[9px]">Promotions you create will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

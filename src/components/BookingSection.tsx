"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Star, Heart, MessageCircle, HelpCircle, Sun, User, 
  Crown, Target, Moon, Music, CloudRain, Video, Building,
  ChevronRight, Sparkles
} from "lucide-react";
import { CALL_SERVICES, CallService } from "@/lib/pricing_config";
import Link from "next/link";

const ICON_MAP: Record<string, any> = {
  Star, Heart, MessageCircle, HelpCircle, Sun, User, 
  Crown, Target, Moon, Music, CloudRain, Video, Building
};

export default function BookingSection() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const services = Object.values(CALL_SERVICES);
  const selectedService = selectedId ? CALL_SERVICES[selectedId] : null;

  return (
    <section id="services" className="py-24 px-4 sm:px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-border text-primary text-[10px] font-bold uppercase tracking-[0.4em] mb-8"
          >
            <Sparkles size={14} className="fill-current" />
            Our Service Catalog
          </motion.div>
          <h2 className="text-4xl sm:text-6xl font-medium mb-6 font-serif tracking-tight">
            Share a <span className="gradient-text italic">Heartfelt Moment</span>
          </h2>
          <p className="text-muted-foreground font-medium text-lg max-w-2xl mx-auto tracking-tight leading-relaxed italic font-serif">
            Choose the perfect experience to brighten someone's day. Each service is crafted with genuine care and emotion.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => {
            const Icon = ICON_MAP[service.icon] || Star;
            return (
              <motion.button
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedId(service.id)}
                className={`p-8 rounded-[40px] text-left transition-all duration-500 transform active:scale-95 border group relative overflow-hidden h-full flex flex-col ${
                  selectedId === service.id 
                    ? 'bg-primary/5 border-primary shadow-huge scale-[1.02]' 
                    : 'glass border-border hover:border-primary/20 hover:bg-primary/[0.02]'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 ${
                  selectedId === service.id ? 'bg-primary text-white rotate-12' : 'bg-foreground/5 text-primary group-hover:bg-primary/10 group-hover:-rotate-12'
                }`}>
                  <Icon size={24} />
                </div>
                
                <div className="flex-grow">
                  <h3 className="font-bold text-xl mb-3 tracking-tight group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-6 line-clamp-3">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                  <div className={`font-black text-sm tracking-tight ${selectedId === service.id ? 'text-primary' : 'text-foreground/40'}`}>
                    {service.basePrice > 0 ? `From ₦${service.basePrice.toLocaleString()}` : "Custom Quote"}
                  </div>
                  {selectedId === service.id && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                       <ChevronRight size={18} className="text-primary" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedService && (
            <motion.div 
              initial={{ height: 0, opacity: 0, y: 20 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: 20 }}
              className="mt-16 p-10 md:p-14 rounded-[56px] glass border border-primary/20 overflow-hidden relative shadow-huge bg-background/40"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full -mr-48 -mt-48" />
              
              <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-white">
                      {(() => { const Icon = ICON_MAP[selectedService.icon] || Star; return <Icon size={20} />; })()}
                    </div>
                    <h3 className="text-3xl md:text-5xl font-medium font-serif italic tracking-tight">{selectedService.name}</h3>
                  </div>
                  <p className="text-muted-foreground font-medium text-lg md:text-xl leading-relaxed tracking-tight max-w-xl">
                    {selectedService.description} Let's make this moment unforgettable for your special someone.
                  </p>
                </div>
                
                <Link 
                  href={`/book?type=${selectedService.id}`}
                  className="w-full md:w-auto px-12 py-6 gradient-bg rounded-3xl font-bold text-xl text-white shadow-huge hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-3 group"
                >
                  Book This Experience
                  <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {selectedService.tiers.length > 1 && (
                <div className="mt-12 pt-12 border-t border-border/50 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {selectedService.tiers.map(tier => (
                    <div key={tier.variant} className="p-6 rounded-3xl bg-foreground/5 border border-border flex flex-col gap-2">
                      <div className="text-[10px] font-black uppercase tracking-widest text-primary/60">{tier.label}</div>
                      <div className="text-xl font-bold">₦{tier.price.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

import { AnimatePresence } from "framer-motion";

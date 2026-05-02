"use client";

import { motion } from "framer-motion";
import { 
  Star, Heart, MessageCircle, HelpCircle, Sun, User, 
  Crown, Target, Moon, Music, CloudRain, Video, Building,
  ArrowRight, Sparkles
} from "lucide-react";
import { CALL_SERVICES } from "@/lib/pricing_config";
import Link from "next/link";

const ICON_MAP: Record<string, any> = {
  Star, Heart, MessageCircle, HelpCircle, Sun, User, 
  Crown, Target, Moon, Music, CloudRain, Video, Building
};

export default function BookingSection() {
  const services = Object.values(CALL_SERVICES);

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
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/book?type=${service.id}`}
                  className="p-8 rounded-[40px] text-left transition-all duration-500 transform active:scale-95 border group relative overflow-hidden h-full flex flex-col glass border-border hover:border-primary/20 hover:bg-primary/[0.02] hover:shadow-huge hover:scale-[1.02]"
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 bg-foreground/5 text-primary group-hover:bg-primary/10 group-hover:-rotate-12">
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
                    <div className="font-black text-sm tracking-tight text-foreground/40 group-hover:text-primary transition-colors">
                      {service.basePrice > 0 ? `From ₦${service.basePrice.toLocaleString()}` : "Custom Quote"}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                       <ArrowRight size={18} className="text-primary" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

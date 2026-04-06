"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Mail, 
  MapPin, 
  Calendar, 
  Zap, 
  Globe, 
  Loader2 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getSupabase } from "@/lib/supabase";

export default function AdminCRM() {
  const { user, accessToken, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [filters, setFilters] = useState({ role: 'all', location: 'all', segment: 'all' });

  useEffect(() => {
    async function fetchProfiles() {
      if (authLoading || !user || user.role !== 'admin') return;
      
      const authenticatedSupabase = getSupabase(accessToken);
      let query = authenticatedSupabase.from('profiles').select('*');

      if (filters.role !== 'all') query = query.eq('role', filters.role);
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (data) setProfiles(data);
      setLoading(false);
    }

    fetchProfiles();
  }, [user, authLoading, accessToken, filters]);

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tighter uppercase italic">Squad <span className="gradient-text">Identity</span></h1>
          <p className="text-muted-foreground font-bold tracking-tight">Managing 12,000+ verified platform superheroes.</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
           {/* Advanced Filters */}
           <select 
             onChange={(e) => setFilters({ ...filters, role: e.target.value })}
             className="px-6 py-4 rounded-2xl glass border border-white/10 text-xs font-black uppercase tracking-widest outline-none cursor-pointer hover:border-primary/40 transition-all appearance-none"
           >
              <option className="bg-background text-foreground" value="all">Every Role</option>
              <option className="bg-background text-foreground" value="user">Superheroes</option>
              <option className="bg-background text-foreground" value="caller">Tactical Callers</option>
              <option className="bg-background text-foreground" value="admin">Squad Leaders</option>
           </select>

           <select className="px-6 py-4 rounded-2xl glass border border-white/10 text-xs font-black uppercase tracking-widest outline-none cursor-pointer hover:border-secondary/40 transition-all appearance-none">
              <option className="bg-background text-foreground">Global Reach</option>
              <option className="bg-background text-foreground">Lagos (HQ)</option>
              <option className="bg-background text-foreground">Abuja (North)</option>
              <option className="bg-background text-foreground">Port-Harcourt (South)</option>
           </select>

           <button className="px-10 py-4 rounded-2xl gradient-bg text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              Export Mission Data (.csv)
           </button>
        </div>
      </header>

      <div className="rounded-[48px] glass border border-white/10 overflow-hidden shadow-huge bg-black/20 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-48 -mt-48" />
        
        <div className="overflow-x-auto relative z-10 scrollbar-hide">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Superhero Identity</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Status & Role</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Location & Segment</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Joined On</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Tactical Pulse</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-bold">
              {profiles.map((profile, i) => (
                <motion.tr 
                  key={profile.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-white/[0.03] transition-all group"
                >
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary p-0.5 shadow-xl shadow-primary/10">
                         <div className="w-full h-full rounded-[14px] bg-[#111] flex items-center justify-center font-black text-lg gradient-text">
                            {profile.full_name?.charAt(0)}
                         </div>
                      </div>
                      <div>
                        <div className="text-white font-black text-lg group-hover:text-primary transition-colors">{profile.full_name}</div>
                        <div className="text-xs text-white/20 tracking-tighter whitespace-nowrap">{profile.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 border border-white/5 ${
                      profile.role === 'admin' ? 'bg-primary/10 text-primary border-primary/20' : 
                      profile.role === 'caller' ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-white/5 text-white/40'
                    }`}>
                      <Zap size={12} className={profile.role === 'admin' ? 'animate-pulse' : ''} />
                      {profile.role}
                    </div>
                  </td>
                  <td className="px-10 py-6">
                     <div className="flex flex-col gap-1.5">
                        <div className="text-sm flex items-center gap-2">
                           <Globe size={14} className="text-white/40" />
                           {profile.location || 'Unknown Sector'}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-primary/60 italic">
                           {profile.age_grade || 'Hero Class Undefined'}
                        </div>
                     </div>
                  </td>
                  <td className="px-10 py-6 text-sm tabular-nums text-white/40">
                     {new Date(profile.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex gap-2">
                       <button className="p-3.5 rounded-2xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 hover:scale-110 active:scale-95 transition-all">
                          <Edit3 size={18} />
                       </button>
                       <button className="p-3.5 rounded-2xl bg-red-400/5 text-red-400/20 hover:text-red-400 hover:bg-red-400/10 hover:scale-110 active:scale-95 transition-all border border-transparent hover:border-red-400/20">
                          <Trash2 size={18} />
                       </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="p-32 flex flex-col items-center justify-center gap-6">
            <Loader2 className="animate-spin text-primary" size={64} />
            <div className="text-sm font-black uppercase tracking-[0.4em] animate-pulse">Scanning Identities...</div>
          </div>
        )}

        {!loading && profiles.length === 0 && (
          <div className="p-40 text-center flex flex-col items-center justify-center">
             <Users size={80} className="text-white/5 mb-8 rotate-12" />
             <div className="text-2xl font-black mb-2 opacity-20">No Superheroes Found.</div>
             <div className="text-sm font-bold text-white/10 uppercase tracking-widest italic font-mono uppercase">Mission Empty.</div>
          </div>
        )}
      </div>
    </div>
  );
}

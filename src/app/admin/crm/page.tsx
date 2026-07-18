"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Globe,
  Loader2,
  Ban,
  Trash2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminCRM() {
  const { user, accessToken, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchProfiles() {
      if (authLoading || !user || user.role !== 'admin') return;
      
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        
        const data = await res.json();
        setProfiles(data);
      } catch (error) {
        console.error("Client directory data error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfiles();
  }, [user, authLoading]);

  const handleUpdateUser = async (userId: string, updates: any) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, updates }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setProfiles(prev => prev.map(u => u.id === userId ? { ...u, ...updatedUser } : u));
      }
    } catch (error) {
      console.error("User Update Failure:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Account Deletion: Proceed with permanent deletion?")) return;
    
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        setProfiles(prev => prev.filter(u => u.id !== userId));
      }
    } catch (error) {
      console.error("User Deletion Failure:", error);
    }
  };

  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      if (roleFilter !== "all" && p.role !== roleFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (!p.full_name?.toLowerCase().includes(q) && !p.email?.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [profiles, roleFilter, query]);

  return (
    <div className="space-y-8 sm:space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2 tracking-tighter uppercase">Clients</h1>
          <p className="text-muted-foreground font-bold uppercase text-[9px] sm:text-[10px] tracking-widest">Every registered member and their account status.</p>
        </div>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
           <div className="relative flex-1 sm:w-56">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or email…"
                className="w-full pl-10 pr-4 py-3 rounded-2xl glass border border-border text-xs font-bold outline-none focus:border-primary/40 transition-all"
              />
           </div>
           <select
             value={roleFilter}
             onChange={(e) => setRoleFilter(e.target.value)}
             className="px-6 py-3 rounded-2xl glass border border-border text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:border-primary/40 transition-all appearance-none"
           >
              <option className="bg-background text-foreground" value="all">Every role</option>
              <option className="bg-background text-foreground" value="user">Clients</option>
              <option className="bg-background text-foreground" value="caller">Callers</option>
              <option className="bg-background text-foreground" value="admin">Admins</option>
           </select>
        </div>
      </header>

      <div className="rounded-[28px] sm:rounded-[48px] glass border border-border overflow-hidden shadow-huge bg-background/40 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-48 -mt-48" />

        <div className="overflow-x-auto relative z-10 scrollbar-hide">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-foreground/2">
                <th className="px-5 sm:px-10 py-6 sm:py-8 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 whitespace-nowrap">Member</th>
                <th className="px-5 sm:px-10 py-6 sm:py-8 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 whitespace-nowrap">Status</th>
                <th className="px-5 sm:px-10 py-6 sm:py-8 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 whitespace-nowrap">Region & plan</th>
                <th className="px-5 sm:px-10 py-6 sm:py-8 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 whitespace-nowrap">Joined</th>
                <th className="px-5 sm:px-10 py-6 sm:py-8 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-bold">
              {filteredProfiles.map((profile, i) => (
                <motion.tr 
                  key={profile.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-foreground/3 transition-all group"
                >
                  <td className="px-5 sm:px-10 py-4 sm:py-6">
                    <div className="flex items-center gap-4 sm:gap-5">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary p-0.5 shadow-xl shadow-primary/10 shrink-0">
                         <div className="w-full h-full rounded-[14px] bg-background flex items-center justify-center font-black text-lg gradient-text">
                            {profile.full_name?.charAt(0)}
                         </div>
                      </div>
                      <div>
                        <div className="text-foreground font-black text-lg group-hover:text-primary transition-colors">{profile.full_name}</div>
                        <div className="text-xs text-foreground/20 tracking-tighter whitespace-nowrap">{profile.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 sm:px-10 py-4 sm:py-6">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 border border-border ${
                      profile.role === 'admin' ? 'bg-primary/10 text-primary border-primary/20' :
                      profile.role === 'caller' ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-foreground/5 text-foreground/40'
                    }`}>
                      {profile.is_suspended && <Ban size={12} className="text-red-500" />}
                      {profile.role}
                    </div>
                  </td>
                  <td className="px-5 sm:px-10 py-4 sm:py-6">
                     <div className="flex flex-col gap-1.5">
                        <div className="text-sm flex items-center gap-2">
                           <Globe size={14} className="text-foreground/40" />
                           {profile.location || '—'}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                           {profile.subscriptions?.[0]?.status === 'active'
                             ? `${profile.subscriptions[0].plan} plan`
                             : profile.subscriptions?.[0]?.plan
                             ? `${profile.subscriptions[0].plan} plan (${profile.subscriptions[0].status})`
                             : 'No active plan'}
                        </div>
                     </div>
                  </td>
                  <td className="px-5 sm:px-10 py-4 sm:py-6 text-sm tabular-nums text-foreground/40 whitespace-nowrap">
                     {new Date(profile.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 sm:px-10 py-4 sm:py-6">
                    <div className="flex flex-wrap gap-2">
                       <select
                         value={profile.role}
                         onChange={(e) => handleUpdateUser(profile.id, { role: e.target.value })}
                         className="px-3 py-2 rounded-xl bg-foreground/5 border border-border text-[10px] font-black uppercase outline-none hover:border-primary/20 transition-all cursor-pointer"
                       >
                          <option className="bg-background" value="user">Client</option>
                          <option className="bg-background" value="caller">Caller</option>
                          <option className="bg-background" value="admin">Admin</option>
                       </select>

                       <button
                         onClick={() => handleUpdateUser(profile.id, { is_suspended: !profile.is_suspended })}
                         className={`p-3.5 rounded-2xl border transition-all hover:scale-105 active:scale-95 ${
                           profile.is_suspended
                           ? 'bg-amber-500/20 text-amber-500 border-amber-500/20 shadow-lg shadow-amber-500/10'
                           : 'bg-foreground/5 text-foreground/40 border-transparent hover:text-foreground hover:bg-foreground/10'
                         }`}
                         title={profile.is_suspended ? 'Reactivate account' : 'Suspend account'}
                       >
                          <Ban size={18} />
                       </button>

                       <button
                         onClick={() => handleDeleteUser(profile.id)}
                         className="p-3.5 rounded-2xl bg-red-400/5 text-red-400/40 hover:text-red-400 hover:bg-red-400/10 hover:scale-110 active:scale-95 transition-all border border-transparent hover:border-red-400/20"
                         title="Delete account"
                       >
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
          <div className="p-20 sm:p-32 flex flex-col items-center justify-center gap-6">
            <Loader2 className="animate-spin text-primary" size={64} />
            <div className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Loading clients…</div>
          </div>
        )}

        {!loading && filteredProfiles.length === 0 && (
          <div className="p-20 sm:p-40 text-center flex flex-col items-center justify-center">
             <Users size={80} className="text-foreground/10 mb-8" />
             <div className="text-xl sm:text-2xl font-black mb-2 opacity-40">
               {profiles.length === 0 ? "No members yet" : "No members match your search"}
             </div>
             <div className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
               {profiles.length === 0 ? "New sign-ups will appear here." : "Try a different name, email, or role."}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

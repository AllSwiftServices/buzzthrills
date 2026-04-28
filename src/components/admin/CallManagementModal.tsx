"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, CheckCircle2, AlertCircle, Loader2, Play, Trash2, User, Heart, MessageSquare, Phone, Calendar, Clock, UserCheck, FileText, AlertTriangle } from "lucide-react";

interface CallManagementModalProps {
  call: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function CallManagementModal({ call, isOpen, onClose, onUpdate }: CallManagementModalProps) {
  const [status, setStatus] = useState(call.status || "pending");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState(call.recording_url || "");
  const [adminNotes, setAdminNotes] = useState(call.admin_notes || "");
  const [failureReason, setFailureReason] = useState(call.failure_reason || "");
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("callId", call.id);

      const res = await fetch("/api/admin/calls/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setRecordingUrl(data.recordingUrl);
      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload recording. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (status === 'delivered' && !recordingUrl) {
      setError("A recording upload is required to mark this call as delivered.");
      return;
    }

    if (status === 'failed' && !failureReason) {
      setError("Please provide a reason for the failure.");
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const res = await fetch("/api/admin/calls/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callId: call.id,
          status,
          recordingUrl,
          adminNotes,
          failureReason: status === 'failed' ? failureReason : null,
        }),
      });

      if (!res.ok) throw new Error("Update failed");
      onUpdate();
      onClose();
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update call. Please check your connection.");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl bg-[#0D0D0E] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-linear-to-b from-white/5 to-transparent">
          <div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Engagement <span className="gradient-text italic">Command Console</span></h2>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">Audit ID: {call.id.toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-4">
             <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                call.status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                call.status === 'failed' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                'bg-amber-500/10 text-amber-500 border-amber-500/20'
             }`}>
                Current: {call.status}
             </div>
             <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/60">
               <X size={24} />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 h-[60vh] overflow-y-auto lg:h-auto lg:overflow-visible">
           {/* Column 1: Core Details */}
           <div className="p-8 space-y-8 border-r border-white/5 bg-white/[0.01]">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">The Recipient</label>
                <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white shadow-xl">
                         <User size={24} />
                      </div>
                      <div className="overflow-hidden">
                         <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Name</div>
                         <div className="text-lg font-black text-white italic truncate">{call.recipient_name}</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                         <Phone size={18} />
                      </div>
                      <div>
                         <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Phone</div>
                         <div className="text-sm font-black text-white tracking-wider">{call.recipient_phone}</div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">The Booker</label>
                <div className="p-5 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary shadow-xl">
                    <UserCheck size={24} />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">User</div>
                    <div className="text-sm font-black text-white truncate">{call.profiles?.full_name || "Anonymous"}</div>
                  </div>
                </div>
              </div>
           </div>

           {/* Column 2: Context */}
           <div className="p-8 space-y-8 border-r border-white/5">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Engagement Context</label>
                <div className="grid grid-cols-2 gap-3">
                   <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 text-white/40 mb-1">
                         <Calendar size={12} className="text-primary" />
                         <span className="text-[9px] font-black uppercase tracking-widest">Date</span>
                      </div>
                      <div className="text-xs font-black text-white">{new Date(call.occasion_date).toLocaleDateString()}</div>
                   </div>
                   <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 text-white/40 mb-1">
                         <Clock size={12} className="text-secondary" />
                         <span className="text-[9px] font-black uppercase tracking-widest">Slot</span>
                      </div>
                      <div className="text-xs font-black text-white uppercase">{call.scheduled_slot}</div>
                   </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent shrink-0">
                    <Heart size={18} />
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-white/40 uppercase tracking-widest">Relationship</div>
                    <div className="text-sm font-black text-white">{call.relationship || "Not specified"}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Message</label>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group min-h-[120px]">
                  <MessageSquare size={40} className="absolute -bottom-4 -right-4 text-white/[0.02] group-hover:scale-110 transition-transform duration-500" />
                  <div className="text-xs font-medium text-white/80 leading-relaxed italic relative z-10">
                    "{call.custom_message || "No custom message provided."}"
                  </div>
                </div>
              </div>
           </div>

           {/* Column 3: Operator Actions (Notes & Proof) */}
           <div className="p-8 space-y-8 border-r border-white/5 bg-white/[0.01]">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Operator Notes (Sent to Booker)</label>
                <textarea 
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add details about how the call went..."
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white outline-none focus:border-primary transition-all resize-none font-medium placeholder:text-white/10"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                  <Upload size={10} />
                  Voice Proof {status === 'delivered' && <span className="text-primary font-black">*REQUIRED</span>}
                </label>
                
                {recordingUrl ? (
                  <div className="p-5 rounded-[24px] bg-green-500/10 border border-green-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white shadow-lg">
                        <Play size={16} />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-[9px] font-black uppercase tracking-widest text-green-500">Audio Ready</div>
                        <div className="text-[8px] font-bold text-white/30 truncate">Proof_Linked.mp3</div>
                      </div>
                    </div>
                    <button onClick={() => setRecordingUrl("")} className="p-2 text-white/20 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" id="recording-upload" />
                    <label htmlFor="recording-upload" className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-[32px] transition-all cursor-pointer group ${
                      error && status === 'delivered' && !recordingUrl ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 hover:border-primary/40 hover:bg-primary/5'
                    }`}>
                      <Upload size={24} className={`mb-2 transition-all ${file ? 'text-primary' : 'text-white/10 group-hover:text-primary group-hover:scale-110'}`} />
                      <div className="text-[9px] font-black uppercase tracking-widest text-white/40 text-center truncate w-full px-4">
                        {file ? file.name : "Select Voice Proof"}
                      </div>
                    </label>
                    {file && (
                      <button onClick={handleUpload} disabled={uploading} className="mt-3 w-full py-3 rounded-xl bg-secondary text-white font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                        {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                        Confirm Upload
                      </button>
                    )}
                  </div>
                )}
              </div>
           </div>

           {/* Column 4: Lifecycle Finalization */}
           <div className="p-8 space-y-8 bg-white/[0.02]">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Status Lifecycle</label>
                <div className="grid grid-cols-1 gap-2">
                  {['pending', 'delivered', 'failed'].map((s) => (
                    <button
                      key={s}
                      onClick={() => { setStatus(s); setError(null); }}
                      className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border flex items-center justify-between px-6 ${
                        status === s ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white/5 border-white/10 text-white/40 hover:border-primary/30 hover:text-white'
                      }`}
                    >
                      {s}
                      {status === s && <CheckCircle2 size={14} />}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {status === 'failed' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 flex items-center gap-2">
                      <AlertTriangle size={12} />
                      Failure Reason
                    </label>
                    <textarea 
                      value={failureReason}
                      onChange={(e) => setFailureReason(e.target.value)}
                      placeholder="Why did this engagement fail?"
                      className="w-full h-24 bg-red-500/5 border border-red-500/20 rounded-2xl p-4 text-xs text-white outline-none focus:border-red-500 transition-all resize-none font-medium placeholder:text-red-500/20"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-8 space-y-4 border-t border-white/5">
                {error && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500">
                    <AlertCircle size={16} className="shrink-0" />
                    <div className="text-[10px] font-black uppercase tracking-widest leading-tight">{error}</div>
                  </div>
                )}
                <button 
                  onClick={handleSave}
                  disabled={uploading}
                  className="w-full py-6 rounded-[24px] bg-primary text-white font-black text-[12px] uppercase tracking-widest shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-50"
                >
                  <div className="flex items-center gap-2">
                    {uploading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                    Complete Engagement
                  </div>
                  <span className="text-[8px] font-bold text-white/40 tracking-[0.2em]">Syncing Results & Notifying Booker</span>
                </button>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
}

function ShieldCheck({ className, size }: { className?: string, size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

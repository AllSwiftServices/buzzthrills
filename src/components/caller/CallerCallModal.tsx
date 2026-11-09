"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Upload, CheckCircle2, AlertCircle, Loader2, Play, Trash2, User, Heart, MessageSquare, Phone, Calendar, Clock, AlertTriangle, ShieldCheck, Volume2, HelpCircle } from "lucide-react";

interface CallerCallModalProps {
  call: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

// A caller only ever moves a call forward to one of these two outcomes —
// "pending"/"assigned" are earlier states set before the call reaches them.
const STATUS_OPTIONS = ["delivered", "failed"];

export default function CallerCallModal({ call, isOpen, onClose, onUpdate }: CallerCallModalProps) {
  const [status, setStatus] = useState(call.status || "pending");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState(call.recording_url || "");
  const [failureReason, setFailureReason] = useState(call.failure_reason || "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isFinalized = call.status === 'delivered' || call.status === 'failed';

  const uploadAudioFile = async (fileToUpload?: File): Promise<string | null> => {
    const targetFile = fileToUpload || file;
    if (!targetFile) return null;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", targetFile);
      formData.append("callId", call.id);

      const res = await fetch("/api/caller/calls/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setRecordingUrl(data.recordingUrl);
      setFile(null);
      return data.recordingUrl;
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err?.message || "Failed to upload recording. Please try again.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = () => uploadAudioFile();

  const handleSave = async () => {
    if (status !== 'delivered' && status !== 'failed') {
      setError("Please mark this call as delivered or failed before saving.");
      return;
    }

    let currentRecording = recordingUrl;
    if (status === 'delivered' && !currentRecording && file) {
      const uploadedUrl = await uploadAudioFile(file);
      if (!uploadedUrl) return;
      currentRecording = uploadedUrl;
    }

    if (status === 'delivered' && !currentRecording) {
      setError("A recording upload is required to mark this call as delivered.");
      return;
    }

    if (status === 'failed' && !failureReason) {
      setError("Please provide a reason for the failure.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const res = await fetch("/api/caller/calls/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callId: call.id,
          status,
          recordingUrl: currentRecording,
          failureReason: status === 'failed' ? failureReason : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      onUpdate();
      onClose();
    } catch (err: any) {
      console.error("Update error:", err);
      setError(err?.message || "Failed to update call. Please check your connection.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-foreground/5 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-background border border-foreground/10 rounded-[24px] sm:rounded-[40px] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
      >
        <div className="p-5 sm:p-8 border-b border-foreground/5 flex justify-between items-center bg-linear-to-b from-white/5 to-transparent shrink-0">
          <div>
            <h2 className="text-lg sm:text-2xl font-black tracking-tighter text-foreground">Your Call</h2>
            <p className="text-[8px] sm:text-[10px] font-medium text-foreground/40 tracking-widest mt-1">Update status and attach the recording.</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-[8px] sm:text-[10px] font-black tracking-widest border ${
               call.status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
               call.status === 'failed' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
               call.status === 'assigned' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
               'bg-amber-500/10 text-amber-500 border-amber-500/20'
            }`}>
               Current: {call.status}
            </div>
            <button onClick={onClose} className="p-1 sm:p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/60">
              <X size={20} className="sm:size-6" />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-8 space-y-6 sm:space-y-8 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-foreground/5 border border-foreground/10 space-y-3 sm:space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white shadow-xl shrink-0">
                  <User size={24} />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[10px] font-black text-foreground/40 tracking-widest">Recipient</div>
                  <div className="text-lg font-black text-foreground truncate">{call.recipient_name}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-foreground/5">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-foreground/40 tracking-widest">Phone</div>
                  <div className="text-sm font-black text-foreground tracking-wider">{call.recipient_phone}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-foreground/5 border border-foreground/10">
                  <div className="flex items-center gap-2 text-foreground/40 mb-1">
                    <Calendar size={12} className="text-primary" />
                    <span className="text-[9px] font-black tracking-widest">Date</span>
                  </div>
                  <div className="text-xs font-black text-foreground">{new Date(call.occasion_date).toLocaleDateString()}</div>
                </div>
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-foreground/5 border border-foreground/10">
                  <div className="flex items-center gap-2 text-foreground/40 mb-1">
                    <Clock size={12} className="text-secondary" />
                    <span className="text-[9px] font-black tracking-widest">Slot</span>
                  </div>
                  <div className="text-xs font-black text-foreground">{call.scheduled_slot}</div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent shrink-0">
                  <Heart size={18} />
                </div>
                <div>
                  <div className="text-[9px] font-black text-foreground/40 tracking-widest">Relationship</div>
                  <div className="text-sm font-black text-foreground">{call.relationship || "Not specified"}</div>
                </div>
              </div>
            </div>
          </div>

          {(call.voice_recording_url || call.metadata?.voiceRecordingUrl || call.metadata?.message?.voiceRecordingUrl) && (
            <div className="space-y-3 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-primary/10 border-2 border-primary/30">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black tracking-[0.2em] text-primary flex items-center gap-2">
                  <Volume2 size={14} />
                  Client Voice Recording (Play to Recipient)
                </label>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary">Special Call</span>
              </div>
              <p className="text-[11px] text-foreground/80 font-medium">
                The sender provided this voice recording to be played directly to the recipient during this call:
              </p>
              <audio controls src={call.voice_recording_url || call.metadata?.voiceRecordingUrl || call.metadata?.message?.voiceRecordingUrl} className="w-full h-10 rounded-xl" />
            </div>
          )}

          <div className="space-y-4">
            <label className="text-[10px] font-black tracking-[0.2em] text-foreground/40">Message</label>
            <div className="p-6 rounded-3xl bg-foreground/5 border border-foreground/10 relative overflow-hidden group min-h-[100px]">
              <MessageSquare size={40} className="absolute -bottom-4 -right-4 text-foreground/[0.02] group-hover:scale-110 transition-transform duration-500" />
              <div className="text-xs font-medium text-foreground/80 leading-relaxed relative z-10">
                &quot;{call.custom_message || "No custom message provided."}&quot;
              </div>
            </div>
          </div>

          {call.metadata?.customQuestions && Array.isArray(call.metadata.customQuestions) && call.metadata.customQuestions.length > 0 && (
            <div className="space-y-3 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-foreground/5 border border-foreground/10">
              <label className="text-[10px] font-black tracking-[0.2em] text-primary flex items-center gap-2">
                <HelpCircle size={14} />
                Special Call Custom Q&amp;A
              </label>
              <div className="space-y-2.5">
                {call.metadata.customQuestions.map((qa: { question: string; answer: string }, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-foreground/5 border border-foreground/5 space-y-1">
                    <div className="text-[10px] font-bold text-foreground/50">Q: {qa.question}</div>
                    <div className="text-xs font-semibold text-foreground">
                      {qa.answer ? qa.answer : <span className="italic text-foreground/30">No answer provided</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <label className="text-[10px] font-black tracking-[0.2em] text-foreground/40 flex items-center gap-2">
              <Volume2 size={12} className="text-primary" />
              Voice Proof {status === 'delivered' && <span className="text-primary font-black">*REQUIRED</span>}
            </label>

            {recordingUrl ? (
              <div className="p-4 sm:p-5 rounded-[24px] bg-green-500/10 border border-green-500/20 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                    <span className="text-[10px] font-black tracking-widest text-green-500 uppercase">
                      Voice Recording Uploaded
                    </span>
                  </div>
                  {!isFinalized && (
                    <button
                      type="button"
                      onClick={() => { setRecordingUrl(""); setFile(null); }}
                      className="text-[10px] font-bold text-foreground/40 hover:text-red-500 transition-colors flex items-center gap-1 shrink-0"
                    >
                      <Trash2 size={12} />
                      Replace
                    </button>
                  )}
                </div>
                <audio controls src={recordingUrl} className="w-full h-10 rounded-xl" />
              </div>
            ) : (
              <div className="relative">
                <input
                  type="file"
                  accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.opus,.webm,audio/mpeg,audio/mp3,audio/wav,audio/x-m4a,audio/aac,audio/ogg"
                  disabled={uploading}
                  onChange={(e) => {
                    const selected = e.target.files?.[0];
                    if (selected) {
                      setFile(selected);
                      uploadAudioFile(selected);
                    }
                  }}
                  className="sr-only"
                  id="caller-recording-upload"
                />
                <label
                  htmlFor="caller-recording-upload"
                  className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-[32px] transition-all cursor-pointer group ${
                    uploading
                      ? "border-primary/50 bg-primary/5 cursor-wait"
                      : error && status === 'delivered' && !recordingUrl
                      ? "border-red-500/50 bg-red-500/5"
                      : "border-foreground/10 hover:border-primary/40 hover:bg-primary/5"
                  }`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2 text-primary py-2">
                      <Loader2 size={24} className="animate-spin" />
                      <span className="text-[10px] font-black tracking-widest uppercase">Uploading Recording...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-center py-1">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Upload size={18} />
                      </div>
                      <span className="text-xs font-black tracking-wider text-foreground">
                        {file ? file.name : "Select Voice Recording"}
                      </span>
                      <span className="text-[9px] text-muted-foreground font-semibold">
                        Tap to choose MP3, M4A, WAV from your device (Max 50MB)
                      </span>
                    </div>
                  )}
                </label>
                {file && !uploading && (
                  <button
                    type="button"
                    onClick={() => uploadAudioFile(file)}
                    className="mt-3 w-full py-3 rounded-xl bg-secondary text-white font-black text-[9px] tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <Upload size={12} />
                    Retry Upload ({file.name})
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black tracking-[0.2em] text-foreground/40">Status</label>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  disabled={isFinalized}
                  onClick={() => { setStatus(s); setError(null); }}
                  className={`py-4 rounded-2xl font-black text-[10px] tracking-widest transition-all border flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                    status === s ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-foreground/5 border-foreground/10 text-foreground/40 hover:border-primary/30'
                  }`}
                >
                  {s}
                  {status === s && <CheckCircle2 size={14} />}
                </button>
              ))}
            </div>
          </div>

          {status === 'failed' && (
            <div className="space-y-4">
              <label className="text-[10px] font-black tracking-[0.2em] text-red-500 flex items-center gap-2">
                <AlertTriangle size={12} />
                Failure Reason
              </label>
              <textarea
                value={failureReason}
                onChange={(e) => setFailureReason(e.target.value)}
                disabled={isFinalized}
                placeholder="Why did this call fail?"
                className="w-full h-24 bg-red-500/5 border border-red-500/20 rounded-2xl p-4 text-xs text-foreground outline-none focus:border-red-500 transition-all resize-none font-medium placeholder:text-red-500/20 disabled:opacity-60"
              />
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500">
              <AlertCircle size={16} className="shrink-0" />
              <div className="text-[10px] font-black tracking-widest leading-tight">{error}</div>
            </div>
          )}

          {isFinalized ? (
            <div className="w-full py-6 rounded-[24px] bg-foreground/5 border border-foreground/10 text-foreground/40 font-black text-[12px] tracking-widest flex flex-col items-center justify-center gap-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} />
                Call Completed
              </div>
              <span className="text-[8px] font-bold tracking-[0.2em]">This call has already been processed.</span>
            </div>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-6 rounded-[24px] bg-primary text-white font-black text-[12px] tracking-widest shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                {saving ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                Save Update
              </div>
              <span className="text-[8px] font-bold text-foreground/40 tracking-[0.2em]">Saves changes and notifies the customer</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

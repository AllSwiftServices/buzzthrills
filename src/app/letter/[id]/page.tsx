"use client";

import { motion } from "framer-motion";
import { Volume2, VolumeX, Heart, Loader2, Play, Pause } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getThemeSpec } from "@/lib/letters";

interface Letter {
  id: string;
  recipient_name: string;
  message: string;
  theme: string;
  tier: string;
  background_music_url: string | null;
  voice_note_url: string | null;
  video_url: string | null;
  qr_identifier: string;
  sender_first_name: string | null;
  recipient_photo_url: string | null;
}

export default function DigitalLetterPage() {
  const params = useParams();
  const code = params?.id as string;

  const [letter, setLetter] = useState<Letter | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUnfurled, setIsUnfurled] = useState(false);
  const [musicMuted, setMusicMuted] = useState(true);
  const [voicePlaying, setVoicePlaying] = useState(false);

  const musicRef = useRef<HTMLAudioElement | null>(null);
  const voiceRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!code) return;
    fetch(`/api/letters/by-code/${code}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.letter) {
          setLetter(data.letter);
          setTimeout(() => setIsUnfurled(true), 600);
        } else {
          setError(data.error || "Letter not found");
        }
      })
      .catch(() => setError("Network error"));
  }, [code]);

  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.muted = musicMuted;
      if (!musicMuted) musicRef.current.play().catch(() => {});
    }
  }, [musicMuted, letter]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white text-center p-8">
        <h1 className="text-3xl font-serif mb-3">We couldn't find this letter</h1>
        <p className="text-white/40 text-sm mb-6">The link may have expired or been mistyped.</p>
        <Link href="/digital-letters" className="text-xs font-bold tracking-widest text-primary">
          Send your own →
        </Link>
      </div>
    );
  }

  if (!letter) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center gap-4 text-white">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm font-black tracking-widest">Loading your letter…</span>
      </div>
    );
  }

  const theme = getThemeSpec(letter.theme);
  const toggleMusic = () => {
    if (musicMuted) setMusicMuted(false);
    else if (musicRef.current) {
      musicRef.current.pause();
      setMusicMuted(true);
    }
  };

  const toggleVoice = () => {
    if (!voiceRef.current) return;
    if (voicePlaying) {
      voiceRef.current.pause();
      setVoicePlaying(false);
    } else {
      voiceRef.current.play().then(() => setVoicePlaying(true)).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-white overflow-hidden relative">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[150px] rounded-full pointer-events-none opacity-30"
        style={{ background: theme.preview.accent }}
      />

      {letter.background_music_url && (
        <audio
          ref={musicRef}
          src={letter.background_music_url}
          loop
          autoPlay
          muted={musicMuted}
        />
      )}

      {letter.voice_note_url && (
        <audio
          ref={voiceRef}
          src={letter.voice_note_url}
          onEnded={() => setVoicePlaying(false)}
        />
      )}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-lg z-10"
      >
        <div
          className="h-10 rounded-t-xl shadow-xl flex items-center justify-center border-b border-black/10 relative z-20"
          style={{ background: theme.preview.rollBg }}
        >
          <div className="w-full h-2 bg-black/5 mx-4 rounded-full" />
        </div>

        <motion.div
          initial={{ height: 0 }}
          animate={{ height: isUnfurled ? "auto" : 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden shadow-2xl relative"
          style={{ background: theme.preview.paperBg, color: theme.preview.paperText, minHeight: isUnfurled ? "400px" : "0px" }}
        >
          <div className="p-10 md:p-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isUnfurled ? 1 : 0, y: isUnfurled ? 0 : 20 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <div
                className="font-serif text-sm tracking-widest mb-8 font-bold opacity-50"
                style={{ color: theme.preview.paperText }}
              >
                {letter.recipient_photo_url && (
                  <div className="flex justify-center mb-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={letter.recipient_photo_url}
                      alt={letter.recipient_name}
                      className="w-20 h-20 rounded-full object-cover border-4 shadow-xl"
                      style={{ borderColor: theme.preview.rollBg }}
                    />
                  </div>
                )}
                A Special Message for {letter.recipient_name}
              </div>

              <div
                className="font-serif text-xl md:text-2xl leading-relaxed mb-12 whitespace-pre-wrap"
                style={{ color: theme.preview.paperText }}
              >
                {letter.message}
              </div>

              {letter.video_url && (
                <div className="mb-10 rounded-2xl overflow-hidden border border-black/10 shadow-xl">
                  <video src={letter.video_url} controls className="w-full" />
                </div>
              )}

              <div className="flex flex-col items-end gap-2 pr-4 border-t border-black/10 pt-8">
                <span className="font-serif text-base opacity-60">With love from,</span>
                <span className="font-serif text-2xl font-black">
                  {letter.sender_first_name || "Someone who cares"}
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div
          className="h-10 rounded-b-xl shadow-xl flex items-center justify-center border-t border-black/10 relative z-20"
          style={{ background: theme.preview.rollBg }}
        >
          <div className="w-full h-2 bg-black/5 mx-4 rounded-full" />
        </div>
      </motion.div>

      {isUnfurled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 flex flex-wrap gap-3 z-20 justify-center"
        >
          {letter.background_music_url && (
            <button
              onClick={toggleMusic}
              className="flex items-center gap-2 px-5 py-3 rounded-full glass hover:bg-white/10 transition-all font-bold text-sm"
            >
              {musicMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              {musicMuted ? "Play Music" : "Mute Music"}
            </button>
          )}
          {letter.voice_note_url && (
            <button
              onClick={toggleVoice}
              className="flex items-center gap-2 px-5 py-3 rounded-full gradient-bg text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              {voicePlaying ? <Pause size={18} /> : <Play size={18} />}
              {voicePlaying ? "Pause" : "Play Voice Note"}
            </button>
          )}
          <Link
            href="/digital-letters"
            className="flex items-center gap-2 px-5 py-3 rounded-full glass hover:bg-white/10 transition-all font-bold text-sm"
          >
            <Heart size={18} />
            Make Your Own
          </Link>
        </motion.div>
      )}

      <div className="mt-16 opacity-40 text-xs flex items-center gap-2">
        <span>Sent via</span>
        <span className="font-black">
          BUZZ<span className="gradient-text">THRILLS</span>
        </span>
      </div>
    </div>
  );
}

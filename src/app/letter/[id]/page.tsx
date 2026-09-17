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
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userPausedRef = useRef(false);

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

  const audioUrl = letter?.background_music_url || letter?.voice_note_url || null;

  // Auto-play audio when letter unfurls, with fallback on first touch/click
  useEffect(() => {
    if (!audioUrl || !isUnfurled) return;

    const play = () => {
      if (audioRef.current && !userPausedRef.current) {
        audioRef.current
          .play()
          .then(() => setIsAudioPlaying(true))
          .catch(() => {
            // Autoplay policy prevented playback until user interaction
            setIsAudioPlaying(false);
          });
      }
    };

    play();

    // Fallback: touch or click anywhere on screen immediately unlocks and starts audio
    const handleInteraction = () => {
      if (audioRef.current && audioRef.current.paused && !userPausedRef.current) {
        audioRef.current
          .play()
          .then(() => setIsAudioPlaying(true))
          .catch(() => {});
      }
    };

    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [audioUrl, isUnfurled]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
      userPausedRef.current = true;
      setIsAudioPlaying(false);
    } else {
      userPausedRef.current = false;
      audioRef.current
        .play()
        .then(() => setIsAudioPlaying(true))
        .catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

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

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 sm:p-6 text-white overflow-hidden relative">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[150px] rounded-full pointer-events-none opacity-30"
        style={{ background: theme.preview.accent }}
      />

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="auto"
          loop
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsAudioPlaying(false)}
          onPlay={() => setIsAudioPlaying(true)}
          onPause={() => setIsAudioPlaying(false)}
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
          style={{
            background: theme.preview.paperBg,
            color: theme.preview.paperText,
            minHeight: isUnfurled ? "400px" : "0px",
          }}
        >
          <div className="p-6 sm:p-10 md:p-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isUnfurled ? 1 : 0, y: isUnfurled ? 0 : 20 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {/* 1. Picture First (Bigger than before) */}
              {letter.recipient_photo_url && (
                <div className="mb-6 flex justify-center">
                  <div
                    className="relative w-full max-w-[320px] sm:max-w-[360px] max-h-[340px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4"
                    style={{ borderColor: theme.preview.rollBg }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={letter.recipient_photo_url}
                      alt={letter.recipient_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Recipient Headline */}
              <div
                className="font-serif text-sm tracking-widest mb-6 font-bold opacity-60 text-center uppercase"
                style={{ color: theme.preview.paperText }}
              >
                A Special Message for {letter.recipient_name}
              </div>

              {/* 2. Audio recording under the image (Auto-plays when possible) */}
              {audioUrl && (
                <div
                  className="mb-8 p-4 rounded-2xl border shadow-md flex items-center gap-3 transition-all"
                  style={{
                    backgroundColor: theme.preview.rollBg ? `${theme.preview.rollBg}25` : "rgba(0,0,0,0.04)",
                    borderColor: theme.preview.rollBg ? `${theme.preview.rollBg}70` : "rgba(0,0,0,0.1)",
                  }}
                >
                  <button
                    type="button"
                    onClick={toggleAudio}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:scale-95 shrink-0"
                    style={{ background: theme.preview.accent || "#8b5cf6" }}
                    aria-label={isAudioPlaying ? "Pause audio" : "Play audio"}
                  >
                    {isAudioPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                  </button>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className="text-xs font-black tracking-wider uppercase opacity-80 truncate"
                        style={{ color: theme.preview.paperText }}
                      >
                        {isAudioPlaying ? "Playing Audio…" : "Audio Recording"}
                      </span>
                      <span
                        className="text-[10px] font-mono opacity-60 tabular-nums shrink-0"
                        style={{ color: theme.preview.paperText }}
                      >
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      step={0.1}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                      style={{ accentColor: theme.preview.accent || "#8b5cf6" }}
                    />
                  </div>
                </div>
              )}

              {/* 3. Video (if uploaded by admin or user) */}
              {letter.video_url && (
                <div className="mb-8 rounded-2xl overflow-hidden border border-black/10 shadow-xl">
                  <video src={letter.video_url} controls className="w-full" />
                </div>
              )}

              {/* 4. Main Letter Last */}
              <div
                className="font-serif text-xl md:text-2xl leading-relaxed mb-10 whitespace-pre-wrap"
                style={{ color: theme.preview.paperText }}
              >
                {letter.message}
              </div>

              {/* Sign-off */}
              <div className="flex flex-col items-end gap-2 pr-4 border-t border-black/10 pt-6">
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
          className="mt-10 flex flex-wrap gap-3 z-20 justify-center"
        >
          {audioUrl && (
            <button
              onClick={toggleAudio}
              className="flex items-center gap-2 px-5 py-3 rounded-full glass hover:bg-white/10 transition-all font-bold text-sm"
            >
              {isAudioPlaying ? <VolumeX size={18} /> : <Volume2 size={18} />}
              {isAudioPlaying ? "Mute Audio" : "Play Audio"}
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

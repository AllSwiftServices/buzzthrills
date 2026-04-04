"use client";

import { QRCodeCanvas } from "qrcode.react";
import { Copy, Download, Share2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function LetterShare({ id, url }: { id: string, url: string }) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 rounded-[40px] glass border-white/20 flex flex-col items-center gap-8 max-w-sm"
    >
      <div className="p-4 bg-white rounded-3xl overflow-hidden shadow-2xl">
        <QRCodeCanvas 
          value={url} 
          size={200} 
          level="H"
          includeMargin={true}
          imageSettings={{
            src: "/falogo.svg",
            x: undefined,
            y: undefined,
            height: 40,
            width: 40,
            excavate: true,
          }}
        />
      </div>

      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">Share the Magic ✨</h3>
        <p className="text-sm text-white/40">Give this QR code or link to your recipient. They'll see your animated surprise!</p>
      </div>

      <div className="w-full flex flex-col gap-3">
        <button 
          onClick={copyLink}
          className="w-full py-4 rounded-2xl bg-white text-black font-extrabold flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
        >
          {copied ? <><Check size={18} /> Copied!</> : <><Copy size={18} /> Copy Link</>}
        </button>
        <div className="flex gap-3">
          <button className="flex-1 py-4 rounded-2xl glass font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
            <Download size={16} />
            Download
          </button>
          <button className="flex-1 py-4 rounded-2xl glass font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
            <Share2 size={16} />
            WhatsApp
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Check({ size }: { size: number }) {
  return <motion.svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></motion.svg>;
}

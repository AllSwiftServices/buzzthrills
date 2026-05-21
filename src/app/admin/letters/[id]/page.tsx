"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, ExternalLink, Copy, Check, Package, QrCode } from "lucide-react";
import DigitalLetterForm from "@/components/DigitalLetterForm";

type ScannableStatus = "none" | "pending" | "printed" | "shipped";

const SCANNABLE_STEPS: { id: ScannableStatus; label: string; desc: string }[] = [
  { id: "pending",  label: "Pending",  desc: "Waiting to be printed" },
  { id: "printed",  label: "Printed",  desc: "Card has been printed" },
  { id: "shipped",  label: "Shipped",  desc: "Card dispatched to sender" },
];

const scannableColors: Record<ScannableStatus, string> = {
  none:    "bg-white/5 text-white/30 border-white/10",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  printed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  shipped: "bg-green-500/10 text-green-400 border-green-500/20",
};

export default function AdminEditLetterPage() {
  const params = useParams();
  const id = params?.id as string;
  const [letter, setLetter] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scannableStatus, setScannableStatus] = useState<ScannableStatus>("none");
  const [savingScannableStatus, setSavingScannableStatus] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/letters/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.letter) {
          setLetter(data.letter);
          setAdminNotes(data.letter.admin_notes || "");
          setScannableStatus(data.letter.scannable_status || "none");
        } else setError(data.error || "Not found");
      })
      .catch(() => setError("Network error"));
  }, [id]);

  const shareUrl = letter
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/letter/${letter.qr_identifier}`
    : "";

  const saveNotes = async () => {
    setSavingNotes(true);
    try {
      await fetch(`/api/letters/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_notes: adminNotes }),
      });
    } finally {
      setSavingNotes(false);
    }
  };

  const saveScannableStatus = async (status: ScannableStatus) => {
    setSavingScannableStatus(true);
    try {
      const res = await fetch(`/api/letters/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scannable_status: status }),
      });
      const data = await res.json();
      if (res.ok && data.letter) {
        setScannableStatus(data.letter.scannable_status);
        setLetter((prev: any) => ({ ...prev, scannable_status: data.letter.scannable_status }));
      }
    } finally {
      setSavingScannableStatus(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <p className="text-red-400 font-bold">{error}</p>
        <Link href="/admin/letters" className="mt-4 inline-block text-primary text-sm font-bold">
          Back to list
        </Link>
      </div>
    );
  }
  if (!letter) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-white/40">
        <Loader2 className="animate-spin" size={20} />
        <span className="text-sm font-bold">Loading letter…</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <Link
          href="/admin/letters"
          className="inline-flex items-center gap-2 text-xs font-bold text-white/40 hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={14} />
          Back to letters
        </Link>
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter leading-none">
              Edit Letter <span className="gradient-text italic">·</span> {letter.recipient_name}
            </h1>
            <p className="text-white/40 mt-2 font-medium text-xs">
              Status: <span className="text-primary font-black uppercase">{letter.status}</span>
              {" · "}Code: <span className="font-mono text-primary/70">{letter.qr_identifier}</span>
            </p>
          </div>
          {letter.status === "published" && (
            <div className="flex gap-2">
              <button
                onClick={copyLink}
                className="px-4 py-3 rounded-2xl border border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy share URL"}
              </button>
              <a
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
              >
                Open
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
      </div>

      <DigitalLetterForm mode="admin" existing={letter} />

      {/* Scannable Physical Fulfilment */}
      {letter.wants_scannable && (
        <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] space-y-4">
          <div className="flex items-center gap-2">
            <QrCode size={16} className="text-primary" />
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              Scannable Physical Copy
            </div>
          </div>
          <p className="text-xs text-white/40 font-medium">
            This letter includes a physical QR card. Track its fulfilment status below.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {SCANNABLE_STEPS.map((step) => {
              const isActive = scannableStatus === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => saveScannableStatus(step.id)}
                  disabled={savingScannableStatus || isActive}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-start gap-1 transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-default ${
                    isActive
                      ? `${scannableColors[step.id]} border-current`
                      : "border-white/10 bg-white/[0.02] hover:bg-white/5 text-white/40"
                  }`}
                >
                  {savingScannableStatus && isActive ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Package size={14} />
                  )}
                  <span className="text-[10px] font-black uppercase tracking-widest">{step.label}</span>
                  <span className="text-[9px] opacity-60">{step.desc}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Current status:</span>
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${scannableColors[scannableStatus]}`}>
              {scannableStatus}
            </span>
          </div>
        </div>
      )}

      {/* Admin Notes */}
      <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] space-y-3">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Admin Notes</div>
        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          rows={4}
          placeholder="Internal notes — not visible to the recipient."
          className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-4 text-sm font-medium outline-none focus:border-primary/40 resize-none"
        />
        <button
          onClick={saveNotes}
          disabled={savingNotes}
          className="px-5 py-2.5 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {savingNotes ? "Saving…" : "Save Notes"}
        </button>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DigitalLetterForm from "@/components/DigitalLetterForm";

export default function AdminNewLetterPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/admin/letters"
        className="inline-flex items-center gap-2 text-xs font-bold text-foreground/40 hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to letters
      </Link>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter leading-none mb-8">
        Create Letter <span className="gradient-text">(Admin)</span>
      </h1>
      <DigitalLetterForm mode="admin" />
    </div>
  );
}

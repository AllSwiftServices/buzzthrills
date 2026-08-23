export type LetterTheme = "parchment" | "royal" | "modern";
export type LetterTier = "standard" | "premium";
export type LetterStatus = "draft" | "published" | "archived" | "processing";

export interface ThemeSpec {
  id: LetterTheme;
  name: string;
  tagline: string;
  premiumOnly: boolean;
  preview: {
    paperBg: string;
    paperText: string;
    rollBg: string;
    accent: string;
  };
}

export const LETTER_THEMES: ThemeSpec[] = [
  {
    id: "parchment",
    name: "Parchment",
    tagline: "Classic warm scroll, included in every letter.",
    premiumOnly: false,
    preview: {
      paperBg: "#fcf5e5",
      paperText: "#2d2417",
      rollBg: "#f4e4bc",
      accent: "#8b5cf6",
    },
  },
  {
    id: "royal",
    name: "Royal",
    tagline: "Deep velvet with gold edges. Premium only.",
    premiumOnly: true,
    preview: {
      paperBg: "#0f0a1f",
      paperText: "#f4e4bc",
      rollBg: "#3b1f57",
      accent: "#d4af37",
    },
  },
  {
    id: "modern",
    name: "Modern",
    tagline: "Clean off-white with soft serifs. Premium only.",
    premiumOnly: true,
    preview: {
      paperBg: "#f7f6f3",
      paperText: "#1a1a1a",
      rollBg: "#1a1a1a",
      accent: "#ec4899",
    },
  },
];

export const LETTER_PRICING = {
  base: 10000,
  audioVideoAddon: 2000,
  scannableAddon: 3000,
} as const;

export interface PriceBreakdown {
  base: number;
  audioVideo: number;
  scannable: number;
  total: number;
  lines: { label: string; amount: number; included: boolean }[];
}

export function calculateLetterPrice(opts: {
  hasAudioOrVideo: boolean;
  wantsScannable: boolean;
}): PriceBreakdown {
  const base = LETTER_PRICING.base;
  const audioVideo = opts.hasAudioOrVideo ? LETTER_PRICING.audioVideoAddon : 0;
  const scannable = opts.wantsScannable ? LETTER_PRICING.scannableAddon : 0;
  return {
    base,
    audioVideo,
    scannable,
    total: base + audioVideo + scannable,
    lines: [
      { label: "Digital letter", amount: base, included: true },
      { label: "Voice or video add-on", amount: LETTER_PRICING.audioVideoAddon, included: opts.hasAudioOrVideo },
      { label: "Scannable physical copy", amount: LETTER_PRICING.scannableAddon, included: opts.wantsScannable },
    ],
  };
}

// Legacy — kept so any old references still resolve. The form no longer offers a tier choice;
// every letter is stored as 'standard'.
export const LETTER_TIERS: Record<LetterTier, { label: string; price: number; description: string }> = {
  standard: {
    label: "Digital Letter",
    price: LETTER_PRICING.base,
    description: "Animated letter delivered via shareable link.",
  },
  premium: {
    label: "Digital Letter",
    price: LETTER_PRICING.base,
    description: "Animated letter delivered via shareable link.",
  },
};

export function getThemeSpec(id: string | null | undefined): ThemeSpec {
  return LETTER_THEMES.find((t) => t.id === id) || LETTER_THEMES[0];
}

export function getLetterTier(id: string | null | undefined): LetterTier {
  return id === "premium" ? "premium" : "standard";
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I confusion
export function generateLetterCode(length = 8): string {
  const bytes = new Uint8Array(length);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

export type LetterMediaKind = "music" | "voice" | "video" | "photo";

export const LETTER_MEDIA_LIMITS = {
  maxFileBytes: 20 * 1024 * 1024,
  acceptedMusic: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/m4a", "audio/mp4"],
  acceptedVoice: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/webm", "audio/m4a", "audio/mp4"],
  acceptedVideo: ["video/mp4", "video/webm", "video/quicktime"],
  acceptedPhoto: ["image/jpeg", "image/png", "image/webp", "image/heic"],
} as const;

// Browsers/OSes report a long tail of MIME variants for the same file (e.g. macOS/Chrome
// report .m4a as "audio/x-m4a", not "audio/m4a" or "audio/mp4") — matching the broad
// audio/video/image category is what actually matters here, an exact-string allowlist
// just rejects real files with an unanticipated but perfectly valid MIME string.
export function isAcceptedLetterMedia(kind: LetterMediaKind, mimetype: string | null | undefined): boolean {
  if (!mimetype) return true;
  const prefix = kind === "photo" ? "image/" : kind === "video" ? "video/" : "audio/";
  return mimetype.toLowerCase().startsWith(prefix);
}

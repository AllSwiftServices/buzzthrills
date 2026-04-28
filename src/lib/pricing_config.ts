export type CallVariant = "standard" | "prank" | "music" | "both" | "special" | "one-off" | "monthly";

export interface PricingTier {
  variant: CallVariant;
  price: number;
  label: string;
}

export interface CallService {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  tiers: PricingTier[];
  icon: string; // Lucide icon name
}

export const CALL_SERVICES: Record<string, CallService> = {
  celebratory: {
    id: "celebratory",
    name: "Celebratory Call",
    description: "Birthdays, anniversaries, graduations, and Every milestone worth celebrating.",
    basePrice: 1500,
    tiers: [
      { variant: "standard", price: 1500, label: "Standard" },
      { variant: "prank", price: 2000, label: "Prank Inclusive" },
      { variant: "music", price: 3000, label: "Music Thrills Inclusive" },
      { variant: "both", price: 4000, label: "Prank + Music Thrills" },
    ],
    icon: "Star",
  },
  appreciatory: {
    id: "appreciatory",
    name: "Appreciatory Call",
    description: "Saying thank you can be more special. Made to appreciate people on different occasions.",
    basePrice: 1500,
    tiers: [
      { variant: "standard", price: 1500, label: "Standard" },
      { variant: "prank", price: 2000, label: "Prank Inclusive" },
      { variant: "music", price: 3000, label: "Music Thrills Inclusive" },
      { variant: "both", price: 4000, label: "Prank + Music Thrills" },
    ],
    icon: "Heart",
  },
  apology: {
    id: "apology",
    name: "Apology Call",
    description: "Communicate that you are sorry in a better way. The bigger person is the first to say sorry.",
    basePrice: 3000,
    tiers: [
      { variant: "standard", price: 3000, label: "Standard" },
      { variant: "special", price: 5000, label: "Special Note / Music Inclusive" },
    ],
    icon: "MessageCircle",
  },
  request: {
    id: "request",
    name: "Request Call",
    description: "Make a particular request and don't know how to go about it? Let us help you reach out.",
    basePrice: 2000,
    tiers: [{ variant: "standard", price: 2000, label: "Standard" }],
    icon: "HelpCircle",
  },
  encouragement: {
    id: "encouragement",
    name: "Encouragement Call",
    description: "Reach out to cheer people up, uplift their spirit, and send words of motivation.",
    basePrice: 1500,
    tiers: [
      { variant: "standard", price: 1500, label: "Standard" },
      { variant: "music", price: 2000, label: "Music Thrills Inclusive" },
    ],
    icon: "Sun",
  },
  self_love: {
    id: "self_love",
    name: "Self Love Call",
    description: "Treat yourself. Affirmations and words of motivation delivered to you.",
    basePrice: 2000,
    tiers: [
      { variant: "one-off", price: 2000, label: "One Off" },
      { variant: "monthly", price: 10000, label: "Monthly (6 calls + 20 words of affirmation)" },
    ],
    icon: "User",
  },
  royal_checkup: {
    id: "royal_checkup",
    name: "Royal Check-up Call",
    description: "Help you do the check on friends, family, and relatives who accuse you of not checking up.",
    basePrice: 10000,
    tiers: [{ variant: "monthly", price: 10000, label: "Monthly Subscription" }],
    icon: "Crown",
  },
  shoot_your_shot: {
    id: "shoot_your_shot",
    name: "Shoot Your Shot",
    description: "Want to tell someone how you feel? We help you deliver that special message.",
    basePrice: 2000,
    tiers: [{ variant: "standard", price: 2000, label: "Standard" }],
    icon: "Target",
  },
  period_care: {
    id: "period_care",
    name: "Period Care Call",
    description: "Reach out to your female friends during their period and make them feel less cranky.",
    basePrice: 1500,
    tiers: [
      { variant: "standard", price: 1500, label: "Standard" },
      { variant: "music", price: 2000, label: "Music Thrills Inclusive" },
    ],
    icon: "Moon",
  },
  lullaby: {
    id: "lullaby",
    name: "Lullaby Call",
    description: "Having a hard time sleeping? Let us sing you to bed and tell you a bedtime story.",
    basePrice: 3000,
    tiers: [
      { variant: "one-off", price: 3000, label: "One Off" },
      { variant: "monthly", price: 10000, label: "Monthly" },
    ],
    icon: "Music",
  },
  silent_vent: {
    id: "silent_vent",
    name: "Silent/Vent Call",
    description: "Overwhelmed and want to rant to an anonymous? Your safe and silent place to talk.",
    basePrice: 1000,
    tiers: [{ variant: "standard", price: 1000, label: "Standard" }],
    icon: "CloudRain",
  },
  video_shoutout: {
    id: "video_shoutout",
    name: "Video Shoutout",
    description: "A personalized video message for your special someone.",
    basePrice: 5000,
    tiers: [{ variant: "standard", price: 5000, label: "Standard" }],
    icon: "Video",
  },
  digital_letter: {
    id: "digital_letter",
    name: "Digital Letter",
    description: "A premium digital artifact combining typography, animated scrolls, and voice recordings.",
    basePrice: 5000,
    tiers: [
      { variant: "standard", price: 5000, label: "Standard (Voice + Animation)" },
      { variant: "special", price: 7500, label: "Premium (Custom Theme + Extended Voice)" },
    ],
    icon: "Mail",
  },
  company_calls: {
    id: "company_calls",
    name: "Company / Corporate Calls",
    description: "Tailored connection solutions for teams, employees, and corporate partners.",
    basePrice: 0, // Contract based
    tiers: [
      { variant: "special", price: 0, label: "Custom Consultation" },
    ],
    icon: "Building",
  },
};
import { Star, Heart, MessageCircle, HelpCircle, Sun, User, Crown, Target, Moon, Music, CloudRain, Video, Building } from "lucide-react";

export const ICON_MAP: Record<string, any> = {
  Star,
  Heart,
  MessageCircle,
  HelpCircle,
  Sun,
  User,
  Crown,
  Target,
  Moon,
  Music,
  CloudRain,
  Video,
  Building
};

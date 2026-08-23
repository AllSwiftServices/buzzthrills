import { Star, Zap, Shield, Briefcase } from "lucide-react";

export type PlanId = "lite" | "plus" | "orbit" | "corporate";
export type BillingCycle = "monthly" | "annual";

export interface SubscriptionPlan {
  id: PlanId;
  name: string;
  tagline: string;
  perfectFor: string;
  monthlyPrice: number;
  annualPrice: number;
  totalCalls: number;
  features: string[];
  iconName: "Star" | "Zap" | "Shield" | "Briefcase";
  isCustom?: boolean;
  popular?: boolean;
}

const ANNUAL_DISCOUNT = 0.05;
const round = (n: number) => Math.round(n);

export const SUBSCRIPTION_PLANS: Record<PlanId, SubscriptionPlan> = {
  lite: {
    id: "lite",
    name: "Buzz Lite",
    tagline: "For the thoughtful person with a few special celebrations, monthly milestones, or long-distance check-ins.",
    perfectFor: "Someone who wants consistent thoughtfulness without stress.",
    monthlyPrice: 15000,
    annualPrice: round(15000 * (1 - ANNUAL_DISCOUNT)),
    totalCalls: 10,
    features: [
      "10 heartfelt call deliveries per month",
      "Custom messages tailored entirely to your recipient's story",
      "100% full access to all specialized call types (including Apologies & Period Care)",
      "Complimentary add-ons (Prank & Music Thrills) included on request",
    ],
    iconName: "Star",
  },
  plus: {
    id: "plus",
    name: "Buzz Plus",
    tagline: "For anyone who wants to share love with more people, especially in months filled with celebrations.",
    perfectFor: "People who show love through constant, thoughtful gestures.",
    monthlyPrice: 25000,
    annualPrice: round(25000 * (1 - ANNUAL_DISCOUNT)),
    totalCalls: 15,
    features: [
      "15 heartfelt call deliveries per month",
      "Perfect for consistent midday affirmations, apologies, and 'just because' surprises",
      "Deeply customized messaging scripts managed by our expert Thrillers",
      "Faster order processing & priority high-tier call scheduling slots",
      "Complimentary add-ons (Prank & Music Thrills) included automatically on request",
    ],
    iconName: "Zap",
    popular: true,
  },
  orbit: {
    id: "orbit",
    name: "Buzz Orbit",
    tagline: "For those who want to do it BIG: large families, content creators, high-performing executives, and fast-growing small teams.",
    perfectFor: "Families, executives, influencers, and small teams who never want to forget anyone.",
    monthlyPrice: 50000,
    annualPrice: round(50000 * (1 - ANNUAL_DISCOUNT)),
    totalCalls: 25,
    features: [
      "25 Premium Personalized Call Deliveries per month",
      "Unlimited access to ALL premium call experiences",
      "Custom voice notes (your voice or a Buzzthrills host)",
      "Choose your preferred caller",
      "Early access to Buzzthrills drops & limited experiences",
      "VIP scheduling & priority customer support",
    ],
    iconName: "Shield",
  },
  corporate: {
    id: "corporate",
    name: "Buzz for Business",
    tagline: "Engineered for companies, progressive HR teams, and corporate leaders looking to combat workplace burnout, celebrate staff, and build structured client engagement.",
    perfectFor: "Companies that want recurring, brand-aligned heartfelt experiences at scale.",
    monthlyPrice: 100000,
    annualPrice: 100000,
    totalCalls: 0,
    features: [
      "Custom monthly volume for both specialized voice calls and premium digital letters",
      "A dedicated Account Manager to fully manage your company's entire milestone calendar",
      "Automated HR triggers that sync with your calendar, so no employee birthday or anniversary is ever missed",
      "Custom scripts and branding featuring your company's brand voice",
      "Seamless corporate onboarding with invoiced billing, flexible contract terms, and direct team scheduling",
    ],
    iconName: "Briefcase",
    isCustom: true,
  },
};

export const PLAN_ICONS = { Star, Zap, Shield, Briefcase };

export const PLAN_LIST: SubscriptionPlan[] = [
  SUBSCRIPTION_PLANS.lite,
  SUBSCRIPTION_PLANS.plus,
  SUBSCRIPTION_PLANS.orbit,
  SUBSCRIPTION_PLANS.corporate,
];

export function getPlan(id: string | null | undefined): SubscriptionPlan | null {
  if (!id) return null;
  return SUBSCRIPTION_PLANS[id as PlanId] || null;
}

export function getPlanQuota(id: string | null | undefined): number {
  const plan = getPlan(id);
  return plan?.totalCalls ?? 0;
}

export function getPlanPrice(id: PlanId, cycle: BillingCycle): number {
  const plan = SUBSCRIPTION_PLANS[id];
  return cycle === "annual" ? plan.annualPrice : plan.monthlyPrice;
}

export function getCycleMultiplier(cycle: BillingCycle): number {
  return cycle === "annual" ? 12 : 1;
}

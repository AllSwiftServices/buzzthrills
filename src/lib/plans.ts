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
    tagline: "For the thoughtful person with a few special celebrations in a month.",
    perfectFor: "Someone who wants consistent thoughtfulness without stress.",
    monthlyPrice: 15000,
    annualPrice: round(15000 * (1 - ANNUAL_DISCOUNT)),
    totalCalls: 12,
    features: [
      "Up to 12 heartfelt calls monthly",
      "Custom messages for every recipient",
      "Access to all Buzzthrills call types, even premium ones at no extra cost",
      "Priority booking anytime you need an extra surprise",
      "Ad-ons like prank & music thrills included on request",
    ],
    iconName: "Star",
  },
  plus: {
    id: "plus",
    name: "Buzz Plus",
    tagline: "For anyone who wants to share love with more people, especially in months filled with celebrations.",
    perfectFor: "People who show love through constant thoughtful gestures.",
    monthlyPrice: 25000,
    annualPrice: round(25000 * (1 - ANNUAL_DISCOUNT)),
    totalCalls: 20,
    features: [
      "Up to 20 surprise calls monthly",
      "Perfect for affirmations, apologies, birthdays & “just because” calls",
      "Customizable messages for each call",
      "Faster processing & priority call slots",
      "Ad-ons like prank & music thrills included on request",
    ],
    iconName: "Zap",
    popular: true,
  },
  orbit: {
    id: "orbit",
    name: "Buzz Orbit",
    tagline: "For those who want to do it BIG — families, creators, business owners and small teams.",
    perfectFor: "Families, executives, influencers, VIPs and small teams who never want to forget anyone.",
    monthlyPrice: 50000,
    annualPrice: round(50000 * (1 - ANNUAL_DISCOUNT)),
    totalCalls: 30,
    features: [
      "Up to 30+ premium personalized calls monthly",
      "Unlimited access to ALL premium call experiences",
      "Custom voice notes (your voice or a Buzzthrills host)",
      "Choose your preferred caller",
      "Bonus surprise calls every other month",
      "Early access to Buzzthrills drops & limited experiences",
      "VIP scheduling & priority customer support",
    ],
    iconName: "Shield",
  },
  corporate: {
    id: "corporate",
    name: "Buzz Corporate",
    tagline: "Built for companies, HR teams & professionals needing structured employee or client engagement.",
    perfectFor: "Companies that want recurring, brand-aligned heartfelt experiences at scale.",
    monthlyPrice: 0,
    annualPrice: 0,
    totalCalls: 0,
    features: [
      "Custom monthly call volume",
      "Dedicated account manager",
      "Branded voice notes & scripts",
      "Quarterly engagement reports",
      "Invoiced billing & contract terms",
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

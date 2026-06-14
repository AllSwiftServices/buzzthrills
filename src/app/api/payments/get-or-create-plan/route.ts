import { NextResponse } from 'next/server';
import { PAYSTACK_SECRET_KEY } from '@/lib/paystack';
import { SUBSCRIPTION_PLANS, getCycleMultiplier, type PlanId, type BillingCycle } from '@/lib/plans';

export async function POST(request: Request) {
  try {
    const { planId, cycle } = await request.json() as { planId: PlanId, cycle: BillingCycle };

    if (!planId || !cycle || !SUBSCRIPTION_PLANS[planId]) {
      return NextResponse.json({ error: 'Invalid plan or cycle' }, { status: 400 });
    }

    const planData = SUBSCRIPTION_PLANS[planId];
    const amount = cycle === "annual" ? planData.annualPrice : planData.monthlyPrice;
    const totalDueInKobo = amount * getCycleMultiplier(cycle) * 100;
    const interval = cycle === "annual" ? "annually" : "monthly";
    const expectedPlanName = `${planData.name} ${cycle === 'annual' ? 'Annual' : 'Monthly'}`;

    // 1. Fetch existing plans from Paystack
    const listRes = await fetch('https://api.paystack.co/plan', {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` }
    });

    if (listRes.ok) {
      const listData = await listRes.json();
      const existingPlans = listData.data || [];
      
      // Find matching plan by name or amount & interval
      const match = existingPlans.find((p: any) => 
        p.name.toLowerCase() === expectedPlanName.toLowerCase() || 
        (p.amount === totalDueInKobo && p.interval === interval)
      );

      if (match && match.plan_code) {
        return NextResponse.json({ planCode: match.plan_code });
      }
    }

    // 2. If plan doesn't exist, create it dynamically
    const createRes = await fetch('https://api.paystack.co/plan', {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: expectedPlanName,
        interval: interval,
        amount: totalDueInKobo
      })
    });

    const createData = await createRes.json();

    if (createData.status && createData.data?.plan_code) {
      return NextResponse.json({ planCode: createData.data.plan_code });
    }

    return NextResponse.json({ error: 'Failed to create plan on Paystack', details: createData }, { status: 500 });

  } catch (error) {
    console.error('Paystack Plan Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

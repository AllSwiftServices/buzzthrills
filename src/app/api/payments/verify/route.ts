import { NextResponse } from 'next/server';
import { PAYSTACK_SECRET_KEY } from '@/lib/paystack';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get('reference');

  if (!reference) {
    return NextResponse.json({ error: 'Reference is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

      if (data.status && data.data.status === 'success') {
        const metadata = data.data.metadata;
        const { plan, cycle, user_id } = metadata || {};
        const customerEmail = data.data.customer.email;
        const amount = (data.data.amount / 100).toLocaleString();

        if (plan && user_id && typeof window === 'undefined') {
          const { supabaseAdmin } = await import('@/lib/supabase');
          
          if (supabaseAdmin) {
            // ... subscription logic ...
            const daysToAdd = cycle === 'annual' ? 365 : 30;
            const nextBillingDate = new Date();
            nextBillingDate.setDate(nextBillingDate.getDate() + daysToAdd);

            await supabaseAdmin
              .from('subscriptions')
              .upsert({
                user_id: user_id,
                plan: plan,
                status: 'active',
                next_billing_date: nextBillingDate.toISOString(),
              }, { onConflict: 'user_id' });
          }
        }

        // Trigger Confirmation Email via Brevo
        try {
          const { sendBookingConfirmation } = await import('@/lib/email');
          await sendBookingConfirmation(customerEmail, {
            serviceName: plan || "BuzzThrills Service",
            price: amount
          });
        } catch (emailError) {
          console.error("Post-payment email failed:", emailError);
          // Don't fail the verification if email fails
        }

        return NextResponse.json({ success: true, data: data.data });
      }

    return NextResponse.json({ success: false, message: data.message || 'Verification failed' }, { status: 400 });
  } catch (error) {
    console.error('Paystack Verification Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

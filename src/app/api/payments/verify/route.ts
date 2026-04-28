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
        const { service, variant, user_id, recipients, is_express, cycle, plan } = metadata || {};
        const customerEmail = data.data.customer.email;
        const amount = (data.data.amount / 100).toLocaleString();

        const { supabaseAdmin } = await import('@/lib/supabase');
        
        if (supabaseAdmin) {
          // 1. Handle Subscriptions
          if (plan && user_id) {
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

          // 2. Handle One-Off Bookings (Calls)
          if (recipients && Array.isArray(recipients)) {
            const callInserts = recipients.map((r: any) => ({
              user_id: user_id || null,
              recipient_name: r.name,
              recipient_phone: r.phone,
              occasion_type: r.occasion || service || 'General',
              occasion_date: r.date,
              call_type: variant || 'standard',
              scheduled_slot: r.time || 'morning',
              is_express: !!is_express,
              status: 'pending'
            }));

            await supabaseAdmin.from('calls').insert(callInserts);
          }
        }

        // Trigger Confirmation Email via Brevo
        try {
          const { sendBookingConfirmation, sendAdminCallNotification } = await import('@/lib/email');
          
          // User Confirmation
          await sendBookingConfirmation(customerEmail, {
            serviceName: plan || service || "BuzzThrills Service",
            price: amount
          });

          // Admin Notification
          if (recipients && recipients.length > 0) {
            await sendAdminCallNotification(recipients.map((r: any) => ({
              recipient_name: r.name,
              recipient_phone: r.phone,
              occasion_type: r.occasion || service || 'General',
              occasion_date: r.date,
              call_type: variant || 'standard',
              scheduled_slot: r.time || 'morning'
            })));
          }
        } catch (emailError) {
          console.error("Post-payment email failed:", emailError);
        }

        return NextResponse.json({ success: true, data: data.data });
      }

    return NextResponse.json({ success: false, message: data.message || 'Verification failed' }, { status: 400 });
  } catch (error) {
    console.error('Paystack Verification Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { PAYSTACK_SECRET_KEY } from '@/lib/paystack';
import { getPlan, type PlanId } from '@/lib/plans';

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
        const { service, variant, user_id, recipients, is_express, cycle, plan, purchase_type, letter_id } = metadata || {};
        const customerEmail = data.data.customer.email;
        const amount = (data.data.amount / 100).toLocaleString();

        const { supabaseAdmin } = await import('@/lib/supabase');

        // 0. Digital Letter publishing (short-circuit — letters don't insert into calls)
        if (purchase_type === 'digital_letter' && letter_id && supabaseAdmin) {
          // Fetch the letter to check if admin work is required
          const { data: letterFull } = await supabaseAdmin
            .from('digital_letters')
            .select('id, qr_identifier, recipient_name, request_admin_letter, request_admin_voice')
            .eq('id', letter_id)
            .single();

          const needsAdminWork = !!(letterFull?.request_admin_letter || letterFull?.request_admin_voice);
          const newStatus = needsAdminWork ? 'processing' : 'published';

          const { data: letterRow } = await supabaseAdmin
            .from('digital_letters')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', letter_id)
            .select('id, qr_identifier, recipient_name, request_admin_letter, request_admin_voice')
            .single();

          try {
            const origin = new URL(request.url).origin;
            if (needsAdminWork) {
              const { sendLetterProcessingEmail } = await import('@/lib/email');
              await sendLetterProcessingEmail(customerEmail, {
                recipientName: letterRow?.recipient_name || 'your recipient',
              });
            } else {
              const { sendLetterReadyEmail } = await import('@/lib/email');
              await sendLetterReadyEmail(customerEmail, {
                recipientName: letterRow?.recipient_name || 'your recipient',
                shareUrl: `${origin}/letter/${letterRow?.qr_identifier}`,
              });
            }
          } catch (e) {
            console.error('Letter email failed:', e);
          }

          return NextResponse.json({
            success: true,
            letter: letterRow,
            needs_processing: needsAdminWork,
          });
        }
        
        if (supabaseAdmin) {
          // 1. Handle Subscriptions
          if (plan && user_id) {
            const planConfig = getPlan(plan);
            if (!planConfig || planConfig.isCustom) {
              // Corporate plans are provisioned manually; self-serve checkout shouldn't reach here.
              return NextResponse.json(
                { success: false, message: 'Plan not available for self-serve checkout.' },
                { status: 400 }
              );
            }

            const billingCycle: 'monthly' | 'annual' = cycle === 'annual' ? 'annual' : 'monthly';
            const daysToAdd = billingCycle === 'annual' ? 365 : 30;
            const nextBillingDate = new Date();
            nextBillingDate.setDate(nextBillingDate.getDate() + daysToAdd);

            await supabaseAdmin
              .from('subscriptions')
              .upsert({
                user_id: user_id,
                plan: planConfig.id as PlanId,
                status: 'active',
                total_calls: planConfig.totalCalls,
                calls_made: 0,
                billing_cycle: billingCycle,
                start_date: new Date().toISOString(),
                next_billing_date: nextBillingDate.toISOString(),
              }, { onConflict: 'user_id' });
          }

          // 2. Handle One-Off Bookings (Calls)
          if (recipients && Array.isArray(recipients)) {
            const bookingMetadata = metadata?.booking && typeof metadata.booking === 'object' ? metadata.booking : {};
            const callInserts = recipients.map((r: any, idx: number) => ({
              user_id: user_id || null,
              recipient_name: r.name,
              recipient_phone: r.phone,
              relationship: r.relationship || null,
              occasion_type: r.occasion || service || 'General',
              occasion_date: r.date,
              call_type: variant || 'standard',
              scheduled_slot: r.time || 'morning',
              is_express: !!is_express,
              status: 'pending',
              metadata: {
                ...bookingMetadata,
                recipient: bookingMetadata?.recipients?.[idx] ?? null,
              },
            }));

            await supabaseAdmin.from('calls').insert(callInserts);
          }
        }

        // Trigger Confirmation Email via Brevo
        try {
          const { sendBookingConfirmation, sendAdminCallNotification, sendSubscriptionConfirmation } = await import('@/lib/email');
          const subscriptionPlan = plan ? getPlan(plan) : null;

          if (subscriptionPlan && !subscriptionPlan.isCustom) {
            const billingCycle: 'monthly' | 'annual' = cycle === 'annual' ? 'annual' : 'monthly';
            const daysToAdd = billingCycle === 'annual' ? 365 : 30;
            const nextBilling = new Date();
            nextBilling.setDate(nextBilling.getDate() + daysToAdd);

            await sendSubscriptionConfirmation(customerEmail, {
              planName: subscriptionPlan.name,
              totalCalls: subscriptionPlan.totalCalls,
              billingCycle,
              amountPaid: amount,
              nextBillingDate: nextBilling.toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' }),
            });
          } else {
            // One-off booking
            await sendBookingConfirmation(customerEmail, {
              serviceName: service || "BuzzThrills Service",
              price: amount
            });
          }

          // Admin Notification for any new call records
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

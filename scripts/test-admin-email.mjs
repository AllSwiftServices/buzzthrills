import { sendAdminCallNotification } from '../src/lib/email.js';

async function testAdminNotification() {
  console.log('Testing Admin Call Notification...');
  const mockCalls = [
    {
      recipient_name: 'Jane Doe',
      recipient_phone: '+2348123456789',
      occasion_type: 'Birthday Surprise',
      call_type: 'express',
      occasion_date: '2026-05-01',
      scheduled_slot: 'morning'
    }
  ];

  try {
    await sendAdminCallNotification(mockCalls);
    console.log('✅ Admin notification sent successfully!');
  } catch (error) {
    console.error('❌ Failed to send admin notification:', error);
  }
}

testAdminNotification();

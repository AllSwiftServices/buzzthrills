const isTest = process.env.NEXT_PUBLIC_PAYSTACK_MODE === 'test';

export const PAYSTACK_PUBLIC_KEY = isTest 
  ? process.env.NEXT_PUBLIC_PAYSTACK_TEST_PUBLIC_KEY 
  : process.env.NEXT_PUBLIC_PAYSTACK_LIVE_PUBLIC_KEY;

export const PAYSTACK_SECRET_KEY = isTest 
  ? process.env.PAYSTACK_TEST_SECRET_KEY 
  : process.env.PAYSTACK_LIVE_SECRET_KEY;

export const getPaystackConfig = (email: string, amount: number, metadata: any) => ({
  publicKey: PAYSTACK_PUBLIC_KEY || '',
  email,
  amount: amount * 100, // Paystack expects amount in kobo
  metadata,
});

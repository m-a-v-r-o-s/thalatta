import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { amount } = await request.json().catch(() => ({ amount: 0 }));
  const cents = Math.max(0, Math.round(Number(amount) * 100));

  const secret = process.env.STRIPE_SECRET_KEY;

  // No key configured → run the demo in simulated mode.
  if (!secret) {
    return NextResponse.json({ simulated: true });
  }

  try {
    // Imported lazily so the app builds/runs without the key present.
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(secret, { apiVersion: '2024-06-20' });

    const intent = await stripe.paymentIntents.create({
      amount: cents,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      description: 'Thalatta Bay Resort · demo reservation',
      metadata: { source: 'akos-digital-sample' },
    });

    return NextResponse.json({ clientSecret: intent.client_secret, simulated: false });
  } catch (err) {
    // Fall back to simulated success rather than blocking the demo.
    return NextResponse.json({ simulated: true, error: 'stripe_unavailable' });
  }
}

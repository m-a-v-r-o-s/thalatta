'use client';

import { useEffect, useMemo, useState } from 'react';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const PUBLISHABLE = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

let stripePromise: Promise<Stripe | null> | null = null;
function getStripe() {
  if (!stripePromise && PUBLISHABLE) stripePromise = loadStripe(PUBLISHABLE);
  return stripePromise;
}

export default function PaymentStep({
  amount,
  onSuccess,
  onBack,
}: {
  amount: number;
  onSuccess: () => void;
  onBack: () => void;
}) {
  const [mode, setMode] = useState<'loading' | 'stripe' | 'simulated'>('loading');
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        if (data.clientSecret && PUBLISHABLE) {
          setClientSecret(data.clientSecret);
          setMode('stripe');
        } else {
          setMode('simulated');
        }
      })
      .catch(() => active && setMode('simulated'));
    return () => {
      active = false;
    };
  }, [amount]);

  if (mode === 'loading') {
    return <p className="font-body text-sm text-sand-muted">Preparing secure payment…</p>;
  }

  if (mode === 'stripe' && clientSecret) {
    return (
      <Elements
        stripe={getStripe()}
        options={{
          clientSecret,
          appearance: {
            theme: 'night',
            variables: {
              colorPrimary: '#C9A15A',
              colorBackground: '#0F1D20',
              colorText: '#EFE7D6',
              fontFamily: 'Inter, sans-serif',
              borderRadius: '0px',
            },
          },
        }}
      >
        <StripeForm amount={amount} onSuccess={onSuccess} onBack={onBack} />
      </Elements>
    );
  }

  return <SimulatedForm amount={amount} onSuccess={onSuccess} onBack={onBack} />;
}

function StripeForm({
  amount,
  onSuccess,
  onBack,
}: {
  amount: number;
  onSuccess: () => void;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    if (!stripe || !elements) return;
    setBusy(true);
    setError(null);
    const { error: err } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });
    if (err) {
      setError(err.message ?? 'Payment could not be completed.');
      setBusy(false);
      return;
    }
    onSuccess();
  }

  return (
    <div>
      <TestNote />
      <PaymentElement />
      {error && <p className="mt-3 font-body text-sm text-red-300">{error}</p>}
      <PayActions amount={amount} busy={busy} onPay={pay} onBack={onBack} />
    </div>
  );
}

/** Fallback used when no Stripe key is configured. Behaves like a card form. */
function SimulatedForm({
  amount,
  onSuccess,
  onBack,
}: {
  amount: number;
  onSuccess: () => void;
  onBack: () => void;
}) {
  const [card, setCard] = useState('4242 4242 4242 4242');
  const [exp, setExp] = useState('12 / 34');
  const [cvc, setCvc] = useState('123');
  const [busy, setBusy] = useState(false);

  const valid = useMemo(
    () => card.replace(/\s/g, '').length >= 12 && exp.length >= 4 && cvc.length >= 3,
    [card, exp, cvc]
  );

  function pay() {
    setBusy(true);
    setTimeout(onSuccess, 900);
  }

  return (
    <div>
      <TestNote simulated />
      <div className="space-y-4">
        <div>
          <label className="field-label">Card number</label>
          <input className="field" value={card} onChange={(e) => setCard(e.target.value)} inputMode="numeric" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label">Expiry</label>
            <input className="field" value={exp} onChange={(e) => setExp(e.target.value)} />
          </div>
          <div>
            <label className="field-label">CVC</label>
            <input className="field" value={cvc} onChange={(e) => setCvc(e.target.value)} inputMode="numeric" />
          </div>
        </div>
      </div>
      <PayActions amount={amount} busy={busy} disabled={!valid} onPay={pay} onBack={onBack} />
    </div>
  );
}

function TestNote({ simulated }: { simulated?: boolean }) {
  return (
    <div className="mb-5 border border-gold/25 bg-gold/5 px-4 py-3">
      <p className="font-body text-[12px] leading-relaxed text-sand-muted">
        {simulated ? (
          <>Demo mode. No real payment is processed. Add Stripe test keys in <code className="text-gold">.env</code> to enable the live test-mode Payment Element.</>
        ) : (
          <>Stripe test mode. Use card <span className="text-gold">4242 4242 4242 4242</span>, any future expiry, any CVC. No real charge is made.</>
        )}
      </p>
    </div>
  );
}

function PayActions({
  amount,
  busy,
  disabled,
  onPay,
  onBack,
}: {
  amount: number;
  busy: boolean;
  disabled?: boolean;
  onPay: () => void;
  onBack: () => void;
}) {
  return (
    <div className="mt-8 flex items-center justify-between gap-4">
      <button onClick={onBack} className="font-body text-[12px] uppercase tracking-[0.2em] text-sand-muted hover:text-gold">
        ← Back
      </button>
      <button onClick={onPay} disabled={busy || disabled} className="btn-gold disabled:cursor-not-allowed disabled:opacity-40">
        {busy ? 'Processing…' : `Pay €${amount.toLocaleString()}`}
      </button>
    </div>
  );
}

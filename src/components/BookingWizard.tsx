'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ROOMS } from '@/lib/content';
import { lummi } from '@/lib/images';
import { useFormKeyboard } from '@/lib/useFormKeyboard';
import PaymentStep from './PaymentStep';

type Extras = { breakfast: boolean; spa: boolean; transfer: boolean };
const EXTRA_PRICES = { breakfast: 35, spa: 120, transfer: 90 }; // per stay (breakfast per guest/night)

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function BookingWizard() {
  const t = useTranslations('booking');
  const rt = useTranslations('roomsList');
  const formRef = useFormKeyboard<HTMLDivElement>();

  const [step, setStep] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomId, setRoomId] = useState<string>('');
  const [extras, setExtras] = useState<Extras>({ breakfast: false, spa: false, transfer: false });
  const [guest, setGuest] = useState({ firstName: '', lastName: '', email: '', phone: '', requests: '' });
  const [ref, setRef] = useState('');

  // Sensible defaults (client-only to avoid hydration mismatch).
  useEffect(() => {
    const now = new Date();
    const inD = new Date(now); inD.setDate(now.getDate() + 14);
    const outD = new Date(now); outD.setDate(now.getDate() + 17);
    setCheckIn(iso(inD));
    setCheckOut(iso(outD));
  }, []);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(0, Math.round(ms / 86_400_000));
  }, [checkIn, checkOut]);

  const room = ROOMS.find((r) => r.id === roomId);
  const guests = adults + children;

  const extrasTotal =
    (extras.breakfast ? EXTRA_PRICES.breakfast * guests * nights : 0) +
    (extras.spa ? EXTRA_PRICES.spa : 0) +
    (extras.transfer ? EXTRA_PRICES.transfer : 0);
  const roomTotal = room ? room.price * nights : 0;
  const total = roomTotal + extrasTotal;

  const steps = ['dates', 'room', 'extras', 'details', 'payment'] as const;

  const canNext = useMemo(() => {
    if (step === 0) return nights > 0;
    if (step === 1) return !!room;
    if (step === 3) return guest.firstName && guest.lastName && /.+@.+\..+/.test(guest.email);
    return true;
  }, [step, nights, room, guest]);

  function confirm() {
    const code = 'TB-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    setRef(code);
    setStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ---- Confirmation ----
  if (step === 5) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">{t('confirm.eyebrow')}</p>
        <h2 className="mt-4 font-display text-4xl md:text-5xl">{t('confirm.title')}</h2>
        <p className="mt-4 font-body text-sand-muted">{t('confirm.body')}</p>

        <div className="mt-10 border border-gold/25 bg-ink-800 p-8 text-left">
          <Row label={t('confirm.reference')} value={ref} accent />
          <Row label={t('summary.room')} value={room ? rt(`${room.id}.name`) : '–'} />
          <Row label={t('summary.checkIn')} value={checkIn} />
          <Row label={t('summary.checkOut')} value={checkOut} />
          <Row label={t('summary.guests')} value={`${adults} · ${children}`} />
          <Row label={t('summary.nights')} value={String(nights)} />
          <div className="mt-4 flex items-center justify-between border-t border-line/10 pt-4">
            <span className="font-display text-xl">{t('summary.total')}</span>
            <span className="font-display text-2xl text-gold">€{total.toLocaleString()}</span>
          </div>
        </div>
        <p className="mt-6 font-body text-[12px] text-sand-muted">
          {t('confirm.emailed', { email: guest.email || '–' })}
        </p>
      </div>
    );
  }

  return (
    <div ref={formRef} className="grid gap-12 lg:grid-cols-[1fr_360px]">
      {/* Left: steps */}
      <div>
        {/* Progress */}
        <ol className="mb-10 flex flex-wrap gap-x-6 gap-y-2">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] ${
                  i === step
                    ? 'border-gold bg-gold text-ink'
                    : i < step
                    ? 'border-gold text-gold'
                    : 'border-sand/25 text-sand-muted'
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`font-body text-[11px] uppercase tracking-[0.18em] ${
                  i === step ? 'text-gold' : 'text-sand-muted'
                }`}
              >
                {t(`steps.${s}`)}
              </span>
            </li>
          ))}
        </ol>

        {/* Step 0: dates & guests */}
        {step === 0 && (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="field-label">{t('fields.checkIn')}</label>
                <input type="date" className="field" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
              </div>
              <div>
                <label className="field-label">{t('fields.checkOut')}</label>
                <input type="date" className="field" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <Stepper label={t('fields.adults')} value={adults} min={1} onChange={setAdults} />
              <Stepper label={t('fields.children')} value={children} min={0} onChange={setChildren} />
            </div>
            {nights === 0 && <p className="font-body text-sm text-red-300">{t('fields.datesError')}</p>}
          </div>
        )}

        {/* Step 1: room */}
        {step === 1 && (
          <div className="grid gap-5">
            {ROOMS.map((r) => {
              const active = r.id === roomId;
              return (
                <button
                  key={r.id}
                  onClick={() => setRoomId(r.id)}
                  className={`flex flex-col gap-4 border p-3 text-left transition-colors sm:flex-row ${
                    active ? 'border-gold bg-gold/5' : 'border-sand/15 hover:border-sand/40'
                  }`}
                >
                  <div className="relative h-40 w-full flex-none overflow-hidden sm:h-28 sm:w-44">
                    <Image src={lummi(r.image, 600)} alt={rt(`${r.id}.name`)} fill className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div>
                      <h3 className="font-display text-2xl">{rt(`${r.id}.name`)}</h3>
                      <p className="mt-1 font-body text-[13px] text-sand-muted">
                        {r.sizeSqm} m² · {t('summary.upTo', { n: r.guests })}
                      </p>
                    </div>
                    <p className="font-body text-sm text-sand">
                      <span className="text-gold">€{r.price}</span> {t('perNight')}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 2: extras */}
        {step === 2 && (
          <div className="space-y-4">
            {(['breakfast', 'spa', 'transfer'] as const).map((k) => (
              <button
                key={k}
                onClick={() => setExtras((e) => ({ ...e, [k]: !e[k] }))}
                className={`flex w-full items-start gap-4 border p-5 text-left transition-colors ${
                  extras[k] ? 'border-gold bg-gold/5' : 'border-sand/15 hover:border-sand/40'
                }`}
              >
                <span
                  className={`mt-1 flex h-5 w-5 flex-none items-center justify-center border ${
                    extras[k] ? 'border-gold bg-gold' : 'border-sand/40'
                  }`}
                >
                  {extras[k] && (
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6.2l2.6 2.6L10 3.2" stroke="#0B1416" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl">{t(`extras.${k}.title`)}</h3>
                    <span className="font-body text-sm text-gold">{t(`extras.${k}.price`)}</span>
                  </div>
                  <p className="mt-1 font-body text-[13px] text-sand-muted">{t(`extras.${k}.desc`)}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 3: details */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="field-label">{t('fields.firstName')}</label>
                <input className="field" value={guest.firstName} onChange={(e) => setGuest({ ...guest, firstName: e.target.value })} />
              </div>
              <div>
                <label className="field-label">{t('fields.lastName')}</label>
                <input className="field" value={guest.lastName} onChange={(e) => setGuest({ ...guest, lastName: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="field-label">{t('fields.email')}</label>
                <input type="email" className="field" value={guest.email} onChange={(e) => setGuest({ ...guest, email: e.target.value })} />
              </div>
              <div>
                <label className="field-label">{t('fields.phone')}</label>
                <input className="field" value={guest.phone} onChange={(e) => setGuest({ ...guest, phone: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="field-label">{t('fields.requests')}</label>
              <textarea rows={3} className="field resize-none" value={guest.requests} onChange={(e) => setGuest({ ...guest, requests: e.target.value })} />
            </div>
          </div>
        )}

        {/* Step 4: payment */}
        {step === 4 && <PaymentStep amount={total} onSuccess={confirm} onBack={() => setStep(3)} />}

        {/* Nav */}
        {step !== 4 && (
          <div className="mt-10 flex items-center justify-between gap-4">
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)} className="font-body text-[12px] uppercase tracking-[0.2em] text-sand-muted hover:text-gold">
                ← {t('back')}
              </button>
            ) : (
              <span />
            )}
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canNext}
              className="btn-gold disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t('continue')}
            </button>
          </div>
        )}
      </div>

      {/* Right: summary */}
      <aside className="h-fit lg:sticky lg:top-28">
        <div className="border border-line/10 bg-ink-800 p-7">
          <p className="eyebrow">{t('summary.title')}</p>
          <div className="mt-6 space-y-3 font-body text-sm">
            <Line label={t('summary.room')} value={room ? rt(`${room.id}.name`) : t('summary.none')} />
            <Line label={t('summary.dates')} value={checkIn && checkOut ? `${checkIn} → ${checkOut}` : '–'} />
            <Line label={t('summary.nights')} value={nights ? String(nights) : '–'} />
            <Line label={t('summary.guests')} value={`${adults} + ${children}`} />
            {room && <Line label={`${t('summary.room')} ×${nights}`} value={`€${roomTotal.toLocaleString()}`} />}
            {extras.breakfast && <Line label={t('extras.breakfast.title')} value={`€${(EXTRA_PRICES.breakfast * guests * nights).toLocaleString()}`} />}
            {extras.spa && <Line label={t('extras.spa.title')} value={`€${EXTRA_PRICES.spa}`} />}
            {extras.transfer && <Line label={t('extras.transfer.title')} value={`€${EXTRA_PRICES.transfer}`} />}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-line/10 pt-5">
            <span className="font-display text-lg">{t('summary.total')}</span>
            <span className="font-display text-2xl text-gold">€{total.toLocaleString()}</span>
          </div>
          <p className="mt-4 font-body text-[11px] leading-relaxed text-sand-muted/70">{t('summary.note')}</p>
        </div>
      </aside>
    </div>
  );
}

function Stepper({ label, value, min, onChange }: { label: string; value: number; min: number; onChange: (n: number) => void }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="flex items-center border border-sand/20 bg-ink-800">
        <button onClick={() => onChange(Math.max(min, value - 1))} className="px-5 py-3 text-sand hover:text-gold" aria-label="decrease">
          −
        </button>
        <span className="flex-1 text-center font-body text-sand">{value}</span>
        <button onClick={() => onChange(value + 1)} className="px-5 py-3 text-sand hover:text-gold" aria-label="increase">
          +
        </button>
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sand-muted">{label}</span>
      <span className="text-right text-sand">{value}</span>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-line/5 py-3 last:border-0">
      <span className="font-body text-[12px] uppercase tracking-[0.16em] text-sand-muted">{label}</span>
      <span className={`font-body ${accent ? 'text-lg text-gold' : 'text-sand'}`}>{value}</span>
    </div>
  );
}

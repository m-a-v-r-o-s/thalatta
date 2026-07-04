'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useFormKeyboard } from '@/lib/useFormKeyboard';

export default function ContactForm() {
  const t = useTranslations('contact');
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const formRef = useFormKeyboard<HTMLDivElement>();

  const valid = form.name && /.+@.+\..+/.test(form.email) && form.message;

  if (sent) {
    return (
      <div className="border border-gold/25 bg-gold/5 p-8">
        <p className="font-display text-2xl text-sand">{t('form.sentTitle')}</p>
        <p className="mt-2 font-body text-sm text-sand-muted">{t('form.sentBody')}</p>
      </div>
    );
  }

  return (
    <div ref={formRef} className="space-y-5">
      <div>
        <label className="field-label">{t('form.name')}</label>
        <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div>
        <label className="field-label">{t('form.email')}</label>
        <input type="email" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div>
        <label className="field-label">{t('form.message')}</label>
        <textarea rows={5} className="field resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      </div>
      <button
        onClick={() => valid && setSent(true)}
        disabled={!valid}
        className="btn-gold disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t('form.send')}
      </button>
    </div>
  );
}

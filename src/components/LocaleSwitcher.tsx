'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { useState, useRef, useEffect } from 'react';

const LABELS: Record<string, string> = {
  en: 'EN',
  el: 'ΕΛ',
  de: 'DE',
  fr: 'FR',
};

export default function LocaleSwitcher({ light = false }: { light?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function switchTo(next: string) {
    setOpen(false);
    router.replace(pathname, { locale: next });
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`header-ctl font-body text-[12px] uppercase tracking-[0.22em] transition-colors hover:text-gold ${
          light ? 'text-ink' : 'text-sand'
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {LABELS[locale]}
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-3 min-w-[64px] border border-gold/40 bg-ink-800 py-1"
        >
          {routing.locales.map((l) => (
            <li key={l}>
              <button
                onClick={() => switchTo(l)}
                className={`block w-full px-4 py-2 text-left font-body text-[12px] uppercase tracking-[0.18em] transition-colors hover:text-gold ${
                  l === locale ? 'text-gold' : 'text-sand'
                }`}
              >
                {LABELS[l]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

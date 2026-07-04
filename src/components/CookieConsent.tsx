'use client';

import { useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'tb-cookie-consent';

type Consent = { necessary: true; analytics: boolean; ts: number };

/** Mock analytics loader, gated behind consent. */
function enableAnalytics() {
  if (typeof window === 'undefined') return;
  (window as any).__analyticsEnabled = true;
  // In a real build this is where GA / Plausible / etc. would initialise.
  // console.info('[analytics] enabled with consent');
}

export default function CookieConsent() {
  const [view, setView] = useState<'hidden' | 'banner' | 'prefs'>('hidden');
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setView('banner');
        return;
      }
      const saved: Consent = JSON.parse(raw);
      if (saved.analytics) enableAnalytics();
    } catch {
      setView('banner');
    }
  }, []);

  // Allow re-opening preferences from elsewhere (e.g. a footer link).
  useEffect(() => {
    const open = () => setView('prefs');
    window.addEventListener('open-cookie-preferences', open);
    return () => window.removeEventListener('open-cookie-preferences', open);
  }, []);

  const persist = useCallback((consent: Consent) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch {
      /* storage unavailable: consent applies for this session only */
    }
    if (consent.analytics) enableAnalytics();
    setView('hidden');
  }, []);

  const acceptAll = () => persist({ necessary: true, analytics: true, ts: Date.now() });
  const rejectAll = () => persist({ necessary: true, analytics: false, ts: Date.now() });
  const savePrefs = () =>
    persist({ necessary: true, analytics, ts: Date.now() });

  if (view === 'hidden') return null;

  return (
    <div data-theme="dark" className="fixed bottom-0 left-0 z-[60] w-full max-w-[420px] p-4 sm:bottom-5 sm:left-5 sm:p-0">
      <div className="border border-gold/25 bg-ink-800/98 p-6 shadow-2xl backdrop-blur-md">
        {/* Label */}
        <div className="mb-4 flex items-center gap-2">
          <Spark />
          <span className="font-body text-[11px] uppercase tracking-[0.32em] text-gold">
            Cookies
          </span>
        </div>

        {view === 'banner' ? (
          <>
            <p className="font-body text-[13px] leading-relaxed text-sand-muted">
              Αυτός ο ιστότοπος χρησιμοποιεί απαραίτητα cookies για να λειτουργεί.
              Με τη συγκατάθεσή σου, προαιρετικά cookies όπως analytics με βοηθούν
              να τον βελτιώσω. Έχεις τον έλεγχο: αποδοχή, απόρριψη ή διαχείριση
              προτιμήσεων.{' '}
              <a href="#" className="text-gold underline underline-offset-4 hover:text-gold-light">
                Μάθε περισσότερα
              </a>
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={acceptAll} className="btn-gold !px-6 !py-2.5">
                Αποδοχή όλων
              </button>
              <button onClick={rejectAll} className="btn-ghost !px-6 !py-2.5">
                Απόρριψη όλων
              </button>
            </div>

            <button
              onClick={() => setView('prefs')}
              className="mt-4 font-body text-[11px] uppercase tracking-[0.2em] text-sand-muted transition-colors hover:text-gold"
            >
              Διαχείριση προτιμήσεων
            </button>
          </>
        ) : (
          <>
            <div className="space-y-5">
              {/* Necessary: always on */}
              <div className="flex gap-3">
                <Checkbox checked disabled />
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-body text-sm text-sand">Απολύτως απαραίτητα</span>
                    <span className="font-body text-[10px] uppercase tracking-[0.2em] text-gold">
                      Πάντα ενεργά
                    </span>
                  </div>
                  <p className="mt-1.5 font-body text-[12px] leading-relaxed text-sand-muted">
                    Απαραίτητα για τη λειτουργία του ιστότοπου, όπως ασφάλεια και η
                    αποθήκευση αυτής της επιλογής.
                  </p>
                </div>
              </div>

              {/* Analytics: toggle */}
              <button
                type="button"
                onClick={() => setAnalytics((v) => !v)}
                className="flex w-full gap-3 text-left"
              >
                <Checkbox checked={analytics} />
                <div>
                  <span className="font-body text-sm text-sand">Analytics</span>
                  <p className="mt-1.5 font-body text-[12px] leading-relaxed text-sand-muted">
                    Ανώνυμα στατιστικά που με βοηθούν να καταλάβω πώς
                    χρησιμοποιείται ο ιστότοπος.
                  </p>
                </div>
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button onClick={savePrefs} className="btn-gold !px-6 !py-2.5">
                Αποθήκευση προτιμήσεων
              </button>
              <button
                onClick={acceptAll}
                className="font-body text-[11px] uppercase tracking-[0.2em] text-sand-muted transition-colors hover:text-gold"
              >
                Αποδοχή όλων
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Spark() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2L12 2z"
        stroke="#C9A15A"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Checkbox({ checked, disabled }: { checked: boolean; disabled?: boolean }) {
  return (
    <span
      className={`mt-0.5 flex h-[18px] w-[18px] flex-none items-center justify-center border ${
        checked ? 'border-gold bg-gold' : 'border-sand/40 bg-transparent'
      } ${disabled ? 'opacity-90' : ''}`}
      aria-hidden="true"
    >
      {checked && (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path d="M2 6.2l2.6 2.6L10 3.2" stroke="#0B1416" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

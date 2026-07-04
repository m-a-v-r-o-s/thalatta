import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { HOTEL } from '@/lib/content';

export default function Footer() {
  const t = useTranslations();
  const nav = useTranslations('nav');

  return (
    <footer className="border-t border-line/5 bg-ink-900">
      <div className="container-x grid gap-12 py-16 md:grid-cols-4 md:py-20">
        <div className="md:col-span-2">
          <Image
            src="/logo-mark.png"
            alt=""
            width={67}
            height={46}
            className="mb-4 h-16 w-auto opacity-90 md:h-20"
          />
          <p className="font-display text-2xl font-medium text-sand">
            Thalatta<span className="text-gold"> Bay</span>
          </p>
          <p className="mt-4 max-w-sm font-body text-sm leading-relaxed text-sand-muted">
            {t('footer.tagline')}
          </p>
        </div>

        <div>
          <p className="eyebrow mb-5">{t('footer.explore')}</p>
          <ul className="space-y-3">
            {['rooms', 'dining', 'spa', 'experiences', 'testimonials', 'gallery', 'booking', 'contact'].map((k) => (
              <li key={k}>
                <Link
                  href={`/${k === 'rooms' ? 'rooms' : k}`}
                  className="font-body text-sm text-sand-muted transition-colors hover:text-gold"
                >
                  {nav(k)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-5">{t('footer.contact')}</p>
          <address className="space-y-2 font-body text-sm not-italic text-sand-muted">
            <p>{HOTEL.street}</p>
            <p>{HOTEL.area}</p>
            <p>{HOTEL.region}</p>
            <p className="pt-2">
              <a href={`tel:${HOTEL.phone.replace(/\s/g, '')}`} className="hover:text-gold">
                {HOTEL.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${HOTEL.email}`} className="hover:text-gold">
                {HOTEL.email}
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-line/5">
        <div className="container-x py-6">
          <p className="text-center font-body text-[11px] leading-relaxed tracking-wide text-sand-muted/70">
            © 2026 {HOTEL.name}. All rights reserved. Akos Digital Sample Website.
            Images &amp; text are placeholders.
          </p>
        </div>
      </div>
    </footer>
  );
}

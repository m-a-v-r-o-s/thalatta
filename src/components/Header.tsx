'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import LocaleSwitcher from './LocaleSwitcher';
import ThemeToggle from './ThemeToggle';
import { HOTEL } from '@/lib/content';

const NAV = [
  { href: '/rooms', key: 'rooms' },
  { href: '/dining', key: 'dining' },
  { href: '/spa', key: 'spa' },
  { href: '/experiences', key: 'experiences' },
  { href: '/testimonials', key: 'testimonials' },
  { href: '/gallery', key: 'gallery' },
  { href: '/contact', key: 'contact' },
] as const;

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock scroll when the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <>
      <header
        data-theme={solid ? undefined : 'dark'}
        className={`fixed inset-x-0 top-0 z-[70] transition-colors duration-500 ${
          // Background only from scrolling. When the menu is open at the top the
          // header stays transparent so the overlay behind it is the single
          // surface that appears/disappears as one.
          scrolled ? 'bg-ink/95 backdrop-blur-sm' : 'bg-transparent'
        }`}
      >
        <div className="container-x flex h-24 items-center justify-between gap-4">
          {/* Logo mark (name lives in the hero / footer) */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            aria-label="Thalatta Bay, home"
            className="flex items-center"
          >
            <Image
              src="/logo-mark.png"
              alt="Thalatta Bay"
              width={117}
              height={80}
              priority
              className="h-16 w-auto sm:h-20"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-4 lg:flex xl:gap-8">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link font-body text-[12px] uppercase tracking-[0.2em] ${
                    active ? 'is-active' : ''
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          {/* Language + Book stay outside the burger, visible on every size */}
          <div className="flex items-center gap-3 sm:gap-5">
            <ThemeToggle />
            <LocaleSwitcher />
            <Link
              href="/booking"
              onClick={() => setOpen(false)}
              className="btn-gold !px-4 !py-2.5 !text-[11px] sm:!px-6"
            >
              <span className="sm:hidden">{t('booking')}</span>
              <span className="hidden sm:inline">{t('bookNow')}</span>
            </Link>

            {/* Hamburger / X */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="relative z-10 -mr-1 flex h-8 w-8 flex-col items-center justify-center gap-[6px] lg:hidden"
            >
              <span
                className={`block h-px w-6 bg-sand transition-all duration-300 ${
                  open ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-px w-6 bg-sand transition-all duration-300 ${
                  open ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-px w-6 bg-sand transition-all duration-300 ${
                  open ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu: sibling of the header, so the header's
          backdrop-filter does not trap this fixed element to its box.
          Sits below the header (z-[70]) so the top bar stays usable. */}
      <div
        className={`mobile-menu fixed inset-0 z-[65] flex flex-col bg-ink lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <nav className="flex flex-1 flex-col items-center justify-center gap-8">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="nav-link font-display text-3xl font-light"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
        <p className="pb-10 text-center font-body text-[11px] uppercase tracking-[0.2em] text-sand-muted">
          {HOTEL.area} · {HOTEL.region}
        </p>
      </div>
    </>
  );
}

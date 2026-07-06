import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import { HOTEL } from '@/lib/content';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: {
      default: `${HOTEL.name} · ${t('tagline')}`,
      template: `%s · ${HOTEL.name}`,
    },
    description: t('description'),
    icons: { icon: '/favicon.ico?v=2', shortcut: '/favicon.ico?v=2' },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as never)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Set the theme before paint: saved choice, else by time of day. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var t;try{t=localStorage.getItem('tb-theme');}catch(e){}if(t!=='light'&&t!=='dark'){var h=new Date().getHours();t=(h>=7&&h<19)?'light':'dark';}document.documentElement.setAttribute('data-theme',t);})();",
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Warm up the image CDNs so the hero photo starts loading sooner. */}
        <link rel="preconnect" href="https://images.pexels.com" />
        <link rel="preconnect" href="https://assets.lummi.ai" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Caveat:wght@500;600&family=Inter:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main>{children}</main>
          <Footer />
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

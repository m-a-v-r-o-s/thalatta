import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import BookingWizard from '@/components/BookingWizard';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'booking' });
  return { title: t('title') };
}

export default async function BookingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('booking');

  return (
    <section className="pt-32 pb-24 md:pt-40">
      <div className="container-x">
        <div className="mb-14 max-w-2xl">
          <p className="eyebrow">{t('eyebrow')}</p>
          <h1 className="horizon mt-4 font-display text-5xl md:text-6xl">{t('title')}</h1>
          <p className="mt-6 font-body leading-relaxed text-sand-muted">{t('intro')}</p>
        </div>
        <BookingWizard />
      </div>
    </section>
  );
}

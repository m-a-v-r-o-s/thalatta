import Image from 'next/image';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import { IMG, lummi } from '@/lib/images';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'spa' });
  return { title: t('title') };
}

const TREATMENTS = ['aegean', 'olive', 'thalasso', 'couples'] as const;

export default async function SpaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('spa');
  const common = await getTranslations('common');

  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} image={lummi(IMG.spa.hero, 1600)} />

      <section className="py-20 md:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">{t('introEyebrow')}</p>
            <h2 className="horizon mt-4 font-display text-4xl md:text-5xl">{t('introTitle')}</h2>
            <p className="mt-7 font-body leading-relaxed text-sand-muted">{t('intro1')}</p>
            <p className="mt-4 font-body leading-relaxed text-sand-muted">{t('intro2')}</p>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src={lummi(IMG.spa.lounge, 1200)} alt="" fill className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink-900 py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">{t('menuEyebrow')}</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">{t('menuTitle')}</h2>
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden border border-line/10 bg-line/10 md:grid-cols-2">
            {TREATMENTS.map((k, i) => (
              <Reveal key={k} delay={i * 80} className="bg-ink-900">
                <div className="flex h-full flex-col p-8">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-2xl">{t(`treatments.${k}.name`)}</h3>
                    <span className="font-body text-sm text-gold">{t(`treatments.${k}.price`)}</span>
                  </div>
                  <p className="mt-3 font-body text-sm leading-relaxed text-sand-muted">{t(`treatments.${k}.desc`)}</p>
                  <span className="mt-4 font-body text-[11px] uppercase tracking-[0.18em] text-sand-muted">{t(`treatments.${k}.duration`)}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 text-center">
            <Link href="/contact" className="btn-gold">{t('bookTreatment')}</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

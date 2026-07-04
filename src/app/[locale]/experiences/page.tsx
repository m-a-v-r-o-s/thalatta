import Image from 'next/image';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import { EXPERIENCES } from '@/lib/content';
import { IMG, lummi } from '@/lib/images';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'experiences' });
  return { title: t('title') };
}

export default async function ExperiencesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('experiences');

  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} image={lummi(IMG.experiences.hero, 1600)} />

      <section className="py-20 md:py-28">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="font-body leading-relaxed text-sand-muted">{t('intro')}</p>
          </Reveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {EXPERIENCES.map((x, i) => (
              <Reveal key={x.id} delay={(i % 3) * 90}>
                <article className="group flex h-full flex-col">
                  <div data-theme="dark" className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={lummi(x.image, 800)}
                      alt={t(`items.${x.id}.name`)}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                    <span className="absolute left-5 top-5 border border-line/25 bg-ink/30 px-3 py-1 font-body text-[10px] uppercase tracking-[0.2em] text-sand backdrop-blur-sm">
                      {t(`items.${x.id}.meta`)}
                    </span>
                  </div>
                  <p className="eyebrow mt-5">{t(`items.${x.id}.kind`)}</p>
                  <h3 className="mt-2 font-display text-2xl">{t(`items.${x.id}.name`)}</h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-sand-muted">
                    {t(`items.${x.id}.desc`)}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16 text-center">
            <p className="font-body text-[12px] uppercase tracking-[0.2em] text-sand-muted">
              {t('concierge')}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-ink-900 py-24 text-center md:py-28">
        <Reveal className="container-x">
          <p className="eyebrow">{t('cta.eyebrow')}</p>
          <h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl leading-tight md:text-5xl">
            {t('cta.title')}
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-body leading-relaxed text-sand-muted">
            {t('cta.body')}
          </p>
          <Link href="/contact" className="btn-gold mt-10">
            {t('cta.button')}
          </Link>
        </Reveal>
      </section>
    </>
  );
}

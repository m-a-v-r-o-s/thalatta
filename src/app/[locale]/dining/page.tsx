import Image from 'next/image';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import { RESTAURANTS, BARS } from '@/lib/content';
import { IMG, lummi } from '@/lib/images';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dining' });
  return { title: t('title') };
}

export default async function DiningPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('dining');
  const vt = await getTranslations('venues');
  const common = await getTranslations('common');

  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} image={lummi(IMG.dining.overview, 1600)} />

      <section className="py-20 md:py-28">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="font-body leading-relaxed text-sand-muted">{t('intro')}</p>
          </Reveal>

          {/* Restaurants */}
          <Reveal className="mt-20">
            <p className="eyebrow">{t('restaurantsLabel')}</p>
            <div className="mt-8 h-px w-full bg-line/10" />
          </Reveal>

          <div className="mt-12 space-y-20">
            {RESTAURANTS.map((v, i) => (
              <Reveal key={v.id}>
                <article className={`grid items-center gap-10 lg:grid-cols-2 ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                  <Link href={`/dining/${v.id}`} className="group relative block aspect-[4/3] overflow-hidden">
                    <Image src={lummi(v.image, 1200)} alt={vt(`${v.id}.name`)} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </Link>
                  <div>
                    <p className="eyebrow">{vt(`${v.id}.kind`)}</p>
                    <h2 className="horizon mt-4 font-display text-4xl md:text-5xl">{vt(`${v.id}.name`)}</h2>
                    <p className="mt-6 font-body italic text-foam">{vt(`${v.id}.tagline`)}</p>
                    <p className="mt-5 font-body leading-relaxed text-sand-muted">{vt(`${v.id}.summary`)}</p>
                    <div className="mt-7 flex items-center gap-6">
                      <span className="font-body text-sm text-sand-muted">{vt(`${v.id}.hours`)}</span>
                    </div>
                    <Link href={`/dining/${v.id}`} className="btn-ghost mt-8">{common('viewDetails')}</Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Bars */}
          <Reveal className="mt-28">
            <p className="eyebrow">{t('barsLabel')}</p>
            <div className="mt-8 h-px w-full bg-line/10" />
          </Reveal>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {BARS.map((v, i) => (
              <Reveal key={v.id} delay={i * 100}>
                <Link href={`/dining/${v.id}`} className="group block">
                  <div data-theme="dark" className="relative aspect-[16/10] overflow-hidden">
                    <Image src={lummi(v.image, 1000)} alt={vt(`${v.id}.name`)} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                  </div>
                  <p className="mt-4 font-body text-[11px] uppercase tracking-[0.2em] text-gold">{vt(`${v.id}.kind`)}</p>
                  <h3 className="mt-1 font-display text-3xl">{vt(`${v.id}.name`)}</h3>
                  <p className="mt-2 font-body text-sm text-sand-muted">{vt(`${v.id}.tagline`)}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

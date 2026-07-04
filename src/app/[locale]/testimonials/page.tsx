import Image from 'next/image';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import { TESTIMONIALS } from '@/lib/content';
import { IMG, lummi } from '@/lib/images';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'testimonials' });
  return { title: t('title') };
}

function Stars({ n, size = 15 }: { n: number; size?: number }) {
  return (
    <div className="flex gap-1" role="img" aria-label={`${n} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className={i <= n ? 'text-gold' : 'text-sand-muted/25'}
        >
          <path d="M12 2l2.9 6.26 6.85.72-5.13 4.6 1.44 6.72L12 17.9l-6.06 2.4 1.44-6.72-5.13-4.6 6.85-.72z" />
        </svg>
      ))}
    </div>
  );
}

export default async function TestimonialsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('testimonials');

  const stats = ['rating', 'stays', 'return'] as const;

  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} image={lummi(IMG.testimonials.hero, 1600)} />

      {/* Intro + rating summary */}
      <section className="py-20 md:py-28">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="font-body leading-relaxed text-sand-muted">{t('intro')}</p>
          </Reveal>

          <Reveal className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-px overflow-hidden border border-line/10 bg-line/10 sm:grid-cols-3">
            {stats.map((k) => (
              <div key={k} className="flex flex-col items-center bg-ink px-6 py-8 text-center">
                <p className="font-display text-4xl text-gold md:text-5xl">{t(`stats.${k}.value`)}</p>
                <p className="mt-2 font-body text-[11px] uppercase tracking-[0.18em] text-sand-muted">
                  {t(`stats.${k}.label`)}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="bg-ink-900 py-20 md:py-28">
        <div className="container-x">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((item, i) => (
              <Reveal key={item.id} delay={(i % 3) * 90}>
                <figure className="flex h-full flex-col border border-line/10 bg-ink-800 p-8">
                  <Stars n={item.rating} />
                  <blockquote className="mt-5 flex-1 font-body leading-relaxed text-sand">
                    “{t(`items.${item.id}.quote`)}”
                  </blockquote>
                  <figcaption className="mt-7 flex items-center gap-4 border-t border-line/10 pt-6">
                    <Image
                      src={lummi(item.image, 200)}
                      alt={t(`items.${item.id}.name`)}
                      width={56}
                      height={56}
                      className="h-14 w-14 flex-none rounded-full object-cover"
                    />
                    <div>
                      <p className="font-display text-lg leading-tight text-sand">{t(`items.${item.id}.name`)}</p>
                      <p className="mt-0.5 font-body text-[12px] text-sand-muted">{t(`items.${item.id}.location`)}</p>
                      <p className="font-body text-[11px] uppercase tracking-[0.14em] text-gold/80">
                        {t(`items.${item.id}.stay`)}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 text-center">
            <p className="font-body text-[12px] uppercase tracking-[0.2em] text-sand-muted">{t('verified')}</p>
          </Reveal>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-24 text-center md:py-28">
        <Reveal className="container-x">
          <p className="eyebrow">{t('cta.eyebrow')}</p>
          <h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl leading-tight md:text-5xl">{t('cta.title')}</h2>
          <p className="mx-auto mt-6 max-w-xl font-body leading-relaxed text-sand-muted">{t('cta.body')}</p>
          <Link href="/booking" className="btn-gold mt-10">
            {t('cta.button')}
          </Link>
        </Reveal>
      </section>
    </>
  );
}

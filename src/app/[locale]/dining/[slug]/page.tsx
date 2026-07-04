import Image from 'next/image';
import Grain from '@/components/Grain';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Reveal from '@/components/Reveal';
import { VENUES, getVenue } from '@/lib/content';
import { routing } from '@/i18n/routing';
import { lummi } from '@/lib/images';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    VENUES.map((v) => ({ locale, slug: v.id }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const vt = await getTranslations({ locale, namespace: 'venues' });
  const venue = getVenue(slug);
  if (!venue) return {};
  return { title: vt(`${slug}.name`) };
}

export default async function VenuePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const venue = getVenue(slug);
  if (!venue) notFound();

  const vt = await getTranslations('venues');
  const t = await getTranslations('dining');
  const common = await getTranslations('common');

  return (
    <>
      <section data-theme="dark" className="relative flex h-[70vh] min-h-[460px] items-end overflow-hidden">
        <Image src={lummi(venue.image, 2000)} alt="" fill priority className="animate-slow-zoom object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
        <Grain />
        <div className="container-x relative pb-16">
          <p className="eyebrow">{vt(`${slug}.kind`)}</p>
          <h1 className="mt-4 font-display text-5xl md:text-7xl">{vt(`${slug}.name`)}</h1>
          <p className="mt-4 max-w-xl font-body italic text-foam">{vt(`${slug}.tagline`)}</p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_320px]">
          <Reveal>
            <p className="font-body text-lg leading-relaxed text-sand">{vt(`${slug}.summary`)}</p>
            <p className="mt-6 font-body leading-relaxed text-sand-muted">{vt(`${slug}.description`)}</p>

            <div className="mt-12">
              <p className="eyebrow">{t('signatureLabel')}</p>
              <ul className="mt-6 divide-y divide-line/10 border-y border-line/10">
                {[0, 1, 2, 3].map((n) => (
                  <li key={n} className="flex items-baseline justify-between gap-6 py-4">
                    <span className="font-display text-xl text-sand">{vt(`${slug}.menu.${n}.name`)}</span>
                    <span className="flex-1 border-b border-dotted border-line/15" />
                    <span className="font-body text-sm text-gold">{vt(`${slug}.menu.${n}.price`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <aside className="h-fit border border-line/10 bg-ink-800 p-7 lg:sticky lg:top-28">
            <Detail label={t('detail.hours')} value={vt(`${slug}.hours`)} />
            <Detail label={t('detail.cuisine')} value={vt(`${slug}.cuisineType`)} />
            <Detail label={t('detail.dress')} value={vt(`${slug}.dress`)} />
            <Link href="/booking" className="btn-gold mt-6 w-full">{common('reserve')}</Link>
          </aside>
        </div>

        <div className="container-x mt-16">
          <Link href="/dining" className="font-body text-[12px] uppercase tracking-[0.2em] text-sand-muted hover:text-gold">
            ← {t('title')}
          </Link>
        </div>
      </section>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-line/10 py-4 first:pt-0 last:border-0">
      <span className="block font-body text-[11px] uppercase tracking-[0.18em] text-sand-muted">{label}</span>
      <span className="mt-1 block font-body text-sand">{value}</span>
    </div>
  );
}

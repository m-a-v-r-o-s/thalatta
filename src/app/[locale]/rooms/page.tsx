import Image from 'next/image';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import { ROOMS } from '@/lib/content';
import { IMG, lummi } from '@/lib/images';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'rooms' });
  return { title: t('title') };
}

export default async function RoomsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('rooms');
  const rt = await getTranslations('roomsList');
  const common = await getTranslations('common');

  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} image={lummi(IMG.rooms.junior, 1600)} />

      <section className="py-20 md:py-28">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="font-body leading-relaxed text-sand-muted">{t('intro')}</p>
          </Reveal>

          <div className="mt-20 space-y-24">
            {ROOMS.map((r, i) => (
              <Reveal key={r.id}>
                <article className={`grid items-center gap-10 lg:grid-cols-2 ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={lummi(r.image, 1200)} alt={rt(`${r.id}.name`)} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="eyebrow">{rt(`${r.id}.kind`)}</p>
                    <h2 className="horizon mt-4 font-display text-4xl md:text-5xl">{rt(`${r.id}.name`)}</h2>
                    <p className="mt-7 font-body leading-relaxed text-sand-muted">{rt(`${r.id}.desc`)}</p>

                    <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3 border-t border-line/10 pt-6 font-body text-sm">
                      <Spec label={t('spec.size')} value={`${r.sizeSqm} m²`} />
                      <Spec label={t('spec.guests')} value={String(r.guests)} />
                      <Spec label={t('spec.view')} value={rt(`${r.id}.view`)} />
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-6">
                      <p className="font-display text-3xl text-gold">
                        €{r.price} <span className="font-body text-sm text-sand-muted">{common('perNight')}</span>
                      </p>
                      <Link href="/booking" className="btn-gold">{common('reserve')}</Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block font-body text-[11px] uppercase tracking-[0.18em] text-sand-muted">{label}</span>
      <span className="mt-1 block font-display text-lg text-sand">{value}</span>
    </div>
  );
}

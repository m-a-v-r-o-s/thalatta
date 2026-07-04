import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import ContactForm from '@/components/ContactForm';
import { HOTEL } from '@/lib/content';
import { IMG, lummi } from '@/lib/images';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return { title: t('title') };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  const bbox = [HOTEL.lng - 0.02, HOTEL.lat - 0.012, HOTEL.lng + 0.02, HOTEL.lat + 0.012].join('%2C');
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${HOTEL.lat}%2C${HOTEL.lng}`;

  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} image={lummi(IMG.gallery[1], 1600)} />

      <section className="py-20 md:py-28">
        <div className="container-x grid gap-16 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">{t('reachUs')}</p>
            <h2 className="horizon mt-4 font-display text-4xl md:text-5xl">{t('subtitle')}</h2>
            <p className="mt-7 font-body leading-relaxed text-sand-muted">{t('intro')}</p>

            <dl className="mt-10 space-y-6">
              <div>
                <dt className="font-body text-[11px] uppercase tracking-[0.2em] text-sand-muted">{t('address')}</dt>
                <dd className="mt-2 font-body text-sand">
                  {HOTEL.street}, {HOTEL.area}
                  <br />
                  {HOTEL.region}
                </dd>
              </div>
              <div>
                <dt className="font-body text-[11px] uppercase tracking-[0.2em] text-sand-muted">{t('phone')}</dt>
                <dd className="mt-2 font-body">
                  <a href={`tel:${HOTEL.phone.replace(/\s/g, '')}`} className="text-sand hover:text-gold">{HOTEL.phone}</a>
                </dd>
              </div>
              <div>
                <dt className="font-body text-[11px] uppercase tracking-[0.2em] text-sand-muted">{t('email')}</dt>
                <dd className="mt-2 font-body">
                  <a href={`mailto:${HOTEL.email}`} className="text-sand hover:text-gold">{HOTEL.email}</a>
                </dd>
              </div>
            </dl>

            <div className="mt-10 aspect-[16/10] w-full overflow-hidden border border-line/10">
              <iframe
                title="Map"
                src={mapSrc}
                className="h-full w-full opacity-90"
                loading="lazy"
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="border border-line/10 bg-ink-800 p-8 md:p-10">
              <p className="eyebrow">{t('form.eyebrow')}</p>
              <h3 className="mt-4 font-display text-3xl">{t('form.title')}</h3>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

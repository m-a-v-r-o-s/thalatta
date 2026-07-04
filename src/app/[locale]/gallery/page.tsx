import Image from 'next/image';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import { IMG, lummi } from '@/lib/images';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'gallery' });
  return { title: t('title') };
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('gallery');

  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} image={lummi(IMG.gallery[0], 1600)} />

      <section className="py-20 md:py-28">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="font-body leading-relaxed text-sand-muted">{t('intro')}</p>
          </Reveal>

          <div className="mt-16 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {IMG.gallery.slice(1).map((hash, i) => (
              <Reveal key={hash} delay={(i % 3) * 80} className="block break-inside-avoid">
                <div className="relative w-full overflow-hidden">
                  <Image
                    src={lummi(hash, 900)}
                    alt=""
                    width={900}
                    height={i % 3 === 1 ? 1200 : i % 2 === 0 ? 700 : 900}
                    className="h-auto w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

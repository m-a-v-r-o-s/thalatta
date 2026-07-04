import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Reveal from '@/components/Reveal';
import DiagonalScript from '@/components/DiagonalScript';
import Grain from '@/components/Grain';
import { IMG, lummi } from '@/lib/images';
import { ROOMS, RESTAURANTS, BARS, HOTEL } from '@/lib/content';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const nav = await getTranslations('nav');
  const common = await getTranslations('common');
  const rt = await getTranslations('roomsList');
  const vt = await getTranslations('venues');

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section data-theme="dark" className="relative flex h-screen min-h-[640px] items-center overflow-hidden">
        {/* Two photos crossfade with the page theme: pool by day, night sky after dark. */}
        <Image src={lummi(IMG.heroLight, 2000)} alt="" fill priority className="theme-img theme-img--light animate-slow-zoom object-cover" />
        <Image src={lummi(IMG.heroDark, 2000)} alt="" fill priority className="theme-img theme-img--dark animate-slow-zoom object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/45 to-ink" />
        <Grain />
        <div className="container-x relative flex flex-col items-center text-center">
          <p className="reveal is-visible font-script text-3xl font-semibold text-sand sm:text-4xl">
            Thalatta<span className="text-gold"> Bay</span>
          </p>
          <h1 className="hero-title reveal is-visible mt-3 font-script leading-[1.2] text-[clamp(1.9rem,7vw,5.5rem)]">
            <DiagonalScript text={t('hero.title')} angle={5} />
          </h1>
          <Image
            src="/logo-mark.png"
            alt="Thalatta Bay"
            width={410}
            height={281}
            priority
            className="reveal is-visible mt-2 h-56 w-auto sm:h-72 md:h-[26rem]"
          />
          <p className="reveal is-visible mx-auto mt-2 max-w-lg font-body text-base leading-relaxed text-sand-muted">
            {t('hero.subtitle')}
          </p>
          <div className="reveal is-visible mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/booking" className="btn-gold">
              {t('hero.cta')}
            </Link>
            <Link href="/rooms" className="btn-ghost">
              {nav('rooms')}
            </Link>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-8 flex justify-center">
          <span className="font-body text-[10px] uppercase tracking-[0.3em] text-sand-muted">
            {HOTEL.area} · {HOTEL.region}
          </span>
        </div>
      </section>

      {/* ---------- Welcome ---------- */}
      <section className="py-24 md:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">{t('welcome.eyebrow')}</p>
            <h2 className="horizon mt-5 font-display text-4xl leading-tight md:text-5xl">
              {t('welcome.title')}
            </h2>
            <p className="mt-8 font-body leading-relaxed text-sand-muted">{t('welcome.body1')}</p>
            <p className="mt-4 font-body leading-relaxed text-sand-muted">{t('welcome.body2')}</p>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-line/10 pt-8">
              {(['suites', 'dining', 'shoreline'] as const).map((k) => (
                <div key={k}>
                  <p className="font-display text-3xl text-gold md:text-4xl">{t(`welcome.stats.${k}.value`)}</p>
                  <p className="mt-1 font-body text-[11px] uppercase tracking-[0.18em] text-sand-muted">
                    {t(`welcome.stats.${k}.label`)}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image src={lummi(IMG.intro, 1200)} alt="" fill className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Rooms ---------- */}
      <section className="bg-ink-900 py-24 md:py-32">
        <div className="container-x">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">{t('rooms.eyebrow')}</p>
              <h2 className="mt-4 font-display text-4xl md:text-5xl">{t('rooms.title')}</h2>
            </div>
            <Link href="/rooms" className="font-body text-[12px] uppercase tracking-[0.2em] text-gold hover:text-gold-light">
              {common('viewAll')} →
            </Link>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {ROOMS.slice(0, 3).map((r, i) => (
              <Reveal key={r.id} delay={i * 100}>
                <Link href="/rooms" className="group block">
                  <div data-theme="dark" className="relative aspect-[3/4] overflow-hidden">
                    <Image src={lummi(r.image, 800)} alt={rt(`${r.id}.name`)} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent opacity-70" />
                  </div>
                  <div className="mt-5">
                    <h3 className="font-display text-2xl">{rt(`${r.id}.name`)}</h3>
                    <p className="mt-2 font-body text-sm text-sand-muted">
                      <span className="text-gold">€{r.price}</span> {t('rooms.perNight')} · {r.sizeSqm} m²
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Dining ---------- */}
      <section className="py-24 md:py-32">
        <div className="container-x">
          <Reveal className="max-w-xl">
            <p className="eyebrow">{t('dining.eyebrow')}</p>
            <h2 className="horizon mt-4 font-display text-4xl md:text-5xl">{t('dining.title')}</h2>
            <p className="mt-6 font-body leading-relaxed text-sand-muted">{t('dining.body')}</p>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {RESTAURANTS.map((v, i) => (
              <Reveal key={v.id} delay={i * 90}>
                <Link href={`/dining/${v.id}`} className="group block">
                  <div className="relative aspect-square overflow-hidden">
                    <Image src={lummi(v.image, 800)} alt={vt(`${v.id}.name`)} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <p className="mt-4 font-body text-[11px] uppercase tracking-[0.2em] text-gold">{vt(`${v.id}.kind`)}</p>
                  <h3 className="mt-1 font-display text-2xl">{vt(`${v.id}.name`)}</h3>
                  <p className="mt-1 font-body text-sm text-sand-muted">{vt(`${v.id}.tagline`)}</p>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {BARS.map((v, i) => (
              <Reveal key={v.id} delay={i * 90}>
                <Link href={`/dining/${v.id}`} className="group flex items-center gap-6 border border-line/10 p-4 transition-colors hover:border-gold/40">
                  <div className="relative h-24 w-28 flex-none overflow-hidden">
                    <Image src={lummi(v.image, 500)} alt={vt(`${v.id}.name`)} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div>
                    <p className="font-body text-[11px] uppercase tracking-[0.2em] text-gold">{vt(`${v.id}.kind`)}</p>
                    <h3 className="mt-1 font-display text-2xl">{vt(`${v.id}.name`)}</h3>
                    <p className="mt-1 font-body text-sm text-sand-muted">{vt(`${v.id}.tagline`)}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Spa band ---------- */}
      <section data-theme="dark" className="relative overflow-hidden py-32">
        <Image src={lummi(IMG.spa.outdoor, 1600)} alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-ink/75" />
        <div className="container-x relative">
          <Reveal className="max-w-xl">
            <p className="eyebrow">{t('spa.eyebrow')}</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">{t('spa.title')}</h2>
            <p className="mt-6 font-body leading-relaxed text-sand-muted">{t('spa.body')}</p>
            <Link href="/spa" className="btn-ghost mt-8">{nav('spa')}</Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="py-24 text-center md:py-32">
        <Reveal className="container-x">
          <p className="eyebrow">{t('cta.eyebrow')}</p>
          <h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl leading-tight md:text-6xl">
            {t('cta.title')}
          </h2>
          <Link href="/booking" className="btn-gold mt-10">{t('hero.cta')}</Link>
        </Reveal>
      </section>
    </>
  );
}

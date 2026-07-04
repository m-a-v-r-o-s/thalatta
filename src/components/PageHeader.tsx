import Image from 'next/image';
import Grain from './Grain';

export default function PageHeader({
  eyebrow,
  title,
  image,
}: {
  eyebrow: string;
  title: string;
  image: string;
}) {
  return (
    <section data-theme="dark" className="relative flex h-[62vh] min-h-[420px] items-end overflow-hidden">
      <Image src={image} alt="" fill priority className="animate-slow-zoom object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
      <Grain />
      <div className="container-x relative pb-16">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] md:text-7xl">
          {title}
        </h1>
      </div>
    </section>
  );
}

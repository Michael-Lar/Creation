'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/sections/Footer';

const divisions = [
  {
    label: 'Investment',
    name: 'Creation Equities',
    image: '/images/webp/equities.webp',
    imagePosition: 'center 40%',
    body: [
      'We selectively invest in real estate opportunities across Los Angeles, with a focus on properties located along dynamic urban corridors and within evolving neighborhoods. We seek opportunities where thoughtful ownership, repositioning, and long-term stewardship can unlock meaningful value.',
      'We often partner with investors and operators who share a long-term perspective on placemaking and neighborhood vitality.',
    ],
  },
  {
    label: 'Advisory',
    name: 'Creation Realty Corporation',
    image: '/images/webp/realty.webp',
    imagePosition: 'center 45%',
    body: [
      'We provide strategic advisory services to property owners, investors, and institutions across acquisitions, dispositions, and asset positioning. Drawing on deep local knowledge and transactional experience, we work closely with clients to navigate complex real estate decisions and identify opportunities that align with long-term objectives.',
      'Many advisory engagements evolve from long-standing relationships and a shared focus on thoughtful stewardship of real estate assets.',
    ],
  },
  {
    label: 'Asset Management',
    name: 'Creation Asset Management',
    image: '/images/webp/asset-management.webp',
    imagePosition: 'center 50%',
    body: [
      'We work with owners and partners to maximize the long-term performance of real estate assets through thoughtful leasing strategy, tenant curation, and operational oversight.',
      'Particular emphasis is placed on properties located along street-oriented retail corridors, where tenant mix and placemaking play a critical role in shaping the character and success of a neighborhood.',
    ],
  },
];

export default function DivisionsDetail() {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/?back=divisions', { scroll: false });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)' }}>
      <Header forceScrolledStyle={true} scrolledBlurClass="backdrop-blur-sm" />

      <div className="pt-[96px] sm:pt-[104px] lg:pt-[112px]">

        {/* ── Page intro ── */}
        <div className="container-content pt-8 pb-12 sm:pt-10 sm:pb-14 md:pt-12 md:pb-16">
          {/* Back button */}
          <div className="mb-10 sm:mb-12">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-ink-500 hover:text-ink-800 transition-all-standard group"
            >
              <svg
                className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span className="text-[0.65rem] sm:text-caption tracking-wide uppercase font-light">
                Back to Home
              </span>
            </button>
          </div>

          {/* Label + intro */}
          <div className="section-label mb-8 md:mb-10">
            <div className="section-label-line" />
            <span className="section-label-text">Divisions</span>
          </div>

          <p className="text-[clamp(1.5rem,3.5vw,2.5rem)] font-serif font-light text-ink-700 leading-[1.2] max-w-3xl">
            Creation Partners participates in real estate through investment, strategic advisory, and asset management across Los Angeles.
          </p>
        </div>

        {/* ── Divisions ── */}
        {divisions.map((division, index) => (
          <div key={division.label}>
            <div className="divider-bronze" aria-hidden="true" />

            <div className="container-content py-14 sm:py-16 md:py-20 lg:py-24">
              <div className="grid md:grid-cols-12 gap-8 md:gap-10 lg:gap-16 items-start">

                {/* Text — 7 columns, text-first on mobile */}
                <div className="md:col-span-7 order-2 md:order-1">

                  {/* Navigator: index + label */}
                  <div className="flex items-center gap-3 mb-6 md:mb-8">
                    <span className="text-[0.6rem] text-ink-300 font-light tracking-[0.25em] tabular-nums select-none" aria-hidden="true">
                      0{index + 1}
                    </span>
                    <span className="w-8 h-px bg-accent/50" aria-hidden="true" />
                    <span className="text-[0.75rem] sm:text-[0.8rem] text-ink-400 tracking-luxury uppercase font-medium">
                      {division.label}
                    </span>
                  </div>

                  {/* Name — the visual anchor of each section */}
                  <h2 className="text-[clamp(2.25rem,5.5vw,3.75rem)] font-serif text-accent leading-[1.08] tracking-tight mb-8 md:mb-10">
                    {division.name}
                  </h2>

                  {/* Body — left accent line from project detail pattern */}
                  <div className="relative pl-5 sm:pl-6 space-y-4 sm:space-y-5">
                    <div
                      className="absolute left-0 top-0 bottom-0 w-px"
                      style={{
                        background: 'linear-gradient(to bottom, var(--color-accent) 0%, var(--color-accent) 50%, transparent 100%)',
                      }}
                      aria-hidden="true"
                    />
                    {division.body.map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="text-[1.05rem] sm:text-lg text-ink-600 font-light leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                </div>

                {/* Image — 5 columns, image-first on mobile for visual entry */}
                <div className="md:col-span-5 md:col-start-8 order-1 md:order-2">
                  <div className="relative aspect-[4/3] md:aspect-[3/4] overflow-hidden bg-ink-50 border border-ink-100/40 shadow-premium rounded-2xl">
                    <Image
                      src={division.image}
                      alt={division.name}
                      fill
                      className="object-cover"
                      style={{ objectPosition: division.imagePosition }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority={index === 0}
                    />
                    {/* Faint gradient — just enough to separate image from cream bg */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900/10 to-transparent pointer-events-none" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}

        {/* ── Bottom nav ── */}
        <div className="divider-bronze" aria-hidden="true" />
        <div className="container-content py-10 sm:py-12">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-3 text-ink-700 hover:text-ink-900 transition-all-standard group"
          >
            <span className="text-caption tracking-wide uppercase font-light">Back to Home</span>
            <div className="flex items-center gap-2">
              <span className="w-8 h-px bg-ink-300 group-hover:w-12 group-hover:bg-accent transition-all-standard" />
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </button>
        </div>

        <div className="divider-bronze" aria-hidden="true" />
        <Footer />
      </div>
    </div>
  );
}

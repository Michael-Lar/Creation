import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Yoav Sarraf | Creation Partners',
  description:
    'Yoav Sarraf is the Founder and CEO of Creation Partners, a Los Angeles-based commercial real estate investment, advisory, and management platform. Over 15 years of experience and $1B+ in completed transactions.',
  openGraph: {
    title: 'Yoav Sarraf | Creation Partners',
    description:
      'Yoav Sarraf is the Founder and CEO of Creation Partners, a Los Angeles-based commercial real estate investment, advisory, and management platform. Over 15 years of experience and $1B+ in completed transactions.',
    url: '/yoav-sarraf',
    images: [{ url: '/team/yoav-sarraf.webp', width: 400, height: 500 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yoav Sarraf | Creation Partners',
    description:
      'Yoav Sarraf is the Founder and CEO of Creation Partners, a Los Angeles-based commercial real estate investment, advisory, and management platform.',
  },
  alternates: {
    canonical: '/yoav-sarraf',
  },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Yoav Sarraf',
  jobTitle: 'Founder & CEO',
  url: 'https://creation-partners.com/yoav-sarraf',
  image: 'https://creation-partners.com/team/yoav-sarraf.webp',
  email: 'ys@creation-partners.com',
  sameAs: ['https://www.linkedin.com/in/yoavsarraf/'],
  worksFor: {
    '@type': 'Organization',
    name: 'Creation Partners',
    url: 'https://creation-partners.com',
  },
  description:
    'Yoav Sarraf is the Founder and CEO of Creation Partners, a commercial real estate investment, advisory, and management platform. With over 15 years of experience and involvement in over $1 billion in real estate transactions.',
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'University of California, Los Angeles',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Los Angeles',
    addressRegion: 'CA',
    addressCountry: 'US',
  },
};

const bio = `Yoav Sarraf is the Founder and CEO of Creation Partners, a commercial real estate investment, advisory, and management platform focused on creative dealmaking, entrepreneurial execution, and long-term ownership.

Prior to founding Creation Partners, Yoav spent over 15 years at Concord Companies, where he served as a Managing Partner and senior leader across both advisory and principal investment activities. During his tenure, he mentored numerous professionals and helped guide transactional strategy and platform growth across retail, multifamily, creative office, mixed-use, and development-oriented assets.

Yoav was also instrumental in helping build and scale Concord Capital Partners, the firm's investment arm, overseeing the acquisition of more than 1,200 apartment units along with investments across additional asset classes. Earlier in his career, he began at Brighton Holdings, where he was first exposed to principal-driven investing, underwriting, and asset-level decision making. Over the course of his career, Yoav has been involved in over $1 billion in completed and advised real estate transactions.

In parallel with his real estate work, Yoav is actively involved as an investor, advisor, and operator in technology, media, and other ventures connected to the built environment. He is a graduate of the University of California, Los Angeles.

Yoav is deeply engaged in philanthropic and community leadership. He currently serves as Chair of the House & Grounds Committee at Sinai Temple, is actively involved with Sinai Akiba Academy, and previously served as Real Estate Chair for the Young Adults division of the Jewish Federation of Greater Los Angeles. He lives in Los Angeles with his wife and children.`;

export default function YoavSarrafPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <main className="min-h-screen bg-cream">
        {/* Back link bar */}
        <div className="border-b border-accent/20 bg-cream/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <a
              href="https://creation-partners.com"
              className="inline-flex items-center gap-2 text-sm text-ink-400 hover:text-accent transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Creation Partners
            </a>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row lg:min-h-[calc(100vh-53px)]">

          {/* LEFT: Photo panel */}
          <div className="relative w-full lg:w-[42%] xl:w-[40%] flex-shrink-0 bg-cream border-b lg:border-b-0 lg:border-r border-accent/30 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 overflow-hidden max-h-[45dvh] lg:max-h-none lg:sticky lg:top-0 lg:h-screen">
            {/* Dot pattern */}
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-accent) 1px, transparent 0)`,
                backgroundSize: '40px 40px',
              }}
              aria-hidden="true"
            />
            <div className="w-full max-h-full flex items-center justify-center relative z-10">
              <div className="relative w-full aspect-[4/5] max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] bg-white rounded-sm border border-accent/30 shadow-premium overflow-hidden">
                <Image
                  src="/team/yoav-sarraf.webp"
                  alt="Yoav Sarraf - Founder & CEO of Creation Partners"
                  fill
                  priority
                  className="object-contain object-bottom"
                  sizes="(max-width: 1024px) 100vw, 400px"
                  style={{
                    filter: 'grayscale(100%) contrast(1.15)',
                    WebkitFilter: 'grayscale(100%) contrast(1.15)',
                  }}
                />
                {/* Bronze corner accents on photo */}
                <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-accent/50" aria-hidden="true" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-accent/50" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* RIGHT: Content */}
          <div className="flex-1 relative">
            {/* Background pattern */}
            <div
              className="absolute inset-0 opacity-[0.015] pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(90deg, transparent 0%, var(--color-accent) 50%, transparent 100%), radial-gradient(circle at 1px 1px, var(--color-accent) 1px, transparent 0)`,
                backgroundSize: '100% 1px, 30px 30px',
                backgroundPosition: '0 0, 0 0',
              }}
              aria-hidden="true"
            />

            {/* Bronze corner accents */}
            <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-accent/50" aria-hidden="true" />
            <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-accent/50" aria-hidden="true" />

            <div className="relative z-10 p-5 sm:p-8 md:p-10 lg:p-12 xl:p-14">
              {/* Name and Title */}
              <div className="mb-5 sm:mb-8 md:mb-10">
                <h1 className="text-[clamp(1.5rem,5vw,2.75rem)] font-playfair text-ink-800 mb-2 sm:mb-3 leading-tight">
                  Yoav Sarraf
                </h1>
                <p className="text-xs sm:text-sm md:text-base uppercase tracking-[0.12em] text-ink-500 font-light">
                  Founder & CEO
                </p>
              </div>

              {/* Bronze divider */}
              <div className="w-20 sm:w-24 h-0.5 bg-gradient-to-r from-transparent via-accent/80 to-transparent mb-5 sm:mb-8 md:mb-10" aria-hidden="true" />

              {/* Bio */}
              <div className="mb-6 sm:mb-10 md:mb-12">
                {bio.split('\n\n').map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="text-sm sm:text-base md:text-lg text-ink-700 font-light leading-[1.75] sm:leading-[1.8] mb-4 sm:mb-6 last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* LinkedIn */}
              <div className="pt-6 border-t border-accent/30">
                <a
                  href="https://www.linkedin.com/in/yoavsarraf/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-base text-ink-600 hover:text-accent transition-colors group/link"
                >
                  <span className="w-7 h-7 flex items-center justify-center flex-shrink-0 bg-ink-100/40 border border-ink-100/60 rounded-sm group-hover/link:bg-accent/10 group-hover/link:border-accent/40 transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </span>
                  <span className="group-hover/link:underline font-medium">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

'use client';

import Image from 'next/image';
import { Division } from '@/types/models';
import ImageSkeleton from '@/components/ImageSkeleton';
import { useImageLoading } from '@/hooks/useImageLoading';

const divisions: Division[] = [
  {
    name: 'Creation Realty Corporation',
    description: 'Full-service brokerage and advisory.',
    image: '/images/webp/realty.webp',
    imagePosition: 'center 45%',
    imageScale: 'scale-[1.03]',
    blurDataURL: 'data:image/webp;base64,UklGRo4AAABXRUJQVlA4IIIAAADQBACdASoUABsAP3GowFi0raYjsBgMApAuCWYAxnwQN7ztLagyRBZ4Ahc13GMAAAD+jO/1PzjW6p+CHHDw7mcF8SIcU2Z/nQiOBFckKtd3is3RnND/K7BMtdLiHT43e2tkx6wN1r0StNu36537VWH3db74VYiNluwHbWx9V6WK44AA',
  },
  {
    name: 'Creation Equities',
    description: 'Equity partnerships across asset classes.',
    image: '/images/webp/equities.webp',
    imagePosition: 'center 40%',
    imageScale: 'scale-[1.03]',
    blurDataURL: 'data:image/webp;base64,UklGRpgAAABXRUJQVlA4IIwAAADQBACdASoUABsAP3Gsyl20rSgkqAqqkC4JbADCkf/gG6HZTxqLMSQc/nw5rfEtMAD6MUhCovEpKZzMl6qDvQ+lt+gksyWNwz4s8YMcQiiDwQKWSJhzao5quipjWdN4hVdhbWFJLM0RcO8XsXW25EzMsf37LEjWJvyNPOF6/UaWWXb63SxwZ5xR0kAAAA==',
  },
  {
    name: 'Creation Asset Management',
    description: 'Operations and value optimization.',
    image: '/images/webp/asset-management.webp',
    imagePosition: 'center 50%',
    imageScale: 'scale-[1.03]',
    blurDataURL: 'data:image/webp;base64,UklGRowAAABXRUJQVlA4IIAAAACwBACdASoUAB4AP3Gkx1i0rCgjsAgCkC4JQBdgBDoYcJ7PWW5dW3vsti0PDgwAAP3MlPmm0eZSir8zUReE69Pk2Lp4tW1WxqOa/ETREyOIqciRUAJ5MGuaT9JG6VIe3zXStAyWu3oUIWFG8jcYgjaH2vhOWzqevrhtQyqZ+ngAAA==',
  },
];

export default function Divisions() {
  const { loadingImages, handleImageLoad } = useImageLoading(
    divisions.map((_, i) => i)
  );

  return (
    <section 
      id="divisions" 
      className="section-spacing-sm pb-3 md:pb-4 lg:pb-5 relative bg-texture-paper"
      style={{ backgroundColor: 'var(--color-cream)' }}
    >
      {/* Section top divider - with spacing from content */}
      <div className="absolute top-0 left-0 right-0 divider-bronze" aria-hidden="true" />
      
      <div className="container-main pt-2 md:pt-4">
        {/* Section Label */}
        <div className="section-label mb-4 md:mb-5 lg:mb-6">
          <div className="section-label-line" />
          <span className="section-label-text">Divisions</span>
        </div>

        {/* Divisions Grid - Image Card Layout */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 max-w-7xl mx-auto md:justify-items-center lg:justify-items-stretch"
        >
          {divisions.map((division, index) => {
            const isLoading = loadingImages.has(index);
            
            return (
            <article
              key={index}
              className="group relative aspect-[3/5] sm:aspect-[3/4] rounded-2xl overflow-hidden border border-ink-100/40 bg-white/50 shadow-premium transition-all duration-slow hover:shadow-premium-hover hover:border-accent/30 hover:z-10 w-full max-w-md md:max-w-none"
            >
              {/* Loading Skeleton */}
              {isLoading && (
                <ImageSkeleton 
                  className="absolute inset-0 rounded-2xl z-[1]"
                  aspectRatio=""
                  showShimmer={true}
                />
              )}
              
              {/* Background Image */}
              <Image
                src={division.image}
                alt={`${division.name} division - ${division.description}`}
                fill
                className={`object-cover transition-opacity duration-500 ${
                  isLoading ? 'opacity-0' : 'opacity-100'
                } ${division.imageScale ?? ''}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
                placeholder={division.blurDataURL ? 'blur' : 'empty'}
                blurDataURL={division.blurDataURL}
                style={
                  division.imagePosition
                    ? { objectPosition: division.imagePosition }
                    : undefined
                }
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageLoad(index)}
              />

              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              {/* Subtle vignette to anchor titles */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.35),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(0,0,0,0.35),transparent_60%)] opacity-90" />

              {/* Text Content at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 lg:p-8 z-10 transition-transform duration-slow group-hover:translate-y-[-8px]">
                <h3 className="text-[clamp(1.5rem,4vw,2rem)] sm:text-2xl md:text-3xl lg:text-2xl font-serif text-white text-shadow-subtle mb-1.5 sm:mb-2 leading-tight transition-all duration-slow group-hover:text-accent group-hover:scale-[1.02] origin-bottom-left">
                  {division.name}
                </h3>
                <p className="text-[clamp(1rem,2.5vw,1.125rem)] sm:text-base md:text-lg lg:text-base text-white/80 font-light leading-relaxed transition-all duration-slow group-hover:text-white">
                  {division.description}
                </p>
              </div>

              {/* Hover effect - stronger glow */}
              <div className="absolute inset-0 bg-accent/15 opacity-0 group-hover:opacity-100 transition-opacity duration-slow z-[5]" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-slow z-[6]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-slow z-[5]" />
              {/* Inner bronze stroke */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl border-[5px] border-accent/70 transition-[border-color,box-shadow] duration-slow group-hover:border-accent/90 group-hover:shadow-[0_0_0_2px_rgba(184,160,104,0.25)] z-[7]" />
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

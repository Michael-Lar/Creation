'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Division } from '@/types/models';
import ImageSkeleton from '@/components/ImageSkeleton';

const divisions: Division[] = [
  {
    name: 'Creation Realty Corporation',
    description: 'Full-service brokerage and advisory.',
    image: '/images/webp/realty.webp',
    icon: '🏛️',
  },
  {
    name: 'Creation Equities',
    description: 'Equity partnerships across asset classes.',
    image: '/images/webp/equities.webp',
    icon: '📊',
  },
  {
    name: 'Creation Asset Management',
    description: 'Operations and value optimization.',
    image: '/images/webp/asset-management.webp',
    icon: '🔑',
  },
];

export default function Divisions() {
  const sectionRef = useRef<HTMLElement>(null);
  const [loadingImages, setLoadingImages] = useState<Set<number>>(new Set(divisions.map((_, i) => i)));

  return (
    <section 
      ref={sectionRef} 
      id="divisions" 
      className="section-spacing relative bg-texture-paper"
      style={{ backgroundColor: 'var(--color-cream)' }}
    >
      {/* Section top divider - with spacing from content */}
      <div className="absolute top-0 left-0 right-0 divider-bronze" aria-hidden="true" />
      
      <div className="container-main pt-2 md:pt-4">
        {/* Section Label */}
        <div className="section-label mb-6 md:mb-8 lg:mb-10">
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
              className="group relative aspect-[3/5] sm:aspect-[3/4] rounded-2xl overflow-hidden transition-all transition-slow hover:scale-[1.05] hover:shadow-2xl hover:z-10 w-full max-w-md md:max-w-none"
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
                }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={index < 2}
                onLoad={() => {
                  setLoadingImages(prev => {
                    const next = new Set(prev);
                    next.delete(index);
                    return next;
                  });
                }}
                onError={() => {
                  setLoadingImages(prev => {
                    const next = new Set(prev);
                    next.delete(index);
                    return next;
                  });
                }}
              />

              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Icon in top-left */}
              <div className="absolute top-4 sm:top-5 md:top-6 left-4 sm:left-5 md:left-6 z-10">
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center text-white/90 text-xl sm:text-2xl">
                  {division.icon}
                </div>
              </div>

              {/* Text Content at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 lg:p-8 z-10 transition-transform transition-slow group-hover:translate-y-[-8px]">
                <h3 className="text-[clamp(1.5rem,4vw,2rem)] sm:text-2xl md:text-3xl lg:text-2xl font-serif text-white mb-1.5 sm:mb-2 leading-tight transition-all transition-slow group-hover:text-accent group-hover:scale-105 origin-bottom-left">
                  {division.name}
                </h3>
                <p className="text-[clamp(1rem,2.5vw,1.125rem)] sm:text-base md:text-lg lg:text-base text-white/80 font-light leading-relaxed transition-all transition-slow group-hover:text-white">
                  {division.description}
                </p>
              </div>

              {/* Hover effect - stronger glow */}
              <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity transition-slow z-[5]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity transition-slow z-[5]" />
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const divisions = [
  {
    name: 'Creation Capital',
    description: 'Strategic capital for real estate investments.',
    image: '/images/webp/capital.webp',
    icon: '💎',
  },
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
  const labelRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleChange);
    return () => motionQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return;

    // Check if animation has already played this session
    const hasAnimated = sessionStorage.getItem('divisionsAnimated') === 'true';

    if (hasAnimated) {
      // Skip animation - elements are already visible
      return;
    }

    const ctx = gsap.context(() => {
      // Animate section label with impact (quicker)
      gsap.from(labelRef.current, {
        opacity: 0,
        y: 30,
        scale: 0.9,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 90%',
          once: true, // Only trigger once
        },
      });

      // Animate cards with dramatic stagger and movement (quicker)
      const cards = Array.from(cardsRef.current?.children || []) as HTMLElement[];
      gsap.from(cards, {
        opacity: 0,
        y: 80,
        scale: 0.85,
        rotateY: -15,
        duration: 0.8,
        ease: 'power4.out',
        stagger: {
          amount: 0.3,
          from: 'start',
        },
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 85%',
          once: true, // Only trigger once
        },
        onComplete: () => {
          // Mark animation as complete in sessionStorage
          sessionStorage.setItem('divisionsAnimated', 'true');
          cards.forEach((card) => {
            gsap.set(card, { clearProps: 'all' });
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

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
        <div ref={labelRef} className="section-label mb-6 md:mb-8 lg:mb-10">
          <div className="section-label-line" />
          <span className="section-label-text">Divisions</span>
        </div>

        {/* Divisions Grid - Image Card Layout */}
        <div 
          ref={cardsRef} 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6"
          style={{ perspective: '1200px' }}
        >
          {divisions.map((division, index) => (
            <article
              key={index}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:z-10"
            >
              {/* Background Image */}
              <Image
                src={division.image}
                alt={division.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                priority={index < 2}
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
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 lg:p-8 z-10 transition-transform duration-500 group-hover:translate-y-[-8px]">
                <h3 className="text-lg sm:text-xl md:text-2xl font-serif text-white mb-1.5 sm:mb-2 leading-tight transition-all duration-500 group-hover:text-accent group-hover:scale-105 origin-bottom-left">
                  {division.name}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-white/80 font-light leading-relaxed transition-all duration-500 group-hover:text-white">
                  {division.description}
                </p>
              </div>

              {/* Hover effect - stronger glow */}
              <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-[5]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-[5]" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

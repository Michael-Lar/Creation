'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const divisions = [
  {
    name: 'Creation Capital',
    description: 'Strategic capital solutions for real estate investments and development projects.',
    tagline: 'Investment & Capital',
  },
  {
    name: 'Creation Realty Corporation',
    description: 'Full-service real estate brokerage, advisory, and transaction management.',
    tagline: 'Brokerage & Advisory',
  },
  {
    name: 'Creation Equities',
    description: 'Equity investment and partnership opportunities across asset classes.',
    tagline: 'Equity & Partnerships',
  },
  {
    name: 'Creation Asset Management',
    description: 'Comprehensive asset management, operations, and value optimization.',
    tagline: 'Operations & Management',
  },
];

// Format number with leading zero
const formatIndex = (index: number): string => {
  return String(index + 1).padStart(2, '0');
};

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

    const ctx = gsap.context(() => {
      // Animate section label
      gsap.from(labelRef.current, {
        opacity: 0,
        y: 15,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 92%',
        },
      });

      // Animate cards with stagger
      const cards = Array.from(cardsRef.current?.children || []) as HTMLElement[];
      gsap.from(cards, {
        opacity: 0,
        y: 25,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 90%',
        },
        onComplete: () => {
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
      
      <div className="container-main pt-4 md:pt-6">
        {/* Section Label */}
        <div ref={labelRef} className="section-label mb-12 md:mb-16">
          <div className="section-label-line" />
          <span className="section-label-text">Our Divisions</span>
        </div>

        {/* Divisions Grid */}
        <div 
          ref={cardsRef} 
          className="grid md:grid-cols-2 gap-5 md:gap-7"
        >
          {divisions.map((division, index) => (
            <article
              key={index}
              className="group relative bg-white border border-ink-100 rounded-card overflow-hidden transition-all duration-400 ease-smooth hover:border-accent/30 shadow-premium hover:shadow-premium-hover"
              style={{ minHeight: '300px' }}
            >
              {/* Corner accents */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
              
              {/* Card Content */}
              <div className="relative h-full p-7 md:p-9 flex flex-col">
                {/* Top Row: Index and Tagline */}
                <div className="flex items-start justify-between mb-auto">
                  {/* Index Label with bronze accent */}
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-px bg-accent/50" aria-hidden="true" />
                    <span className="index-label text-ink-300 font-medium">
                      {formatIndex(index)}
                    </span>
                  </div>
                  
                  {/* Tagline */}
                  <span className="text-label text-ink-400 tracking-[0.1em]">
                    {division.tagline}
                  </span>
                </div>

                {/* Main Content */}
                <div className="mt-14 md:mt-16">
                  <h3 className="text-title text-ink-800 mb-4 group-hover:text-ink-900 transition-colors duration-300">
                    {division.name}
                  </h3>
                  <p className="text-body text-ink-500 font-light leading-relaxed max-w-sm">
                    {division.description}
                  </p>
                </div>

                {/* Bottom: Elegant Arrow Indicator */}
                <div className="mt-8 flex items-center">
                  <div 
                    className="flex items-center gap-3 text-ink-300 group-hover:text-accent transition-colors duration-400"
                    aria-hidden="true"
                  >
                    <span className="w-8 h-px bg-current group-hover:w-12 transition-all duration-400" />
                    <svg 
                      className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Subtle hover background effect - bronze tinted */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-accent/0 via-transparent to-accent/0 group-hover:from-accent/[0.02] group-hover:to-accent/[0.05] transition-all duration-600 pointer-events-none"
                aria-hidden="true"
              />
              
              {/* Inner glow effect on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at 50% 0%, rgba(184, 160, 104, 0.05) 0%, transparent 70%)',
                }}
                aria-hidden="true"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

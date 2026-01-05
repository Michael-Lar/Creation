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
          <span className="section-label-text">Divisions</span>
        </div>

        {/* Divisions Grid */}
        <div 
          ref={cardsRef} 
          className="grid md:grid-cols-2 gap-6 md:gap-8"
        >
          {divisions.map((division, index) => (
            <article
              key={index}
              className="group relative bg-white border border-ink-100 rounded-card overflow-hidden transition-all duration-400 ease-smooth hover:border-accent/20 shadow-premium hover:shadow-premium-hover"
            >
              {/* Card Content */}
              <div className="relative h-full p-8 md:p-10 lg:p-12 flex flex-col">
                {/* Tagline - Subtle and refined */}
                <div className="mb-6">
                  <span className="text-label text-ink-400 tracking-wide font-light">
                    {division.tagline}
                  </span>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                  <h3 className="text-title text-ink-800 mb-4 group-hover:text-ink-900 transition-colors duration-300 font-serif">
                    {division.name}
                  </h3>
                  <p className="text-body text-ink-600 font-light leading-relaxed">
                    {division.description}
                  </p>
                </div>
              </div>

              {/* Subtle hover background effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at 50% 0%, rgba(184, 160, 104, 0.03) 0%, transparent 70%)',
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

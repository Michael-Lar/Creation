'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const divisions = [
  {
    name: 'Creation Capital',
    description: 'Strategic capital solutions for real estate investments.',
  },
  {
    name: 'Creation Realty Corporation',
    description: 'Full-service real estate brokerage and advisory.',
  },
  {
    name: 'Creation Equities',
    description: 'Equity investment and partnership opportunities.',
  },
  {
    name: 'Creation Asset Management',
    description: 'Comprehensive asset management and operations.',
  },
];

export default function Divisions() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animate section label
      gsap.from(labelRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      // Animate divider
      gsap.from(dividerRef.current, {
        scaleX: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      // Animate cards with stagger and scale
      const cards = Array.from(cardsRef.current?.children || []) as HTMLElement[];
      gsap.from(cards, {
        opacity: 0,
        y: 80,
        scale: 0.9,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 75%',
        },
        onComplete: () => {
          // Ensure all cards are fully visible after animation
          cards.forEach((card) => {
            gsap.set(card, { opacity: 1, y: 0, scale: 1, clearProps: 'all' });
          });
        },
      });
      
      // Fallback: if cards are already in view, make them visible immediately
      const checkVisibility = () => {
        if (cardsRef.current) {
          const rect = cardsRef.current.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.9;
          if (isVisible) {
            cards.forEach((card) => {
              gsap.set(card, { opacity: 1, y: 0, scale: 1 });
            });
          }
        }
      };
      
      // Check on mount and after a short delay
      checkVisibility();
      setTimeout(checkVisibility, 100);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="divisions" className="py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <div ref={labelRef} className="mb-8 md:mb-10 lg:mb-12">
          <span className="text-xs md:text-sm uppercase tracking-widest text-gray-500 font-semibold">
            Divisions
          </span>
          <div ref={dividerRef} className="mt-3 w-12 h-px bg-bronze origin-left"></div>
        </div>

        {/* Divisions Grid - Responsive Cards (2x2) */}
        <div ref={cardsRef} className="grid md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {divisions.map((division, index) => (
            <div
              key={index}
              className="group relative min-h-[280px] md:min-h-[320px] lg:min-h-[360px] rounded-lg md:rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-bronze/30 border border-transparent"
              style={{ 
                opacity: 1, // Ensure cards are visible by default
                transform: 'translateY(0) scale(1)', // Ensure cards are in correct position
              }}
            >
              {/* Background Gradient - Different colors for each card */}
              <div 
                className={`absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.02] ${
                  index === 0 ? 'bg-gradient-to-br from-bronze/20 via-bronze-light/15 to-bronze-dark/20' :
                  index === 1 ? 'bg-gradient-to-br from-gray-400/30 via-gray-500/25 to-gray-600/30' :
                  index === 2 ? 'bg-gradient-to-br from-blue-400/20 via-blue-500/15 to-blue-600/20' :
                  'bg-gradient-to-br from-gray-500/25 via-gray-600/20 to-gray-700/25'
                }`}
              ></div>
              
              {/* Overlay Gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>

              {/* Logo Icon - Top Right (using cropped logo) */}
              <div className="absolute top-4 right-4 md:top-6 md:right-6 w-7 h-7 md:w-9 md:h-9 lg:w-10 lg:h-10 opacity-90">
                <img
                  src={`/logos/logo.svg?t=${Date.now()}`}
                  alt=""
                  className="w-full h-full brightness-0 invert"
                  style={{ display: 'block' }}
                />
              </div>

              {/* Content - Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 lg:p-8">
                <div className="space-y-2 md:space-y-3">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-white tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                    {division.name}
                  </h3>
                  <p className="text-sm md:text-base lg:text-lg text-white/90 font-light leading-relaxed pr-8 md:pr-12">
                    {division.description}
                  </p>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

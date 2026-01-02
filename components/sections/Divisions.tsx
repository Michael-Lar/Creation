'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

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
      gsap.from(cardsRef.current?.children || [], {
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
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="divisions" className="py-20 md:py-24 px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <div ref={labelRef} className="mb-10 md:mb-12">
          <span className="text-xs md:text-sm uppercase tracking-widest text-gray-500 font-semibold">
            Divisions
          </span>
          <div ref={dividerRef} className="mt-3 w-12 h-px bg-amber-400 origin-left"></div>
        </div>

        {/* Divisions Grid - Large Cards (2x2) */}
        <div ref={cardsRef} className="grid md:grid-cols-2 gap-6 md:gap-8">
          {divisions.map((division, index) => (
            <div
              key={index}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
            >
              {/* Background Gradient - Different colors for each card */}
              <div 
                className={`absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105 ${
                  index === 0 ? 'bg-gradient-to-br from-amber-400/20 via-amber-500/15 to-amber-600/20' :
                  index === 1 ? 'bg-gradient-to-br from-gray-400/30 via-gray-500/25 to-gray-600/30' :
                  index === 2 ? 'bg-gradient-to-br from-blue-400/20 via-blue-500/15 to-blue-600/20' :
                  'bg-gradient-to-br from-gray-500/25 via-gray-600/20 to-gray-700/25'
                }`}
              ></div>
              
              {/* Overlay Gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>

              {/* Logo Icon - Top Left (using cropped logo) */}
              <div className="absolute top-6 left-6 md:top-8 md:left-8 w-8 h-8 md:w-10 md:h-10 opacity-90">
                <img
                  src="/logos/logo.svg?v=3"
                  alt=""
                  className="w-full h-full brightness-0 invert"
                  style={{ display: 'block' }}
                />
              </div>

              {/* Content - Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-10">
                <div className="space-y-3 md:space-y-4">
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                    {division.name}
                  </h3>
                  <p className="text-base md:text-lg lg:text-xl text-white/90 font-light leading-relaxed max-w-md">
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

'use client';

import { useRef } from 'react';
import Image from 'next/image';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section 
      ref={sectionRef} 
      id="about" 
      className="relative overflow-hidden bg-luxury-gradient py-10 sm:py-12 md:py-14 lg:py-16"
      style={{ backgroundColor: 'var(--color-cream)' }}
    >
      {/* Section top divider */}
      <div className="absolute top-0 left-0 right-0 divider-bronze" aria-hidden="true" />
      
      <div className="container-main relative">
        {/* Section Label */}
        <div className="section-label mb-4 md:mb-5 lg:mb-6">
          <div className="section-label-line" />
          <span className="section-label-text">About</span>
        </div>

        {/* Main Heading with Logo */}
        <div className="grid md:grid-cols-12 gap-4 md:gap-5 lg:gap-6 items-start mb-6 md:mb-7 lg:mb-8">
          {/* Heading */}
          <div className="md:col-span-9">
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.15] text-ink-800 tracking-tight-luxury">
              Creation Partners is a Los Angeles-based commercial real estate platform focused on investment, advisory, and asset management across dynamic urban corridors and neighborhoods.
            </h2>
          </div>
          
          {/* Logo Mark */}
          <div className="hidden md:flex md:col-span-3 items-center justify-start">
            <div className="relative group">
              {/* Subtle ring around logo */}
              <div 
                className="absolute inset-0 rounded-full border border-accent/10 scale-150 opacity-0 group-hover:opacity-100 transition-all duration-700"
                aria-hidden="true"
              />
              <Image
                src="/logos/logo.svg"
                alt=""
                width={160}
                height={160}
                className="w-32 h-32 lg:w-40 lg:h-40 opacity-25 transition-all duration-500 group-hover:opacity-35 group-hover:scale-105"
                style={{ filter: 'grayscale(30%)' }}
              />
              {/* Bronze glow on hover */}
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10"
                style={{
                  background: 'radial-gradient(circle, rgba(184, 160, 104, 0.12) 0%, transparent 70%)',
                  transform: 'scale(2)',
                }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Two Column Grid */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 pb-4 md:pb-6 lg:pb-8">
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 sm:w-8 h-px bg-accent/70" aria-hidden="true" />
              <span className="text-[0.65rem] sm:text-label text-ink-400 tracking-luxury">What We Do</span>
            </div>
            <p className="text-[1.05rem] sm:text-lg md:text-body-lg text-ink-600 font-light leading-relaxed">
              The firm works with property owners, investors, institutions, and partners to identify opportunities, unlock value, and shape environments that contribute to the long-term vitality of the communities they serve.
            </p>
          </div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 sm:w-8 h-px bg-accent/70" aria-hidden="true" />
              <span className="text-[0.65rem] sm:text-label text-ink-400 tracking-luxury">How We Work</span>
            </div>
            <p className="text-[1.05rem] sm:text-lg md:text-body-lg text-ink-600 font-light leading-relaxed">
              Creation Partners participates in select projects both as investor and strategic advisor, with a particular focus on street-oriented retail, institutional partnerships, and urban redevelopment opportunities across Los Angeles.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
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

      // Animate logo
      gsap.from(logoRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 92%',
        },
      });

      // Animate heading
      gsap.from(headingRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 92%',
        },
      });

      // Animate grid columns with stagger
      gsap.from(gridRef.current?.children || [], {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.06,
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 90%',
        },
      });

      // Animate quote
      gsap.from(quoteRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: quoteRef.current,
          start: 'top 92%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section 
      ref={sectionRef} 
      id="about" 
      className="section-spacing relative overflow-hidden bg-luxury-gradient"
      style={{ backgroundColor: 'var(--color-cream)' }}
    >
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ink-100 to-transparent" aria-hidden="true" />
      
      <div className="container-content relative">
        {/* Section Label */}
        <div ref={labelRef} className="section-label mb-12 md:mb-16">
          <div className="section-label-line" />
          <span className="section-label-text">About</span>
        </div>

        {/* Main Heading with Logo */}
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start mb-16 md:mb-20">
          {/* Heading */}
          <div ref={headingRef} className="md:col-span-9">
            <h2 className="text-headline text-ink-800 tracking-tight-luxury">
              A Los Angeles-based, vertically integrated real estate investment and operating platform.
            </h2>
          </div>
          
          {/* Logo Mark */}
          <div 
            ref={logoRef}
            className="hidden md:flex md:col-span-3 items-center justify-center"
          >
            <div className="relative group">
              {/* Subtle ring around logo */}
              <div 
                className="absolute inset-0 rounded-full border border-accent/10 scale-150 opacity-0 group-hover:opacity-100 transition-all duration-700"
                aria-hidden="true"
              />
              <img
                src="/logos/logo.svg"
                alt=""
                className="w-20 h-20 lg:w-24 lg:h-24 opacity-25 transition-all duration-500 group-hover:opacity-35 group-hover:scale-105"
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
        <div 
          ref={gridRef} 
          className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-24 pb-12 md:pb-16"
        >
          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-accent/70" aria-hidden="true" />
              <span className="text-label text-ink-400 tracking-luxury">What We Do</span>
            </div>
            <p className="text-body-lg text-ink-600 font-light leading-relaxed">
              Acquisitions, advisory, capital formation, and asset management—partnering with 
              owners, investors, and operators to identify opportunities and create long-term value.
            </p>
          </div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-accent/70" aria-hidden="true" />
              <span className="text-label text-ink-400 tracking-luxury">How We Work</span>
            </div>
            <p className="text-body-lg text-ink-600 font-light leading-relaxed">
              Deep market knowledge, creative problem-solving, and hands-on execution 
              across a range of asset types with an emphasis on thoughtful growth and alignment.
            </p>
          </div>
        </div>
        
        {/* Bronze divider */}
        <div className="divider-bronze my-12 md:my-16" aria-hidden="true" />

        {/* Pull Quote */}
        <div ref={quoteRef}>
          <div className="relative pl-6 md:pl-8">
            {/* Decorative quote border with bronze accent */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-px"
              style={{
                background: 'linear-gradient(to bottom, var(--color-accent) 0%, var(--color-accent) 30%, var(--color-gray-200) 100%)',
              }}
              aria-hidden="true"
            />
            <p className="text-title text-ink-700 font-light italic leading-snug max-w-3xl">
              &ldquo;At our core, Creation Partners is built around movement—of ideas, capital, 
              projects, and people—with the goal of building enduring businesses and places over time.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

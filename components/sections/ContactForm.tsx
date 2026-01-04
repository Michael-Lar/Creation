'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Animate section label
      gsap.from(labelRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
      });

      // Animate content
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 85%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section 
      ref={sectionRef} 
      id="contact" 
      className="py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12 bg-texture-paper relative"
      style={{ backgroundColor: 'var(--color-cream)' }}
    >
      {/* Section top divider */}
      <div className="absolute top-0 left-0 right-0 divider-bronze" aria-hidden="true" />
      
      <div className="max-w-4xl mx-auto pt-4 md:pt-6">
        {/* Section Label */}
        <div ref={labelRef} className="section-label mb-16 md:mb-20">
          <div className="section-label-line" />
          <span className="section-label-text">Get In Touch</span>
        </div>

        {/* Contact Content */}
        <div ref={contentRef} className="text-center">
          {/* Main Tagline */}
          <p className="text-lg md:text-xl text-ink/60 font-light mb-12 md:mb-16 max-w-xl mx-auto leading-relaxed">
            Ready to discuss your next project? We&apos;d love to hear from you.
          </p>

          {/* Contact Info */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 lg:gap-24">
            {/* Phone */}
            <a 
              href="tel:+13102732846"
              className="group flex flex-col items-center"
            >
              <span className="text-xs uppercase tracking-widest text-ink/40 mb-3 font-medium">
                Phone
              </span>
              <span className="text-2xl md:text-3xl lg:text-4xl font-playfair text-ink tracking-wide group-hover:text-accent transition-colors duration-300">
                (310) CREATION
              </span>
              <span className="text-sm text-ink/50 mt-2 group-hover:text-accent/70 transition-colors duration-300">
                (310) 273-2846
              </span>
              <div className="h-px w-0 group-hover:w-full bg-accent/40 mt-3 transition-all duration-500 ease-out" />
            </a>

            {/* Divider - Desktop Only */}
            <div className="hidden md:block w-px h-20 bg-ink/10" aria-hidden="true" />

            {/* Email */}
            <a 
              href="mailto:info@creation-partners.com"
              className="group flex flex-col items-center"
            >
              <span className="text-xs uppercase tracking-widest text-ink/40 mb-3 font-medium">
                Email
              </span>
              <span className="text-2xl md:text-3xl lg:text-4xl font-playfair text-ink tracking-wide group-hover:text-accent transition-colors duration-300">
                info@creation-partners.com
              </span>
              <div className="h-px w-0 group-hover:w-full bg-accent/40 mt-3 transition-all duration-500 ease-out" />
            </a>
          </div>

          {/* Location */}
          <div className="mt-16 md:mt-20">
            <span className="text-xs uppercase tracking-widest text-ink/40 font-medium">
              Los Angeles, California
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

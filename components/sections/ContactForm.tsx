'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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
      className="py-16 md:py-20 lg:py-24 px-6 md:px-8 lg:px-12 bg-texture-paper relative"
      style={{ backgroundColor: 'var(--color-cream)' }}
    >
      {/* Section top divider */}
      <div className="absolute top-0 left-0 right-0 divider-bronze" aria-hidden="true" />
      
      <div className="max-w-4xl mx-auto pt-2 md:pt-4">
        {/* Section Label */}
        <div ref={labelRef} className="section-label mb-6 md:mb-8">
          <div className="section-label-line" />
          <span className="section-label-text">Connect</span>
        </div>

        {/* Contact Content */}
        <div ref={contentRef} className="text-center">
          {/* Main Tagline */}
          <p className="text-lg md:text-xl text-ink/50 mb-10 md:mb-12 max-w-xl mx-auto leading-relaxed tracking-wide">
            We would love to connect.
          </p>

          {/* Primary Contact */}
          <div className="mb-10 md:mb-12">
            <a 
              href="mailto:hello@creation-partners.com"
              className="group inline-block"
            >
              <span className="text-2xl md:text-3xl lg:text-4xl font-playfair text-ink tracking-wide group-hover:text-accent transition-colors duration-300">
                hello@creation-partners.com
              </span>
              <div className="h-px w-0 group-hover:w-full bg-accent/40 mt-2 transition-all duration-500 ease-out mx-auto" />
            </a>
          </div>

          {/* Phone */}
          <div className="mb-10 md:mb-12">
            <a 
              href="tel:+13102732846"
              className="group inline-block"
            >
              <span className="text-xl md:text-2xl font-playfair text-ink/80 tracking-wide group-hover:text-accent transition-colors duration-300">
                (310) CREATION
              </span>
              <span className="block text-sm text-ink/50 mt-1 tracking-wider group-hover:text-accent/70 transition-colors duration-300">
                (310) 273-2846
              </span>
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-8 mb-10 md:mb-12">
            <a 
              href="https://instagram.com/creationpartners"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-ink/50 hover:text-accent transition-colors duration-300"
              aria-label="Follow us on Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs uppercase tracking-widest font-medium">Instagram</span>
            </a>

            <span className="w-px h-4 bg-ink/20" aria-hidden="true" />

            <a 
              href="https://linkedin.com/company/creation-partners"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-ink/50 hover:text-accent transition-colors duration-300"
              aria-label="Connect with us on LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span className="text-xs uppercase tracking-widest font-medium">LinkedIn</span>
            </a>
          </div>

          {/* Location */}
          <div>
            <span className="text-xs uppercase tracking-widest text-ink/40 font-medium">
              Los Angeles, California
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

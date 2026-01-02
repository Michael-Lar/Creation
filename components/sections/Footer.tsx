'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

      // Animate content
      gsap.from(contentRef.current?.children || [], {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 75%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={sectionRef} id="contact" className="py-32 md:py-40 px-6 md:px-8 lg:px-12 border-t border-gray-300/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <div ref={labelRef} className="mb-16 md:mb-20">
          <span className="text-sm md:text-base uppercase tracking-widest text-gray-500 font-semibold">
            Contact
          </span>
          <div ref={dividerRef} className="mt-4 w-16 h-px bg-gray-400 origin-left"></div>
        </div>

        {/* Footer Content */}
        <div ref={contentRef} className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-light text-gray-900 tracking-tight">Get in Touch</h3>
            <p className="text-base text-gray-600 font-light leading-relaxed">
              Footer section placeholder content.
            </p>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-light text-gray-900 tracking-tight">Information</h3>
            <p className="text-base text-gray-600 font-light leading-relaxed">
              Footer section placeholder content.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

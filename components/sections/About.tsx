'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const firstParaRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const italicRef = useRef<HTMLParagraphElement>(null);

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

      // Animate first paragraph
      gsap.from(firstParaRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: firstParaRef.current,
          start: 'top 85%',
        },
      });

      // Animate grid columns
      gsap.from(gridRef.current?.children || [], {
        opacity: 0,
        y: 50,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
        },
      });

      // Animate italic statement
      gsap.from(italicRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: italicRef.current,
          start: 'top 85%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Section Label */}
        <div ref={labelRef} className="mb-10 md:mb-12">
          <span className="text-xs md:text-sm uppercase tracking-widest text-gray-500 font-semibold">
            About
          </span>
          <div ref={dividerRef} className="mt-3 w-12 h-px bg-bronze origin-left"></div>
        </div>

        {/* Main Content with Creative Layout */}
        <div className="space-y-8 md:space-y-10">
          <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-center">
            {/* Large Opening Statement - Takes more space */}
            <div className="md:col-span-9">
              <p ref={firstParaRef} className="text-2xl md:text-3xl lg:text-4xl text-gray-900 leading-tight font-light tracking-tight">
                A Los Angeles-based, vertically integrated real estate investment and operating platform.
              </p>
            </div>
            
            {/* Logo Element - Centered and properly sized */}
            <div className="md:col-span-3 flex items-center justify-center">
              <div className="relative group">
                <img
                  src={`/logos/logo.svg?t=${Date.now()}`}
                  alt="Creation Partners"
                  className="w-20 h-20 md:w-28 md:h-28 opacity-40 transition-all duration-500 group-hover:opacity-50 group-hover:scale-105"
                  style={{ display: 'block' }}
                />
                <div className="absolute inset-0 bg-bronze/0 group-hover:bg-bronze/5 rounded-full transition-all duration-500 -z-10"></div>
              </div>
            </div>
          </div>
          
          {/* Two Column Grid */}
          <div ref={gridRef} className="grid md:grid-cols-2 gap-8 md:gap-12 pt-8 border-t border-gray-300/20">
            <div className="space-y-3 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-px bg-bronze"></div>
                <h3 className="text-xs uppercase tracking-widest text-gray-500 font-semibold">What We Do</h3>
              </div>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed font-light pl-11">
                Acquisitions, advisory, capital formation, and asset management.
              </p>
            </div>
            <div className="space-y-3 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-px bg-bronze"></div>
                <h3 className="text-xs uppercase tracking-widest text-gray-500 font-semibold">How We Work</h3>
              </div>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed font-light pl-11">
                Deep market knowledge, creative problem-solving, and hands-on execution.
              </p>
            </div>
          </div>

          {/* Final Statement with Creative Styling */}
          <div className="pt-8 border-t border-bronze/30">
            <p ref={italicRef} className="text-xl md:text-2xl lg:text-3xl text-gray-900 leading-tight font-light italic max-w-4xl relative pl-8 md:pl-12">
              <span className="absolute left-0 top-0 bottom-0 w-px bg-bronze/40"></span>
              Built around movement of ideas, capital, projects, and people.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

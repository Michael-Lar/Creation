'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

      // Animate project cards
      gsap.from(gridRef.current?.children || [], {
        opacity: 0,
        y: 60,
        scale: 0.95,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 75%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="py-32 md:py-40 px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <div ref={labelRef} className="mb-16 md:mb-20">
          <span className="text-sm md:text-base uppercase tracking-widest text-gray-500 font-semibold">
            Recent Projects
          </span>
          <div ref={dividerRef} className="mt-4 w-16 h-px bg-gray-400 origin-left"></div>
        </div>

        {/* Projects Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="group space-y-4 cursor-pointer">
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-200/50 to-gray-300/30 rounded-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gray-400/20 group-hover:bg-gray-400/10 transition-all duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-gray-600 text-sm uppercase tracking-wider font-semibold">
                    View Project
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-light text-gray-900 tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                  Project Name
                </h3>
                <p className="text-sm text-gray-600 font-light mt-1">Location</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

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

      // Animate grid columns
      gsap.from(gridRef.current?.children || [], {
        opacity: 0,
        y: 50,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 75%',
        },
      });

      // Animate bottom section
      gsap.from(bottomRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: bottomRef.current,
          start: 'top 85%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickLinks = [
    { label: 'About', id: 'about' },
    { label: 'Divisions', id: 'divisions' },
    { label: 'Team', id: 'team' },
    { label: 'Projects', id: 'projects' },
  ];

  const divisions = [
    { label: 'Creation Capital', id: 'divisions' },
    { label: 'Creation Realty Corporation', id: 'divisions' },
    { label: 'Creation Equities', id: 'divisions' },
    { label: 'Creation Asset Management', id: 'divisions' },
  ];

  return (
    <footer 
      ref={sectionRef} 
      id="contact" 
      className="relative py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12 border-t border-gray-200/30 overflow-hidden"
      style={{ backgroundColor: 'var(--color-cream)' }}
    >
      {/* Watermarked background image - subtle overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'url(https://creation-partners.com/wp-content/uploads/2024/01/hero-image.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Label */}
        <div ref={labelRef} className="mb-12 md:mb-16 lg:mb-20">
          <span className="text-xs md:text-sm uppercase tracking-widest text-gray-500 font-semibold">
            Contact
          </span>
          <div ref={dividerRef} className="mt-3 w-12 h-px bg-bronze origin-left"></div>
        </div>

        {/* Main Footer Grid - 4 Columns */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 lg:gap-20 mb-16 md:mb-20">
          {/* Visual Separator Lines */}
          <div className="hidden lg:block absolute left-0 right-0 top-0 bottom-0 pointer-events-none">
            <div className="h-full w-px bg-gray-200/20 absolute left-[25%]"></div>
            <div className="h-full w-px bg-gray-200/20 absolute left-[50%]"></div>
            <div className="h-full w-px bg-gray-200/20 absolute left-[75%]"></div>
          </div>
          {/* Column 1: Statement */}
          <div className="lg:col-span-2 relative">
            <p className="text-xl md:text-2xl lg:text-3xl font-light text-gray-900 leading-tight tracking-tight mb-6 max-w-2xl">
              Crafting timeless spaces that connect people, elevate living, and inspire community.
            </p>
            <div className="w-12 h-px bg-bronze"></div>
            {/* Subtle decorative element */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-bronze/5 rounded-full blur-2xl -z-10"></div>
          </div>

          {/* Column 2: Contact - Simplified */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-6">
                Contact
              </h3>
              <div className="space-y-4 font-light">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-3">Address</p>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                    10700 Santa Monica Blvd<br />
                    Suite 205<br />
                    Los Angeles, CA 90025
                  </p>
                </div>
                <div>
                  <a 
                    href="mailto:ys@creation-partners.com" 
                    className="text-sm md:text-base text-gray-700 hover:text-bronze transition-colors duration-200 break-all"
                  >
                    ys@creation-partners.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-6">
                Quick Links
              </h3>
              <nav className="space-y-3 font-light">
                {quickLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="block text-sm md:text-base text-gray-700 hover:text-bronze transition-all duration-200 group text-left"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-0 h-px bg-bronze transition-all duration-300 group-hover:w-4"></span>
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{link.label}</span>
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Column 4: Divisions */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-6">
                Divisions
              </h3>
              <nav className="space-y-3 font-light">
                {divisions.map((division, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSection(division.id)}
                    className="block text-sm md:text-base text-gray-700 hover:text-bronze transition-all duration-200 group text-left"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-0 h-px bg-bronze transition-all duration-300 group-hover:w-4"></span>
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{division.label}</span>
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Social Links */}
            <div className="pt-4">
              <h3 className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-4">
                Connect
              </h3>
              <div className="flex flex-col space-y-3">
                <a 
                  href="https://www.linkedin.com/company/creation-partners" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-700 hover:text-bronze transition-all duration-200 group font-light"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-0 h-px bg-amber-400 transition-all duration-300 group-hover:w-4"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">LinkedIn</span>
                  </span>
                </a>
                <a 
                  href="https://www.instagram.com/creationpartners" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-700 hover:text-bronze transition-all duration-200 group font-light"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-0 h-px bg-amber-400 transition-all duration-300 group-hover:w-4"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">Instagram</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div ref={bottomRef} className="pt-12 md:pt-16 border-t border-gray-200/30">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="text-sm text-gray-500 font-light">
              <p>© {new Date().getFullYear()} Creation Partners. All rights reserved.</p>
            </div>
            <div className="text-sm text-gray-500 font-light">
              <a 
                href="https://creation-partners.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-bronze transition-colors duration-200"
              >
                www.creation-partners.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

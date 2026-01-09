'use client';

import { useRef } from 'react';
import Image from 'next/image';

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const quickLinks = [
    { label: 'About', id: 'about' },
    { label: 'Divisions', id: 'divisions' },
    { label: 'Team', id: 'team' },
    { label: 'Projects', id: 'projects' },
  ];

  const divisions = [
    'Creation Capital',
    'Creation Realty Corporation',
    'Creation Equities',
    'Creation Asset Management',
  ];

  return (
    <footer 
      ref={sectionRef} 
      className="relative overflow-hidden"
      style={{ 
        backgroundColor: 'var(--color-ink)', 
        color: 'var(--color-cream)',
        paddingTop: 'clamp(4rem, 8vw, 8rem)',
        paddingBottom: 'clamp(4rem, 8vw, 8rem)',
        paddingLeft: '0',
        paddingRight: '0',
      }}
    >
      {/* Premium texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />
      
      {/* Bronze glow accents */}
      <div 
        className="absolute top-0 left-1/4 w-96 h-96 opacity-[0.03] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      
      {/* Logo Watermark - Large, positioned bottom-right */}
      <div 
        className="absolute bottom-0 right-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/logos/logo.svg"
          alt=""
          width={500}
          height={500}
          className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] opacity-[0.04]"
          style={{ 
            filter: 'brightness(0) invert(1)',
            transform: 'translate(25%, 25%)',
          }}
          unoptimized
        />
      </div>

      {/* Elegant top border with bronze accent */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 10%, var(--color-accent) 50%, transparent 90%)' }}
        aria-hidden="true"
      />

      <div className="container-main relative">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 md:mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Logo with text */}
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logos/logo.svg"
                alt=""
                width={32}
                height={32}
                className="w-8 h-8 opacity-60"
                style={{ filter: 'brightness(0) invert(1)' }}
                unoptimized
              />
              <h2 className="text-title text-cream-100">
                Creation Partners
              </h2>
            </div>
            <p className="text-body text-cream-100/60 font-light max-w-md mb-6 leading-relaxed">
              Building enduring businesses and places through the movement of ideas, 
              capital, projects, and people.
            </p>
            <div className="w-12 h-px bg-accent/40" />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-label text-cream-100/40 mb-6">Navigation</h3>
            <nav className="space-y-3">
              {quickLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="block text-body text-cream-100/70 hover:text-cream-100 transition-colors font-light text-left"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-label text-cream-100/40 mb-6">Contact</h3>
            <address className="not-italic space-y-4 text-body font-light">
              <div className="text-cream-100/70">
                <p>10700 Santa Monica Blvd</p>
                <p>Suite 205</p>
                <p>Los Angeles, CA 90025</p>
              </div>
              <a 
                href="mailto:ys@creation-partners.com" 
                className="block text-cream-100/70 hover:text-accent transition-colors"
              >
                ys@creation-partners.com
              </a>
            </address>
          </div>
        </div>

        {/* Divisions List - Horizontal on desktop */}
        <div className="py-8 border-t border-cream-100/10">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <span className="text-label text-cream-100/30">Divisions</span>
            {divisions.map((division, index) => (
              <span 
                key={index}
                className="text-caption text-cream-100/50 font-light"
              >
                {division}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-cream-100/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-caption text-cream-100/40 font-light">
              © {new Date().getFullYear()} Creation Partners. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-6">
              <a 
                href="https://www.linkedin.com/company/creation-partners" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-caption text-cream-100/50 hover:text-cream-100 transition-colors font-light"
                aria-label="LinkedIn (opens in new tab)"
              >
                LinkedIn
              </a>
              <a 
                href="https://www.instagram.com/creationpartners" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-caption text-cream-100/50 hover:text-cream-100 transition-colors font-light"
                aria-label="Instagram (opens in new tab)"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

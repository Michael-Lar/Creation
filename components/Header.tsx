'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOverHero, setIsOverHero] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
      // Check if we're over the hero section (assuming hero is ~100vh)
      setIsOverHero(scrollY < window.innerHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: 'About', id: 'about' },
    { label: 'Divisions', id: 'divisions' },
    { label: 'Team', id: 'team' },
    { label: 'Projects', id: 'projects' },
    { label: 'Contact', id: 'contact' },
  ];

  // Enhanced visibility: stronger backdrop when over video, subtle when over content
  const headerStyle = isOverHero
    ? 'bg-black/30 backdrop-blur-sm border-b border-white/5'
    : isScrolled
    ? 'bg-[#F5F1E8]/90 backdrop-blur-sm border-b border-gray-200/30'
    : 'bg-transparent';

  const textColor = isOverHero ? 'text-white' : 'text-gray-900';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 header-content opacity-0 ${headerStyle}`}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo with text */}
          <Link href="/" className="flex items-center group gap-2 md:gap-3">
            <span className={`${textColor} text-base md:text-lg lg:text-xl font-medium tracking-wide transition-opacity duration-300 group-hover:opacity-80 whitespace-nowrap`}>
              Creation Partners
            </span>
            <div className="transition-transform duration-300 group-hover:scale-105 flex-shrink-0">
              <img
                src={`/logos/logo.svg?t=${Date.now()}`}
                alt="Creation Partners"
                className="h-7 md:h-8 w-auto"
                style={{ display: 'block' }}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`${textColor} text-sm lg:text-base font-medium tracking-wider uppercase relative group transition-all duration-300 hover:opacity-80`}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-current transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden ${textColor} focus:outline-none`}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
              <span
                className={`block h-px bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`block h-px bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-px bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-6 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left ${textColor} text-base font-semibold tracking-wider uppercase hover:opacity-70 transition-opacity duration-200`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}

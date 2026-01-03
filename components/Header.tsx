'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOverHero, setIsOverHero] = useState(true);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstMenuItemRef = useRef<HTMLButtonElement>(null);

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

  // Fade in header after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (headerRef.current) {
        gsap.to(headerRef.current, {
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        });
      }
    }, 2500); // Start fading in around when preloader completes

    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
      // Return focus to menu button after closing
      setTimeout(() => {
        menuButtonRef.current?.focus();
      }, 100);
    }
  };

  // Handle Escape key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    if (isMobileMenuOpen) {
      window.addEventListener('keydown', handleEscape);
      // Focus first menu item when menu opens
      setTimeout(() => {
        firstMenuItemRef.current?.focus();
      }, 100);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileMenuOpen]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen || !menuRef.current) return;

    const menuItems = menuRef.current.querySelectorAll('button');
    const firstItem = menuItems[0] as HTMLElement;
    const lastItem = menuItems[menuItems.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstItem) {
          e.preventDefault();
          lastItem.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastItem) {
          e.preventDefault();
          firstItem.focus();
        }
      }
    };

    menuRef.current.addEventListener('keydown', handleTabKey);
    return () => {
      menuRef.current?.removeEventListener('keydown', handleTabKey);
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { label: 'About', id: 'about' },
    { label: 'Divisions', id: 'divisions' },
    { label: 'Team', id: 'team' },
    { label: 'Projects', id: 'projects' },
    { label: 'Contact', id: 'contact' },
  ];

  // Minimal, clean styling that works over video
  const headerStyle = isOverHero
    ? 'bg-black/20 backdrop-blur-md border-b border-white/10'
    : isScrolled
    ? 'bg-cream/95 backdrop-blur-sm border-b border-gray-200/20'
    : 'bg-transparent';

  const textColor = isOverHero ? 'text-white' : 'text-gray-900';

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerStyle}`}
      style={{ opacity: 0 }}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo with text - More minimal */}
          <Link href="/" className="flex items-center group gap-2 md:gap-2.5">
            <span className={`${textColor} text-sm md:text-base lg:text-lg font-light tracking-wide transition-opacity duration-300 group-hover:opacity-70 whitespace-nowrap`}>
              Creation Partners
            </span>
            <div className="transition-opacity duration-300 group-hover:opacity-70 flex-shrink-0">
              <img
                src={`/logos/logo.svg?t=${Date.now()}`}
                alt="Creation Partners"
                className="h-5 md:h-6 w-auto opacity-90"
                style={{ display: 'block' }}
              />
            </div>
          </Link>

          {/* Desktop Navigation - More minimal and clean */}
          <div className="hidden md:flex items-center space-x-5 lg:space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`${textColor} text-xs lg:text-sm font-light tracking-widest uppercase relative group transition-all duration-300 hover:opacity-60`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-current transition-all duration-300 group-hover:w-full opacity-50"></span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
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
            ref={menuRef}
            className={`md:hidden overflow-hidden transition-all duration-300 ${
              isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
            style={{ display: isMobileMenuOpen ? 'block' : 'none' }}
          >
            <div className="py-4 space-y-3">
              {navItems.map((item, index) => (
                <button
                  key={item.id}
                  ref={index === 0 ? firstMenuItemRef : null}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left ${textColor} text-sm font-light tracking-widest uppercase hover:opacity-60 transition-opacity duration-200`}
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

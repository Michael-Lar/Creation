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
    // Get Lenis instance if available
    const getLenis = (): any => {
      return (window as any).lenis || null;
    };

    const handleScroll = () => {
      const lenis = getLenis();
      let scrollY = 0;

      if (lenis) {
        // Use Lenis scroll position
        scrollY = lenis.scroll;
      } else {
        // Fallback to native scroll
        scrollY = window.scrollY;
      }

      setIsScrolled(scrollY > 50);
      setIsOverHero(scrollY < window.innerHeight * 0.8);
    };

    // Try to use Lenis scroll event
    const lenis = getLenis();
    if (lenis) {
      lenis.on('scroll', handleScroll);
      handleScroll(); // Initial update
      return () => {
        lenis.off('scroll', handleScroll);
      };
    } else {
      // Fallback to native scroll
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Fade in header
  useEffect(() => {
    const timer = setTimeout(() => {
      if (headerRef.current) {
        gsap.to(headerRef.current, {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        });
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
    setTimeout(() => menuButtonRef.current?.focus(), 100);
  };

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    if (isMobileMenuOpen) {
      window.addEventListener('keydown', handleEscape);
      setTimeout(() => firstMenuItemRef.current?.focus(), 100);
    }

    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  // Focus trap for mobile menu
  useEffect(() => {
    const menu = menuRef.current;
    if (!isMobileMenuOpen || !menu) return;

    const menuItems = menu.querySelectorAll('button');
    const firstItem = menuItems[0] as HTMLElement;
    const lastItem = menuItems[menuItems.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstItem) {
          e.preventDefault();
          lastItem.focus();
        }
      } else {
        if (document.activeElement === lastItem) {
          e.preventDefault();
          firstItem.focus();
        }
      }
    };

    menu.addEventListener('keydown', handleTabKey);
    return () => menu.removeEventListener('keydown', handleTabKey);
  }, [isMobileMenuOpen]);

  const navItems = [
    { label: 'About', id: 'about' },
    { label: 'Divisions', id: 'divisions' },
    { label: 'Team', id: 'team' },
    { label: 'Projects', id: 'projects' },
    { label: 'Contact', id: 'contact' },
  ];

  const headerBg = isOverHero
    ? 'bg-ink-900/30 backdrop-blur-md'
    : isScrolled
    ? 'bg-cream/95 backdrop-blur-sm shadow-soft'
    : 'bg-transparent';

  const textColor = isOverHero ? 'text-white' : 'text-ink-800';

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}
      style={{ opacity: 0 }}
    >
      <nav className="container-main">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo with Icon */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 group transition-opacity duration-300 hover:opacity-70"
          >
            {/* Logo Icon */}
            <img
              src="/logos/logo.svg"
              alt=""
              className="w-6 h-6 md:w-7 md:h-7 transition-transform duration-300 group-hover:scale-105"
              style={{ 
                filter: isOverHero ? 'brightness(0) invert(1)' : 'grayscale(20%)',
              }}
            />
            {/* Company Name */}
            <span className={`${textColor} text-body-lg font-sans font-light tracking-tight transition-colors duration-300`}>
              Creation Partners
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`${textColor} text-caption font-sans tracking-[0.1em] uppercase font-light relative group transition-colors duration-300 hover:opacity-70`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-current transition-all duration-300 group-hover:w-full opacity-50" />
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden ${textColor} p-3 -mr-2 touch-target`}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <div className="w-6 h-5 flex flex-col justify-center gap-1.5">
              <span
                className={`block h-px bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
                }`}
              />
              <span
                className={`block h-px bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-px bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          ref={menuRef}
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{ display: isMobileMenuOpen ? 'block' : 'none' }}
        >
          <div className="py-4 space-y-1">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                ref={index === 0 ? firstMenuItemRef : null}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left ${textColor} py-4 px-4 text-body font-sans font-light tracking-wide transition-opacity duration-200 active:opacity-70 touch-target`}
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

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOverHero, setIsOverHero] = useState(true);
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstMenuItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
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

    // Initial check after mount
    handleScroll();

    // Try to use Lenis scroll event
    const lenis = getLenis();
    if (lenis) {
      lenis.on('scroll', handleScroll);
      return () => {
        lenis.off('scroll', handleScroll);
      };
    } else {
      // Fallback to native scroll
      window.addEventListener('scroll', handleScroll, { passive: true });
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

  // Elegant background - subtle and clean
  // Use initial state until mounted to avoid hydration mismatch
  const headerBg = !mounted || isOverHero
    ? 'bg-transparent'
    : isScrolled
    ? 'bg-cream/98 backdrop-blur-sm border-b border-ink-100/50'
    : 'bg-transparent';

  const textColor = !mounted || isOverHero ? 'text-white' : 'text-ink-800';
  const logoFilter = !mounted || isOverHero ? 'brightness(0) invert(1)' : 'none';

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}
      style={{ opacity: 0 }}
    >
      <nav className="container-main">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo - Proud and Simplistic */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group transition-opacity duration-300 hover:opacity-80"
            aria-label="Creation Partners - Home"
          >
            {/* Prominent Logo Icon */}
            <div className="relative">
              <img
                src="/logos/logo.svg"
                alt="Creation Partners"
                className="w-10 h-10 md:w-12 md:h-12 transition-all duration-300"
                style={{ 
                  filter: logoFilter,
                }}
              />
              {/* Subtle glow on hover */}
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-md"
                style={{
                  background: (!mounted || isOverHero)
                    ? 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(184, 160, 104, 0.15) 0%, transparent 70%)',
                }}
                aria-hidden="true"
              />
            </div>
            
            {/* Company Name - Elegant Typography */}
            <span className={`${textColor} text-lg md:text-xl font-serif font-normal tracking-[-0.02em] transition-colors duration-300`}>
              Creation Partners
            </span>
          </Link>

          {/* Desktop Navigation - Clean and Minimal */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`${textColor} text-xs font-sans tracking-[0.15em] uppercase font-light relative group transition-all duration-300 hover:opacity-80`}
              >
                {item.label}
                {/* Subtle underline on hover */}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-current transition-all duration-400 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Mobile Menu Button - Minimal Design */}
          <button
            ref={menuButtonRef}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden ${textColor} p-2 -mr-2 touch-target transition-opacity duration-300 hover:opacity-70`}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <div className="w-6 h-5 flex flex-col justify-center gap-1.5">
              <span
                className={`block h-[1.5px] bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
                }`}
              />
              <span
                className={`block h-[1.5px] bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-[1.5px] bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu - Clean Design */}
        <div
          ref={menuRef}
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{ display: isMobileMenuOpen ? 'block' : 'none' }}
        >
          <div className="py-6 space-y-2 border-t border-ink-100/30 mt-2">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                ref={index === 0 ? firstMenuItemRef : null}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left ${textColor} py-3 px-4 text-sm font-sans font-light tracking-wide transition-opacity duration-200 active:opacity-70 touch-target hover:opacity-80`}
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

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
    { label: 'Connect', id: 'contact', boxed: true },
  ];

  // Elegant background - subtle and clean
  // Use initial state until mounted to avoid hydration mismatch
  const headerBg = !mounted || isOverHero
    ? 'bg-transparent'
    : isScrolled
    ? 'bg-cream/95 backdrop-blur-md'
    : 'bg-transparent';

  const textColor = !mounted || isOverHero ? 'text-white' : 'text-ink-800';
  const logoFilter = !mounted || isOverHero ? 'brightness(0) invert(1)' : 'none';
  
  // Border frame is 20px - header sits inside it
  const borderWidth = 20;
  const headerPaddingX = 12; // Horizontal padding stays consistent
  const headerPaddingY = !mounted || isOverHero ? 12 : 8; // Vertical padding shrinks when scrolled

  return (
    <header
      ref={headerRef}
      className={`fixed z-50 transition-all duration-500 ${headerBg}`}
      style={{ 
        opacity: 0,
        top: borderWidth,
        left: borderWidth,
        right: borderWidth,
      }}
    >
      <nav 
        className="relative flex items-start justify-between transition-all duration-500"
        style={{ 
          paddingTop: headerPaddingY,
          paddingBottom: headerPaddingY,
          paddingLeft: headerPaddingX,
          paddingRight: headerPaddingX,
        }}
      >
        {/* Logo - Bigger on hero, scales down when scrolled */}
        <Link 
          href="/" 
          className="group transition-all duration-500 hover:opacity-80 flex-shrink-0"
          aria-label="Creation Partners - Home"
        >
          <img
            src="/logos/logo-with-text.svg"
            alt="Creation Partners"
            className={`w-auto transition-all duration-500 ${
              !mounted || isOverHero 
                ? 'h-20 md:h-28 lg:h-32' 
                : 'h-9 md:h-11 lg:h-[52px]'
            }`}
            style={{ 
              filter: logoFilter,
              display: 'block',
            }}
          />
        </Link>

        {/* Desktop Navigation - Fixed vertical position */}
        <div className="hidden md:flex items-center gap-5 lg:gap-7" style={{ marginTop: '6px' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`${textColor} text-[10px] lg:text-[11px] font-sans tracking-[0.14em] uppercase relative group transition-all duration-300 hover:opacity-70 font-bold ${
                item.boxed 
                  ? 'px-3 lg:px-4 py-1.5 border border-current rounded-sm' 
                  : ''
              }`}
            >
              {item.label}
              {!item.boxed && (
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-current transition-all duration-400 group-hover:w-full" />
              )}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button - Fixed vertical position */}
        <button
          ref={menuButtonRef}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden ${textColor} p-2 touch-target transition-opacity duration-300 hover:opacity-70`}
          style={{ marginTop: '2px' }}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          <div className="w-5 h-4 flex flex-col justify-center gap-1">
            <span
              className={`block h-[1.5px] bg-current transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-[5px]' : ''
              }`}
            />
            <span
              className={`block h-[1.5px] bg-current transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-[1.5px] bg-current transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''
              }`}
            />
          </div>
        </button>

        {/* Mobile Menu */}
        <div
          ref={menuRef}
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{ display: isMobileMenuOpen ? 'block' : 'none' }}
        >
          <div className="pt-4 pb-2 space-y-1">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                ref={index === 0 ? firstMenuItemRef : null}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left ${textColor} py-2.5 text-sm font-sans tracking-wide transition-opacity duration-200 active:opacity-70 touch-target hover:opacity-70 ${
                  item.boxed 
                    ? 'border border-current rounded-sm font-bold mt-2 text-center px-3' 
                    : 'font-bold'
                }`}
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

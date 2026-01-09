'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from '@/utils/gsap';
import { useScrollListener } from '@/hooks/useScrollPosition';

interface HeaderProps {
  isModalOpen?: boolean;
}

export default function Header({ isModalOpen = false }: HeaderProps) {
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
  }, []);

  useScrollListener((scrollY) => {
    setIsScrolled(scrollY > 50);
    setIsOverHero(scrollY < window.innerHeight * 0.8);
  });

  // Fade in header (only on initial mount, not when modal closes)
  useEffect(() => {
    if (isModalOpen) return; // Don't fade in if modal is open
    
    const timer = setTimeout(() => {
      if (headerRef.current && !isModalOpen) {
        // Check current opacity to avoid overriding modal close animation
        const currentOpacity = headerRef.current.style.opacity;
        if (!currentOpacity || parseFloat(currentOpacity) === 0) {
          gsap.to(headerRef.current, {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
          });
        }
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []); // Only run on mount, not when isModalOpen changes

  // Hide/show header when modal opens/closes
  useEffect(() => {
    if (!headerRef.current || !mounted) return;
    
    if (isModalOpen) {
      gsap.to(headerRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: 'power1.in',
        onComplete: () => {
          if (headerRef.current) {
            headerRef.current.style.visibility = 'hidden';
          }
        },
      });
    } else {
      if (headerRef.current) {
        headerRef.current.style.visibility = 'visible';
      }
      // Only animate opacity if header was already visible (not initial mount)
      const computedOpacity = window.getComputedStyle(headerRef.current).opacity;
      if (parseFloat(computedOpacity) > 0) {
        gsap.to(headerRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: 'power1.out',
          delay: 0.1,
        });
      }
    }
  }, [isModalOpen, mounted]);

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
  
  // Border frame is responsive - header sits inside it
  const headerPaddingX = 'clamp(0.75rem, 2vw, 0.75rem)'; // Horizontal padding
  const headerPaddingY = !mounted || isOverHero ? 'clamp(0.75rem, 2vw, 0.75rem)' : 'clamp(0.5rem, 1.5vw, 0.5rem)'; // Vertical padding shrinks when scrolled

  return (
    <header
      ref={headerRef}
      className={`fixed z-50 transition-all duration-500 ${headerBg} ${isModalOpen ? 'pointer-events-none' : ''}`}
      style={{ 
        opacity: 0, // Will be animated by GSAP
        top: 'clamp(4px, 1.5vw, 20px)',
        left: 'clamp(4px, 1.5vw, 20px)',
        right: 'clamp(4px, 1.5vw, 20px)',
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
          <Image
            src="/logos/logo-with-text.svg"
            alt="Creation Partners"
            width={200}
            height={80}
            className={`w-auto transition-all duration-500 ${
              !mounted || isOverHero 
                ? 'h-12 sm:h-16 md:h-20 lg:h-24 xl:h-28' 
                : 'h-8 sm:h-9 md:h-10 lg:h-11 xl:h-[52px]'
            }`}
            style={{ 
              filter: logoFilter,
              display: 'block',
            }}
            priority
            unoptimized
          />
        </Link>

        {/* Desktop Navigation - Fixed vertical position */}
        <div className="hidden md:flex items-center gap-4 lg:gap-5 xl:gap-7" style={{ marginTop: '6px' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`${textColor} text-[9px] md:text-[10px] lg:text-[11px] font-sans tracking-[0.14em] uppercase relative group transition-all duration-300 hover:opacity-70 font-bold ${
                item.boxed 
                  ? 'px-2.5 md:px-3 lg:px-4 py-1.5 border border-current rounded-sm' 
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
            isMobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
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

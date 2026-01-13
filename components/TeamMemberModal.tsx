'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from '@/utils/gsap';
import { stopLenis, startLenis, getLenisInstance } from '@/utils/lenis';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { EASING } from '@/constants/animations';
import { TeamMember } from '@/types/models';

interface TeamMemberModalProps {
  member: TeamMember | null;
  allMembers: TeamMember[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function TeamMemberModal({ 
  member, 
  allMembers, 
  currentIndex, 
  isOpen, 
  onClose, 
  onNavigate 
}: TeamMemberModalProps) {
  // Custom hooks
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // Refs
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const savedScrollPositionRef = useRef<number>(0);

  // Scroll lock integration
  useEffect(() => {
    if (isOpen) {
      // Save the current scroll position using Lenis if available, otherwise window.scrollY
      const lenis = getLenisInstance();
      savedScrollPositionRef.current = lenis ? lenis.scroll : (window.scrollY || window.pageYOffset || 0);
      previousActiveElementRef.current = document.activeElement as HTMLElement;
      stopLenis();
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollPositionRef.current}px`;
      document.body.style.width = '100%';
    }
    
    // Cleanup function - ALWAYS runs on unmount or when isOpen changes
    return () => {
      // Only restore if body was locked (overflow is hidden) - this means modal was open
      const wasLocked = document.body.style.overflow === 'hidden' || window.getComputedStyle(document.body).overflow === 'hidden';
      
      if (wasLocked) {
        // Get the saved scroll position BEFORE removing fixed positioning
        const scrollPosition = savedScrollPositionRef.current;
        
        // CRITICAL: Restore body styles immediately
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        
        // CRITICAL: Restore scroll position IMMEDIATELY after removing fixed positioning
        // Use window.scrollTo synchronously to prevent jump to top
        window.scrollTo(0, scrollPosition);
        
        // Then restore Lenis (it will sync with the scroll position we just set)
        startLenis();
      }
    };
  }, [isOpen]);

  // Handle Escape key and arrow navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : allMembers.length - 1;
        onNavigate(prevIndex);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = currentIndex < allMembers.length - 1 ? currentIndex + 1 : 0;
        onNavigate(nextIndex);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, currentIndex, allMembers.length, onNavigate]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  // Prevent Lenis from intercepting scroll events within the modal (desktop and mobile)
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const scrollableContent = modal.querySelector('.overflow-y-auto') as HTMLElement;
    
    if (!scrollableContent) return;
    
    const handleWheel = (e: WheelEvent) => {
      // Stop propagation to prevent Lenis from handling the event
      e.stopPropagation();
      // Allow native scrolling within the modal
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Always stop propagation to prevent Lenis from handling touch events
      // This allows native scrolling within the modal
      e.stopPropagation();
      
      // Allow native scrolling - don't prevent default
      // The browser will handle scrolling naturally within the scrollable container
    };

    // Use capture phase to intercept before Lenis
    scrollableContent.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    // Use passive: true for touchmove to allow smooth native scrolling
    scrollableContent.addEventListener('touchmove', handleTouchMove, { passive: true, capture: true });
    
    return () => {
      scrollableContent.removeEventListener('wheel', handleWheel, { capture: true });
      scrollableContent.removeEventListener('touchmove', handleTouchMove, { capture: true });
    };
  }, [isOpen]);

  // GSAP animations
  useEffect(() => {
    if (!backdropRef.current || !modalRef.current) return;

    if (prefersReducedMotion) {
      if (isOpen) {
        backdropRef.current.style.opacity = '1';
        modalRef.current.style.opacity = '1';
        modalRef.current.style.transform = 'scale(1)';
      } else {
        backdropRef.current.style.opacity = '0';
        modalRef.current.style.opacity = '0';
        modalRef.current.style.transform = 'scale(0.95)';
      }
      return;
    }

    if (isOpen) {
      gsap.set(backdropRef.current, { opacity: 0 });
      gsap.set(modalRef.current, { opacity: 0, scale: 0.95 });

      const tl = gsap.timeline();
      tl.to(backdropRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: EASING.STANDARD,
      });
      tl.to(
        modalRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          ease: EASING.SMOOTH,
        },
        '-=0.2'
      );
    } else {
      const tl = gsap.timeline();
      tl.to(modalRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.25,
        ease: EASING.IN,
      });
      tl.to(
        backdropRef.current,
        {
          opacity: 0,
          duration: 0.25,
          ease: EASING.IN,
        },
        '-=0.2'
      );
    }
  }, [isOpen, prefersReducedMotion]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!member) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[60] bg-ink-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8"
      onClick={handleBackdropClick}
      aria-hidden={!isOpen}
      style={{ display: isOpen ? 'flex' : 'none' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-cream rounded-sm shadow-premium-lg max-w-6xl w-full max-h-[95vh] sm:max-h-[92vh] flex flex-col lg:flex-row relative border border-accent/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bronze corner accents */}
        <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-accent/50" aria-hidden="true" />
        <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-accent/50" aria-hidden="true" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white active:bg-white border border-ink-200/60 hover:border-accent/50 flex items-center justify-center text-ink-600 hover:text-accent transition-all transition-standard touch-target z-20 shadow-soft"
          aria-label="Close modal"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Photo Section - Fixed on left */}
        <div className="relative w-full lg:w-[42%] xl:w-[40%] flex-shrink-0 bg-cream lg:h-[92vh] border-b lg:border-b-0 lg:border-r border-accent/30 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 overflow-hidden max-h-[40vh] sm:max-h-[45vh] lg:max-h-none">
          {/* Decorative background pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-accent) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
            aria-hidden="true"
          />
          <div className="w-full max-w-full h-full max-h-full flex items-center justify-center relative z-10">
            {member.image ? (
              <div className="relative w-full aspect-[4/5] max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] bg-white rounded-sm border border-accent/30 shadow-premium overflow-hidden group/photo">
                <Image
                  src={member.image}
                  alt={`${member.name} - ${member.title}`}
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 1024px) 100vw, 400px"
                  style={{
                    filter: 'grayscale(100%) contrast(1.15)',
                    WebkitFilter: 'grayscale(100%) contrast(1.15)',
                  }}
                />
                {/* Bronze corner accents on photo */}
                <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-accent/40 opacity-0 group-hover/photo:opacity-100 transition-opacity transition-slow" aria-hidden="true" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-accent/40 opacity-0 group-hover/photo:opacity-100 transition-opacity transition-slow" aria-hidden="true" />
              </div>
            ) : (
              <div className="w-full aspect-[4/5] max-w-[400px] bg-white rounded-sm border border-accent/30 shadow-premium flex items-center justify-center">
                <span className="text-ink-300 text-6xl font-playfair">
                  {member.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content Section - Scrollable on right */}
        <div 
          className="flex-1 overflow-y-auto max-h-[55vh] sm:max-h-[47vh] lg:max-h-[92vh] relative"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Decorative background pattern */}
          <div 
            className="absolute inset-0 opacity-[0.015] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(90deg, transparent 0%, var(--color-accent) 50%, transparent 100%), radial-gradient(circle at 1px 1px, var(--color-accent) 1px, transparent 0)`,
              backgroundSize: '100% 1px, 30px 30px',
              backgroundPosition: '0 0, 0 0',
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 p-5 sm:p-8 md:p-10 lg:p-12 xl:p-14">
            {/* Name and Title */}
            <div className="mb-5 sm:mb-8 md:mb-10">
              <h2 id="modal-title" className="text-[clamp(1.5rem,5vw,2.75rem)] font-playfair text-ink-800 mb-2 sm:mb-3 leading-tight">
                {member.name}
              </h2>
              <p className="text-xs sm:text-sm md:text-base uppercase tracking-[0.12em] text-ink-500 font-light">
                {member.title}
              </p>
            </div>

            {/* Bronze Divider */}
            <div className="w-20 sm:w-24 h-0.5 bg-gradient-to-r from-transparent via-accent/80 to-transparent mb-5 sm:mb-8 md:mb-10" aria-hidden="true" />

            {/* Bio */}
            {member.bio && (
              <div className="mb-6 sm:mb-10 md:mb-12">
                {member.bio.split('\n\n').map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="text-sm sm:text-base md:text-lg text-ink-700 font-light leading-[1.75] sm:leading-[1.8] mb-4 sm:mb-6 last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {/* LinkedIn - Only show if exists */}
            {member.linkedin && (
              <div className="pt-6 border-t border-accent/30">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-base text-ink-600 hover:text-accent transition-colors transition-standard group/link"
                >
                  <span className="w-7 h-7 flex items-center justify-center flex-shrink-0 bg-ink-100/40 border border-ink-100/60 rounded-sm group-hover/link:bg-accent/10 group-hover/link:border-accent/40 transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </span>
                  <span className="group-hover/link:underline font-medium">LinkedIn</span>
                </a>
              </div>
            )}
          </div>
          
          {/* Navigation Arrows */}
          <div className="sticky bottom-0 left-0 right-0 flex items-center justify-between p-3 sm:p-4 md:p-6 bg-gradient-to-t from-cream via-cream/98 to-transparent border-t border-accent/20 z-20">
            <button
              onClick={() => {
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : allMembers.length - 1;
                onNavigate(prevIndex);
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white/80 hover:bg-white active:bg-white/90 border border-ink-200/60 hover:border-accent/50 rounded-sm text-ink-600 hover:text-accent transition-all transition-standard shadow-soft group/prev touch-target"
              aria-label="Previous team member"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover/prev:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">Previous</span>
            </button>
            
            <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 bg-white/60 rounded-sm border border-ink-100/40">
              <span className="text-[10px] sm:text-xs text-ink-500 font-medium">
                {currentIndex + 1} / {allMembers.length}
              </span>
            </div>
            
            <button
              onClick={() => {
                const nextIndex = currentIndex < allMembers.length - 1 ? currentIndex + 1 : 0;
                onNavigate(nextIndex);
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white/80 hover:bg-white active:bg-white/90 border border-ink-200/60 hover:border-accent/50 rounded-sm text-ink-600 hover:text-accent transition-all transition-standard shadow-soft group/next touch-target"
              aria-label="Next team member"
            >
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">Next</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover/next:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

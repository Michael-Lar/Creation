'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
  }, []);

  useEffect(() => {
    if (!preloaderRef.current) return;

    // If user prefers reduced motion, skip animation
    if (prefersReducedMotion) {
      if (preloaderRef.current) {
        preloaderRef.current.style.display = 'none';
      }
      onComplete?.();
      return;
    }

    const tl = gsap.timeline();

    // Initial state
    gsap.set(preloaderRef.current, { opacity: 1 });
    gsap.set(logoRef.current, { opacity: 0, scale: 0.8, rotate: -10 });
    gsap.set(textRef.current, { opacity: 0, y: 15 });
    gsap.set(lineRef.current, { scaleX: 0 });

    // Animation sequence
    tl
      // Logo fades in with subtle scale and rotation
      .to(logoRef.current, {
        duration: 0.8,
        delay: 0.2,
        opacity: 1,
        scale: 1,
        rotate: 0,
        ease: 'power3.out',
      })
      // Text fades in
      .to(textRef.current, {
        duration: 0.6,
        opacity: 1,
        y: 0,
        ease: 'power3.out',
      }, '-=0.4')
      // Line animates
      .to(lineRef.current, {
        duration: 0.8,
        scaleX: 1,
        ease: 'power2.inOut',
      }, '-=0.3')
      // Hold for a moment, then fade out
      .to([logoRef.current, textRef.current, lineRef.current], {
        duration: 0.5,
        delay: 0.6,
        opacity: 0,
        y: -10,
        ease: 'power2.in',
        stagger: 0.05,
      })
      // Fade out preloader
      .to(preloaderRef.current, {
        duration: 0.6,
        opacity: 0,
        ease: 'power2.in',
        onComplete: () => {
          if (preloaderRef.current) {
            preloaderRef.current.style.display = 'none';
          }
          onComplete?.();
        },
      }, '-=0.3');

  }, [onComplete, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-cream)' }}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center">
        {/* Logo Mark */}
        <img
          ref={logoRef}
          src="/logos/logo.svg"
          alt=""
          className="w-20 h-20 md:w-24 md:h-24 mb-6"
          style={{ 
            filter: 'grayscale(20%)',
          }}
        />
        
        {/* Company Name */}
        <div ref={textRef} className="text-center mb-4">
          <span className="text-headline text-ink-800 tracking-[-0.03em] font-light">
            Creation Partners
          </span>
        </div>
        
        {/* Animated line */}
        <div 
          ref={lineRef}
          className="w-16 h-px bg-accent"
          style={{ transformOrigin: 'center' }}
        />
      </div>
    </div>
  );
}

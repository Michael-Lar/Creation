'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const scanlineRef = useRef<HTMLDivElement>(null);
  const staticRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
  }, []);

  useEffect(() => {
    if (!mounted || !preloaderRef.current || !logoRef.current) return;

    // If user prefers reduced motion, skip animation
    if (prefersReducedMotion) {
      if (preloaderRef.current) {
        preloaderRef.current.style.display = 'none';
      }
      onComplete?.();
      return;
    }

    const logo = logoRef.current;
    const tl = gsap.timeline();

    // Initial state
    gsap.set(preloaderRef.current, { opacity: 1 });
    gsap.set(logo, { opacity: 0, scale: 0.95 });
    gsap.set(scanlineRef.current, { opacity: 0 });
    gsap.set(staticRef.current, { opacity: 0 });

    // RGB glitch filter values
    const glitchOn = 'brightness(0) invert(1) drop-shadow(-4px 0 0 rgba(255, 0, 0, 0.8)) drop-shadow(4px 0 0 rgba(0, 255, 255, 0.8)) drop-shadow(0 2px 0 rgba(0, 255, 0, 0.5))';
    const glitchOff = 'brightness(0) invert(1) drop-shadow(0 0 0 transparent)';
    const glitchMild = 'brightness(0) invert(1) drop-shadow(-2px 0 0 rgba(255, 0, 0, 0.5)) drop-shadow(2px 0 0 rgba(0, 255, 255, 0.5))';

    // Animation sequence with old-school color TV glitch effect
    tl
      // Initial glitch flicker with RGB separation
      .to(logo, {
        duration: 0.08,
        opacity: 0.4,
        scale: 0.98,
        ease: 'power1.inOut',
        onStart: () => {
          logo.style.filter = glitchOn;
        },
      })
      .to(logo, {
        duration: 0.05,
        opacity: 0.8,
        x: -3,
        ease: 'power1.inOut',
      })
      .to(logo, {
        duration: 0.05,
        opacity: 0.3,
        x: 2,
        ease: 'power1.inOut',
        onStart: () => {
          logo.style.filter = glitchMild;
        },
      })
      .to(logo, {
        duration: 0.08,
        opacity: 0.6,
        x: -1,
        scale: 1.01,
        ease: 'power1.inOut',
        onStart: () => {
          logo.style.filter = glitchOn;
        },
      })
      .to(logo, {
        duration: 0.05,
        opacity: 0.9,
        x: 0,
        ease: 'power1.inOut',
      })
      // Logo stabilizes
      .to(logo, {
        duration: 0.6,
        opacity: 1,
        scale: 1,
        x: 0,
        ease: 'power3.out',
        onStart: () => {
          logo.style.filter = glitchOff;
        },
      })
      // Scanlines appear
      .to(scanlineRef.current, {
        duration: 0.3,
        opacity: 0.15,
        ease: 'power2.out',
      }, '-=0.4')
      // Static noise appears briefly
      .to(staticRef.current, {
        duration: 0.15,
        opacity: 0.1,
        ease: 'power1.inOut',
      }, '-=0.2')
      .to(staticRef.current, {
        duration: 0.2,
        opacity: 0,
        ease: 'power1.inOut',
      })
      // Hold for a moment
      .to({}, { duration: 0.8 })
      // Final glitch before fade out
      .to(logo, {
        duration: 0.04,
        x: -2,
        ease: 'power1.inOut',
        onStart: () => {
          logo.style.filter = glitchOn;
        },
      })
      .to(logo, {
        duration: 0.04,
        x: 3,
        ease: 'power1.inOut',
      })
      .to(logo, {
        duration: 0.04,
        x: -1,
        ease: 'power1.inOut',
        onStart: () => {
          logo.style.filter = glitchMild;
        },
      })
      .to(logo, {
        duration: 0.04,
        x: 0,
        ease: 'power1.inOut',
        onStart: () => {
          logo.style.filter = glitchOff;
        },
      })
      // Fade out everything
      .to([logo, scanlineRef.current], {
        duration: 0.5,
        opacity: 0,
        ease: 'power2.in',
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

  }, [onComplete, prefersReducedMotion, mounted]);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  // If user prefers reduced motion, render but hide immediately
  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ 
        backgroundColor: '#0F0E0D',
        backgroundImage: `
          radial-gradient(ellipse at 50% 50%, rgba(184, 160, 104, 0.03) 0%, transparent 70%)
        `
      }}
      aria-hidden="true"
    >
      {/* Old-School Color TV Static Noise Overlay */}
      <div
        ref={staticRef}
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,0,0,0.05) 1px, rgba(255,0,0,0.05) 2px, transparent 2px, transparent 3px, rgba(0,255,0,0.05) 3px, rgba(0,255,0,0.05) 4px, transparent 4px, transparent 5px, rgba(0,0,255,0.05) 5px, rgba(0,0,255,0.05) 6px),
            repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,0,0,0.05) 1px, rgba(255,0,0,0.05) 2px, transparent 2px, transparent 3px, rgba(0,255,0,0.05) 3px, rgba(0,255,0,0.05) 4px, transparent 4px, transparent 5px, rgba(0,0,255,0.05) 5px, rgba(0,0,255,0.05) 6px)
          `,
          backgroundSize: '6px 6px',
          animation: 'tv-static 0.08s steps(1) infinite',
        }}
        aria-hidden="true"
      />

      {/* Scanlines Effect */}
      <div
        ref={scanlineRef}
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.03) 2px,
              rgba(255, 255, 255, 0.03) 4px
            )
          `,
          backgroundSize: '100% 4px',
        }}
        aria-hidden="true"
      />

      {/* Logo with RGB Chromatic Aberration via drop-shadow */}
      <div 
        ref={logoRef}
        className="relative z-10"
      >
        <img
          src="/logos/logo-with-text.svg"
          alt="Creation Partners"
          className="w-64 md:w-80 lg:w-96 h-auto"
          style={{
            imageRendering: 'crisp-edges',
            filter: 'brightness(0) invert(1)',
          }}
        />
      </div>

      {/* Subtle vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)',
        }}
        aria-hidden="true"
      />
    </div>
  );
}

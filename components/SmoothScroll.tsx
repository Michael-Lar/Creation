'use client';

import { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { markLenisReady } from '@/utils/lenis';
import { LENIS_CONFIG, EASING } from '@/constants/animations';

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Guard against SSR
    if (typeof window === 'undefined') {
      markLenisReady(); // Mark ready anyway so dependent code doesn't hang
      return;
    }

    if (prefersReducedMotion) {
      markLenisReady(); // Mark ready even without Lenis so dependent code doesn't hang
      return; // Don't initialize Lenis if user prefers reduced motion
    }

    let lenis: Lenis | null = null;
    let rafId: number | null = null;

    try {
      // Initialize Lenis with error handling for Safari
      lenis = new Lenis({
        duration: LENIS_CONFIG.DURATION,
        easing: EASING.LENIS_EASING,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: LENIS_CONFIG.WHEEL_MULTIPLIER,
        touchMultiplier: LENIS_CONFIG.TOUCH_MULTIPLIER,
        infinite: false,
      });

      // Store Lenis instance globally for other components to access
      window.lenis = lenis;
      
      // Mark Lenis as ready
      markLenisReady();

      // Prevent Lenis from interfering with Next.js Link navigation
      // Stop any ongoing scroll when clicking Next.js Links
      const handleLinkClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const link = target.closest('a[href^="/"]') as HTMLAnchorElement;
        
        // If it's a Next.js route link (starts with / and not a hash), stop Lenis scroll
        if (link && lenis) {
          const href = link.getAttribute('href') || '';
          // Only stop for route navigation (not hash links)
          if (href.startsWith('/') && !href.includes('#')) {
            lenis.stop();
          }
        }
      };

      document.addEventListener('click', handleLinkClick, true);

      // Animation frame loop
      function raf(time: number) {
        if (lenis) {
          lenis.raf(time);
        }
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);

      // Cleanup
      return () => {
        document.removeEventListener('click', handleLinkClick, true);
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
        if (lenis) {
          lenis.destroy();
        }
        delete window.lenis;
      };
    } catch (error) {
      // Lenis failed to initialize (can happen in Safari or with certain browser settings)
      console.warn('Lenis initialization failed, falling back to native scroll:', error);
      markLenisReady(); // Mark ready anyway so dependent code doesn't hang
      return;
    }
  }, [prefersReducedMotion]);

  return <>{children}</>;
}


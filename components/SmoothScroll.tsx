'use client';

import { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { LENIS_CONFIG, EASING } from '@/constants/animations';

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return; // Don't initialize Lenis if user prefers reduced motion
    }

    // Initialize Lenis
    const lenis = new Lenis({
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

    // Prevent Lenis from interfering with Next.js Link navigation
    // Stop any ongoing scroll when clicking Next.js Links
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="/"]') as HTMLAnchorElement;
      
      // If it's a Next.js route link (starts with / and not a hash), stop Lenis scroll
      if (link) {
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
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleLinkClick, true);
      lenis.destroy();
      delete window.lenis;
    };
  }, [prefersReducedMotion]);

  return <>{children}</>;
}


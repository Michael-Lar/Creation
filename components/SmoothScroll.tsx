'use client';

import { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      return; // Don't initialize Lenis if user prefers reduced motion
    }

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
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
  }, []);

  return <>{children}</>;
}


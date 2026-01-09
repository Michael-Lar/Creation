'use client';

import { useEffect, useState, useCallback } from 'react';
import type { LenisInstance, LenisScrollToOptions } from '@/types/lenis';

/**
 * Type guard to check if a value is a valid Lenis instance
 */
function isLenisInstance(value: unknown): value is LenisInstance {
  return (
    typeof value === 'object' &&
    value !== null &&
    'scroll' in value &&
    'on' in value &&
    'off' in value &&
    'scrollTo' in value &&
    'stop' in value &&
    'start' in value &&
    'destroy' in value
  );
}

/**
 * Get the Lenis instance from window with type safety
 */
export function getLenisInstance(): LenisInstance | null {
  if (typeof window === 'undefined') return null;
  
  const lenis = window.lenis;
  if (isLenisInstance(lenis)) {
    return lenis;
  }
  
  return null;
}

/**
 * Hook to access Lenis instance with type safety
 * Returns null if Lenis is not available
 */
export function useLenis(): LenisInstance | null {
  const [lenis, setLenis] = useState<LenisInstance | null>(null);

  useEffect(() => {
    // Check if Lenis is available
    const checkLenis = () => {
      const instance = getLenisInstance();
      setLenis(instance);
    };

    // Initial check
    checkLenis();

    // Poll for Lenis initialization (in case it's initialized after mount)
    const interval = setInterval(() => {
      if (!lenis) {
        checkLenis();
      } else {
        clearInterval(interval);
      }
    }, 100);

    // Cleanup interval after 5 seconds (Lenis should be initialized by then)
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [lenis]);

  return lenis;
}

/**
 * Hook to get current scroll position (works with both Lenis and native scroll)
 */
export function useScrollPosition(): number {
  const [scrollY, setScrollY] = useState(0);
  const lenis = useLenis();

  useEffect(() => {
    const updateScroll = () => {
      if (lenis) {
        setScrollY(lenis.scroll);
      } else {
        setScrollY(window.scrollY);
      }
    };

    // Initial update
    updateScroll();

    if (lenis) {
      lenis.on('scroll', updateScroll);
      return () => {
        lenis.off('scroll', updateScroll);
      };
    } else {
      window.addEventListener('scroll', updateScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', updateScroll);
      };
    }
  }, [lenis]);

  return scrollY;
}

/**
 * Helper function to scroll to a target using Lenis or native scroll
 */
export function scrollTo(
  target: HTMLElement | string | number,
  options?: LenisScrollToOptions
): void {
  const lenis = getLenisInstance();
  
  if (lenis) {
    lenis.scrollTo(target, options);
  } else {
    // Fallback to native scroll
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

/**
 * Helper function to stop Lenis scrolling
 */
export function stopLenis(): void {
  const lenis = getLenisInstance();
  if (lenis) {
    lenis.stop();
  }
}

/**
 * Helper function to start Lenis scrolling
 */
export function startLenis(): void {
  const lenis = getLenisInstance();
  if (lenis) {
    lenis.start();
  }
}

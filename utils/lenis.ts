'use client';

import { useEffect, useState } from 'react';
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
    const checkLenis = () => {
      const instance = getLenisInstance();
      if (instance) {
        setLenis(instance);
      }
    };

    checkLenis(); // Initial check
    waitForLenis().then(checkLenis); // Check again when ready
  }, []); // Empty deps - only run on mount

  return lenis;
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

/**
 * Lenis ready state management
 */
let lenisReady = false;
let lenisReadyPromise: Promise<void> | null = null;
let lenisReadyResolve: (() => void) | null = null;

/**
 * Mark Lenis as ready (called by SmoothScroll after initialization)
 */
export function markLenisReady(): void {
  if (lenisReady) return;
  lenisReady = true;
  if (lenisReadyResolve) {
    lenisReadyResolve();
    lenisReadyResolve = null;
    lenisReadyPromise = null;
  }
}

/**
 * Check if Lenis is ready
 */
export function isLenisReady(): boolean {
  return lenisReady;
}

/**
 * Wait for Lenis to be ready (returns immediately if already ready)
 */
export function waitForLenis(): Promise<void> {
  if (lenisReady) {
    return Promise.resolve();
  }
  if (!lenisReadyPromise) {
    lenisReadyPromise = new Promise<void>((resolve) => {
      lenisReadyResolve = resolve;
    });
  }
  return lenisReadyPromise;
}

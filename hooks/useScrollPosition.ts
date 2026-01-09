'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLenis } from '@/utils/lenis';

interface UseScrollPositionOptions {
  onScroll?: (scrollY: number) => void;
  throttle?: number;
}

/**
 * Hook to track scroll position with automatic Lenis/native fallback
 * Consolidates the common pattern of listening to scroll events
 */
export function useScrollPosition(options: UseScrollPositionOptions = {}): number {
  const { onScroll, throttle = 16 } = options;
  const [scrollY, setScrollY] = useState(0);
  const lenis = useLenis();

  useEffect(() => {
    let rafId: number | null = null;
    let lastUpdate = 0;

    const updateScroll = () => {
      const now = Date.now();
      if (now - lastUpdate < throttle) {
        rafId = requestAnimationFrame(updateScroll);
        return;
      }
      
      lastUpdate = now;
      const currentScroll = lenis ? lenis.scroll : window.scrollY;
      setScrollY(currentScroll);
      onScroll?.(currentScroll);
    };

    // Initial update
    updateScroll();

    if (lenis) {
      lenis.on('scroll', updateScroll);
      return () => {
        lenis.off('scroll', updateScroll);
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
      };
    } else {
      window.addEventListener('scroll', updateScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', updateScroll);
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
      };
    }
  }, [lenis, onScroll, throttle]);

  return scrollY;
}

/**
 * Hook to subscribe to scroll events with automatic cleanup
 * Useful for components that need to react to scroll changes
 */
export function useScrollListener(
  callback: (scrollY: number) => void,
  options: { throttle?: number } = {}
): void {
  const { throttle = 16 } = options;
  const lenis = useLenis();

  useEffect(() => {
    let rafId: number | null = null;
    let lastUpdate = 0;

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastUpdate < throttle) {
        rafId = requestAnimationFrame(handleScroll);
        return;
      }
      
      lastUpdate = now;
      const scrollY = lenis ? lenis.scroll : window.scrollY;
      callback(scrollY);
    };

    // Initial call
    handleScroll();

    if (lenis) {
      lenis.on('scroll', handleScroll);
      return () => {
        lenis.off('scroll', handleScroll);
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
      };
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
      };
    }
  }, [lenis, callback, throttle]);
}

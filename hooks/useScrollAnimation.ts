'use client';

import { useEffect, useRef, RefObject } from 'react';
import { gsap } from '@/utils/gsap';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface UseScrollAnimationOptions {
  trigger?: RefObject<HTMLElement>;
  disabled?: boolean;
}

/**
 * Reusable hook for scroll-triggered animations
 * Handles GSAP context cleanup automatically
 * Respects prefers-reduced-motion
 */
export function useScrollAnimation(
  containerRef: RefObject<HTMLElement>,
  animationFn: () => void,
  options: UseScrollAnimationOptions = {}
) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { trigger, disabled = false } = options;
  const animationFnRef = useRef(animationFn);
  const ctxRef = useRef<gsap.Context | null>(null);

  // Update ref when animation function changes
  useEffect(() => {
    animationFnRef.current = animationFn;
  }, [animationFn]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (prefersReducedMotion || disabled) {
      // Clean up any existing context if disabled
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
      return;
    }

    // Use double requestAnimationFrame to ensure DOM is fully ready
    let rafId1: number;
    const rafId2 = requestAnimationFrame(() => {
      rafId1 = requestAnimationFrame(() => {
        if (!containerRef.current) return;

        const container = trigger?.current || containerRef.current;
        if (!container) return;

        // Clean up any existing context
        if (ctxRef.current) {
          ctxRef.current.revert();
        }

        // Create new context and run animation
        // The context automatically tracks all GSAP animations created within
        const ctx = gsap.context(() => {
          animationFnRef.current();
        }, container);
        
        ctxRef.current = ctx;
      });
    });

    return () => {
      cancelAnimationFrame(rafId2);
      if (typeof rafId1 !== 'undefined') {
        cancelAnimationFrame(rafId1);
      }
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    };
    // Only re-run when these values change (refs are stable, so we check .current inside)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion, disabled]);
}
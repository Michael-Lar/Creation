'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number; // delay in ms
  threshold?: number; // 0-1, how much of element should be visible
  once?: boolean; // animate only once
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  threshold = 0.1,
  once = true,
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // If user prefers reduced motion, show content immediately
    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add delay if specified
            if (delay > 0) {
              setTimeout(() => setIsRevealed(true), delay);
            } else {
              setIsRevealed(true);
            }
            
            // Unobserve if we only want to animate once
            if (once) {
              observer.unobserve(element);
            }
          } else if (!once) {
            setIsRevealed(false);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before element is fully in view
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [delay, threshold, once, prefersReducedMotion]);

  // If reduced motion is preferred, render without animation wrapper
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={elementRef}
      className={`reveal-on-scroll ${isRevealed ? 'revealed' : ''} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// Stagger helper - for animating lists of items
export function useStaggerDelay(index: number, baseDelay: number = 0, stagger: number = 80): number {
  return baseDelay + index * stagger;
}


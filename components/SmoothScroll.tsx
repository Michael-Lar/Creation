'use client';

import { useEffect, useRef, ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollProps {
  children: ReactNode;
  options?: {
    duration?: number;
    easing?: (t: number) => number;
    orientation?: 'vertical' | 'horizontal';
    gestureOrientation?: 'vertical' | 'horizontal';
    smoothWheel?: boolean;
    wheelMultiplier?: number;
    smoothTouch?: boolean;
    touchMultiplier?: number;
    infinite?: boolean;
  };
}

// Singleton to prevent multiple Lenis instances
let lenisInstance: Lenis | null = null;
let rafId: number | null = null;

export default function SmoothScroll({ children, options }: SmoothScrollProps) {
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContentRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Prevent double initialization (React Strict Mode)
    if (isInitializedRef.current || lenisInstance) {
      return;
    }
    
    isInitializedRef.current = true;

    // Initialize Lenis with optimized settings
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => 1 - Math.pow(1 - t, 3), // Cubic ease-out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
      ...options,
    });

    lenisInstance = lenis;

    // ScrollTrigger integration - only update when scroll changes
    let lastScroll = 0;
    lenis.on('scroll', () => {
      const currentScroll = lenis.scroll;
      if (Math.abs(currentScroll - lastScroll) > 0.5) {
        lastScroll = currentScroll;
        ScrollTrigger.update();
      }
    });

    // RAF loop
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Make Lenis instance available globally
    (window as any).lenis = lenis;

    // Refresh ScrollTrigger after DOM is ready
    setTimeout(() => ScrollTrigger.refresh(), 100);

    // Cleanup
    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      lenis.destroy();
      lenisInstance = null;
      delete (window as any).lenis;
      isInitializedRef.current = false;
    };
  }, [options]);

  return (
    <div id="page" className="relative">
      {/* Thin Border Frame - Clean and Elegant (Edge-style) */}
      <div 
        className="fixed inset-0 pointer-events-none z-[10000]"
        style={{
          border: '1px solid rgba(26, 26, 26, 0.5)',
          boxSizing: 'border-box',
          margin: 0,
          padding: 0
        }}
      ></div>
      
      <div id="smooth-wrapper" ref={smoothWrapperRef} className="overflow-hidden">
        <div id="smooth-content" ref={smoothContentRef}>
          {children}
        </div>
      </div>
    </div>
  );
}


'use client';

import { useEffect, useRef, useState } from 'react';
import { useLenis } from '@/utils/lenis';
import { ErrorHandler } from '@/utils/errorHandler';
import type { LenisInstance } from '@/types/lenis';

/**
 * Centralized scroll event manager
 * Maintains a single scroll listener and allows multiple subscribers
 * This prevents performance issues from multiple scroll listeners
 */

type ScrollCallback = (scrollY: number) => void;

class ScrollManager {
  private subscribers = new Set<ScrollCallback>();
  private lenis: LenisInstance | null = null;
  private rafId: number | null = null;
  private lastUpdate = 0;
  private throttle = 16; // ~60fps
  private isListening = false;

  setLenis(lenis: LenisInstance | null) {
    this.lenis = lenis;
  }

  setThrottle(throttle: number) {
    this.throttle = throttle;
  }

  subscribe(callback: ScrollCallback): () => void {
    this.subscribers.add(callback);
    
    // Start listening if this is the first subscriber
    if (!this.isListening) {
      this.startListening();
    }

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
      
      // Stop listening if no more subscribers
      if (this.subscribers.size === 0) {
        this.stopListening();
      }
    };
  }

  private notifySubscribers(scrollY: number) {
    this.subscribers.forEach(callback => {
      try {
        callback(scrollY);
      } catch (error) {
        ErrorHandler.handleScrollError(error, {
          scrollY,
          callbackName: callback.name || 'anonymous',
        });
      }
    });
  }

  private updateScroll = () => {
    const now = Date.now();
    if (now - this.lastUpdate < this.throttle) {
      this.rafId = requestAnimationFrame(this.updateScroll);
      return;
    }
    
    this.lastUpdate = now;
    // Guard against SSR and Safari edge cases
    const scrollY = this.lenis 
      ? this.lenis.scroll 
      : (typeof window !== 'undefined' ? window.scrollY : 0);
    this.notifySubscribers(scrollY);
  };

  private startListening() {
    if (this.isListening) return;
    this.isListening = true;

    // Initial update
    this.updateScroll();

    if (this.lenis) {
      this.lenis.on('scroll', this.updateScroll);
    } else if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.updateScroll, { passive: true });
    }
  }

  private stopListening() {
    if (!this.isListening) return;
    this.isListening = false;

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (this.lenis) {
      this.lenis.off('scroll', this.updateScroll);
    } else if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.updateScroll);
    }
  }

  destroy() {
    this.stopListening();
    this.subscribers.clear();
  }
}

// Singleton instance
let scrollManagerInstance: ScrollManager | null = null;

function getScrollManager(): ScrollManager {
  if (!scrollManagerInstance) {
    scrollManagerInstance = new ScrollManager();
  }
  return scrollManagerInstance;
}

/**
 * Hook to subscribe to scroll events using the centralized scroll manager
 * This consolidates all scroll listeners into a single shared listener
 */
export function useScrollListener(
  callback: (scrollY: number) => void,
  options: { throttle?: number } = {}
): void {
  const lenis = useLenis();
  const callbackRef = useRef(callback);
  const { throttle = 16 } = options;

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const manager = getScrollManager();
    
    // Update Lenis instance
    manager.setLenis(lenis);
    manager.setThrottle(throttle);

    // Create a stable callback wrapper that uses the ref
    const stableCallback = (scrollY: number) => {
      callbackRef.current(scrollY);
    };

    // Subscribe to scroll events
    const unsubscribe = manager.subscribe(stableCallback);

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [lenis, throttle]);
}

/**
 * Hook to get current scroll position using the centralized scroll manager
 */
export function useScrollPosition(options: { throttle?: number } = {}): number {
  const [scrollY, setScrollY] = useState(0);
  const { throttle = 16 } = options;

  useScrollListener((scroll) => {
    setScrollY(scroll);
  }, { throttle });

  return scrollY;
}

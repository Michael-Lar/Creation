/**
 * TypeScript declarations for Lenis smooth scroll library
 */

export interface LenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  orientation?: 'vertical' | 'horizontal';
  gestureOrientation?: 'vertical' | 'horizontal';
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  touchMultiplier?: number;
  infinite?: boolean;
}

export interface LenisScrollToOptions {
  offset?: number;
  immediate?: boolean;
  duration?: number;
  easing?: (t: number) => number;
  lock?: boolean;
  force?: boolean;
  lerp?: number;
  onComplete?: () => void;
}

export interface LenisInstance {
  scroll: number;
  limit: number;
  velocity: number;
  direction: number;
  isScrolling: boolean | string;
  isStopped: boolean;
  isSmooth: boolean;
  
  on(event: 'scroll', handler: (e: { scroll: number; limit: number; velocity: number; direction: number; progress: number }) => void): void;
  off(event: 'scroll', handler: (e: { scroll: number; limit: number; velocity: number; direction: number; progress: number }) => void): void;
  raf(time: number): void;
  scrollTo(target: HTMLElement | string | number, options?: LenisScrollToOptions): void;
  stop(): void;
  start(): void;
  resize(): void;
  destroy(): void;
}

declare class Lenis {
  constructor(options?: LenisOptions);
  scroll: number;
  limit: number;
  velocity: number;
  direction: number;
  isScrolling: boolean | string;
  isStopped: boolean;
  isSmooth: boolean;
  
  on(event: 'scroll', handler: (e: { scroll: number; limit: number; velocity: number; direction: number; progress: number }) => void): void;
  off(event: 'scroll', handler: (e: { scroll: number; limit: number; velocity: number; direction: number; progress: number }) => void): void;
  raf(time: number): void;
  scrollTo(target: HTMLElement | string | number, options?: LenisScrollToOptions): void;
  stop(): void;
  start(): void;
  resize(): void;
  destroy(): void;
}

export default Lenis;

declare global {
  interface Window {
    lenis?: LenisInstance | Lenis;
  }
}


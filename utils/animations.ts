import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Standardized animation constants
 * Central source of truth for all animation parameters across the website
 */
export const ANIMATIONS = {
  // Durations (in seconds)
  duration: {
    fast: 0.25,
    standard: 0.3,
    medium: 0.35,
    slow: 0.8,
  },
  
  // Easing functions
  ease: {
    standard: 'power1.out',
    smooth: 'power2.out',
    sharp: 'power3.out',
    in: 'power1.in',
    inOut: 'power2.inOut',
  },
  
  // ScrollTrigger defaults
  scrollTrigger: {
    start: 'top 95%',
    once: true, // Default to once for performance
  },
  
  // Stagger timing (in seconds)
  stagger: {
    tight: 0.02,
    standard: 0.03,
    loose: 0.05,
  },
  
  // Transform values
  transform: {
    slideUp: {
      small: 10,
      medium: 15,
      large: 30,
    },
    scale: {
      subtle: 0.97,
      medium: 0.95,
      large: 0.9,
    },
  },
} as const;

/**
 * Standard scroll reveal animation
 * Creates a fade + slide-up animation with consistent defaults
 */
export function createScrollReveal(
  element: gsap.TweenTarget | null | undefined,
  options: {
    y?: number;
    scale?: number;
    duration?: number;
    ease?: string;
    trigger?: HTMLElement | null;
    start?: string;
    once?: boolean;
  } = {}
) {
  if (!element) return null;

  const {
    y = ANIMATIONS.transform.slideUp.medium,
    scale,
    duration = ANIMATIONS.duration.standard,
    ease = ANIMATIONS.ease.standard,
    trigger,
    start = ANIMATIONS.scrollTrigger.start,
    once = ANIMATIONS.scrollTrigger.once,
  } = options;

  const vars: gsap.TweenVars = {
    opacity: 0,
    y,
    duration,
    ease,
    scrollTrigger: {
      trigger: trigger || (element as HTMLElement),
      start,
      once,
    },
  };

  if (scale !== undefined) {
    vars.scale = scale;
  }

  return gsap.from(element, vars);
}

/**
 * Standard stagger reveal animation
 * Creates a staggered fade + slide-up animation for multiple elements
 */
export function createStaggerReveal(
  elements: gsap.TweenTarget | null | undefined,
  options: {
    y?: number;
    duration?: number;
    ease?: string;
    stagger?: number | gsap.StaggerVars;
    trigger?: HTMLElement | null;
    start?: string;
    once?: boolean;
  } = {}
) {
  if (!elements) return null;

  const {
    y = ANIMATIONS.transform.slideUp.medium,
    duration = ANIMATIONS.duration.standard,
    ease = ANIMATIONS.ease.standard,
    stagger = ANIMATIONS.stagger.standard,
    trigger,
    start = ANIMATIONS.scrollTrigger.start,
    once = ANIMATIONS.scrollTrigger.once,
  } = options;

  return gsap.from(elements, {
    opacity: 0,
    y,
    duration,
    ease,
    stagger,
    scrollTrigger: {
      trigger: trigger || (elements as HTMLElement),
      start,
      once,
    },
  });
}

/**
 * Performance optimization: Add will-change hint for animations
 * Automatically removes will-change after animation completes
 */
export function optimizeForAnimation(element: HTMLElement | HTMLElement[]) {
  const elements = Array.isArray(element) ? element : [element];
  elements.forEach((el) => {
    if (el && el.style) {
      el.style.willChange = 'transform, opacity';
      // Remove will-change after animation completes to avoid performance issues
      setTimeout(() => {
        if (el && el.style) {
          el.style.willChange = 'auto';
        }
      }, 1000);
    }
  });
}

/**
 * Batch DOM reads/writes for better performance
 */
export function batchAnimation(animations: gsap.core.Tween[]) {
  return gsap.timeline().add(animations);
}

/**
 * Schedule animation using double requestAnimationFrame for DOM readiness
 */
export function scheduleAnimation(callback: () => void) {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });
}
/**
 * Animation timing constants
 * Centralized source for all animation durations and delays
 */
export const ANIMATION_TIMING = {
  // Video rotation timings (Hero component)
  VIDEO_PREPARE_DELAY: 2000,
  VIDEO_FADE_DELAY: 2500,
  VIDEO_ROTATION_DELAY: 3000,
  
  // Header fade-in delay
  HEADER_FADE_DELAY: 2500,
  
  // Shimmer effect delays
  SHIMMER_START_DELAY: 1200,
  
  // Scroll indicator fade
  SCROLL_INDICATOR_FADE_DURATION: 0.3,
} as const;

/**
 * Easing functions for animations
 */
export const EASING = {
  // Lenis smooth scroll easing
  LENIS_EASING: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  
  // GSAP easing strings
  STANDARD: 'power1.out',
  SMOOTH: 'power2.out',
  SHARP: 'power3.out',
  IN: 'power1.in',
  IN_OUT: 'power2.inOut',
} as const;

/**
 * Lenis configuration constants
 */
export const LENIS_CONFIG = {
  DURATION: 1.2,
  WHEEL_MULTIPLIER: 1,
  TOUCH_MULTIPLIER: 2,
} as const;

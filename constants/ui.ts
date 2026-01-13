/**
 * UI constants
 * Centralized source for breakpoints, timeouts, scroll thresholds, and other UI magic numbers
 */

/**
 * Breakpoint values (in pixels)
 */
export const BREAKPOINTS = {
  DESKTOP: 1024, // Desktop breakpoint (lg in Tailwind)
  TABLET: 768,   // Tablet breakpoint (md in Tailwind)
  MOBILE: 640,   // Mobile breakpoint (sm in Tailwind)
} as const;

/**
 * Debounce and throttle delays (in milliseconds)
 */
export const TIMING = {
  RESIZE_DEBOUNCE: 150,        // Resize event debounce delay
  SCROLL_THROTTLE: 16,          // Scroll event throttle (~60fps)
  FOCUS_DELAY: 100,             // Focus timeout delay
  MENU_FOCUS_DELAY: 100,        // Menu item focus delay
  HASH_CHANGE_DELAY: 500,       // Hash change handler delay
  SCROLL_RESET_DELAY: 50,      // Scroll reset timeout
  VIDEO_ERROR_RETRY: 500,       // Video error retry delay
  VIDEO_READY_CHECK: 100,       // Video ready state check delay
  LENIS_POLL_INTERVAL: 100,     // Lenis polling interval
  LENIS_POLL_TIMEOUT: 5000,     // Lenis polling timeout
  PRELOADER_FALLBACK: 4000,     // Preloader fallback timer
  HEADER_FADE_DELAY: 2500,      // Header fade-in delay
} as const;

/**
 * Scroll thresholds and offsets (in pixels)
 */
export const SCROLL = {
  HEADER_SCROLLED_THRESHOLD: 50,        // Header "scrolled" state threshold
  HERO_OVER_THRESHOLD: 0.8,              // Hero section overlay threshold (80% of viewport)
  SECTION_OFFSET: -100,                  // Scroll to section offset
  PROGRESS_Z_INDEX: 50,                  // Scroll progress bar z-index
} as const;

/**
 * Visual constants
 */
export const VISUAL = {
  CURSOR_GLOW_SIZE: 600,                 // Cursor glow effect size (px)
  SHIMMER_BACKGROUND_SIZE: '200%',       // Shimmer background size
  SHIMMER_BACKGROUND_POSITION: '-200%',   // Shimmer initial background position
  SHIMMER_BACKGROUND_POSITION_END: '200%', // Shimmer end background position
  GRAYSCALE_FILTER: 'grayscale(100%) contrast(1.15)', // Image grayscale filter
  MODAL_Z_INDEX: 100,                    // Modal z-index
  FRAME_Z_INDEX: 100,                    // Border frame z-index
} as const;

/**
 * Percentage values
 */
export const PERCENTAGES = {
  HERO_OVER: 0.8,                        // 80% - Hero overlay threshold
  FULL: 100,                             // 100%
  HALF: 50,                              // 50%
  TRANSPARENT_START: 0,                   // 0%
} as const;

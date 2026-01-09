import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Centralized GSAP initialization
 * ScrollTrigger is registered once here to avoid duplicate registrations
 */
let isInitialized = false;

export function initializeGSAP(): void {
  if (typeof window === 'undefined' || isInitialized) return;
  
  gsap.registerPlugin(ScrollTrigger);
  isInitialized = true;
}

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
  initializeGSAP();
}

// Export GSAP and ScrollTrigger for use in components
export { gsap, ScrollTrigger };
export default gsap;

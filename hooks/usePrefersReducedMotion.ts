import { useEffect, useState } from 'react';

/**
 * Hook to detect user's preference for reduced motion
 * Respects prefers-reduced-motion media query for accessibility
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    motionQuery.addEventListener('change', handleChange);
    
    return () => {
      motionQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}
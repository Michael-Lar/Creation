'use client';

import { useEffect } from 'react';

/**
 * Configures scroll restoration at the app level.
 * Sets window.history.scrollRestoration to 'manual' so Lenis can handle
 * scroll restoration consistently across the application.
 * 
 * This hook should be called once at the top level of the app (e.g., in app/page.tsx)
 * to prevent conflicts from multiple components trying to control scroll independently.
 */
export function useScrollConfiguration() {
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
    // Disable automatic scroll restoration so Lenis can handle it
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []); // Empty dependency array - run once on mount
}
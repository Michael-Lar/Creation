'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/utils/gsap';
import { useLenis } from '@/utils/lenis';

export default function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);

  const lenis = useLenis();

  useEffect(() => {
    if (!progressRef.current) return;

    const updateProgress = () => {
      let progress = 0;

      if (lenis) {
        // Use Lenis scroll position
        const scrollProgress = lenis.scroll;
        const limit = lenis.limit;
        progress = limit > 0 ? scrollProgress / limit : 0;
      } else {
        // Fallback to native scroll if Lenis not available
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const scrollableHeight = documentHeight - windowHeight;
        progress = scrollableHeight > 0 ? scrollTop / scrollableHeight : 0;
      }
      
      if (progressRef.current) {
        gsap.to(progressRef.current, {
          scaleX: progress,
          duration: 0.1,
          ease: 'none',
          transformOrigin: 'left',
        });
      }
    };

    // Initial update
    updateProgress();

    // Try to use Lenis scroll event
    if (lenis) {
      lenis.on('scroll', updateProgress);
      return () => {
        lenis.off('scroll', updateProgress);
      };
    } else {
      // Fallback to native scroll
      window.addEventListener('scroll', updateProgress, { passive: true });
      return () => window.removeEventListener('scroll', updateProgress);
    }
  }, [lenis]);

  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 bg-bronze/30 z-50 origin-left">
      <div
        ref={progressRef}
        className="h-full bg-bronze origin-left"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}


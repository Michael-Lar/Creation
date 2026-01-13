'use client';

import { useRef } from 'react';
import { gsap } from '@/utils/gsap';
import { useLenis } from '@/utils/lenis';
import { useScrollListener } from '@/hooks/useScrollPosition';
import { SCROLL } from '@/constants/ui';

export default function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  const updateProgress = (scrollY: number) => {
    if (!progressRef.current) return;

    let progress = 0;

    if (lenis) {
      // Use Lenis scroll position
      const limit = lenis.limit;
      progress = limit > 0 ? scrollY / limit : 0;
    } else {
      // Fallback to native scroll if Lenis not available
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollableHeight = documentHeight - windowHeight;
      progress = scrollableHeight > 0 ? scrollY / scrollableHeight : 0;
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

  // Use centralized scroll listener
  useScrollListener(updateProgress);

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-0.5 bg-bronze/30 origin-left"
      style={{ zIndex: SCROLL.PROGRESS_Z_INDEX }}
    >
      <div
        ref={progressRef}
        className="h-full bg-bronze origin-left"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}


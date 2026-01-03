'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!progressRef.current) return;

    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollableHeight = documentHeight - windowHeight;
      const progress = scrollableHeight > 0 ? scrollTop / scrollableHeight : 0;
      
      if (progressRef.current) {
        gsap.to(progressRef.current, {
          scaleX: progress,
          duration: 0.1,
          ease: 'none',
          transformOrigin: 'left',
        });
      }
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial update

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

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


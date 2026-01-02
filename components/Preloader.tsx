'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const [logoUrl] = useState(`/logos/logo-with-text.svg?t=${Date.now()}`);

  useEffect(() => {
    if (!preloaderRef.current || !logoContainerRef.current) return;

    // Start with background visible, logo hidden
    gsap.set(preloaderRef.current, { opacity: 1 });
    gsap.set(logoContainerRef.current, { opacity: 0 });

    // Fade in logo
    gsap.to(logoContainerRef.current, {
      duration: 0.5,
      delay: 0.3,
      opacity: 1,
      ease: 'power2.out',
    });

    // Fade out logo
    gsap.to(logoContainerRef.current, {
      duration: 0.5,
      delay: 2,
      opacity: 0,
      ease: 'power2.in',
    });

    // Fade out preloader background
    gsap.to(preloaderRef.current, {
      duration: 0.5,
      delay: 2.5,
      opacity: 0,
      ease: 'power2.in',
      onComplete: () => {
        if (preloaderRef.current) {
          preloaderRef.current.style.display = 'none';
        }
        if (onComplete) {
          onComplete();
        }
      },
    });
  }, [onComplete]);

  return (
    <section
      ref={preloaderRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: '#F5F1E8' }}
    >
      <div ref={logoContainerRef} className="flex flex-col items-center justify-center">
        <img
          src={logoUrl}
          alt="Creation Partners"
          width={300}
          height={300}
          style={{ display: 'block' }}
          key={logoUrl}
        />
      </div>
    </section>
  );
}


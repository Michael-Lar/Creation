'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
  }, []);

  useEffect(() => {
    if (!mounted || !preloaderRef.current || !videoRef.current) return;

    // If user prefers reduced motion, skip animation
    if (prefersReducedMotion) {
      if (preloaderRef.current) {
        preloaderRef.current.style.display = 'none';
      }
      onComplete?.();
      return;
    }

    const video = videoRef.current;
    const preloader = preloaderRef.current;

    // Initial state
    gsap.set(preloader, { opacity: 1 });
    gsap.set(video, { opacity: 0 });

    // Simple fade in for video
    gsap.to(video, {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
      delay: 0.2,
    });

    // Play the video
    video.play().catch((err) => {
      console.log('Video autoplay prevented:', err);
    });

    // Listen for video end or use a timer as fallback
    const handleVideoEnd = () => {
      // Fade out video
      gsap.to(video, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
      });

      // Fade out preloader - start content fade-in slightly before preloader fully fades
      gsap.to(preloader, {
        opacity: 0,
        duration: 0.6,
        delay: 0.3,
        ease: 'power2.in',
        onStart: () => {
          // Start content fade-in when preloader starts fading out (overlap transition)
          onComplete?.();
        },
        onComplete: () => {
          if (preloader) {
            preloader.style.display = 'none';
            preloader.style.pointerEvents = 'none';
          }
        },
      });
    };

    video.addEventListener('ended', handleVideoEnd);

    // Fallback timeout in case video doesn't play or end event doesn't fire
    const fallbackTimeout = setTimeout(handleVideoEnd, 3500);

    return () => {
      video.removeEventListener('ended', handleVideoEnd);
      clearTimeout(fallbackTimeout);
    };
  }, [onComplete, prefersReducedMotion, mounted]);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  // If user prefers reduced motion, render but hide immediately
  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ 
        backgroundColor: '#0F0E0D',
        backgroundImage: `
          radial-gradient(ellipse at 50% 50%, rgba(184, 160, 104, 0.03) 0%, transparent 70%)
        `
      }}
      aria-hidden="true"
    >
      {/* Animated Logo Video */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="w-64 sm:w-72 md:w-80 lg:w-96 h-auto relative z-10"
        style={{
          opacity: 0,
          mixBlendMode: 'screen',
          filter: 'contrast(1.1) brightness(1.05)',
        }}
        aria-label="Creation Partners logo animation"
      >
        <source src="/logos/animation.mp4" type="video/mp4" />
      </video>

      {/* Subtle vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)',
        }}
        aria-hidden="true"
      />
    </div>
  );
}

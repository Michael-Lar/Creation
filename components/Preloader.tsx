'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface PreloaderProps {
  onComplete?: () => void;
  shouldSkip?: boolean;
}

export default function Preloader({ onComplete, shouldSkip = false }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const forwardVideoRef = useRef<HTMLVideoElement>(null);
  const reverseVideoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);
  
  // Use refs for persistent flags to survive re-renders without using global variables
  const videoPlayedRef = useRef(false);
  const animationCompleteRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      const skipPreloader = sessionStorage.getItem('scrollToProjects') === 'true' || shouldSkip;
      if (skipPreloader) {
        setShouldShow(false);
        onComplete?.();
      }
    }
  }, [onComplete, shouldSkip]);

  useEffect(() => {
    if (!mounted || !preloaderRef.current || !forwardVideoRef.current || !reverseVideoRef.current || !shouldShow) return;

    if (prefersReducedMotion) {
      if (preloaderRef.current) {
        preloaderRef.current.style.display = 'none';
      }
      onComplete?.();
      return;
    }

    const forwardVideo = forwardVideoRef.current;
    const reverseVideo = reverseVideoRef.current;
    const preloader = preloaderRef.current;

    if (animationCompleteRef.current) {
      if (preloader) {
        preloader.style.display = 'none';
        preloader.style.pointerEvents = 'none';
      }
      onComplete?.();
      return;
    }

    if (videoPlayedRef.current) {
      return;
    }
    
    videoPlayedRef.current = true;

    // Speed up videos for snappier feel
    const playbackSpeed = 1.3;
    forwardVideo.playbackRate = playbackSpeed;
    reverseVideo.playbackRate = playbackSpeed;
    
    // Preload reverse video immediately
    reverseVideo.load();
    
    let reverseTriggered = false;

    const playForward = () => {
      gsap.set(preloader, { opacity: 1 });
      gsap.set(forwardVideo, { opacity: 1 });
      gsap.set(reverseVideo, { opacity: 0 });

      forwardVideo.play().catch(() => {
        finishAnimation();
      });
    };

    const playReverse = () => {
      if (reverseTriggered) return;
      reverseTriggered = true;
      
      // Instant swap
      forwardVideo.style.opacity = '0';
      reverseVideo.style.opacity = '1';
      
      reverseVideo.play().catch(() => {
        finishAnimation();
      });
    };

    const finishAnimation = () => {
      if (animationCompleteRef.current) return;
      animationCompleteRef.current = true;
      
      // Instant fade out
      gsap.to(preloader, {
        opacity: 0,
        duration: 0.15,
        ease: 'power2.in',
        onStart: () => {
          onComplete?.();
        },
        onComplete: () => {
          preloader.style.display = 'none';
          preloader.style.pointerEvents = 'none';
        },
      });
    };

    // Trigger reverse slightly before forward ends for snappier transition
    forwardVideo.ontimeupdate = () => {
      if (!reverseTriggered && forwardVideo.duration - forwardVideo.currentTime < 0.05) {
        playReverse();
      }
    };
    
    // Backup: also listen for ended event
    forwardVideo.onended = playReverse;
    
    // When reverse video ends, finish animation
    reverseVideo.onended = finishAnimation;

    // Start playing when forward video is ready
    if (forwardVideo.readyState >= 3) {
      playForward();
    } else {
      forwardVideo.addEventListener('canplay', playForward, { once: true });
      forwardVideo.load();
    }

    // Fallback timeout
    const fallbackTimeout = setTimeout(() => {
      if (!animationCompleteRef.current) {
        if (forwardVideo.readyState >= 2) {
          playForward();
        } else {
          finishAnimation();
        }
      }
    }, 500);

    return () => {
      forwardVideo.removeEventListener('canplay', playForward);
      clearTimeout(fallbackTimeout);
    };
  }, [onComplete, prefersReducedMotion, mounted, shouldShow]);

  if (!mounted || !shouldShow) {
    return null;
  }

  if (prefersReducedMotion) {
    return null;
  }

  const videoStyles = {
    opacity: 0,
    mixBlendMode: 'screen' as const,
    filter: 'brightness(1.2) contrast(1.15)',
  };

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ 
        backgroundColor: '#0F0E0D',
        backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(184, 160, 104, 0.03) 0%, transparent 70%)`
      }}
      aria-hidden="true"
    >
      {/* Forward animation */}
      <video
        ref={forwardVideoRef}
        muted
        playsInline
        preload="auto"
        className="absolute w-64 sm:w-72 md:w-80 lg:w-96 h-auto z-10"
        style={videoStyles}
      >
        <source src="/logos/animation.mp4" type="video/mp4" />
      </video>

      {/* Reverse animation */}
      <video
        ref={reverseVideoRef}
        muted
        playsInline
        preload="auto"
        className="absolute w-64 sm:w-72 md:w-80 lg:w-96 h-auto z-10"
        style={videoStyles}
      >
        <source src="/logos/reverse.mp4" type="video/mp4" />
      </video>

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

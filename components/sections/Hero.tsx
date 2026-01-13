'use client';

import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { gsap } from '@/utils/gsap';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useScrollListener } from '@/hooks/useScrollPosition';
import { ANIMATION_TIMING } from '@/constants/animations';
import { BREAKPOINTS, TIMING, VISUAL, PERCENTAGES } from '@/constants/ui';
import { useVideoRotation } from '@/hooks/useVideoRotation';

interface HeroProps {
  preloaderComplete?: boolean;
}

function Hero({ preloaderComplete = false }: HeroProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const sectionRef = useRef<HTMLElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const creationTextRef = useRef<HTMLSpanElement>(null);

  // Use video rotation hook
  const {
    activeVideo,
    isLoading,
    hasError,
    errorMessage,
    video1Ref,
    video2Ref,
  } = useVideoRotation({
    preloaderComplete,
    // Don't pass onError - errors are already handled by the hook
  });

  // Debounced resize handler to avoid excessive calculations
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const checkDesktop = useCallback(() => {
    setIsDesktop(window.innerWidth >= BREAKPOINTS.DESKTOP);
  }, []);

  // Check for desktop with debounced resize listener
  useEffect(() => {
    // Initial check
    checkDesktop();
    
    const handleResize = () => {
      // Clear existing timeout
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      // Set new timeout for debounced execution
      resizeTimeoutRef.current = setTimeout(() => {
        checkDesktop();
      }, TIMING.RESIZE_DEBOUNCE);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      // Clean up timeout on unmount
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [checkDesktop]);

  // Cursor glow effect (desktop only, respects reduced motion)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDesktop || prefersReducedMotion || !sectionRef.current) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  }, [isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (!isDesktop || prefersReducedMotion) return;
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove, isDesktop, prefersReducedMotion]);


  // Track if user has scrolled (for shimmer effect)
  const [hasScrolled, setHasScrolled] = useState(false);
  
  // Listen for scroll to stop shimmer
  useScrollListener(() => {
    if (!hasScrolled) {
      setHasScrolled(true);
    }
  });

  // Shimmer effect for "creation" text when it loads - loops until scroll
  useEffect(() => {
    if (!preloaderComplete || !creationTextRef.current || prefersReducedMotion || hasScrolled) return;

    const creationText = creationTextRef.current;
    let shimmerTween: gsap.core.Tween | null = null;
    
    // Set initial state - start with normal white text
    creationText.style.display = 'inline-block';
    creationText.style.color = 'white';
    creationText.style.webkitTextFillColor = 'white';
    
    // Function to start shimmer animation
    const startShimmer = () => {
      if (hasScrolled || !creationTextRef.current) return;
      
      // Apply shimmer gradient
      creationText.style.background = 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.5) 30%, rgba(184,160,104,1) 45%, rgba(255,255,255,1) 50%, rgba(184,160,104,1) 55%, rgba(255,255,255,0.5) 70%, rgba(255,255,255,0.3) 100%)';
      creationText.style.backgroundSize = `${VISUAL.SHIMMER_BACKGROUND_SIZE} 100%`;
      creationText.style.webkitBackgroundClip = 'text';
      creationText.style.backgroundClip = 'text';
      creationText.style.webkitTextFillColor = 'transparent';
      creationText.style.color = 'transparent';
      creationText.style.backgroundPosition = `${VISUAL.SHIMMER_BACKGROUND_POSITION} center`;
      creationText.style.filter = 'drop-shadow(0 0 8px rgba(184, 160, 104, 0.3))';
      
      creationText.classList.add('shimmer-text');
      
      // Animate the background position - loop continuously
      shimmerTween = gsap.to(creationText, {
        backgroundPosition: `${VISUAL.SHIMMER_BACKGROUND_POSITION_END} center`,
        duration: 2.5,
        ease: 'power2.inOut',
        repeat: -1, // Infinite loop
        repeatDelay: 1, // Pause 1 second between loops
        onRepeat: () => {
          // Reset position for next loop
          if (!hasScrolled && creationTextRef.current) {
            creationText.style.backgroundPosition = `${VISUAL.SHIMMER_BACKGROUND_POSITION} center`;
          }
        },
      });
    };
    
    // Function to stop shimmer and restore normal text
    const stopShimmer = () => {
      if (shimmerTween) {
        shimmerTween.kill();
        shimmerTween = null;
      }
      
      if (!creationTextRef.current) return;
      
      // Remove gradient and restore normal text
      creationText.style.background = 'none';
      creationText.style.webkitBackgroundClip = 'unset';
      creationText.style.backgroundClip = 'unset';
      creationText.style.webkitTextFillColor = 'white';
      creationText.style.color = 'white';
      creationText.style.filter = 'none';
      creationText.style.backgroundPosition = 'unset';
      creationText.style.backgroundSize = 'unset';
    };
    
    // Start shimmer after initial delay
    const startTimer = setTimeout(() => {
      startShimmer();
    }, ANIMATION_TIMING.SHIMMER_START_DELAY);
    
    return () => {
      clearTimeout(startTimer);
      stopShimmer();
    };
  }, [preloaderComplete, prefersReducedMotion, hasScrolled]);


  // Scroll indicator fade
  useScrollListener((scrollY) => {
    if (!scrollIndicatorRef.current || prefersReducedMotion) return;
    
    const windowHeight = window.innerHeight;
    const opacity = Math.max(0, 1 - scrollY / (windowHeight * 0.5));
    
    if (scrollIndicatorRef.current) {
      gsap.to(scrollIndicatorRef.current, {
        opacity,
        duration: ANIMATION_TIMING.SCROLL_INDICATOR_FADE_DURATION,
        ease: 'power2.out',
      });
    }
  });

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      ref={sectionRef}
      className="relative h-screen min-h-[100svh] w-full overflow-hidden"
      role="region"
      aria-label="Hero section with video background"
      tabIndex={0}
    >
      {/* Loading State */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-ink-800 z-[2] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border border-white/20 border-t-white/60 rounded-full animate-spin" />
            <p className="text-white/60 text-caption font-light tracking-wide">Loading</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-ink-800 z-[2] flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <p className="text-white/80 text-body-lg font-light mb-6">{errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-accent hover:bg-accent-dark text-ink-900 text-caption font-medium uppercase tracking-widest transition-colors duration-300"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )}

      {/* Video Elements */}
      {/* Note: poster image provides fallback if video fails to load. 
          Create /public/images/hero-poster.jpg for production use. */}
      <video
        ref={video1Ref}
        muted
        playsInline
        loop={false}
        preload="auto"
        poster="/images/hero-poster.jpg"
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
        style={{ 
          opacity: activeVideo === 0 && !isLoading && !hasError ? 1 : 0, 
          zIndex: activeVideo === 0 ? 1 : 0,
          transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: 'none'
        }}
        // Mobile optimizations - prevent fullscreen on iOS/Android
        {...({
          'webkit-playsinline': 'true',
          'x5-playsinline': 'true',
          'x5-video-player-type': 'h5',
          'x5-video-player-fullscreen': 'true',
          'x5-video-orientation': 'portrait',
        } as React.VideoHTMLAttributes<HTMLVideoElement>)}
      />

      <video
        ref={video2Ref}
        muted
        playsInline
        loop={false}
        preload="metadata"
        poster="/images/hero-poster.jpg"
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
        style={{ 
          opacity: activeVideo === 1 && !isLoading && !hasError ? 1 : 0, 
          zIndex: activeVideo === 1 ? 1 : 0,
          transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: 'none'
        }}
        // Mobile optimizations - prevent fullscreen on iOS/Android
        {...({
          'webkit-playsinline': 'true',
          'x5-playsinline': 'true',
          'x5-video-player-type': 'h5',
          'x5-video-player-fullscreen': 'true',
          'x5-video-orientation': 'portrait',
        } as React.VideoHTMLAttributes<HTMLVideoElement>)}
      />

      {/* Subtle Grid Texture Overlay */}
      <div 
        className="absolute inset-0 z-[3] pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Gradient Overlays - Refined layering */}
      <div className="absolute inset-0 z-[4] pointer-events-none">
        {/* Bottom gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {/* Top vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
        {/* Side vignettes */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
      </div>

      {/* Cursor Glow Effect (Desktop only, reduced motion aware) */}
      {isDesktop && !prefersReducedMotion && (
        <div 
          className="absolute inset-0 z-[5] pointer-events-none transition-opacity duration-500"
          style={{
            background: `radial-gradient(${VISUAL.CURSOR_GLOW_SIZE}px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(184, 160, 104, 0.06), transparent ${PERCENTAGES.HALF}%)`,
          }}
        />
      )}

      {/* Text Content */}
      <div className="absolute inset-0 flex flex-col justify-end z-10 pb-16 sm:pb-20 md:pb-24 lg:pb-28">
        <div className="container-main">
          <div className="max-w-3xl">
            {/* Main Headline with text shadow for depth */}
            <h1 className="text-white mb-3 sm:mb-4 md:mb-6 text-shadow-subtle">
              <span className="block text-[clamp(2.25rem,7vw,6rem)] leading-[1.1] tracking-[-0.03em] font-light">
                We Never Stop Moving.
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-white/80 text-[clamp(0.9rem,2.5vw,1.125rem)] max-w-xl font-light leading-relaxed mb-5 sm:mb-6 md:mb-8">
              A commercial real estate investment, advisory, and management company 
              guided by passion, purpose, and the relentless pursuit of value <span ref={creationTextRef} className="font-bold">creation</span>.
            </p>

            {/* CTA Button with enhanced hover */}
            <button
              onClick={scrollToAbout}
              className="group inline-flex items-center gap-3 text-white/90 hover:text-white transition-all duration-300 focus-bronze touch-target"
              aria-label="Scroll to learn more"
            >
              <span className="text-[0.65rem] sm:text-caption font-medium tracking-[0.15em] uppercase">
                Explore
              </span>
              <span className="w-8 h-px bg-accent group-hover:w-14 transition-all duration-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        ref={scrollIndicatorRef}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
        aria-hidden="true"
      >
        <div className="w-px h-10 sm:h-12 bg-gradient-to-b from-white/0 via-white/40 to-white/60" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/60 mt-1 animate-pulse" />
      </div>
    </section>
  );
}

export default memo(Hero);

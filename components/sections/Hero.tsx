'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

// Video file paths
const videoUrls = [
  '/videos/video1.mp4',
  '/videos/video2.mp4',
  '/videos/video3.mp4',
  '/videos/video4.mp4',
  '/videos/video5.mp4',
  '/videos/video6.mp4',
];

// Helper function to extract pathname from video src for comparison
const getVideoPath = (src: string): string => {
  try {
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return new URL(src).pathname;
    }
    return src;
  } catch {
    const match = src.match(/\/videos\/[^/]+\.mp4/);
    return match ? match[0] : src;
  }
};

interface HeroProps {
  preloaderComplete?: boolean;
}

export default function Hero({ preloaderComplete = false }: HeroProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [failedVideos, setFailedVideos] = useState<Set<number>>(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prepareTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeVideoRef = useRef(0);
  const video1IndexRef = useRef<number | null>(null);
  const video2IndexRef = useRef<number | null>(null);
  const pauseListenerRef = useRef<((e: Event) => void) | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const creationTextRef = useRef<HTMLSpanElement>(null);

  // Check for desktop and reduced motion
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    setPrefersReducedMotion(motionQuery.matches);
    checkDesktop();
    
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);
    window.addEventListener('resize', checkDesktop);
    
    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', checkDesktop);
    };
  }, []);

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

  const handleVideoError = useCallback((videoIndex: number, videoElement: HTMLVideoElement) => {
    setFailedVideos((prev) => {
      const updated = new Set([...prev, videoIndex]);
      
      if (updated.size < videoUrls.length - 1) {
        const nextIndex = (videoIndex + 1) % videoUrls.length;
        if (!updated.has(nextIndex)) {
          setTimeout(() => {
            videoElement.src = videoUrls[nextIndex];
            videoElement.load();
          }, 500);
        }
      } else {
        setHasError(true);
        setErrorMessage('Unable to load videos. Please refresh the page.');
        setIsLoading(false);
      }
      
      return updated;
    });
  }, []);

  useEffect(() => {
    if (!video1Ref.current || !video2Ref.current) return;
    // Don't start video rotation until preloader is complete
    if (!preloaderComplete) return;

    const currentIndex = currentVideoIndex;
    const currentVideoSrc = videoUrls[currentIndex];
    
    const showingVideo = activeVideoRef.current === 0 ? video1Ref.current : video2Ref.current;
    const hiddenVideo = activeVideoRef.current === 0 ? video2Ref.current : video1Ref.current;
    
    const showingVideoIndex = activeVideoRef.current === 0 ? video1IndexRef.current : video2IndexRef.current;
    const hiddenVideoIndex = activeVideoRef.current === 0 ? video2IndexRef.current : video1IndexRef.current;

    if (showingVideoIndex !== currentIndex) {
      const showingVideoPath = getVideoPath(showingVideo.src);
      if (showingVideoPath !== currentVideoSrc) {
        showingVideo.src = currentVideoSrc;
        showingVideo.load();
        showingVideo.addEventListener('loadeddata', () => {
          setIsLoading(false);
          showingVideo.currentTime = 0;
          showingVideo.play().catch(() => {
            handleVideoError(currentIndex, showingVideo);
          });
        }, { once: true });

        showingVideo.addEventListener('error', () => {
          handleVideoError(currentIndex, showingVideo);
        }, { once: true });
      } else {
        showingVideo.currentTime = 0;
        showingVideo.play().catch(() => {});
      }
      if (activeVideoRef.current === 0) {
        video1IndexRef.current = currentIndex;
      } else {
        video2IndexRef.current = currentIndex;
      }
    }

    const nextIndex = (currentIndex + 1) % videoUrls.length;
    const nextVideoSrc = videoUrls[nextIndex];
    
    if (hiddenVideoIndex !== nextIndex) {
      const hiddenVideoPath = getVideoPath(hiddenVideo.src);
      if (hiddenVideoPath !== nextVideoSrc) {
        hiddenVideo.src = nextVideoSrc;
        hiddenVideo.load();
        hiddenVideo.addEventListener('loadeddata', () => {
          hiddenVideo.currentTime = 0;
        }, { once: true });

        hiddenVideo.addEventListener('error', () => {
          handleVideoError(nextIndex, hiddenVideo);
        }, { once: true });
      }
      if (activeVideoRef.current === 0) {
        video2IndexRef.current = nextIndex;
      } else {
        video1IndexRef.current = nextIndex;
      }
    }

    // Only start video rotation timers if preloader is complete
    if (preloaderComplete) {
      prepareTimeoutRef.current = setTimeout(() => {
        if (hiddenVideo.readyState >= 4) {
          hiddenVideo.currentTime = 0;
          const playPromise = hiddenVideo.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              const handlePause = () => {
                if (!hiddenVideo.paused) return;
                hiddenVideo.play().catch(() => {});
              };
              if (pauseListenerRef.current) {
                hiddenVideo.removeEventListener('pause', pauseListenerRef.current);
              }
              pauseListenerRef.current = handlePause;
              hiddenVideo.addEventListener('pause', handlePause);
            }).catch(() => {});
          }
        }
      }, 2000);

      fadeTimeoutRef.current = setTimeout(() => {
        if (hiddenVideo && hiddenVideo.readyState >= 4 && !hiddenVideo.paused) {
          const newActiveVideo = activeVideoRef.current === 0 ? 1 : 0;
          activeVideoRef.current = newActiveVideo;
          setActiveVideo(newActiveVideo);
        }
      }, 2500);

      timeoutRef.current = setTimeout(() => {
        const oldShowingVideo = activeVideoRef.current === 0 ? video1Ref.current : video2Ref.current;
        if (oldShowingVideo) {
          oldShowingVideo.pause();
        }
        setCurrentVideoIndex(nextIndex);
      }, 3000);
    }

    // Store ref values for cleanup
    const video1 = video1Ref.current;
    const video2 = video2Ref.current;

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (prepareTimeoutRef.current) clearTimeout(prepareTimeoutRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      if (pauseListenerRef.current) {
        video1?.removeEventListener('pause', pauseListenerRef.current);
        video2?.removeEventListener('pause', pauseListenerRef.current);
        pauseListenerRef.current = null;
      }
    };
  }, [currentVideoIndex, preloaderComplete, handleVideoError]);

  // Reset video to index 0 when preloader completes (only once)
  const preloaderCompleteRef = useRef(false);
  useEffect(() => {
    if (preloaderComplete && !preloaderCompleteRef.current && video1Ref.current) {
      preloaderCompleteRef.current = true;
      // Ensure we're on video 1 and reset state
      setCurrentVideoIndex(0);
      setActiveVideo(0);
      activeVideoRef.current = 0;
      video1IndexRef.current = null;
      video2IndexRef.current = null;
      
      // Reset video1 to first video if needed
      if (video1Ref.current) {
        const currentPath = getVideoPath(video1Ref.current.src);
        if (currentPath !== videoUrls[0]) {
          video1Ref.current.src = videoUrls[0];
          video1Ref.current.load();
          video1Ref.current.currentTime = 0;
          video1Ref.current.play().catch(() => {});
        }
      }
    }
  }, [preloaderComplete]);

  // Shimmer effect for "creation" text when it loads
  useEffect(() => {
    if (!preloaderComplete || !creationTextRef.current || prefersReducedMotion) return;

    const creationText = creationTextRef.current;
    
    // Set initial state with more dramatic gradient
    creationText.style.display = 'inline-block';
    creationText.style.background = 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.5) 30%, rgba(184,160,104,1) 45%, rgba(255,255,255,1) 50%, rgba(184,160,104,1) 55%, rgba(255,255,255,0.5) 70%, rgba(255,255,255,0.3) 100%)';
    creationText.style.backgroundSize = '200% 100%';
    creationText.style.webkitBackgroundClip = 'text';
    creationText.style.backgroundClip = 'text';
    creationText.style.webkitTextFillColor = 'transparent';
    creationText.style.color = 'transparent';
    creationText.style.backgroundPosition = '-200% center';
    creationText.style.filter = 'drop-shadow(0 0 8px rgba(184, 160, 104, 0.3))';
    
    // Add shimmer class after a short delay to trigger animation
    const timer = setTimeout(() => {
      creationText.classList.add('shimmer-text');
      // Animate the background position - slower and more dramatic
      gsap.to(creationText, {
        backgroundPosition: '200% center',
        duration: 2.5,
        ease: 'power2.inOut',
        onComplete: () => {
          // Return to normal white text after shimmer
          gsap.to(creationText, {
            duration: 0.5,
            ease: 'power2.out',
            onStart: () => {
              creationText.style.background = 'white';
              creationText.style.webkitTextFillColor = 'white';
              creationText.style.filter = 'none';
            },
          });
        },
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [preloaderComplete, prefersReducedMotion]);

  // Preload first video on mount
  useEffect(() => {
    if (!video1Ref.current) return;
    
    setIsLoading(true);
    const firstVideo = video1Ref.current;
    firstVideo.src = videoUrls[0];
    firstVideo.preload = 'auto';
    
    const handleCanPlay = () => {
      setIsLoading(false);
      firstVideo.play().catch(() => {
        handleVideoError(0, firstVideo);
      });
    };

    const handleError = () => handleVideoError(0, firstVideo);

    firstVideo.addEventListener('canplay', handleCanPlay, { once: true });
    firstVideo.addEventListener('error', handleError, { once: true });
    firstVideo.load();

    return () => {
      firstVideo.removeEventListener('canplay', handleCanPlay);
      firstVideo.removeEventListener('error', handleError);
    };
  }, [handleVideoError]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        const activeVideoElement = activeVideoRef.current === 0 ? video1Ref.current : video2Ref.current;
        if (activeVideoElement) {
          if (activeVideoElement.paused) {
            activeVideoElement.play().catch(() => {});
          } else {
            activeVideoElement.pause();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            video1Ref.current?.pause();
            video2Ref.current?.pause();
          } else {
            const activeVideoElement = activeVideoRef.current === 0 ? video1Ref.current : video2Ref.current;
            if (activeVideoElement && !activeVideoElement.paused) {
              activeVideoElement.play().catch(() => {});
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const section = sectionRef.current;
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  // Scroll indicator fade
  useEffect(() => {
    if (!scrollIndicatorRef.current || prefersReducedMotion) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const opacity = Math.max(0, 1 - scrollY / (windowHeight * 0.5));
      
      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          opacity,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
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
      <video
        ref={video1Ref}
        muted
        playsInline
        loop={false}
        preload={currentVideoIndex === 0 ? 'auto' : 'none'}
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
          'x5-video-orientation': 'portraint',
        } as React.VideoHTMLAttributes<HTMLVideoElement>)}
      />

      <video
        ref={video2Ref}
        muted
        playsInline
        loop={false}
        preload="none"
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
          'x5-video-orientation': 'portraint',
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
            background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(184, 160, 104, 0.06), transparent 50%)`,
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

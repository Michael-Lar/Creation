'use client';

import { useEffect, useRef, useState } from 'react';
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
    // If URL parsing fails, try to extract pathname manually
    const match = src.match(/\/videos\/[^/]+\.mp4/);
    return match ? match[0] : src;
  }
};

export default function Hero() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState(0); // 0 or 1 to alternate between two video elements
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [failedVideos, setFailedVideos] = useState<Set<number>>(new Set());
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prepareTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeVideoRef = useRef(0); // Track activeVideo without triggering re-renders
  const video1IndexRef = useRef<number | null>(null); // Track which video index is in video1
  const video2IndexRef = useRef<number | null>(null); // Track which video index is in video2
  const pauseListenerRef = useRef<((e: Event) => void) | null>(null); // Track pause listener for cleanup
  const retryCountRef = useRef<number>(0);

  const handleVideoError = (videoIndex: number, videoElement: HTMLVideoElement) => {
    setFailedVideos((prev) => new Set([...prev, videoIndex]));
    
    // Try next video if current fails
    if (failedVideos.size < videoUrls.length - 1) {
      const nextIndex = (videoIndex + 1) % videoUrls.length;
      if (!failedVideos.has(nextIndex)) {
        setTimeout(() => {
          videoElement.src = videoUrls[nextIndex];
          videoElement.load();
        }, 500);
      }
    } else {
      // All videos failed
      setHasError(true);
      setErrorMessage('Unable to load videos. Please refresh the page.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // This effect should ONLY run when currentVideoIndex changes, NOT when activeVideo changes
    // We use refs to track which video element has which content
    
    if (!video1Ref.current || !video2Ref.current) return;

    const currentIndex = currentVideoIndex;
    const currentVideoSrc = videoUrls[currentIndex];
    
    // Determine which video element should show the current video based on activeVideoRef
    // But DON'T change this based on activeVideo state - use the ref
    const showingVideo = activeVideoRef.current === 0 ? video1Ref.current : video2Ref.current;
    const hiddenVideo = activeVideoRef.current === 0 ? video2Ref.current : video1Ref.current;
    
    // Check which video element currently has the current video
    const showingVideoIndex = activeVideoRef.current === 0 ? video1IndexRef.current : video2IndexRef.current;
    const hiddenVideoIndex = activeVideoRef.current === 0 ? video2IndexRef.current : video1IndexRef.current;

    // If the showing video doesn't have the current video, we need to load it
    // But we should NEVER reset a video that's already playing the correct content
    if (showingVideoIndex !== currentIndex) {
      // Load new video into the showing element
      const showingVideoPath = getVideoPath(showingVideo.src);
      if (showingVideoPath !== currentVideoSrc) {
        showingVideo.src = currentVideoSrc;
        showingVideo.load();
        showingVideo.addEventListener('loadeddata', () => {
          setIsLoading(false);
          showingVideo.currentTime = 0;
          showingVideo.play().catch((error) => {
            console.error('Video play error:', error);
            handleVideoError(currentIndex, showingVideo);
          });
        }, { once: true });

        showingVideo.addEventListener('error', () => {
          handleVideoError(currentIndex, showingVideo);
        }, { once: true });
      } else {
        // Video src matches, just ensure it's playing from start
        showingVideo.currentTime = 0;
        showingVideo.play().catch(() => {});
      }
      // Update tracking
      if (activeVideoRef.current === 0) {
        video1IndexRef.current = currentIndex;
      } else {
        video2IndexRef.current = currentIndex;
      }
    }
    // If showing video already has the correct video, DON'T touch it - it's already playing

    // Prepare next video in the hidden element
    const nextIndex = (currentIndex + 1) % videoUrls.length;
    const nextVideoSrc = videoUrls[nextIndex];
    
    // Only load if the hidden video doesn't already have the next video
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
      // Update tracking
      if (activeVideoRef.current === 0) {
        video2IndexRef.current = nextIndex;
      } else {
        video1IndexRef.current = nextIndex;
      }
    }

    // Start preparing next video early (at 2.0 seconds) to ensure it's fully buffered
    prepareTimeoutRef.current = setTimeout(() => {
      if (hiddenVideo.readyState >= 4) {
        hiddenVideo.currentTime = 0;
        const playPromise = hiddenVideo.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            // Keep video playing - add event listener to resume if browser pauses it
            const handlePause = () => {
              if (!hiddenVideo.paused) return;
              hiddenVideo.play().catch(() => {});
            };
            // Clean up any existing listener first
            if (pauseListenerRef.current) {
              hiddenVideo.removeEventListener('pause', pauseListenerRef.current);
            }
            pauseListenerRef.current = handlePause;
            hiddenVideo.addEventListener('pause', handlePause);
          }).catch(() => {
            // Silently handle play errors
          });
        }
      }
    }, 2000);

    // Start crossfade transition at 2.5 seconds
    fadeTimeoutRef.current = setTimeout(() => {
      if (hiddenVideo && hiddenVideo.readyState >= 4 && !hiddenVideo.paused) {
        const newActiveVideo = activeVideoRef.current === 0 ? 1 : 0;
        activeVideoRef.current = newActiveVideo;
        setActiveVideo(newActiveVideo);
      }
    }, 2500);

    // Complete the transition and update index at 3 seconds
    timeoutRef.current = setTimeout(() => {
      const oldShowingVideo = activeVideoRef.current === 0 ? video1Ref.current : video2Ref.current;
      if (oldShowingVideo) {
        oldShowingVideo.pause();
      }
      setCurrentVideoIndex(nextIndex);
    }, 3000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (prepareTimeoutRef.current) {
        clearTimeout(prepareTimeoutRef.current);
        prepareTimeoutRef.current = null;
      }
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = null;
      }
      // Clean up pause listener if it exists (check both videos)
      if (pauseListenerRef.current) {
        if (video1Ref.current) {
          video1Ref.current.removeEventListener('pause', pauseListenerRef.current);
        }
        if (video2Ref.current) {
          video2Ref.current.removeEventListener('pause', pauseListenerRef.current);
        }
        pauseListenerRef.current = null;
      }
    };
  }, [currentVideoIndex]); // ONLY depends on currentVideoIndex

  // Preload only first video on mount for better performance
  useEffect(() => {
    if (!video1Ref.current) return;
    
    setIsLoading(true);
    const firstVideo = video1Ref.current;
    firstVideo.src = videoUrls[0];
    firstVideo.preload = 'auto';
    
    const handleCanPlay = () => {
      setIsLoading(false);
      firstVideo.play().catch((error) => {
        console.error('Initial video play error:', error);
        handleVideoError(0, firstVideo);
      });
    };

    const handleError = () => {
      handleVideoError(0, firstVideo);
    };

    firstVideo.addEventListener('canplay', handleCanPlay, { once: true });
    firstVideo.addEventListener('error', handleError, { once: true });
    firstVideo.load();

    return () => {
      firstVideo.removeEventListener('canplay', handleCanPlay);
      firstVideo.removeEventListener('error', handleError);
    };
  }, []);

  // Keyboard controls for accessibility
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Space bar to pause/play (when focused on the section)
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

  // Intersection Observer to pause videos when not visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            // Pause videos when section is not visible
            video1Ref.current?.pause();
            video2Ref.current?.pause();
          } else {
            // Resume active video when section becomes visible
            const activeVideoElement = activeVideoRef.current === 0 ? video1Ref.current : video2Ref.current;
            if (activeVideoElement && !activeVideoElement.paused) {
              activeVideoElement.play().catch(() => {});
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('primary')?.querySelector('section');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  // Scroll indicator animation
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!scrollIndicatorRef.current) return;

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
  }, []);

  return (
    <section 
      className="relative h-screen w-full overflow-hidden"
      role="region"
      aria-label="Hero section with video background"
      tabIndex={0}
    >
      {/* Loading Skeleton */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 z-[2] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <p className="text-white/80 text-sm font-light">Loading video...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 z-[2] flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <p className="text-white/90 text-lg font-light mb-4">{errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-bronze hover:bg-bronze-dark text-charcoal font-light uppercase tracking-wider rounded-sm transition-all duration-300"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )}

      <video
        ref={video1Ref}
        muted
        playsInline
        loop={false}
        preload={currentVideoIndex === 0 ? 'auto' : 'none'}
        className="absolute inset-0 h-full w-full object-cover"
        aria-label="Creation Partners video background"
        style={{ 
          opacity: activeVideo === 0 && !isLoading && !hasError ? 1 : 0, 
          zIndex: activeVideo === 0 ? 1 : 0,
          transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: 'none'
        }}
      >
        Your browser does not support the video tag.
      </video>

      <video
        ref={video2Ref}
        muted
        playsInline
        loop={false}
        preload="none"
        className="absolute inset-0 h-full w-full object-cover"
        aria-label="Creation Partners video background"
        style={{ 
          opacity: activeVideo === 1 && !isLoading && !hasError ? 1 : 0, 
          zIndex: activeVideo === 1 ? 1 : 0,
          transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: 'none'
        }}
      >
        Your browser does not support the video tag.
      </video>

      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-[5] pointer-events-none"></div>

      {/* Text Overlay - Positioned strategically in lower portion */}
      <div className="absolute inset-0 flex flex-col justify-end z-10 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-3xl relative">
            {/* Text Container with Backdrop Blur for Better Readability */}
            <div className="relative backdrop-blur-[2px] rounded-lg p-3 sm:p-4 md:p-6 -m-3 sm:-m-4 md:-m-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white mb-3 sm:mb-4 md:mb-6 tracking-tight leading-tight drop-shadow-lg">
                Perpetual Movement x Value Creation
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 max-w-2xl font-light leading-relaxed drop-shadow-md">
                Creation Partners is a commercial real estate investment, advisory
                and management company built for purpose and movement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        ref={scrollIndicatorRef}
        className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <div className="w-px h-8 sm:h-12 bg-white/60"></div>
        <div className="w-1 h-1 rounded-full bg-white/60 animate-pulse"></div>
      </div>
    </section>
  );
}

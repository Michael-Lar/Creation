'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ANIMATION_TIMING } from '@/constants/animations';
import { ErrorHandler, ErrorCategory } from '@/utils/errorHandler';

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

interface UseVideoRotationOptions {
  preloaderComplete?: boolean;
  onError?: (error: string) => void;
}

interface UseVideoRotationReturn {
  currentVideoIndex: number;
  activeVideo: number;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  video1Ref: React.RefObject<HTMLVideoElement>;
  video2Ref: React.RefObject<HTMLVideoElement>;
}

/**
 * Hook to manage video rotation in Hero section
 * Handles loading, error handling, and smooth transitions between videos
 */
export function useVideoRotation(
  options: UseVideoRotationOptions = {}
): UseVideoRotationReturn {
  const { preloaderComplete = false, onError } = options;
  
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Start as false - only show loading when actually loading
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [failedVideos, setFailedVideos] = useState<Set<number>>(new Set());
  
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prepareTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeVideoRef = useRef(0);
  const video1IndexRef = useRef<number | null>(null);
  const video2IndexRef = useRef<number | null>(null);
  const pauseListenerRef = useRef<((e: Event) => void) | null>(null);
  const preloaderCompleteRef = useRef(false);
  const firstVideoLoadedRef = useRef(false);

  const handleVideoError = useCallback((videoIndex: number, videoElement: HTMLVideoElement) => {
    ErrorHandler.handleVideoError(
      new Error(`Failed to load video at index ${videoIndex}`),
      videoIndex
    );
    
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
        const errorMsg = 'Unable to load videos. Please refresh the page.';
        setErrorMessage(errorMsg);
        setIsLoading(false);
        onError?.(errorMsg);
      }
      
      return updated;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Remove onError from dependencies to prevent infinite loops

  // Main video rotation logic
  useEffect(() => {
    if (!video1Ref.current || !video2Ref.current) {
      return;
    }
    if (!preloaderComplete) {
      return;
    }

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
        hiddenVideo.preload = 'auto';
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
      }, ANIMATION_TIMING.VIDEO_PREPARE_DELAY);

      fadeTimeoutRef.current = setTimeout(() => {
        if (hiddenVideo && hiddenVideo.readyState >= 4 && !hiddenVideo.paused) {
          const newActiveVideo = activeVideoRef.current === 0 ? 1 : 0;
          activeVideoRef.current = newActiveVideo;
          setActiveVideo(newActiveVideo);
        }
      }, ANIMATION_TIMING.VIDEO_FADE_DELAY);

      timeoutRef.current = setTimeout(() => {
        const oldShowingVideo = activeVideoRef.current === 0 ? video1Ref.current : video2Ref.current;
        if (oldShowingVideo) {
          oldShowingVideo.pause();
        }
        setCurrentVideoIndex(nextIndex);
      }, ANIMATION_TIMING.VIDEO_ROTATION_DELAY);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideoIndex, preloaderComplete]); // Remove handleVideoError from dependencies

  // Reset video to index 0 when preloader completes (only once)
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

  // Preload first video on mount - only run once
  useEffect(() => {
    if (!video1Ref.current || firstVideoLoadedRef.current) {
      return;
    }
    
    // Only load if video doesn't already have a src set
    const firstVideo = video1Ref.current;
    const currentPath = getVideoPath(firstVideo.src);
    if (currentPath === videoUrls[0]) {
      // Video already has correct src, just trigger play if needed
      firstVideoLoadedRef.current = true;
      return;
    }
    
    firstVideoLoadedRef.current = true;
    // Don't set isLoading to true - the loading state caused issues with React Strict Mode
    // The video will load in the background and play when ready
    firstVideo.src = videoUrls[0];
    firstVideo.preload = 'auto';
    
    const handleCanPlay = () => {
      firstVideo.play().catch((err) => {
        handleVideoError(0, firstVideo);
      });
    };

    const handleError = (e: Event) => {
      handleVideoError(0, firstVideo);
    };

    firstVideo.addEventListener('canplay', handleCanPlay, { once: true });
    firstVideo.addEventListener('canplaythrough', handleCanPlay, { once: true });
    firstVideo.addEventListener('error', handleError, { once: true });
    firstVideo.load();
    
    // Check if video is already ready (race condition: video loaded before event listener attached)
    if (firstVideo.readyState >= 3) {
      setTimeout(() => handleCanPlay(), 100);
    }

    return () => {
      firstVideo.removeEventListener('canplay', handleCanPlay);
      firstVideo.removeEventListener('canplaythrough', handleCanPlay);
      firstVideo.removeEventListener('error', handleError);
    };
  }, []); // Run only once on mount - remove handleVideoError dependency

  // Preload next video in background for faster transitions
  useEffect(() => {
    if (!preloaderComplete || !video1Ref.current || !video2Ref.current) return;
    
    const nextIndex = (currentVideoIndex + 1) % videoUrls.length;
    const hiddenVideo = activeVideoRef.current === 0 ? video2Ref.current : video1Ref.current;
    const hiddenVideoIndex = activeVideoRef.current === 0 ? video2IndexRef.current : video1IndexRef.current;
    
    // Only preload if it's not already loaded
    if (hiddenVideoIndex !== nextIndex) {
      const hiddenVideoPath = getVideoPath(hiddenVideo.src);
      const nextVideoSrc = videoUrls[nextIndex];
      
      if (hiddenVideoPath !== nextVideoSrc) {
        // Preload the next video in the background
        hiddenVideo.preload = 'auto';
        hiddenVideo.src = nextVideoSrc;
        hiddenVideo.load();
        
        // Update index reference
        if (activeVideoRef.current === 0) {
          video2IndexRef.current = nextIndex;
        } else {
          video1IndexRef.current = nextIndex;
        }
      }
    }
  }, [currentVideoIndex, preloaderComplete]);

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

    const section = video1Ref.current?.parentElement;
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  return {
    currentVideoIndex,
    activeVideo,
    isLoading,
    hasError,
    errorMessage,
    video1Ref,
    video2Ref,
  };
}

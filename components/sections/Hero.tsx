'use client';

import { useEffect, useRef, useState } from 'react';

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
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prepareTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeVideoRef = useRef(0); // Track activeVideo without triggering re-renders
  const video1IndexRef = useRef<number | null>(null); // Track which video index is in video1
  const video2IndexRef = useRef<number | null>(null); // Track which video index is in video2
  const pauseListenerRef = useRef<((e: Event) => void) | null>(null); // Track pause listener for cleanup

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
          showingVideo.currentTime = 0;
          showingVideo.play().catch(() => {
            // Silently handle play errors
          });
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

  // Preload all videos on mount
  useEffect(() => {
    const videoElements: HTMLVideoElement[] = [];
    
    videoUrls.forEach((url) => {
      const video = document.createElement('video');
      video.src = url;
      video.preload = 'auto';
      video.muted = true;
      video.style.display = 'none';
      document.body.appendChild(video);
      videoElements.push(video);
    });
    
    return () => {
      videoElements.forEach((video) => {
        if (video.parentNode) {
          video.parentNode.removeChild(video);
        }
        video.src = '';
      });
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

  return (
    <section 
      className="relative h-screen w-full overflow-hidden"
      role="region"
      aria-label="Hero section with video background"
      tabIndex={0}
    >
      <video
        ref={video1Ref}
        muted
        playsInline
        loop={false}
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        aria-label="Creation Partners video background"
        style={{ 
          opacity: activeVideo === 0 ? 1 : 0, 
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
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        aria-label="Creation Partners video background"
        style={{ 
          opacity: activeVideo === 1 ? 1 : 0, 
          zIndex: activeVideo === 1 ? 1 : 0,
          transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: 'none'
        }}
      >
        Your browser does not support the video tag.
      </video>

      {/* Text Overlay - Positioned strategically in lower portion */}
      <div className="absolute inset-0 flex flex-col justify-end z-10 pb-16 md:pb-20 lg:pb-24">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-8 lg:px-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white mb-4 md:mb-6 tracking-tight leading-tight">
              Perpetual Movement x Value Creation
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-white/95 max-w-2xl font-light leading-relaxed">
              Creation Partners is a commercial real estate investment, advisory
              and management company built for purpose and movement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

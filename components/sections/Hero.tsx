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

export default function Hero() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState(0); // 0 or 1 to alternate between two video elements
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentVideo = activeVideo === 0 ? video1Ref.current : video2Ref.current;
    const nextVideo = activeVideo === 0 ? video2Ref.current : video1Ref.current;
    
    if (!currentVideo || !nextVideo) return;

    // Set up current video
    const currentIndex = currentVideoIndex;
    const currentVideoSrc = videoUrls[currentIndex];
    // Better src checking - compare full paths
    if (currentVideo.src !== currentVideoSrc) {
      currentVideo.src = currentVideoSrc;
      currentVideo.load();
    }
    currentVideo.currentTime = 0;
    
    // Preload and prepare next video
    const nextIndex = (currentIndex + 1) % videoUrls.length;
    const nextVideoSrc = videoUrls[nextIndex];
    // Better src checking - compare full paths
    if (nextVideo.src !== nextVideoSrc) {
      nextVideo.src = nextVideoSrc;
      nextVideo.load();
    }
    nextVideo.currentTime = 0;

    // Play current video immediately
    const playPromise = currentVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.error('Error playing video:', error);
      });
    }

    // Switch to next video after exactly 3 seconds
    timeoutRef.current = setTimeout(() => {
      // Pause current video
      currentVideo.pause();

      // Play next video immediately
      const nextPlayPromise = nextVideo.play();
      if (nextPlayPromise !== undefined) {
        nextPlayPromise.catch((error) => {
          console.error('Error playing video:', error);
        });
      }

      // Switch active video and update index
      setActiveVideo(activeVideo === 0 ? 1 : 0);
      setCurrentVideoIndex(nextIndex);
    }, 3000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      // Pause videos on cleanup to prevent memory leaks
      currentVideo.pause();
      nextVideo.pause();
    };
  }, [currentVideoIndex, activeVideo]);

  // Preload all videos on mount
  useEffect(() => {
    const videoElements: HTMLVideoElement[] = [];
    
    videoUrls.forEach((url) => {
      const video = document.createElement('video');
      video.src = url;
      video.preload = 'auto';
      video.muted = true;
      // Actually append to DOM for preloading to work
      video.style.display = 'none';
      document.body.appendChild(video);
      videoElements.push(video);
    });
    
    return () => {
      // Cleanup: remove all preload video elements
      videoElements.forEach((video) => {
        if (video.parentNode) {
          video.parentNode.removeChild(video);
        }
        video.src = ''; // Clear src to free memory
      });
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video 1 - Shows current video when activeVideo is 0 */}
      <video
        ref={video1Ref}
        muted
        playsInline
        loop={false}
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ 
          opacity: activeVideo === 0 ? 1 : 0, 
          zIndex: activeVideo === 0 ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      >
        Your browser does not support the video tag.
      </video>

      {/* Video 2 - Shows next video when activeVideo is 1 */}
      <video
        ref={video2Ref}
        muted
        playsInline
        loop={false}
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ 
          opacity: activeVideo === 1 ? 1 : 0, 
          zIndex: activeVideo === 1 ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
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

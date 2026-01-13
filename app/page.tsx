'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Divisions from "@/components/sections/Divisions";
import ErrorBoundary from "@/components/ErrorBoundary";
import ScrollProgress from "@/components/ScrollProgress";
import SmoothScroll from "@/components/SmoothScroll";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import { getLenisInstance, waitForLenis } from '@/utils/lenis';
import { SCROLL, TIMING, VISUAL } from '@/constants/ui';
import { useScrollConfiguration } from '@/hooks/useScrollConfiguration';
import gsap from 'gsap';

// Dynamically import Preloader to reduce initial bundle size
// SSR disabled since it uses client-side video elements
const Preloader = dynamic(() => import("@/components/Preloader"), {
  ssr: false,
  loading: () => null, // No loading state needed - preloader handles its own appearance
});

// Lazy-load below-the-fold sections to reduce initial bundle size
// These sections are not visible on initial page load
const Team = dynamic(() => import("@/components/sections/Team"), {
  ssr: true,
  loading: () => <SectionSkeleton height="min-h-[600px]" />,
});

const Projects = dynamic(() => import("@/components/sections/Projects"), {
  ssr: true,
  loading: () => <SectionSkeleton height="min-h-[800px]" />,
});

const ContactForm = dynamic(() => import("@/components/sections/ContactForm"), {
  ssr: true,
  loading: () => <SectionSkeleton height="min-h-[500px]" />,
});

const Footer = dynamic(() => import("@/components/sections/Footer"), {
  ssr: true,
  loading: () => <SectionSkeleton height="min-h-[300px]" />,
});

// Minimal skeleton component for lazy-loaded sections
function SectionSkeleton({ height = "min-h-[400px]" }: { height?: string }) {
  return (
    <div 
      className={`${height} bg-cream animate-pulse`}
      style={{ backgroundColor: 'var(--color-cream)' }}
      aria-hidden="true"
    />
  );
}

export default function Home() {
  // Configure scroll restoration once at app level
  useScrollConfiguration();
  
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const [shouldSkipPreloader, setShouldSkipPreloader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mainContentRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const fadeInContent = useCallback(() => {
    // Start content fade-in immediately, overlapping with preloader fade-out
    if (mainContentRef.current) {
      // Set background first to prevent white flash
      mainContentRef.current.style.backgroundColor = '#0F0E0D';
      
      // Fade in content while transitioning background
      gsap.to(mainContentRef.current, {
        opacity: 1,
        backgroundColor: 'var(--color-cream)',
        duration: 0.8,
        ease: 'power2.out',
      });
    }
    
    // Transition body and html background simultaneously
    gsap.to(['body', 'html'], {
      backgroundColor: 'var(--color-cream)',
      duration: 0.8,
      ease: 'power2.out',
    });

    if (headerRef.current) {
      gsap.to(headerRef.current, {
        duration: 0.8,
        opacity: 1,
        ease: 'power2.out',
      });
    }
  }, []);

  const handlePreloaderComplete = () => {
    setPreloaderComplete(true);
    fadeInContent();
  };

  // Set initial body and html background to match preloader
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      // Set body and html background to preloader color initially to prevent white flash
      document.body.style.backgroundColor = '#0F0E0D';
      document.documentElement.style.backgroundColor = '#0F0E0D';
    }
  }, []);

  // Check if URL has #projects hash on initial load - skip preloader and scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check if URL has #projects hash on initial load
    const hash = window.location.hash;
    const hasProjectsHash = hash === '#projects';
    
    if (hasProjectsHash) {
      setShouldSkipPreloader(true);
      setPreloaderComplete(true);
      // Immediately set body and html background to cream when skipping preloader
      if (typeof document !== 'undefined') {
        document.body.style.backgroundColor = 'var(--color-cream)';
        document.documentElement.style.backgroundColor = 'var(--color-cream)';
      }
    }
  }, []);

  useEffect(() => {
    if (shouldSkipPreloader) {
      // Content should already be visible since preloaderComplete starts as true
      fadeInContent();
    }
  }, [shouldSkipPreloader, fadeInContent]);

  // Handle hash navigation (e.g., /#projects) - both initial load and hash changes
  useEffect(() => {
    if (typeof window === 'undefined' || !preloaderComplete) return;
    
    const scrollToProjectsSection = async () => {
      const hash = window.location.hash;
      if (hash === '#projects') {
        const projectsSection = document.getElementById('projects');
        if (!projectsSection) return;
        
        await waitForLenis();
        
        const lenis = getLenisInstance();
        if (lenis) {
          lenis.scrollTo(projectsSection, { 
            offset: SCROLL.SECTION_OFFSET,
            immediate: false,
            duration: 0.8,
            onComplete: () => {
              // Remove hash from URL after scroll animation completes
              if (window.location.hash === '#projects') {
                window.history.replaceState(null, '', window.location.pathname);
              }
            }
          });
        } else {
          projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Fallback: Remove hash after native scroll completes
          setTimeout(() => {
            if (window.location.hash === '#projects') {
              window.history.replaceState(null, '', window.location.pathname);
            }
          }, 1000); // Standard smooth scroll duration
        }
      }
    };
    
    // Check hash on mount (for initial navigation from project detail page)
    scrollToProjectsSection();
    
    // Also listen for hash changes (for user navigation with hash links)
    const handleHashChange = () => {
      scrollToProjectsSection().then(() => {
        // Hash removal happens inside scrollToProjectsSection
      });
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [preloaderComplete]);

  // Fallback: ensure content is visible after 4 seconds even if preloader doesn't complete
  useEffect(() => {
    if (shouldSkipPreloader) return; // Skip fallback if we're returning from project page
    
    const fallbackTimer = setTimeout(() => {
      if (!preloaderComplete) {
        setPreloaderComplete(true);
        fadeInContent();
      }
    }, TIMING.PRELOADER_FALLBACK);

    return () => clearTimeout(fallbackTimer);
  }, [preloaderComplete, shouldSkipPreloader, fadeInContent]);

  // Safari safety: Force content visibility if GSAP animation fails
  // This catches edge cases where JavaScript errors prevent fadeInContent from running
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const safetyTimer = setTimeout(() => {
      if (mainContentRef.current && getComputedStyle(mainContentRef.current).opacity === '0') {
        // If content is still invisible after 5 seconds, force it visible with CSS
        mainContentRef.current.style.opacity = '1';
        mainContentRef.current.style.backgroundColor = 'var(--color-cream)';
        document.body.style.backgroundColor = 'var(--color-cream)';
        document.documentElement.style.backgroundColor = 'var(--color-cream)';
      }
    }, 5000);

    return () => clearTimeout(safetyTimer);
  }, []);

  return (
    <SmoothScroll>
      <KeyboardShortcuts />
      <div id="primary" className="relative min-h-screen">
        {/* Elegant Border Frame - Wraps entire page including header */}
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: VISUAL.FRAME_Z_INDEX,
            border: 'clamp(4px, 1.5vw, 20px) solid var(--color-cream)',
            boxShadow: `
              inset 0 0 0 1px rgba(255, 255, 255, 0.1),
              0 0 0 1px rgba(0, 0, 0, 0.05)
            `,
          }}
          aria-hidden="true"
        />
        {/* Inner accent line */}
        <div 
          className="fixed pointer-events-none"
          style={{
            zIndex: VISUAL.FRAME_Z_INDEX,
            top: 'clamp(4px, 1.5vw, 20px)',
            left: 'clamp(4px, 1.5vw, 20px)',
            right: 'clamp(4px, 1.5vw, 20px)',
            bottom: 'clamp(4px, 1.5vw, 20px)',
            border: '1px solid rgba(184, 160, 104, 0.2)',
          }}
          aria-hidden="true"
        />
        
        <ScrollProgress />
        {!shouldSkipPreloader && <Preloader onComplete={handlePreloaderComplete} shouldSkip={shouldSkipPreloader} />}
        <Header isModalOpen={isModalOpen} />
        <main 
          ref={mainContentRef} 
          className="main-content" 
          style={{ 
            backgroundColor: '#0F0E0D',
            opacity: 0,
            minHeight: '100vh',
            position: 'relative',
            zIndex: 1
          }}
        >
          <ErrorBoundary sectionName="Hero">
            <Hero preloaderComplete={preloaderComplete} />
          </ErrorBoundary>
          <ErrorBoundary sectionName="About">
            <About />
          </ErrorBoundary>
          <ErrorBoundary sectionName="Divisions">
            <Divisions />
          </ErrorBoundary>
          <ErrorBoundary sectionName="Team">
            <Team onModalStateChange={setIsModalOpen} />
          </ErrorBoundary>
          <ErrorBoundary sectionName="Projects">
            <Projects />
          </ErrorBoundary>
          <ErrorBoundary sectionName="Contact Form">
            <ContactForm />
          </ErrorBoundary>
          <ErrorBoundary sectionName="Footer">
            <Footer />
          </ErrorBoundary>
        </main>
      </div>
    </SmoothScroll>
  );
}

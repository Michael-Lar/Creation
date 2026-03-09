'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Divisions from "@/components/sections/Divisions";
import ErrorBoundary from "@/components/ErrorBoundary";
import ScrollProgress from "@/components/ScrollProgress";
import SmoothScroll from "@/components/SmoothScroll";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import Preloader from "@/components/Preloader";
import { getLenisInstance, waitForLenis } from '@/utils/lenis';
import { SCROLL, VISUAL } from '@/constants/ui';
import { useScrollConfiguration } from '@/hooks/useScrollConfiguration';
import gsap from 'gsap';

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

interface HomeClientProps {
  initialPreloaderShown?: boolean;
}

export default function HomeClient({ initialPreloaderShown = false }: HomeClientProps) {
  // Configure scroll restoration once at app level
  useScrollConfiguration();

  const searchParams = useSearchParams();

  // Initialized from server-resolved cookie prop so the server HTML is correct from the start.
  // This prevents the hydration mismatch that caused the preloader to replay on back navigation.
  const [preloaderComplete, setPreloaderComplete] = useState(initialPreloaderShown);
  const [shouldSkipPreloader, setShouldSkipPreloader] = useState(initialPreloaderShown);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollToProjects, setScrollToProjects] = useState(false);
  const [scrollToDivisions, setScrollToDivisions] = useState(false);
  const mainContentRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const showMainContent = preloaderComplete || shouldSkipPreloader;
  // Only true when the preloader animation actually ran and completed in this render session.
  // Used to gate fadeInContent so the dark→cream transition never fires for skip scenarios.
  const preloaderRanThisSession = useRef(false);

  const fadeInContent = useCallback(() => {
    console.log('[fadeInContent] CALLED — stack:', new Error().stack?.split('\n').slice(1,4).join(' | '));
    // Keep content visible; only transition background
    if (mainContentRef.current) {
      // Set background first to prevent white flash
      mainContentRef.current.style.backgroundColor = '#0F0E0D';
      
      // Transition background to cream
      gsap.to(mainContentRef.current, {
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
    console.log('[handlePreloaderComplete] preloaderRanThisSession → true');
    preloaderRanThisSession.current = true;
    setPreloaderComplete(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('preloaderShown', '1');
      // Cookie lets the server omit the Preloader on subsequent full-page loads (back button, refresh)
      document.cookie = 'preloaderShown=1; path=/; SameSite=Lax';
    }
  };

  // On mount: set initial background and skip preloader if already shown.
  // Uses the server-resolved cookie prop first, then falls back to sessionStorage.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (initialPreloaderShown || sessionStorage.getItem('preloaderShown')) {
      console.log('[skip:sessionStorage/cookie] initialPreloaderShown=' + initialPreloaderShown + ' sessionStorage=' + sessionStorage.getItem('preloaderShown'));
      setShouldSkipPreloader(true);
      setPreloaderComplete(true);
      document.body.style.backgroundColor = 'var(--color-cream)';
      document.documentElement.style.backgroundColor = 'var(--color-cream)';
    } else {
      console.log('[NO SKIP] initialPreloaderShown=' + initialPreloaderShown + ' sessionStorage=' + sessionStorage.getItem('preloaderShown') + ' — setting body DARK');
      document.body.style.backgroundColor = '#0F0E0D';
      document.documentElement.style.backgroundColor = '#0F0E0D';
    }
  }, [initialPreloaderShown]);

  // Detect ?back= query param set when navigating back from sub-pages.
  // useSearchParams updates even when HomeClient is reconciled (not remounted) by
  // Next.js App Router's client-side cache, so this fires on every SPA navigation
  // unlike a [] effect which only runs on component mount.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const back = searchParams.get('back');
    if (!back) return;

    console.log('[skip:back-param] ?back=' + back);
    setShouldSkipPreloader(true);
    setPreloaderComplete(true);
    if (back === 'projects') setScrollToProjects(true);
    if (back === 'divisions') setScrollToDivisions(true);
    if (typeof document !== 'undefined') {
      document.body.style.backgroundColor = 'var(--color-cream)';
      document.documentElement.style.backgroundColor = 'var(--color-cream)';
    }
    // Remove the query param from the URL without a re-render
    window.history.replaceState(null, '', '/');
  }, [searchParams]);

  // Check if URL has #projects hash on initial full-page load
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.location.hash === '#projects') {
      setShouldSkipPreloader(true);
      setPreloaderComplete(true);
      setScrollToProjects(true);
      if (typeof document !== 'undefined') {
        document.body.style.backgroundColor = 'var(--color-cream)';
        document.documentElement.style.backgroundColor = 'var(--color-cream)';
      }
    }
  }, []);

  useEffect(() => {
    console.log('[showMainContent effect] showMainContent=' + showMainContent + ' preloaderRanThisSession=' + preloaderRanThisSession.current);
    // Only run the dark→cream fade-in when the preloader animation actually completed
    // in this render session. Any skip path (cookie, sessionStorage, hash, back-param)
    // leaves preloaderRanThisSession false, so fadeInContent never fires for them.
    if (showMainContent && preloaderRanThisSession.current) {
      requestAnimationFrame(() => {
        fadeInContent();
      });
    }
  }, [showMainContent, fadeInContent]);

  // Scroll to Projects section when scrollToProjects state is set
  useEffect(() => {
    if (typeof window === 'undefined' || !preloaderComplete || !scrollToProjects) return;

    const scrollToProjectsSection = async () => {
      // Projects is a dynamic import — poll until the element is in the DOM (max 3s)
      let projectsSection = document.getElementById('projects');
      if (!projectsSection) {
        await new Promise<void>((resolve) => {
          const interval = setInterval(() => {
            if (document.getElementById('projects')) {
              clearInterval(interval);
              resolve();
            }
          }, 50);
          setTimeout(() => { clearInterval(interval); resolve(); }, 3000);
        });
        projectsSection = document.getElementById('projects');
        if (!projectsSection) return;
      }

      await waitForLenis();

      // Delay so any post-navigation browser/Next.js scroll handling finishes
      // before we set position (prevents our scroll from being overridden)
      await new Promise<void>(r => setTimeout(r, 200));

      // Re-fetch element in case DOM changed during delay
      const targetSection = document.getElementById('projects') ?? projectsSection;

      const lenis = getLenisInstance();
      if (lenis) {
        // Force Lenis to recalculate scrollHeight/limit from the current DOM.
        // Lenis initializes when showMainContent=false (no content), so limit=0.
        // Its ResizeObserver debounce is 250ms — longer than our 200ms delay —
        // so without this call, clamp(0, target, 0) = 0 → silent no-op.
        lenis.resize();
        lenis.start();
        lenis.scrollTo(targetSection, {
          offset: SCROLL.SECTION_OFFSET,
          immediate: true,
        });
      } else {
        const y = targetSection.getBoundingClientRect().top + window.scrollY + SCROLL.SECTION_OFFSET;
        window.scrollTo({ top: Math.max(0, y) });
      }
      setScrollToProjects(false);
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    };

    scrollToProjectsSection();
  }, [preloaderComplete, scrollToProjects]);

  // Scroll to Divisions section when scrollToDivisions state is set
  useEffect(() => {
    if (typeof window === 'undefined' || !preloaderComplete || !scrollToDivisions) return;

    const scrollToDivisionsSection = async () => {
      let divisionsSection = document.getElementById('divisions');
      if (!divisionsSection) {
        await new Promise<void>((resolve) => {
          const interval = setInterval(() => {
            if (document.getElementById('divisions')) {
              clearInterval(interval);
              resolve();
            }
          }, 50);
          setTimeout(() => { clearInterval(interval); resolve(); }, 3000);
        });
        divisionsSection = document.getElementById('divisions');
        if (!divisionsSection) return;
      }

      await waitForLenis();
      await new Promise<void>(r => setTimeout(r, 200));

      const targetSection = document.getElementById('divisions') ?? divisionsSection;

      const lenis = getLenisInstance();
      if (lenis) {
        lenis.resize();
        lenis.start();
        lenis.scrollTo(targetSection, {
          offset: SCROLL.SECTION_OFFSET,
          immediate: true,
        });
      } else {
        const y = targetSection.getBoundingClientRect().top + window.scrollY + SCROLL.SECTION_OFFSET;
        window.scrollTo({ top: Math.max(0, y) });
      }
      setScrollToDivisions(false);
    };

    scrollToDivisionsSection();
  }, [preloaderComplete, scrollToDivisions]);

  // Listen for hash changes (handles /#projects links from external sources)
  useEffect(() => {
    if (typeof window === 'undefined' || !preloaderComplete) return;

    const handleHashChange = () => {
      if (window.location.hash === '#projects') {
        setScrollToProjects(true);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [preloaderComplete]);

  // Fallback: ensure content is visible after reasonable time even if preloader doesn't complete
  // Lengthened to avoid revealing hero before videos are ready
  useEffect(() => {
    if (shouldSkipPreloader) return; // Skip fallback if we're returning from project page
    
    const fallbackTimer = setTimeout(() => {
      if (!preloaderComplete) {
        console.log('[fallback timer FIRED] calling fadeInContent directly — preloaderRanThisSession=' + preloaderRanThisSession.current);
        setPreloaderComplete(true);
        fadeInContent();
      }
    }, 4000); // Increased from 1500ms to allow preloader animation to complete

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
        {!shouldSkipPreloader && !preloaderComplete && (
          <Preloader onComplete={handlePreloaderComplete} shouldSkip={shouldSkipPreloader} />
        )}
        {showMainContent && (
          <>
            <Header isModalOpen={isModalOpen} />
            <main 
              ref={mainContentRef} 
              className="main-content" 
              style={{
                backgroundColor: (shouldSkipPreloader || initialPreloaderShown) ? 'var(--color-cream)' : '#0F0E0D',
                opacity: 1,
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
          </>
        )}
      </div>
    </SmoothScroll>
  );
}

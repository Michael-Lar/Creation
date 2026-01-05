'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Divisions from "@/components/sections/Divisions";
import Team from "@/components/sections/Team";
import Projects from "@/components/sections/Projects";
import ContactForm from "@/components/sections/ContactForm";
import Footer from "@/components/sections/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import ScrollProgress from "@/components/ScrollProgress";
import SmoothScroll from "@/components/SmoothScroll";
import SkipToContent from "@/components/SkipToContent";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import gsap from 'gsap';

export default function Home() {
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const [shouldSkipPreloader, setShouldSkipPreloader] = useState(false);
  const mainContentRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const fadeInContent = useCallback(() => {
    // Transition body background from preloader color to cream
    gsap.to('body', {
      backgroundColor: 'var(--color-cream)',
      duration: 0.8,
      ease: 'power2.out',
    });

    if (mainContentRef.current) {
      gsap.to(mainContentRef.current, {
        duration: 1,
        opacity: 1,
        ease: 'power3.easeIn',
      });
    }
    if (headerRef.current) {
      gsap.to(headerRef.current, {
        duration: 1,
        opacity: 1,
        ease: 'power3.easeIn',
      });
    }
  }, []);

  const handlePreloaderComplete = () => {
    setPreloaderComplete(true);
    fadeInContent();
  };

  // Set initial body background to match preloader
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      // Set body background to preloader color initially
      document.body.style.backgroundColor = '#0F0E0D';
    }
  }, []);

  // Check if returning from project page - skip preloader and scroll to projects immediately
  useEffect(() => {
    // Check sessionStorage only on client side
    if (typeof window !== 'undefined') {
      const scrollToProjects = sessionStorage.getItem('scrollToProjects') === 'true';
      setShouldSkipPreloader(scrollToProjects);
      if (scrollToProjects) {
        setPreloaderComplete(true);
        // Immediately set body background to cream when skipping preloader
        if (typeof document !== 'undefined') {
          document.body.style.backgroundColor = 'var(--color-cream)';
        }
      }
    }
  }, []);

  useEffect(() => {
    if (shouldSkipPreloader) {
      sessionStorage.removeItem('scrollToProjects');
      // Content should already be visible since preloaderComplete starts as true
      fadeInContent();
      
      // Scroll immediately - use Lenis if available, otherwise window scroll
      const scrollToProjects = () => {
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
          const lenis = (window as any).lenis;
          if (lenis) {
            // Use Lenis for instant scroll (immediate: true)
            lenis.scrollTo(projectsSection, { 
              offset: -100, 
              immediate: true,
              duration: 0
            });
          } else {
            // Fallback to instant window scroll
            window.scrollTo({
              top: projectsSection.offsetTop - 100,
              left: 0,
              behavior: 'auto' as ScrollBehavior
            });
          }
        }
      };
      
      // Try to scroll immediately, multiple times to catch DOM updates
      scrollToProjects();
      requestAnimationFrame(() => {
        scrollToProjects();
        // Try once more after a microtask to ensure Lenis is ready
        setTimeout(scrollToProjects, 0);
      });
    }
  }, [shouldSkipPreloader, fadeInContent]);

  // Fallback: ensure content is visible after 4 seconds even if preloader doesn't complete
  useEffect(() => {
    if (shouldSkipPreloader) return; // Skip fallback if we're returning from project page
    
    const fallbackTimer = setTimeout(() => {
      if (!preloaderComplete) {
        setPreloaderComplete(true);
        fadeInContent();
      }
    }, 4000);

    return () => clearTimeout(fallbackTimer);
  }, [preloaderComplete, shouldSkipPreloader, fadeInContent]);

  return (
    <SmoothScroll>
      <SkipToContent />
      <KeyboardShortcuts />
      <div id="primary" className="relative min-h-screen">
        {/* Elegant Border Frame - Wraps entire page including header */}
        <div 
          className="fixed inset-0 pointer-events-none z-[100]"
          style={{
            border: '3px solid var(--color-cream)',
            boxShadow: `
              inset 0 0 0 1px rgba(255, 255, 255, 0.1),
              0 0 0 1px rgba(0, 0, 0, 0.05)
            `,
          }}
          aria-hidden="true"
        />
        {/* Inner accent line */}
        <div 
          className="fixed pointer-events-none z-[100]"
          style={{
            top: '3px',
            left: '3px',
            right: '3px',
            bottom: '3px',
            border: '1px solid rgba(184, 160, 104, 0.2)',
          }}
          aria-hidden="true"
        />
        
        <ScrollProgress />
        {!shouldSkipPreloader && <Preloader onComplete={handlePreloaderComplete} />}
        <Header />
        <main 
          ref={mainContentRef} 
          className="main-content" 
          style={{ 
            backgroundColor: preloaderComplete ? 'var(--color-cream)' : '#0F0E0D',
            opacity: preloaderComplete ? 1 : 0,
            minHeight: '100vh',
            transition: 'background-color 0.8s ease-out, opacity 1s ease-in-out'
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
            <Team />
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

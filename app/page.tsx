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

  // Check if returning from project page - skip preloader and scroll to projects immediately
  useEffect(() => {
    // Check sessionStorage only on client side
    if (typeof window !== 'undefined') {
      // Disable automatic scroll restoration
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      
      const scrollToProjects = sessionStorage.getItem('scrollToProjects') === 'true';
      setShouldSkipPreloader(scrollToProjects);
      if (scrollToProjects) {
        setPreloaderComplete(true);
        // Immediately set body and html background to cream when skipping preloader
        if (typeof document !== 'undefined') {
          document.body.style.backgroundColor = 'var(--color-cream)';
          document.documentElement.style.backgroundColor = 'var(--color-cream)';
          // Prevent scroll to top on page load
          window.scrollTo(0, 0);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (shouldSkipPreloader) {
      sessionStorage.removeItem('scrollToProjects');
      // Content should already be visible since preloaderComplete starts as true
      fadeInContent();
      
      // Prevent default scroll to top
      if (typeof window !== 'undefined') {
        if ('scrollRestoration' in window.history) {
          window.history.scrollRestoration = 'manual';
        }
        // Immediately prevent scroll to top
        window.scrollTo(0, 0);
      }
      
      // Wait for Lenis to be ready, then scroll
      const waitForLenisAndScroll = () => {
        const projectsSection = document.getElementById('projects');
        if (!projectsSection) return false;
        
        const lenis = window.lenis;
        if (lenis) {
          // Use Lenis for instant scroll (immediate: true)
          lenis.scrollTo(projectsSection, { 
            offset: -100, 
            immediate: true,
            duration: 0
          });
          return true;
        } else {
          // Fallback to instant window scroll
          window.scrollTo({
            top: projectsSection.offsetTop - 100,
            left: 0,
            behavior: 'auto' as ScrollBehavior
          });
          return true;
        }
      };
      
      // Try multiple times to ensure scroll happens
      let attempts = 0;
      const maxAttempts = 10;
      
      const tryScroll = () => {
        attempts++;
        if (waitForLenisAndScroll() || attempts >= maxAttempts) {
          return;
        }
        requestAnimationFrame(tryScroll);
      };
      
      // Start trying immediately
      tryScroll();
      // Also try after a short delay in case Lenis isn't ready yet
      setTimeout(() => {
        if (attempts < maxAttempts) {
          tryScroll();
        }
      }, 100);
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
            border: 'clamp(8px, 2vw, 20px) solid var(--color-cream)',
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
            top: 'clamp(8px, 2vw, 20px)',
            left: 'clamp(8px, 2vw, 20px)',
            right: 'clamp(8px, 2vw, 20px)',
            bottom: 'clamp(8px, 2vw, 20px)',
            border: '1px solid rgba(184, 160, 104, 0.2)',
          }}
          aria-hidden="true"
        />
        
        <ScrollProgress />
        {!shouldSkipPreloader && <Preloader onComplete={handlePreloaderComplete} shouldSkip={shouldSkipPreloader} />}
        <Header />
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

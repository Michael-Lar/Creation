'use client';

import { useState, useEffect, useRef } from 'react';
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
  const mainContentRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const fadeInContent = () => {
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
  };

  const handlePreloaderComplete = () => {
    setPreloaderComplete(true);
    fadeInContent();
  };

  // Fallback: ensure content is visible after 4 seconds even if preloader doesn't complete
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!preloaderComplete) {
        setPreloaderComplete(true);
        fadeInContent();
      }
    }, 4000);

    return () => clearTimeout(fallbackTimer);
  }, [preloaderComplete]);

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
        <Preloader onComplete={handlePreloaderComplete} />
        <Header />
        <main 
          ref={mainContentRef} 
          className="main-content" 
          style={{ 
            backgroundColor: 'var(--color-cream)',
            opacity: preloaderComplete ? 1 : 0,
            transition: 'opacity 1s ease-in-out'
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

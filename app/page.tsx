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
      <div id="primary">
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
            <Hero />
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

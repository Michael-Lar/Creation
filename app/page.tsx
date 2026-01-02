'use client';

import { useState } from 'react';
import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Divisions from "@/components/sections/Divisions";
import Team from "@/components/sections/Team";
import Projects from "@/components/sections/Projects";
import Footer from "@/components/sections/Footer";
import gsap from 'gsap';

export default function Home() {
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  const handlePreloaderComplete = () => {
    setPreloaderComplete(true);
    // Fade in main content
    gsap.to('.main-content', {
      duration: 1,
      opacity: 1,
      ease: 'power3.easeIn',
    });
    // Fade in header
    gsap.to('.header-content', {
      duration: 1,
      opacity: 1,
      ease: 'power3.easeIn',
    });
  };

  return (
    <>
      <Preloader onComplete={handlePreloaderComplete} />
      <Header />
      <main className="main-content opacity-0" style={{ backgroundColor: '#F5F1E8' }}>
        <Hero />
        <About />
        <Divisions />
        <Team />
        <Projects />
        <Footer />
      </main>
    </>
  );
}

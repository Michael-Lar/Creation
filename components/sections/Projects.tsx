'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '@/data/projects';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { createScrollReveal, ANIMATIONS } from '@/utils/animations';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Get unique project types for filter
const projectTypes = ['All', ...Array.from(new Set(projects.map(p => p.type)))];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isInitialMount, setIsInitialMount] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();
  const scrollTriggerInstanceRef = useRef<ScrollTrigger | null>(null);

  // Robust filtering with validation
  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p && p.type === activeFilter);

  // Standardized scroll-triggered animations for label
  useScrollAnimation(
    sectionRef,
    () => {
      if (labelRef.current) {
        createScrollReveal(labelRef.current, {
          y: ANIMATIONS.transform.slideUp.small,
          trigger: sectionRef.current,
        });
      }
    },
    { disabled: prefersReducedMotion }
  );

  // Scroll-triggered animation for cards (only runs once on mount)
  useEffect(() => {
    if (prefersReducedMotion || !gridRef.current || !isInitialMount) return;

    const cards = Array.from(gridRef.current.children) as HTMLElement[];
    if (cards.length === 0) return;

    // Kill any existing ScrollTrigger on the grid
    if (scrollTriggerInstanceRef.current) {
      scrollTriggerInstanceRef.current.kill();
    }

    // Check if section is already in view
    const rect = gridRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const isInView = rect.top < windowHeight * 0.95 && rect.bottom > 0;

    if (isInView) {
      // Section is already in view, animate immediately without ScrollTrigger
      gsap.fromTo(cards,
        {
          opacity: 0,
          y: ANIMATIONS.transform.slideUp.medium,
        },
        {
          opacity: 1,
          y: 0,
          duration: ANIMATIONS.duration.standard,
          stagger: ANIMATIONS.stagger.standard,
          ease: ANIMATIONS.ease.standard,
          onComplete: () => {
            cards.forEach((card) => {
              gsap.set(card, { clearProps: 'transform' });
            });
            setIsInitialMount(false);
          },
        }
      );
    } else {
      // Section not in view yet, use ScrollTrigger
      gsap.set(cards, {
        opacity: 0,
        y: ANIMATIONS.transform.slideUp.medium,
      });

      const st = ScrollTrigger.create({
        trigger: gridRef.current,
        start: ANIMATIONS.scrollTrigger.start,
        once: true,
        onEnter: () => {
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: ANIMATIONS.duration.standard,
            stagger: ANIMATIONS.stagger.standard,
            ease: ANIMATIONS.ease.standard,
            onComplete: () => {
              cards.forEach((card) => {
                gsap.set(card, { clearProps: 'transform' });
              });
              setIsInitialMount(false);
              if (scrollTriggerInstanceRef.current) {
                scrollTriggerInstanceRef.current.kill();
                scrollTriggerInstanceRef.current = null;
              }
            },
          });
        },
      });

      scrollTriggerInstanceRef.current = st;
    }

    return () => {
      if (scrollTriggerInstanceRef.current) {
        scrollTriggerInstanceRef.current.kill();
        scrollTriggerInstanceRef.current = null;
      }
    };
  }, [prefersReducedMotion, isInitialMount]);

  // Animate cards when filter changes (skip on initial mount)
  useEffect(() => {
    if (prefersReducedMotion || !gridRef.current || isInitialMount) return;
    
    const cards = Array.from(gridRef.current.children) as HTMLElement[];
    if (cards.length === 0) return;

    // Kill the scroll trigger since we're manually animating
    if (scrollTriggerInstanceRef.current) {
      scrollTriggerInstanceRef.current.kill();
      scrollTriggerInstanceRef.current = null;
    }

    // Reset and animate cards
    gsap.fromTo(cards,
      {
        opacity: 0,
        y: ANIMATIONS.transform.slideUp.medium,
      },
      {
        opacity: 1,
        y: 0,
        duration: ANIMATIONS.duration.standard,
        stagger: ANIMATIONS.stagger.standard,
        ease: ANIMATIONS.ease.standard,
        onComplete: () => {
          // Clear transform after animation completes
          cards.forEach((card) => {
            gsap.set(card, { clearProps: 'transform' });
          });
        },
      }
    );
  }, [activeFilter, prefersReducedMotion, isInitialMount]);

  return (
    <section 
      ref={sectionRef} 
      id="projects" 
      className="section-spacing relative bg-texture-paper"
      style={{ backgroundColor: 'var(--color-cream)' }}
    >
      {/* Section top divider - with spacing from content */}
      <div className="absolute top-0 left-0 right-0 divider-bronze" aria-hidden="true" />
      
      <div className="container-main pt-2 md:pt-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 md:mb-8 lg:mb-10">
          {/* Section Label */}
          <div ref={labelRef}>
            <div className="section-label mb-0">
              <div className="section-label-line" />
              <span className="section-label-text">Recent Projects</span>
            </div>
          </div>

          {/* Filter Pills */}
          <nav 
            className="flex flex-wrap gap-2.5 sm:gap-3" 
            role="tablist" 
            aria-label="Filter projects by type"
          >
            {projectTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                role="tab"
                aria-selected={activeFilter === type}
                className={`
                  px-3 sm:px-4 py-2 text-[0.65rem] sm:text-caption tracking-wide transition-all-standard touch-target rounded-full border
                  ${activeFilter === type 
                    ? 'bg-ink-800 text-white border-ink-800' 
                    : 'bg-transparent text-ink-500 border-ink-200 active:text-ink-700 active:bg-ink-50 hover:text-ink-700 hover:bg-ink-50 hover:border-accent/30'
                  }
                `}
              >
                {type}
              </button>
            ))}
          </nav>
        </div>

        {/* Projects Grid */}
        <div 
          ref={gridRef} 
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-7 lg:gap-8"
          role="tabpanel"
        >
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
            <Link 
              key={project.id}
              href={`/projects/${project.id}`}
              className="group block"
              onClick={(e) => {
                // Prevent any scroll behavior during navigation
                if (typeof window !== 'undefined') {
                  const lenis = window.lenis;
                  if (lenis) {
                    // Immediately stop any ongoing scroll
                    lenis.stop();
                  }
                  // Disable scroll restoration temporarily
                  if ('scrollRestoration' in window.history) {
                    window.history.scrollRestoration = 'manual';
                  }
                }
              }}
            >
              <article>
                {/* Project Image - 4:3 aspect ratio with premium shadow */}
                <div className="aspect-[4/3] bg-gradient-to-br from-ink-50 to-ink-100 rounded-card overflow-hidden relative mb-3 sm:mb-4 border border-ink-100 shadow-premium group-hover:shadow-premium-hover group-hover:border-accent/20 transition-all-standard">
                  {/* Subtle pattern */}
                  <div 
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                      backgroundSize: '20px 20px',
                    }}
                    aria-hidden="true"
                  />
                  
                  {/* Type Badge with bronze accent */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-white/95 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-sm border border-ink-100/50">
                    <span className="text-[0.625rem] sm:text-label text-ink-600 tracking-wider">
                      {project.type}
                    </span>
                  </div>
                  
                  {/* Corner accents on hover */}
                  <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-accent/30 opacity-0 group-hover:opacity-100 transition-opacity transition-slow" aria-hidden="true" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-accent/30 opacity-0 group-hover:opacity-100 transition-opacity transition-slow" aria-hidden="true" />
                  
                  {/* Hover Overlay with View indicator */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 via-ink-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity transition-standard flex items-end justify-center pb-5 sm:pb-6">
                    <span className="text-white text-[0.65rem] sm:text-caption tracking-[0.15em] uppercase font-medium">
                      View Project
                    </span>
                  </div>
                </div>
                
                {/* Project Info */}
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <div>
                    <h3 className="text-base sm:text-body-lg text-ink-800 font-medium mb-0.5 sm:mb-1 group-hover:text-ink-900 transition-colors">
                      {project.name}
                      {project.year && (
                        <span className="text-ink-400 font-light ml-1.5 sm:ml-2 text-[0.65rem] sm:text-caption">
                          {project.year}
                        </span>
                      )}
                    </h3>
                    <p className="text-[0.65rem] sm:text-caption text-ink-500 font-light tracking-wide">
                      {project.location}
                    </p>
                  </div>
                  
                  {/* Arrow indicator with bronze hover */}
                  <div 
                    className="mt-1.5 text-ink-300 group-hover:text-accent transition-colors"
                    aria-hidden="true"
                  >
                    <svg 
                      className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </div>
                </div>
              </article>
            </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-body text-ink-500">
                No projects found matching this filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
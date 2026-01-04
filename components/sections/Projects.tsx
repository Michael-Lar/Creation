'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Project {
  id: number;
  name: string;
  location: string;
  type: string;
  year?: string;
}

// Placeholder project data - replace with actual data
const projects: Project[] = [
  {
    id: 1,
    name: 'Project Name',
    location: 'Los Angeles, CA',
    type: 'Commercial',
    year: '2024',
  },
  {
    id: 2,
    name: 'Project Name',
    location: 'Beverly Hills, CA',
    type: 'Mixed Use',
    year: '2024',
  },
  {
    id: 3,
    name: 'Project Name',
    location: 'Santa Monica, CA',
    type: 'Residential',
    year: '2023',
  },
  {
    id: 4,
    name: 'Project Name',
    location: 'West Hollywood, CA',
    type: 'Commercial',
    year: '2023',
  },
  {
    id: 5,
    name: 'Project Name',
    location: 'Culver City, CA',
    type: 'Mixed Use',
    year: '2024',
  },
  {
    id: 6,
    name: 'Project Name',
    location: 'Venice, CA',
    type: 'Residential',
    year: '2024',
  },
];

// Get unique project types for filter
const projectTypes = ['All', ...Array.from(new Set(projects.map(p => p.type)))];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.type === activeFilter);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleChange);
    return () => motionQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Animate section label
      gsap.from(labelRef.current, {
        opacity: 0,
        y: 15,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 92%',
        },
      });

      // Animate project cards
      gsap.from(gridRef.current?.children || [], {
        opacity: 0,
        y: 25,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.06,
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 90%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Animate cards when filter changes
  useEffect(() => {
    if (prefersReducedMotion || !gridRef.current) return;
    
    const cards = gridRef.current.children;
    gsap.fromTo(cards, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
    );
  }, [activeFilter, prefersReducedMotion]);

  return (
    <section 
      ref={sectionRef} 
      id="projects" 
      className="section-spacing relative bg-texture-paper"
      style={{ backgroundColor: 'var(--color-cream)' }}
    >
      {/* Section top divider - with spacing from content */}
      <div className="absolute top-0 left-0 right-0 divider-bronze" aria-hidden="true" />
      
      <div className="container-main pt-4 md:pt-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          {/* Section Label */}
          <div ref={labelRef}>
            <div className="section-label mb-0">
              <div className="section-label-line" />
              <span className="section-label-text">Recent Projects</span>
            </div>
          </div>

          {/* Filter Pills */}
          <nav 
            className="flex flex-wrap gap-2" 
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
                  px-4 py-2.5 md:py-2 text-caption tracking-wide transition-all duration-300 touch-target rounded-full border
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
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          role="tabpanel"
        >
          {filteredProjects.map((project) => (
            <article 
              key={project.id} 
              className="group cursor-pointer"
            >
              {/* Project Image - 4:3 aspect ratio with premium shadow */}
              <div className="aspect-[4/3] bg-gradient-to-br from-ink-50 to-ink-100 rounded-card overflow-hidden relative mb-4 border border-ink-100 shadow-premium group-hover:shadow-premium-hover group-hover:border-accent/20 transition-all duration-400">
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
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-sm border border-ink-100/50">
                  <span className="text-label text-ink-600 tracking-wider">
                    {project.type}
                  </span>
                </div>
                
                {/* Corner accents on hover */}
                <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                
                {/* Hover Overlay with View indicator */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 via-ink-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end justify-center pb-6">
                  <span className="text-white text-caption tracking-[0.15em] uppercase font-medium">
                    View Project
                  </span>
                </div>
              </div>
              
              {/* Project Info */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-body-lg text-ink-800 font-medium mb-1 group-hover:text-ink-900 transition-colors duration-300">
                    {project.name}
                    {project.year && (
                      <span className="text-ink-400 font-light ml-2 text-caption">
                        {project.year}
                      </span>
                    )}
                  </h3>
                  <p className="text-caption text-ink-500 font-light tracking-wide">
                    {project.location}
                  </p>
                </div>
                
                {/* Arrow indicator with bronze hover */}
                <div 
                  className="mt-1.5 text-ink-300 group-hover:text-accent transition-colors duration-300"
                  aria-hidden="true"
                >
                  <svg 
                    className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" 
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
          ))}
        </div>
      </div>
    </section>
  );
}

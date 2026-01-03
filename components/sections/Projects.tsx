'use client';

import { useEffect, useRef } from 'react';
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

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animate section label
      gsap.from(labelRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      // Animate divider
      gsap.from(dividerRef.current, {
        scaleX: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      // Animate project cards
      gsap.from(gridRef.current?.children || [], {
        opacity: 0,
        y: 60,
        scale: 0.95,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 75%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <div ref={labelRef} className="mb-12 md:mb-16 lg:mb-20">
          <span className="text-xs md:text-sm uppercase tracking-widest text-gray-500 font-semibold">
            Recent Projects
          </span>
          <div ref={dividerRef} className="mt-3 w-12 h-px bg-bronze origin-left"></div>
        </div>

        {/* Projects Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="group space-y-4 cursor-pointer"
            >
              {/* Project Image Placeholder */}
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-200/50 to-gray-300/30 rounded-lg overflow-hidden relative border border-gray-200/30 group-hover:border-bronze/30 transition-all duration-300">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)',
                  backgroundSize: '24px 24px'
                }}></div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gray-400/20 group-hover:bg-black/30 transition-all duration-500"></div>
                
                {/* View Project Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="text-center space-y-2">
                    <span className="text-white text-sm uppercase tracking-widest font-light block">
                      View Project
                    </span>
                    <div className="w-12 h-px bg-bronze mx-auto"></div>
                  </div>
                </div>
                
                {/* Project Type Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-sm">
                  <span className="text-xs uppercase tracking-wider text-gray-700 font-light">
                    {project.type}
                  </span>
                </div>
              </div>
              
              {/* Project Info */}
              <div className="space-y-1">
                <h3 className="text-xl md:text-2xl font-light text-gray-900 tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                  {project.name}
                  {project.year && (
                    <span className="text-gray-500 font-light ml-2 text-base md:text-lg">
                      {project.year}
                    </span>
                  )}
                </h3>
                <p className="text-sm md:text-base text-gray-600 font-light flex items-center gap-2">
                  <span>{project.location}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

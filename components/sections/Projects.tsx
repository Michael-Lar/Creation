'use client';

import { useRef, useState, memo, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { projects } from '@/data/projects';
import { getLenisInstance, stopLenis, waitForLenis } from '@/utils/lenis';
import { SCROLL } from '@/constants/ui';
import ImageSkeleton from '@/components/ImageSkeleton';
import { useImageLoading } from '@/hooks/useImageLoading';

// Project category filters
const projectTypes = [
  'All',
  'Retail',
  'Hospitality',
  'Education',
  'Office',
  'Multifamily',
  'Development',
];

function Projects() {
  // State hooks
  const [activeFilter, setActiveFilter] = useState('All');
  const { loadingImages, handleImageLoad, resetLoading } = useImageLoading(
    []
  );
  
  // Refs
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Derived values (memoized to prevent recalculation on every render)
  const filteredProjects = useMemo(() => {
    return activeFilter === 'All' 
      ? projects 
      : projects.filter(project => project && project.types.includes(activeFilter));
  }, [activeFilter]);

  // Initialize loading state for filtered projects when filter changes
  useEffect(() => {
    resetLoading(filteredProjects.map((project) => project.id));
  }, [filteredProjects, resetLoading]);

  // Safari fix: onLoad doesn't fire for images already in the HTTP cache after
  // client-side navigation. This effect runs in the same commit as resetLoading,
  // so their setLoadingImages calls are batched — cached images are never made invisible.
  useEffect(() => {
    if (!gridRef.current) return;
    const imgs = Array.from(gridRef.current.querySelectorAll('img')) as HTMLImageElement[];
    filteredProjects.forEach((project, index) => {
      const img = imgs[index];
      if (img?.complete && img.naturalWidth > 0) {
        handleImageLoad(project.id);
      }
    });
  }, [filteredProjects, handleImageLoad]);

  // Ensure hash navigation works when section mounts
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash;
    if (hash !== '#projects') return;

    const scrollToSelf = async () => {
      const section = sectionRef.current;
      if (!section) return;

      await waitForLenis();
      const lenis = getLenisInstance();
      if (lenis) {
        lenis.scrollTo(section, {
          offset: SCROLL.SECTION_OFFSET,
          immediate: false,
          duration: 0.8,
          onComplete: () => {
            if (window.location.hash === '#projects') {
              window.history.replaceState(null, '', window.location.pathname);
            }
          },
        });
      } else {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          if (window.location.hash === '#projects') {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }, 1000);
      }
    };

    scrollToSelf();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="projects" 
      className="section-spacing pb-10 sm:pb-12 md:pb-14 lg:pb-16 relative bg-texture-paper"
      style={{ backgroundColor: 'var(--color-cream)' }}
    >
      {/* Section top divider - with spacing from content */}
      <div className="absolute top-0 left-0 right-0 divider-bronze" aria-hidden="true" />
      
      <div className="container-main pt-2 md:pt-4">
        {/* Section Header */}
        <div className="mb-6 md:mb-8 lg:mb-10">
          {/* Label + intro */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-8 mb-4 md:mb-5">
            <div>
              <div className="section-label mb-2">
                <div className="section-label-line" />
                <span className="section-label-text">Selected Projects</span>
              </div>
              <p className="text-sm text-ink-400 font-light tracking-wide max-w-sm">
                Acquisitions, developments, and advisory engagements across Los Angeles.
              </p>
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
        </div>

        {/* Projects Grid */}
        <div 
          ref={gridRef} 
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-7 lg:gap-8"
          role="tabpanel"
        >
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => {
              const isLoading = loadingImages.has(project.id);
              
              return (
              <Link 
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group block"
                onClick={() => {
                  // Prevent any scroll behavior during navigation
                  if (typeof window !== 'undefined') {
                    // Immediately stop any ongoing scroll
                    stopLenis();
                  }
                }}
              >
                <article>
                  {/* Project Image - 4:3 aspect ratio with premium shadow */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-ink-50 to-ink-100 rounded-card overflow-hidden relative mb-3 sm:mb-4 border border-ink-100 shadow-premium group-hover:shadow-premium-hover group-hover:border-accent/20 transition-all-standard">
                    {/* Loading Skeleton - shown while image is loading */}
                    {isLoading && (
                      <ImageSkeleton 
                        className="absolute inset-0 rounded-card z-[1]"
                        aspectRatio=""
                        showShimmer={true}
                      />
                    )}
                    
                    {/* Project Image */}
                    {project.images && project.images.length > 0 ? (
                      <Image
                        src={project.images[0]}
                        alt={`${project.name} - ${project.location}`}
                        fill
                        className={`object-cover object-center transition-all duration-slow group-hover:scale-105 ${
                          isLoading ? 'opacity-0' : 'opacity-100'
                        }`}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                        onLoad={() => handleImageLoad(project.id)}
                        onError={() => handleImageLoad(project.id)}
                      />
                    ) : (
                      /* Fallback pattern if no image */
                      <div 
                        className="absolute inset-0 opacity-[0.04] z-10"
                        style={{
                          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                          backgroundSize: '20px 20px',
                        }}
                        aria-hidden="true"
                      />
                    )}
                  
                  {/* Type Badge with bronze accent */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-white/95 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-sm border border-ink-100/50 z-10">
                    <span className="text-[0.625rem] sm:text-label text-ink-600 tracking-wider">
                      {project.types.join(' / ')}
                    </span>
                  </div>
                  
                  {/* Corner accents on hover */}
                  <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-slow z-10" aria-hidden="true" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-slow z-10" aria-hidden="true" />
                  
                  {/* Hover Overlay with View indicator */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 via-ink-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity transition-standard flex items-end justify-center pb-5 sm:pb-6 z-10">
                    <span className="text-white text-[0.65rem] sm:text-caption tracking-[0.15em] uppercase font-medium">
                      View Project
                    </span>
                  </div>
                </div>
                
                {/* Project Info */}
                <div>
                  {/* Dateline row: location · year + arrow */}
                  <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
                    <p className="text-[0.6rem] sm:text-label text-ink-400 font-light tracking-wider uppercase">
                      {project.location}
                      {project.year && (
                        <>
                          <span className="mx-1.5 opacity-40" aria-hidden="true">·</span>
                          {project.year}
                        </>
                      )}
                    </p>
                    {/* Arrow indicator with bronze hover */}
                    <div
                      className="flex-shrink-0 text-ink-300 group-hover:text-accent transition-colors"
                      aria-hidden="true"
                    >
                      <svg
                        className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </div>
                  </div>
                  {/* Name as primary headline */}
                  <h3 className="text-base sm:text-body-lg text-ink-800 font-medium leading-snug group-hover:text-ink-900 transition-colors">
                    {project.name}
                  </h3>
                </div>
              </article>
            </Link>
            );
            })
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

export default memo(Projects);

'use client';

import { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/sections/Footer';
import { getProjectById } from '@/data/projects';
import { useLenis } from '@/utils/lenis';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  // Robust ID parsing with validation
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const projectId = rawId ? parseInt(String(rawId), 10) : NaN;
  const isValidId = !isNaN(projectId) && projectId > 0;
  const project = isValidId ? getProjectById(projectId) : undefined;
  
  const lenis = useLenis();
  const contentRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Reset scroll position to top when project page loads
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    
    // Reset scroll immediately
    const resetScroll = () => {
      if (lenis) {
        lenis.stop();
        lenis.scrollTo(0, { immediate: true, duration: 0 });
      } else {
        window.scrollTo(0, 0);
      }
    };
    
    // Reset immediately
    resetScroll();
    
    // Also reset after a brief delay to catch any delayed scrolls
    const timeoutId = setTimeout(resetScroll, 50);
    const rafId = requestAnimationFrame(() => {
      resetScroll();
    });
    
    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
    };
  }, [lenis]);

  const handleBackToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Navigate to home page with projects hash
    // The hash will be checked on page load to skip preloader and scroll
    router.push('/#projects');
  };

  // Handle invalid or missing project
  if (!isValidId || !project) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl md:text-4xl font-serif text-ink-800 mb-4">
            Project Not Found
          </h1>
          <p className="text-body text-ink-600 mb-8">
            {!isValidId 
              ? 'The project ID is invalid.' 
              : 'The project you\'re looking for doesn\'t exist or has been removed.'}
          </p>
          <button 
            onClick={handleBackToProjects}
            className="inline-flex items-center gap-2 px-6 py-3 bg-ink-800 text-white rounded-sm hover:bg-ink-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Projects</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header forceScrolledStyle={true} />
      
      {/* Hero Image Section */}
      <div 
        ref={heroRef}
        className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden bg-gradient-to-br from-ink-50 to-ink-100"
      >
        {/* Placeholder for project image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-ink-300 text-6xl md:text-7xl font-serif">
              {project.name && project.name.length > 0 ? project.name.charAt(0).toUpperCase() : '?'}
            </span>
          </div>
        </div>
        
        {/* Subtle texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
          aria-hidden="true"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/40 to-transparent" />
        
        {/* Back Button - Elegant positioning */}
        <div className="absolute top-20 sm:top-24 md:top-28 left-0 right-0 z-[60]">
          <div className="container-main">
            <button
              onClick={handleBackToProjects}
              className="inline-flex items-center gap-3 text-ink-700 hover:text-ink-900 transition-all-standard group bg-cream/95 backdrop-blur-sm px-5 py-2.5 rounded-sm border border-ink-200/50 hover:border-accent/30 shadow-soft hover:shadow-lift"
            >
              <span className="text-caption tracking-wide uppercase font-light">
                View All Projects
              </span>
              <div className="flex items-center gap-2">
                <span className="w-8 h-px bg-ink-300 group-hover:w-12 group-hover:bg-accent transition-all-standard" />
                <svg 
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative bg-cream">
        {/* Subtle top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ink-200 to-transparent" aria-hidden="true" />
        
        <div className="container-content py-16 md:py-24 lg:py-32">
          <div ref={contentRef} className="max-w-4xl mx-auto">
            {/* Project Header */}
            <div className="mb-12 md:mb-16">
              <div className="section-label mb-8">
                <div className="section-label-line" />
                <span className="section-label-text">{project.type}</span>
              </div>
              
              <h1 className="text-display text-ink-800 mb-6 font-serif leading-tight">
                {project.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-body text-ink-600 font-light">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {project.location}
                </span>
                {project.year && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-ink-400" />
                    <span>{project.year}</span>
                  </>
                )}
                {project.status && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-ink-400" />
                    <span className="px-2 py-0.5 bg-ink-100 text-ink-600 text-caption rounded-sm">
                      {project.status}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="divider-bronze my-12 md:my-16" aria-hidden="true" />

            {/* Project Details Grid */}
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 mb-16 md:mb-20">
              {project.size && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-px bg-accent/70" aria-hidden="true" />
                    <span className="text-label text-ink-400 tracking-luxury">Size</span>
                  </div>
                  <p className="text-body-lg text-ink-800 font-light">
                    {project.size}
                  </p>
                </div>
              )}
              
              {project.role && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-px bg-accent/70" aria-hidden="true" />
                    <span className="text-label text-ink-400 tracking-luxury">Role</span>
                  </div>
                  <p className="text-body-lg text-ink-800 font-light">
                    {project.role}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            {project.description && (
              <div className="mb-12 md:mb-16">
                <p className="text-title text-ink-700 font-light leading-relaxed max-w-3xl font-serif">
                  {project.description}
                </p>
              </div>
            )}

            {/* Details */}
            {project.details && (
              <div className="mb-16 md:mb-20">
                <div className="relative pl-6 md:pl-8">
                  {/* Decorative border */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-px"
                    style={{
                      background: 'linear-gradient(to bottom, var(--color-accent) 0%, var(--color-accent) 30%, var(--color-gray-200) 100%)',
                    }}
                    aria-hidden="true"
                  />
                  <p className="text-body-lg text-ink-600 font-light leading-relaxed">
                    {project.details}
                  </p>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="divider-bronze my-12 md:my-16" aria-hidden="true" />

            {/* Navigation to Other Projects */}
            <div className="pt-8 border-t border-ink-100">
              <button
                onClick={handleBackToProjects}
                className="inline-flex items-center gap-3 text-ink-700 hover:text-ink-900 transition-all-standard group"
              >
                <span className="text-caption tracking-wide uppercase font-light">
                  View All Projects
                </span>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-px bg-ink-300 group-hover:w-12 group-hover:bg-accent transition-all-standard" />
                  <svg 
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

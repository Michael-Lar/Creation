'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/sections/Footer';
import { getProjectById } from '@/data/projects';
import { useLenis } from '@/utils/lenis';
import ImageSkeleton from '@/components/ImageSkeleton';

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
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [heroImageLoading, setHeroImageLoading] = useState(true);

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

  useEffect(() => {
    setActiveImageIndex(0);
    setHeroImageLoading(true);
  }, [project?.id]);

  useEffect(() => {
    setHeroImageLoading(true);
  }, [activeImageIndex]);

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

  const heroImages = project.images && project.images.length > 0 ? project.images : [];
  const heroImage = heroImages.length > 0 ? heroImages[activeImageIndex] : undefined;
  const projectTypeLabel = project.types.join(' / ');

  return (
    <div className="min-h-screen bg-cream">
      <Header forceScrolledStyle={true} scrolledBlurClass="backdrop-blur-sm" />
      
      {/* Hero Image Section */}
      <div 
        ref={heroRef}
        className="relative mt-[96px] sm:mt-[104px] lg:mt-[112px] h-[45vh] sm:h-[55vh] lg:h-[65vh] w-full overflow-hidden bg-ink-50"
      >
        {/* Project hero image */}
        {heroImage ? (
          <Image
            src={heroImage}
            alt={`${project.name}, ${project.location} — ${projectTypeLabel}`}
            fill
            priority
            className={`object-cover object-center transition-opacity duration-500 ${
              heroImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            sizes="100vw"
            onLoad={() => setHeroImageLoading(false)}
            onError={() => setHeroImageLoading(false)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-ink-300 text-6xl md:text-7xl font-serif">
                {project.name && project.name.length > 0 ? project.name.charAt(0).toUpperCase() : '?'}
              </span>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {heroImageLoading && (
          <ImageSkeleton 
            className="absolute inset-0 rounded-none z-[1]"
            aspectRatio=""
            showShimmer={true}
          />
        )}
        
      </div>

      {/* Main Content */}
      <main className="relative bg-cream">
        {/* Subtle top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ink-200 to-transparent" aria-hidden="true" />
        
        <div className="container-content pt-6 md:pt-8 lg:pt-10 pb-12 md:pb-16 lg:pb-24">
          {/* Back Link */}
          <div className="mb-8">
            <button
              onClick={handleBackToProjects}
              className="inline-flex items-center gap-2 text-ink-500 hover:text-ink-800 transition-all-standard group"
            >
              <svg 
                className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span className="text-[0.65rem] sm:text-caption tracking-wide uppercase font-light">
                View All Projects
              </span>
            </button>
          </div>
          <div ref={contentRef} className="max-w-4xl mx-auto">
            {/* Thumbnail Gallery */}
            {heroImages.length > 1 && (
              <div className="mb-10 md:mb-12">
                <div className="flex flex-wrap gap-3">
                  {heroImages.map((image, index) => {
                    const isActive = index === activeImageIndex;
                    return (
                      <button
                        key={`${project.id}-${image}-${index}`}
                        onClick={() => setActiveImageIndex(index)}
                        className={`relative w-24 sm:w-28 h-16 sm:h-20 overflow-hidden rounded-md border transition-all-standard ${
                          isActive 
                            ? 'border-accent/70 shadow-lift' 
                            : 'border-ink-100 hover:border-accent/40'
                        }`}
                        aria-pressed={isActive}
                        aria-label={`View image ${index + 1} of ${heroImages.length}`}
                      >
                        <Image
                          src={image}
                          alt={`${project.name}, ${project.location} — ${projectTypeLabel} (thumbnail ${index + 1})`}
                          fill
                          className="object-cover object-center"
                          sizes="120px"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Project Header */}
            <div className="mb-12 md:mb-16">
              <div className="section-label mb-8">
                <div className="section-label-line" />
                <span className="section-label-text">{projectTypeLabel}</span>
              </div>
              
              <h2 className="text-display text-ink-800 mb-6 font-serif leading-tight">
                {project.name}
              </h2>
              
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

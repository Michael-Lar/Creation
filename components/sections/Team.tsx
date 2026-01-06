'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TeamMember {
  id: number;
  name: string;
  title: string;
  bio?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  image?: string; // Path to headshot image
}

// Placeholder team data - replace with actual data
const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Yoav Sarraf',
    title: 'Founder & CEO',
    bio: 'Yoav brings extensive experience in commercial real estate investment, advisory, and management. He has a proven track record of identifying opportunities and creating long-term value across diverse asset types.',
    email: 'ys@creation-partners.com',
    phone: '310.749.9628',
    linkedin: 'https://www.linkedin.com/in/yoav-sarraf',
    image: '/team/yoav-sarraf.png', // Add headshot image path here
  },
  {
    id: 2,
    name: 'Team Member',
    title: 'Position',
    bio: 'Bio information will appear here when expanded. This section can include professional background, expertise, and key achievements.',
  },
  {
    id: 3,
    name: 'Team Member',
    title: 'Position',
    bio: 'Bio information will appear here when expanded. This section can include professional background, expertise, and key achievements.',
  },
  {
    id: 4,
    name: 'Team Member',
    title: 'Position',
    bio: 'Bio information will appear here when expanded. This section can include professional background, expertise, and key achievements.',
  },
  {
    id: 5,
    name: 'Team Member',
    title: 'Position',
    bio: 'Bio information will appear here when expanded. This section can include professional background, expertise, and key achievements.',
  },
  {
    id: 6,
    name: 'Team Member',
    title: 'Position',
    bio: 'Bio information will appear here when expanded. This section can include professional background, expertise, and key achievements.',
  },
];

export default function Team() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const expandedContentRefs = useRef<Map<number, HTMLDivElement>>(new Map());

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

      // Animate team cards with elegant stagger
      const cards = Array.from(gridRef.current?.children || []) as HTMLElement[];
      gsap.from(cards, {
        opacity: 0,
        y: 30,
        scale: 0.95,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 88%',
        },
        onComplete: () => {
          cards.forEach((card) => {
            gsap.set(card, { clearProps: 'all' });
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Handle expand/collapse with GSAP animations
  useEffect(() => {
    teamMembers.forEach((member) => {
      const contentEl = expandedContentRefs.current.get(member.id);
      if (!contentEl) return;

      const isExpanded = expandedId === member.id;
      
      if (prefersReducedMotion) {
        // Instant show/hide for reduced motion
        if (isExpanded) {
          contentEl.style.height = 'auto';
          contentEl.style.opacity = '1';
        } else {
          contentEl.style.height = '0';
          contentEl.style.opacity = '0';
        }
        return;
      }

      if (isExpanded) {
        // Expand: elegant reveal animation
        gsap.set(contentEl, { height: 'auto' });
        const height = contentEl.scrollHeight;
        gsap.set(contentEl, { height: 0, opacity: 0, overflow: 'hidden' });
        
        gsap.to(contentEl, {
          height: height,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          onComplete: () => {
            gsap.set(contentEl, { height: 'auto', overflow: 'visible' });
          },
        });
      } else {
        // Collapse: smooth hide animation
        const currentHeight = contentEl.scrollHeight;
        gsap.set(contentEl, { height: currentHeight, overflow: 'hidden' });
        
        gsap.to(contentEl, {
          height: 0,
          opacity: 0,
          duration: 0.45,
          ease: 'power3.in',
        });
      }
    });
  }, [expandedId, prefersReducedMotion]);

  const handleCardClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section 
      ref={sectionRef} 
      id="team" 
      className="section-spacing relative bg-texture-paper"
      style={{ backgroundColor: 'var(--color-cream)' }}
    >
      {/* Section top divider */}
      <div className="absolute top-0 left-0 right-0 divider-bronze" aria-hidden="true" />
      
      <div className="container-main pt-2 md:pt-4">
        {/* Section Label */}
        <div ref={labelRef} className="section-label mb-6 md:mb-10">
          <div className="section-label-line" />
          <span className="section-label-text">Team</span>
        </div>

        {/* Team Grid */}
        <div 
          ref={gridRef} 
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {teamMembers.map((member) => {
            const isExpanded = expandedId === member.id;
            
            return (
              <article
                key={member.id}
                className="group bg-white/80 backdrop-blur-sm border border-ink-100/40 rounded-sm overflow-hidden transition-all duration-500 hover:bg-white hover:border-accent/30 hover:shadow-lg cursor-pointer touch-target"
                onClick={(e) => handleCardClick(e, member.id)}
              >
                {/* Photo Container - Clean B&W Cutout */}
                <div className="aspect-[4/5] relative flex items-center justify-center bg-gradient-to-b from-gray-50 to-white overflow-hidden group-hover:from-white group-hover:to-gray-50 transition-all duration-500">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={`${member.name} - ${member.title}`}
                      className="w-full h-full object-contain object-center transition-all duration-500 group-hover:scale-105"
                      style={{
                        filter: 'grayscale(100%) contrast(1.15)',
                        WebkitFilter: 'grayscale(100%) contrast(1.15)',
                      }}
                    />
                  ) : (
                    // Fallback placeholder
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-ink-300 text-6xl font-playfair">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 md:p-7">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-playfair text-ink-800 mb-1 leading-tight group-hover:text-accent transition-colors duration-400">
                        {member.name}
                      </h3>
                      <p className="text-xs uppercase tracking-wider text-ink-400 font-light">
                        {member.title}
                      </p>
                    </div>
                    
                    {/* Expand/Collapse Indicator - Touch-friendly */}
                    <button
                      className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-ink-200 text-ink-400 hover:border-accent hover:text-accent transition-all duration-300 touch-target ${
                        isExpanded ? 'rotate-180 border-accent text-accent' : ''
                      }`}
                      aria-label={isExpanded ? 'Collapse bio' : 'Expand bio'}
                      aria-expanded={isExpanded}
                    >
                      <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Expanded Content */}
                  <div
                    ref={(el) => {
                      if (el) expandedContentRefs.current.set(member.id, el);
                    }}
                    className="overflow-hidden"
                    style={{ height: 0, opacity: 0 }}
                  >
                    <div className="pt-5 mt-5 border-t border-ink-100/50 space-y-5">
                      {/* Bio */}
                      {member.bio && (
                        <p className="text-sm md:text-base text-ink/70 font-light leading-relaxed">
                          {member.bio}
                        </p>
                      )}

                      {/* Contact Information */}
                      <div className="flex flex-col gap-3">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2.5 text-sm text-ink/60 hover:text-accent transition-colors duration-300 group/link"
                          >
                            <span className="w-5 h-5 flex items-center justify-center">
                              <svg 
                                className="w-4 h-4" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                                strokeWidth={1.5}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                              </svg>
                            </span>
                            <span className="group-hover/link:underline">{member.email}</span>
                          </a>
                        )}
                        
                        {member.phone && (
                          <a
                            href={`tel:${member.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2.5 text-sm text-ink/60 hover:text-accent transition-colors duration-300 group/link"
                          >
                            <span className="w-5 h-5 flex items-center justify-center">
                              <svg 
                                className="w-4 h-4" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                                strokeWidth={1.5}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.866-.554-1.649-1.413-1.946l-1.557-.51a1.586 1.586 0 00-2.215 1.46c-.16 2.629-.896 3.165-2.28 3.165-1.653 0-3.793-2.364-5.54-5.756-1.748-3.391-2.13-6.52-.53-8.254.617-.67 1.61-.962 2.64-.619l1.485.494c.86.285 1.387 1.092 1.387 1.961v1.378a2.25 2.25 0 01-2.25 2.25h-2.25" />
                              </svg>
                            </span>
                            <span className="group-hover/link:underline">{member.phone}</span>
                          </a>
                        )}
                        
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2.5 text-sm text-ink/60 hover:text-accent transition-colors duration-300 group/link"
                          >
                            <span className="w-5 h-5 flex items-center justify-center">
                              <svg 
                                className="w-4 h-4" 
                                fill="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                            </span>
                            <span className="group-hover/link:underline">LinkedIn</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

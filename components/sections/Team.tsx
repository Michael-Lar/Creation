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

      // Animate team cards with stagger
      const cards = Array.from(gridRef.current?.children || []) as HTMLElement[];
      gsap.from(cards, {
        opacity: 0,
        y: 25,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.05,
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 90%',
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
        // Expand: measure actual height and animate to it
        gsap.set(contentEl, { height: 'auto' });
        const height = contentEl.scrollHeight;
        gsap.set(contentEl, { height: 0, opacity: 0, overflow: 'hidden' });
        
        gsap.to(contentEl, {
          height: height,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => {
            gsap.set(contentEl, { height: 'auto', overflow: 'visible' });
          },
        });
      } else {
        // Collapse: animate to 0
        const currentHeight = contentEl.scrollHeight;
        gsap.set(contentEl, { height: currentHeight, overflow: 'hidden' });
        
        gsap.to(contentEl, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
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
      style={{ backgroundColor: 'var(--color-gray-50)' }}
    >
      {/* Section top divider - with spacing from content */}
      <div className="absolute top-0 left-0 right-0 divider-bronze" aria-hidden="true" />
      
      <div className="container-main pt-4 md:pt-6">
        {/* Section Label */}
        <div ref={labelRef} className="section-label mb-12 md:mb-16">
          <div className="section-label-line" />
          <span className="section-label-text">Our Team</span>
        </div>

        {/* Team Grid */}
        <div 
          ref={gridRef} 
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {teamMembers.map((member) => {
            const isExpanded = expandedId === member.id;
            
            return (
              <article
                key={member.id}
                className="group bg-white border border-ink-100 rounded-card overflow-hidden transition-all duration-400 ease-smooth hover:border-accent/25 shadow-premium hover:shadow-premium-hover cursor-pointer"
                onClick={(e) => handleCardClick(e, member.id)}
              >
                {/* Photo Container - 4:5 aspect ratio */}
                <div className="aspect-[4/5] bg-gradient-to-br from-ink-50 to-ink-100 relative overflow-hidden">
                  {/* Placeholder for photo */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-ink-200 text-5xl font-serif">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  
                  {/* Subtle bronze tint on hover */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-accent/0 to-accent/0 group-hover:from-accent/[0.03] group-hover:to-transparent transition-all duration-500"
                    aria-hidden="true"
                  />
                </div>

                {/* Content */}
                <div className="p-5 md:p-6">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-body-lg text-ink-800 font-medium mb-1 group-hover:text-ink-900 transition-colors duration-300">
                        {member.name}
                      </h3>
                      <p className="text-caption text-ink-500 font-light">
                        {member.title}
                      </p>
                    </div>
                    
                    {/* Expand/Collapse Indicator */}
                    <div 
                      className={`flex-shrink-0 w-6 h-6 flex items-center justify-center transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    >
                      <svg 
                        className="w-4 h-4 text-ink-400" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <div
                    ref={(el) => {
                      if (el) expandedContentRefs.current.set(member.id, el);
                    }}
                    className="overflow-hidden"
                    style={{ height: 0, opacity: 0 }}
                  >
                    <div className="pt-4 mt-4 border-t border-ink-100 space-y-4">
                      {/* Bio */}
                      {member.bio && (
                        <p className="text-body text-ink-600 font-light leading-relaxed">
                          {member.bio}
                        </p>
                      )}

                      {/* Contact Information */}
                      <div className="flex flex-wrap gap-4 pt-2">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 text-caption text-ink-500 hover:text-accent transition-colors duration-300 group/link"
                          >
                            <svg 
                              className="w-3.5 h-3.5" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                            <span className="group-hover/link:underline">Email</span>
                          </a>
                        )}
                        
                        {member.phone && (
                          <a
                            href={`tel:${member.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 text-caption text-ink-500 hover:text-accent transition-colors duration-300 group/link"
                          >
                            <svg 
                              className="w-3.5 h-3.5" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-1.516-1.032-2.812-2.5-3.19l-1.5-.375c-.5-.125-.75-.5-.75-1v-1.5c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-3.75c-.621 0-1.125-.504-1.125-1.125v-1.5c0-.5.25-.875.75-1l1.5-.375c1.468-.378 2.5-1.674 2.5-3.19V6.75c0-1.24-1.01-2.25-2.25-2.25h-2.25C8.966 4.5 2.25 11.216 2.25 19.5v1.372c0 1.516 1.032 2.812 2.5 3.19l1.5.375c.5.125.75.5.75 1v1.5c0 .621-.504 1.125-1.125 1.125H3.375c-.621 0-1.125-.504-1.125-1.125v-3.75c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125v1.5c0 .5-.25.875-.75 1l-1.5.375c-1.468.378-2.5 1.674-2.5 3.19V21.75c0 1.24 1.01 2.25 2.25 2.25h2.25c8.284 0 15-6.716 15-15V6.75c0-1.24-1.01-2.25-2.25-2.25h-2.25c-8.284 0-15 6.716-15 15z" />
                            </svg>
                            <span className="group-hover/link:underline">{member.phone}</span>
                          </a>
                        )}
                        
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 text-caption text-ink-500 hover:text-accent transition-colors duration-300 group/link"
                          >
                            <svg 
                              className="w-3.5 h-3.5" 
                              fill="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
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

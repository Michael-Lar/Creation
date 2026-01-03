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
    bio: 'Yoav brings extensive experience in commercial real estate investment, advisory, and management.',
    email: 'ys@creation-partners.com',
    phone: '310.749.9628',
  },
  {
    id: 2,
    name: 'Team Member',
    title: 'Position',
    bio: 'Bio information will appear here when expanded.',
  },
  {
    id: 3,
    name: 'Team Member',
    title: 'Position',
    bio: 'Bio information will appear here when expanded.',
  },
  {
    id: 4,
    name: 'Team Member',
    title: 'Position',
    bio: 'Bio information will appear here when expanded.',
  },
  {
    id: 5,
    name: 'Team Member',
    title: 'Position',
    bio: 'Bio information will appear here when expanded.',
  },
  {
    id: 6,
    name: 'Team Member',
    title: 'Position',
    bio: 'Bio information will appear here when expanded.',
  },
];

export default function Team() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const expandedContentRefs = useRef<Map<number, HTMLDivElement>>(new Map());

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

      // Animate team cards - but ensure they end at opacity 1 and y: 0
      const cards = Array.from(gridRef.current?.children || []) as HTMLElement[];
      gsap.from(cards, {
        opacity: 0,
        y: 60,
        scale: 0.95,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 75%',
        },
        onComplete: () => {
          // Ensure all cards are fully visible and aligned after animation
          cards.forEach((card) => {
            gsap.set(card, { opacity: 1, y: 0, scale: 1, clearProps: 'all' });
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Handle expand/collapse with GSAP for smooth animation
  useEffect(() => {
    teamMembers.forEach((member) => {
      const contentEl = expandedContentRefs.current.get(member.id);
      if (!contentEl) return;

      const isExpanded = expandedId === member.id;
      
      if (isExpanded) {
        // Expand: measure actual height and animate to it
        gsap.set(contentEl, { height: 'auto' });
        const height = contentEl.scrollHeight;
        gsap.set(contentEl, { height: 0, opacity: 0 });
        gsap.to(contentEl, {
          height: height,
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
          overflow: 'hidden',
        });
      } else {
        // Collapse: animate to 0
        gsap.to(contentEl, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
          overflow: 'hidden',
        });
      }
    });
  }, [expandedId]);

  const handleCardClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section ref={sectionRef} id="team" className="py-20 md:py-24 lg:py-32 px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <div ref={labelRef} className="mb-12 md:mb-16">
          <span className="text-xs md:text-sm uppercase tracking-widest text-gray-500 font-semibold">
            Team
          </span>
          <div ref={dividerRef} className="mt-3 w-12 h-px bg-amber-400 origin-left"></div>
        </div>

        {/* Team Grid - Ensure proper alignment */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 items-start">
          {teamMembers.map((member) => {
            const isExpanded = expandedId === member.id;
            
            return (
              <div
                key={member.id}
                ref={(el) => {
                  if (el) cardRefs.current.set(member.id, el);
                }}
                className="group relative bg-white rounded-lg border border-gray-200/50 overflow-visible cursor-pointer transition-all duration-300 ease-out hover:shadow-md hover:border-gray-300"
                style={{ 
                  opacity: 1, // Ensure consistent opacity
                  transform: 'translateY(0)', // Ensure consistent position
                }}
              >
                {/* Minimal View - Always Visible */}
                <div 
                  className="p-6 md:p-8"
                  onClick={(e) => handleCardClick(e, member.id)}
                >
                  {/* Photo Placeholder */}
                  <div className="aspect-square w-full max-w-[200px] mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200/50 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-gray-300/30 group-hover:bg-gray-300/20 transition-all duration-300"></div>
                    {/* Placeholder for photo - replace with actual image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-400 text-4xl font-light">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Name & Title */}
                  <div className="text-center space-y-2">
                    <h3 className="text-xl md:text-2xl font-light text-gray-900 tracking-tight">
                      {member.name}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 font-light">
                      {member.title}
                    </p>
                  </div>

                  {/* Expand Indicator */}
                  <div className="mt-6 flex items-center justify-center">
                    <div className={`w-8 h-px bg-amber-400 transition-all duration-300 ${
                      isExpanded ? 'rotate-90' : 'group-hover:w-12'
                    }`}></div>
                  </div>
                </div>

                {/* Expanded Details - Animated with GSAP */}
                <div
                  ref={(el) => {
                    if (el) expandedContentRefs.current.set(member.id, el);
                  }}
                  className="overflow-hidden"
                  style={{ height: 0, opacity: 0 }}
                >
                  <div className="px-6 md:px-8 pb-6 md:pb-8 border-t border-gray-200/50 pt-6 space-y-4">
                    {/* Bio */}
                    {member.bio && (
                      <div>
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed font-light">
                          {member.bio}
                        </p>
                      </div>
                    )}

                    {/* Contact Info */}
                    {(member.email || member.phone || member.linkedin) && (
                      <div className="space-y-2 pt-4 border-t border-gray-200/30">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="block text-sm text-gray-600 hover:text-amber-600 transition-colors duration-200"
                          >
                            {member.email}
                          </a>
                        )}
                        {member.phone && (
                          <a
                            href={`tel:${member.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="block text-sm text-gray-600 hover:text-amber-600 transition-colors duration-200"
                          >
                            {member.phone}
                          </a>
                        )}
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="block text-sm text-gray-600 hover:text-amber-600 transition-colors duration-200"
                          >
                            LinkedIn →
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-amber-400/0 group-hover:bg-amber-400/5 transition-all duration-300 pointer-events-none rounded-lg"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

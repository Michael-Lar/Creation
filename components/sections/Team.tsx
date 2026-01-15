'use client';

import { useEffect, useRef, useState, memo, useCallback } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { TeamMember } from '@/types/models';
import ImageSkeleton from '@/components/ImageSkeleton';
import { useImageLoading } from '@/hooks/useImageLoading';

interface TeamProps {
  onModalStateChange?: (isOpen: boolean) => void;
}

// Constants
const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Yoav Sarraf',
    title: 'Founder & CEO',
    bio: `Yoav Sarraf is the Founder and CEO of Creation Partners, a commercial real estate investment, advisory, and management platform focused on disciplined execution, long-term ownership, and thoughtful value creation across complex asset classes.

Prior to founding Creation Partners, Yoav spent 15 years at Concord Companies, where he served as a Managing Partner and senior leader across both advisory and principal investment activities. During his tenure, he oversaw and mentored numerous commercial real estate professionals and helped guide transactional strategy and platform growth across retail, multifamily, creative office, mixed-use, and development-oriented assets.

Yoav was also instrumental in helping build and scale Concord Capital Partners, the firm's investment arm, overseeing the acquisition of more than 1,200 apartment units, along with investments across additional asset classes. Earlier in his career, he began at Brighton Holdings, where he was first exposed to principal-driven investing, underwriting, and asset-level decision making. Over the course of his career, Yoav has been involved in over $1 billion in completed and advised real estate transactions.

In parallel with his real estate work, Yoav is actively involved as an investor, advisor, and operator in technology, media, and other ancillary industries connected to the built environment. He is a graduate of the University of California, Los Angeles.

Yoav is deeply engaged in philanthropic and community leadership. He currently serves as Chair of the House & Grounds Committee at Sinai Temple, is actively involved with Sinai Akiba Academy, and previously served as Real Estate Chair for the Young Adults division of the Jewish Federation of Greater Los Angeles. Above all, Yoav enjoys nothing more than spending time with his wife and children.`,
    image: '/team/yoav-sarraf.png',
  },
  {
    id: 2,
    name: 'Yaron Samuha',
    title: 'Executive Vice President',
    bio: `Yaron Samuha is an Executive Vice President and Commercial Real Estate Advisor at Creation Partners, with over a decade of experience advising investors, developers, and owner-users throughout Los Angeles County. He has been involved in transactions totaling more than $250 million in sales volume, with a primary focus on redevelopment and value-add opportunities.

Yaron began his real estate career in Israel following his military service, where he developed a strong foundation in real estate fundamentals before relocating to Los Angeles. Since then, he has played a key role in numerous redevelopment projects and works closely with many of the region's most prominent developers, with particular expertise in West Los Angeles and the San Fernando Valley.

Over time, Yaron expanded his role beyond advisory work and became an active investor, aligning his interests directly with those of his clients. Outside of work, he is a devoted husband and father, and brings a disciplined, relationship-driven, and long-term mindset to every transaction.`,
    image: '/team/yaron-samuha.png',
  },
  {
    id: 3,
    name: 'Avi Khoshnood',
    title: 'Vice President',
    bio: `Avi Khoshnood is a Vice President at Creation Partners, where he advises clients on multifamily, development, and value-add real estate opportunities. He brings a practical, execution-oriented perspective informed by experience across advisory, investment, and construction.

Prior to joining Creation Partners, Avi served for several years as an advisor and investment associate at Concord Companies, working closely with clients on acquisitions, underwriting, and transaction execution across a range of asset classes. In parallel, he is the Principal of Blackstone Remodeling, a local construction and design firm, giving him hands-on insight into renovation costs, construction strategy, and value creation on the ground.

Avi is a graduate of the University of California, Los Angeles. He lives in Los Angeles with his wife and children and brings a grounded, detail-oriented approach to every engagement.`,
    image: '/team/avi-khoshnood.png',
  },
  {
    id: 4,
    name: 'Sacha Boroumand',
    title: 'Investment Associate',
    bio: `Sacha Boroumand is an Investment Associate at Creation Partners, advising clients on multifamily and retail investments throughout Los Angeles. He brings a hands-on, value-driven approach, emphasizing personal relationships and tailored strategies to help clients execute complex transactions with confidence and maximize long-term performance.

Prior to joining Creation Partners, Sacha spent two years as an Investment Associate at Matthews Real Estate, where he focused on underwriting, deal execution, and client advisory across income-producing assets.

Sacha earned his degree in Communication from the University of California, Santa Barbara, where he founded the Alpha Epsilon Pi fraternity chapter during the COVID-19 pandemic and competed on the UCSB lacrosse team. These experiences shaped his leadership, adaptability, and team-oriented approach to serving clients.`,
    image: '/team/sacha-boroumand.png',
  },
  {
    id: 5,
    name: 'Tiffany Tehrani',
    title: 'Director of Operations',
    bio: `Tiffany Tehrani serves as Director of Operations at Creation Partners, where she oversees internal operations, organizational systems, and day-to-day execution across the platform. She plays a central role in ensuring operational continuity, process efficiency, and coordination across investment, advisory, and management activities.

Tiffany holds a Bachelor of Arts from the University of California, Los Angeles and a Master's degree from California State University, Northridge.`,
    image: '/team/tiffany-tehrani.png',
  },
  {
    id: 6,
    name: 'Michael Larian',
    title: 'Creative & Technology Director',
    bio: `Michael Larian is the Creative & Technology Director at Creation Partners, where he leads the firm's creative direction, digital presence, and technology-forward initiatives. His work spans brand development, visual storytelling, platform design, and the integration of creative and technical tools that enhance how the firm communicates and operates.

Michael holds a Bachelor of Science from the University of California, Berkeley.`,
    linkedin: 'https://www.linkedin.com/in/michael-larian/',
    image: '/team/michael-larian.png',
  },
];

// Dynamically import TeamMemberModal to reduce initial bundle size
// Preloaded proactively to eliminate click delay
const TeamMemberModal = dynamic(() => import('@/components/TeamMemberModal'), {
  ssr: false, // Modal is interactive and only shown client-side
  loading: () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" aria-hidden="true">
      <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  ),
});

function Team({ onModalStateChange }: TeamProps) {
  // State hooks
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { loadingImages, handleImageLoad } = useImageLoading(
    teamMembers.map((member) => member.id)
  );
  
  // Refs
  const sectionRef = useRef<HTMLElement>(null);
  const preloadedRef = useRef<boolean>(false);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

  // Preload modal component to eliminate click delay
  const preloadModal = useCallback(() => {
    if (preloadedRef.current) return;
    preloadedRef.current = true;
    // Preload the modal module - this downloads and caches it
    import('@/components/TeamMemberModal').catch(() => {
      // Silently handle any import errors
      preloadedRef.current = false; // Allow retry
    });
  }, []);

  // Preload modal when section becomes visible (Intersection Observer)
  useEffect(() => {
    if (!sectionRef.current || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      // Fallback: preload after a delay if IntersectionObserver not available
      const timer = setTimeout(() => {
        preloadModal();
      }, 2000);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            preloadModal();
            // Once we've preloaded, we can disconnect the observer
            if (intersectionObserverRef.current) {
              intersectionObserverRef.current.disconnect();
              intersectionObserverRef.current = null;
            }
          }
        });
      },
      {
        // Start preloading when section is 200px away from viewport
        rootMargin: '200px',
        threshold: 0,
      }
    );

    intersectionObserverRef.current = observer;
    observer.observe(sectionRef.current);

    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    };
  }, [preloadModal]);

  // Fallback: Preload modal after page load (delayed to not interfere with initial load)
  useEffect(() => {
    // Preload after 1.5 seconds to ensure initial page load isn't impacted
    const timer = setTimeout(() => {
      preloadModal();
    }, 1500);
    return () => clearTimeout(timer);
  }, [preloadModal]);

  // Effects
  useEffect(() => {
    if (onModalStateChange) {
      onModalStateChange(selectedMember !== null);
    }
  }, [selectedMember, onModalStateChange]);

  // Event handlers
  const handleMemberClick = (member: TeamMember) => {
    const index = teamMembers.findIndex(m => m.id === member.id);
    setCurrentIndex(index);
    setSelectedMember(member);
  };

  const handleNavigate = (index: number) => {
    // Safety check to ensure index is valid
    if (index >= 0 && index < teamMembers.length) {
      setCurrentIndex(index);
      setSelectedMember(teamMembers[index]);
    }
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
        <div className="section-label mb-6 md:mb-8 lg:mb-10">
          <div className="section-label-line" />
          <span className="section-label-text">Team</span>
        </div>

        {/* Team Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {teamMembers.map((member) => (
            <article
              key={member.id}
              className="group relative bg-white/80 backdrop-blur-sm border border-ink-100/40 rounded-sm overflow-hidden transition-all transition-standard hover:bg-white hover:border-accent/40 hover:shadow-premium-lg hover:-translate-y-1 cursor-pointer active:translate-y-0 active:shadow-premium"
              onClick={() => handleMemberClick(member)}
              onMouseEnter={preloadModal}
              role="button"
              tabIndex={0}
              aria-label={`View ${member.name}'s profile`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleMemberClick(member);
                }
              }}
            >
              {/* Hover indicator - subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-accent/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity transition-standard pointer-events-none z-[1]" aria-hidden="true" />
              
              {/* "View Profile" indicator - positioned above content */}
              <div className="absolute bottom-20 left-4 right-4 sm:bottom-24 sm:left-5 sm:right-5 md:bottom-28 md:left-6 md:right-6 opacity-0 group-hover:opacity-100 transition-opacity transition-standard pointer-events-none z-[2]">
                <div className="bg-accent/95 backdrop-blur-sm text-white px-3 py-1.5 rounded-sm border border-white/20 shadow-soft inline-flex items-center gap-2">
                  <span className="text-caption uppercase tracking-wider font-medium">View Profile</span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
              {/* Photo Container - Clean B&W Cutout */}
              <div className="aspect-[4/5] relative flex items-center justify-center bg-gradient-to-b from-gray-50 to-white overflow-hidden group-hover:from-white group-hover:to-gray-50 transition-all transition-standard z-0">
                {(() => {
                  const isLoading = loadingImages.has(member.id);
                  
                  return member.image ? (
                    <>
                      {/* Loading Skeleton */}
                      {isLoading && (
                        <ImageSkeleton 
                          className="absolute inset-0 z-[1]"
                          aspectRatio="aspect-[4/5]"
                          showShimmer={true}
                        />
                      )}
                      
                      <Image
                        src={member.image}
                        alt={`${member.name} - ${member.title}`}
                        fill
                        className={`object-contain object-center transition-transform transition-standard group-hover:scale-105 ${
                          isLoading ? 'opacity-0' : 'opacity-100'
                        } ${member.name === 'Yaron Samuha' ? 'translate-y-3 scale-110' : ''}`}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        style={{
                          filter: 'grayscale(100%) contrast(1.15)',
                          WebkitFilter: 'grayscale(100%) contrast(1.15)',
                        }}
                        onLoad={() => handleImageLoad(member.id)}
                        onError={() => handleImageLoad(member.id)}
                      />
                    </>
                  ) : (
                    // Fallback placeholder
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-ink-300 text-6xl font-playfair">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 md:p-6 lg:p-7 relative z-0">
                <div>
                  <h3 className="text-[clamp(1.125rem,3vw,1.5rem)] sm:text-lg md:text-xl font-playfair text-ink-800 mb-1 leading-tight group-hover:text-accent transition-colors transition-standard">
                    {member.name}
                  </h3>
                  <p className="text-[clamp(0.75rem,2vw,0.875rem)] sm:text-xs uppercase tracking-wider text-ink-400 font-light group-hover:text-ink-500 transition-colors transition-standard">
                    {member.title}
                  </p>
                </div>
                
                {/* Arrow indicator */}
                <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 opacity-0 group-hover:opacity-100 transition-opacity transition-standard">
                  <svg 
                    className="w-5 h-5 text-accent transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform transition-standard" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Team Member Modal - Only render when a member is selected */}
      {selectedMember && (
        <TeamMemberModal
          member={selectedMember}
          allMembers={teamMembers}
          currentIndex={currentIndex}
          isOpen={selectedMember !== null}
          onClose={() => setSelectedMember(null)}
          onNavigate={handleNavigate}
        />
      )}
    </section>
  );
}

export default memo(Team);

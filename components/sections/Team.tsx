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
    bio: `Yoav Sarraf is the Founder and CEO of Creation Partners, a commercial real estate investment, advisory, and management platform focused on creative dealmaking, entrepreneurial execution, and long-term ownership.

Prior to founding Creation Partners, Yoav spent over 15 years at Concord Companies, where he served as a Managing Partner and senior leader across both advisory and principal investment activities. During his tenure, he mentored numerous professionals and helped guide transactional strategy and platform growth across retail, multifamily, creative office, mixed-use, and development-oriented assets.

Yoav was also instrumental in helping build and scale Concord Capital Partners, the firm's investment arm, overseeing the acquisition of more than 1,200 apartment units along with investments across additional asset classes. Earlier in his career, he began at Brighton Holdings, where he was first exposed to principal-driven investing, underwriting, and asset-level decision making. Over the course of his career, Yoav has been involved in over $1 billion in completed and advised real estate transactions.

In parallel with his real estate work, Yoav is actively involved as an investor, advisor, and operator in technology, media, and other ventures connected to the built environment. He is a graduate of the University of California, Los Angeles.

Yoav is deeply engaged in philanthropic and community leadership. He currently serves as Chair of the House & Grounds Committee at Sinai Temple, is actively involved with Sinai Akiba Academy, and previously served as Real Estate Chair for the Young Adults division of the Jewish Federation of Greater Los Angeles. He lives in Los Angeles with his wife and children.`,
    linkedin: 'https://www.linkedin.com/in/yoavsarraf/',
    image: '/team/yoav-sarraf.webp',
    imagePosition: 'center 20%',
    imageScale: 'scale-[1.15]',
  },
  {
    id: 2,
    name: 'Yaron Samuha',
    title: 'Partner',
    bio: `Yaron Samuha is a Partner at Creation, where he brings more than a decade of experience advising investors, developers, and owner-users across Los Angeles on strategic acquisitions, redevelopment opportunities, and complex commercial real estate transactions.

Yaron has been involved in transactions totaling more than $250 million in sales volume, with a primary focus on redevelopment and value-add opportunities.

He began his real estate career in Israel following his military service, where he developed an early foundation in real estate fundamentals before relocating to Los Angeles. Since then, he has worked closely with many of the region's most active developers, with particular expertise in West Los Angeles and the San Fernando Valley.

Over time, Yaron expanded his role beyond advisory work and became an active investor, aligning his interests directly with those of his clients and bringing a disciplined, relationship-driven, and long-term mindset to every transaction.

Outside of work, Yaron is a devoted husband and father.`,
    image: '/team/yaron-samuha.webp',
    imagePosition: 'center 8%',
    imageScale: 'scale-[1.0]',
  },
  {
    id: 7,
    name: 'Adam Gleicher',
    title: 'Partner',
    bio: `Adam Gleicher is a Partner at Creation, where he brings more than two decades of experience across commercial real estate advisory, development, investment, and entrepreneurial ventures.

He began his career working alongside his grandfather, where he developed an early foundation in commercial real estate and an appreciation for the importance of long-term relationships, trust, and market intuition.

He later served as Director of Development at GBB Development in Boulder, Colorado, where he helped lead acquisitions, development, and management initiatives across a $75 million portfolio throughout the Western United States.

Beyond his real estate experience, Adam is a seasoned entrepreneur, with ventures and investments spanning retail, hospitality, food and beverage, and technology. He is also active in the ownership and management of family investments across industrial, flex, automotive, and retail assets. These experiences have shaped a broader perspective on consumer experience, brand positioning, and the intersection of real estate, retail, and storytelling, allowing him to connect landlords and tenants in thoughtful and compelling ways.

In 2013, Adam founded Gleicher Realty, a boutique advisory firm built on strategic execution and highly personalized client service. Through that platform, he led transactions representing more than $300 million in aggregate deal value and developed a reputation for thoughtful dealmaking and a relationship-driven approach to creating value. Adam is also the founder of Hello My Beautiful World, a publishing platform rooted in creativity, storytelling, and meaningful connection. He proudly supports organizations including the SLK Foundation and Yad Ezra V'Shulamit, and outside of work, is a loving and devoted husband and father.`,
    image: '/team/adam-gleicher.webp',
    imagePosition: 'center 20%',
    imageScale: 'scale-[1.05]',
  },
  {
    id: 3,
    name: 'Avi Khoshnood',
    title: 'Vice President',
    bio: `Avi Khoshnood is a Vice President at Creation Partners, where he advises clients on multifamily, development, and value-add real estate opportunities. He brings a practical, execution-oriented perspective informed by experience across advisory, investment, and construction.

Prior to joining Creation Partners, Avi served for several years as an advisor and investment associate at Concord Companies, working closely with clients on acquisitions, underwriting, and transaction execution across a range of asset classes. In parallel, he is the Principal of Blackstone Remodeling, a local construction and design firm, giving him hands-on insight into renovation costs, construction strategy, and value creation on the ground.

Avi is a graduate of the University of California, Los Angeles. He lives in Los Angeles with his wife and children and brings a grounded, detail-oriented approach to every engagement.`,
    image: '/team/avi-khoshnood.webp',
    imagePosition: 'center 12%',
    imageScale: 'scale-[1.02]',
  },
  {
    id: 5,
    name: 'Tiffany Tehrani',
    title: 'Director of Operations',
    bio: `Tiffany Tehrani serves as Director of Operations at Creation Partners, where she oversees internal operations, organizational systems, and day-to-day execution across the platform. She plays a central role in ensuring operational continuity, process efficiency, and coordination across investment, advisory, and management activities.

Prior to joining Creation Partners, Tiffany served as President of a prominent and established construction company, where she oversaw operations and project execution across a range of residential and commercial developments. Her experience leading complex projects and managing multidisciplinary teams brings valuable operational insight to the firm's activities.

Tiffany holds a Bachelor of Arts from the University of California, Los Angeles and a Master's degree from California State University, Northridge.`,
    image: '/team/tiffany-tehrani.webp',
    imagePosition: 'center 32%',
    imageScale: 'scale-[1.06]',
  },
  {
    id: 6,
    name: 'Michael Larian',
    title: 'Creative & Technology Director',
    bio: `Michael Larian is the Creative & Technology Director at Creation Partners, where he leads the firm's creative direction, digital presence, and technology-forward initiatives. His work spans brand development, visual storytelling, platform design, and the integration of creative and technical tools that enhance how the firm communicates and operates.

Michael holds a Bachelor of Science from the University of California, Berkeley.`,
    linkedin: 'https://www.linkedin.com/in/michael-larian/',
    image: '/team/michael-larian.webp',
    imagePosition: 'center 18%',
    imageScale: 'scale-[1.04]',
  },
  {
    id: 4,
    name: 'Sacha Boroumand',
    title: 'Investment Associate',
    bio: `Sacha Boroumand is an Investment Associate at Creation Partners, advising clients on multifamily and retail investments throughout Los Angeles. He brings a hands-on, value-driven approach, emphasizing personal relationships and tailored strategies to help clients execute complex transactions with confidence and maximize long-term performance.

Prior to joining Creation Partners, Sacha spent two years as an Investment Associate at Matthews Real Estate, where he focused on underwriting, deal execution, and client advisory across income-producing assets.

Sacha earned his degree in Communication from the University of California, Santa Barbara, where he founded the Alpha Epsilon Pi fraternity chapter during the COVID-19 pandemic and competed on the UCSB lacrosse team. These experiences shaped his leadership, adaptability, and team-oriented approach to serving clients.`,
    image: '/team/sacha-boroumand.webp',
    imagePosition: 'center bottom',
    imageScale: 'scale-[1.12]',
  },
  {
    id: 8,
    name: 'Jake Ross',
    title: 'Investment Analyst',
    bio: `Jake Ross is an Investment Analyst at Creation Partners, where he supports financial analysis, market research, and investment evaluation across commercial real estate opportunities. His work includes underwriting, site analysis, and assisting with advisory and transaction processes throughout the Los Angeles market.

Jake recently graduated from the University of California, Davis, where he earned a Bachelor of Science in Managerial Economics with a minor in Accounting. He is currently pursuing graduate studies in real estate development.`,
    image: '/team/jake-ross.webp',
    imagePosition: 'center 15%',
    imageScale: 'scale-[1.08]',
  },
  {
    id: 9,
    name: 'Jaden Bahmanyar',
    title: 'Investment Analyst',
    bio: `Jaden Bahmanyar is an Investment Analyst at Creation Partners, where he supports financial analysis, market research, and investment evaluation across commercial real estate opportunities. His work includes underwriting, site analysis, and assisting with advisory and transaction processes throughout the Los Angeles market.

Jaden recently graduated from the University of California, Los Angeles, where he earned a degree in History. He will be pursuing a Master's degree in Real Estate Development at UCLA.`,
    image: '/team/jaden-bahmanyar.webp',
    imagePosition: 'center 20%',
    imageScale: 'scale-[1.05]',
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
            <div
              key={member.id}
              className="group relative bg-white/80 backdrop-blur-sm border border-ink-100/40 rounded-card overflow-hidden transition-all transition-standard hover:bg-white hover:border-accent/40 hover:shadow-premium-lg hover:-translate-y-1 cursor-pointer active:translate-y-0 active:shadow-premium"
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
              
              {/* Photo Container - Clean B&W Cutout */}
              <div className="aspect-[4/5] relative flex items-center justify-center bg-gradient-to-b from-gray-50 to-white overflow-hidden group-hover:from-white group-hover:to-gray-50 transition-all transition-standard z-0">
                {/* "View Profile" overlay — matches project card "View Project" pattern */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/35 via-ink-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity transition-standard flex items-end justify-center pb-4 z-10 pointer-events-none">
                  <span className="text-white text-[0.6rem] tracking-[0.15em] uppercase font-medium">View Profile</span>
                </div>
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
                        alt={member.name === 'Yoav Sarraf' 
                          ? `Yoav Sarraf, Founder & CEO of Creation Partners - Commercial Real Estate Investment & Management`
                          : `${member.name} - ${member.title} at Creation Partners`}
                        fill
                        className={`object-cover transition-transform transition-standard group-hover:scale-105 ${
                          isLoading ? 'opacity-0' : 'opacity-100'
                        } ${member.imageScale ?? 'scale-100'}`}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        style={{
                          objectPosition: member.imagePosition ?? 'center 20%',
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
            </div>
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

'use client';

import { useEffect, useState } from 'react';

interface ImageSkeletonProps {
  className?: string;
  aspectRatio?: string;
  showShimmer?: boolean;
}

/**
 * Reusable skeleton loader for images
 * Provides a smooth loading animation while images are loading
 */
export default function ImageSkeleton({ 
  className = '', 
  aspectRatio = 'aspect-[4/3]',
  showShimmer = true 
}: ImageSkeletonProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div 
      className={`${aspectRatio} ${className} relative overflow-hidden bg-gradient-to-br from-ink-50 to-ink-100 rounded-card`}
      role="status"
      aria-label="Loading image"
    >
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-ink-50 via-ink-100 to-ink-50" />
      
      {/* Shimmer effect */}
      {showShimmer && mounted && (
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s ease-in-out infinite',
          }}
        />
      )}
      
      {/* Subtle pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '20px 20px',
        }}
        aria-hidden="true"
      />
    </div>
  );
}

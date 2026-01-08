'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4" style={{ backgroundColor: 'var(--color-cream)' }}>
      <div className="text-center max-w-2xl">
        {/* Decorative line */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-px bg-accent" style={{ backgroundColor: 'var(--color-accent)' }} />
        </div>
        
        {/* 404 Number */}
        <h1 className="text-8xl md:text-9xl font-serif text-ink-800 mb-6 tracking-tight" style={{ color: 'var(--color-ink)' }}>
          404
        </h1>
        
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-serif text-ink-700 mb-4 tracking-tight" style={{ color: 'var(--color-charcoal-light)' }}>
          Page Not Found
        </h2>
        
        {/* Description */}
        <p className="text-body text-ink-600 mb-10 leading-relaxed max-w-md mx-auto" style={{ color: 'var(--color-gray-600)' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>
        
        {/* Button */}
        <Link 
          href="/"
          className="group inline-flex items-center gap-3 px-8 py-4 bg-ink-800 text-white rounded-sm hover:bg-ink-700 transition-all-standard focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          style={{ 
            backgroundColor: 'var(--color-ink)',
          }}
        >
          <svg 
            className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm tracking-wide uppercase font-medium">Return Home</span>
        </Link>
        
        {/* Decorative line */}
        <div className="flex items-center justify-center mt-12">
          <div className="w-12 h-px bg-accent" style={{ backgroundColor: 'var(--color-accent)' }} />
        </div>
      </div>
    </div>
  );
}

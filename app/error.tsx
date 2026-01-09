'use client';

import { useEffect } from 'react';
import { ErrorHandler, ErrorCategory } from '@/utils/errorHandler';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    ErrorHandler.handleError(error, ErrorCategory.UNKNOWN, {
      component: 'ErrorBoundary',
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4" style={{ backgroundColor: 'var(--color-cream)' }}>
      <div className="text-center max-w-2xl">
        {/* Decorative line */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-px bg-accent" style={{ backgroundColor: 'var(--color-accent)' }} />
        </div>
        
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-ink-100 flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-ink-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" 
              />
            </svg>
          </div>
        </div>
        
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-serif text-ink-800 mb-4 tracking-tight" style={{ color: 'var(--color-ink)' }}>
          Something went wrong
        </h2>
        
        {/* Description */}
        <p className="text-body text-ink-600 mb-10 leading-relaxed max-w-md mx-auto" style={{ color: 'var(--color-gray-600)' }}>
          We apologize for the inconvenience. This issue has been logged and we&apos;ll look into it.
        </p>
        
        {/* Error details in development */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-sm text-left max-w-lg mx-auto">
            <p className="text-xs font-mono text-red-800 break-words">
              {error.message}
            </p>
          </div>
        )}
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-8 py-4 bg-ink-800 text-white rounded-sm hover:bg-ink-700 transition-all-standard focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            style={{ backgroundColor: 'var(--color-ink)' }}
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <span className="text-sm tracking-wide uppercase font-medium">Try Again</span>
          </button>
          
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 border border-ink-300 text-ink-700 rounded-sm hover:bg-ink-50 transition-all-standard focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            <span className="text-sm tracking-wide uppercase font-medium">Go Home</span>
          </a>
        </div>
        
        {/* Decorative line */}
        <div className="flex items-center justify-center mt-12">
          <div className="w-12 h-px bg-accent" style={{ backgroundColor: 'var(--color-accent)' }} />
        </div>
      </div>
    </div>
  );
}

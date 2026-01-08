'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log critical error
    console.error('Global error occurred:', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ 
        margin: 0,
        padding: 0,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#F9F7F3',
        color: '#1A1918',
      }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '600px',
          }}>
            {/* Decorative line */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '2rem',
            }}>
              <div style={{
                width: '48px',
                height: '1px',
                backgroundColor: '#B8A068',
              }} />
            </div>
            
            {/* Icon */}
            <div style={{
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'center',
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#E0DFDC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg 
                  style={{ width: '40px', height: '40px' }}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="#6F6E6B"
                  strokeWidth="1.5"
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
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 2.5rem)',
              fontWeight: 400,
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
            }}>
              Application Error
            </h1>
            
            {/* Description */}
            <p style={{
              fontSize: '1rem',
              lineHeight: '1.7',
              marginBottom: '2.5rem',
              color: '#6F6E6B',
            }}>
              A critical error occurred. Please refresh the page or contact support if the problem persists.
            </p>
            
            {/* Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              alignItems: 'center',
            }}>
              <button
                onClick={reset}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 2rem',
                  backgroundColor: '#1A1918',
                  color: 'white',
                  border: 'none',
                  borderRadius: '2px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2D2C2A'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1A1918'}
              >
                Try Again
              </button>
              
              <a
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '1rem 2rem',
                  border: '1px solid #9D9C99',
                  color: '#1A1918',
                  backgroundColor: 'transparent',
                  borderRadius: '2px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F7F6F4'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Go to Homepage
              </a>
            </div>
            
            {/* Decorative line */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '3rem',
            }}>
              <div style={{
                width: '48px',
                height: '1px',
                backgroundColor: '#B8A068',
              }} />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

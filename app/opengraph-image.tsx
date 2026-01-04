import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Creation Partners - Commercial Real Estate Investment & Management';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: '#1A1918',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        {/* Decorative border */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            bottom: '20px',
            border: '1px solid rgba(184, 160, 104, 0.3)',
            display: 'flex',
          }}
        />
        
        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
          }}
        >
          {/* Logo text */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 400,
              color: '#F9F7F3',
              letterSpacing: '-0.02em',
              fontFamily: 'Georgia, serif',
            }}
          >
            Creation Partners
          </div>
          
          {/* Divider */}
          <div
            style={{
              width: '80px',
              height: '2px',
              background: '#B8A068',
              display: 'flex',
            }}
          />
          
          {/* Tagline */}
          <div
            style={{
              fontSize: '24px',
              fontWeight: 300,
              color: 'rgba(249, 247, 243, 0.7)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
          >
            Commercial Real Estate Investment & Management
          </div>
          
          {/* Location */}
          <div
            style={{
              fontSize: '18px',
              fontWeight: 300,
              color: 'rgba(249, 247, 243, 0.5)',
              letterSpacing: '0.05em',
            }}
          >
            Los Angeles, California
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}


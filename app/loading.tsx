export default function Loading() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center" style={{ backgroundColor: 'var(--color-cream)' }}>
      <div className="flex flex-col items-center gap-6">
        {/* Decorative top line */}
        <div className="w-12 h-px bg-accent animate-pulse" style={{ backgroundColor: 'var(--color-accent)' }} />
        
        {/* Spinner with bronze accent */}
        <div className="relative">
          <div 
            className="w-16 h-16 border-2 rounded-full animate-spin"
            style={{
              borderColor: 'var(--color-gray-200)',
              borderTopColor: 'var(--color-accent)',
            }}
          />
          {/* Inner circle for visual depth */}
          <div 
            className="absolute inset-2 border rounded-full"
            style={{
              borderColor: 'var(--color-gray-100)',
            }}
          />
        </div>
        
        {/* Loading text */}
        <p 
          className="text-caption text-ink-400 tracking-widest uppercase font-medium animate-pulse"
          style={{ color: 'var(--color-gray-500)' }}
        >
          Loading
        </p>
        
        {/* Decorative bottom line */}
        <div className="w-12 h-px bg-accent animate-pulse" style={{ backgroundColor: 'var(--color-accent)' }} />
      </div>
    </div>
  );
}

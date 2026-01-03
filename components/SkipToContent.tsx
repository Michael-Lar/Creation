'use client';

export default function SkipToContent() {
  return (
    <a
      href="#primary"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-bronze focus:text-charcoal focus:font-light focus:uppercase focus:tracking-wider focus:rounded-sm focus:outline-none focus:ring-2 focus:ring-bronze focus:ring-offset-2"
    >
      Skip to content
    </a>
  );
}


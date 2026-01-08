'use client';

export default function SkipToContent() {
  return (
    <a
      href="#primary"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 sm:focus:top-4 focus:left-1/2 focus:-translate-x-1/2 focus:transform focus:z-[100] focus:px-3 sm:focus:px-4 focus:py-2 focus:bg-bronze/90 focus:text-ink-900 focus:font-medium focus:uppercase focus:tracking-wide focus:rounded-full focus:shadow-md focus:outline-none focus:ring-2 focus:ring-bronze focus:ring-offset-2 focus:ring-offset-white focus:transition-all focus:duration-200"
    >
      Skip to content
    </a>
  );
}


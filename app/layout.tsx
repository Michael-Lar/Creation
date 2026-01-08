import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://creation-partners.com'),
  title: "Creation Partners | Commercial Real Estate Investment & Management",
  description: "Creation Partners is a Los Angeles-based, vertically integrated real estate investment and operating platform. We work across acquisitions, advisory, capital formation, and asset management.",
  keywords: ["real estate", "commercial real estate", "investment", "Los Angeles", "property management", "advisory"],
  authors: [{ name: "Creation Partners" }],
  creator: "Creation Partners",
  publisher: "Creation Partners",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Creation Partners | Commercial Real Estate Investment & Management",
    description: "Creation Partners is a Los Angeles-based, vertically integrated real estate investment and operating platform.",
    url: "https://creation-partners.com",
    siteName: "Creation Partners",
    type: "website",
    locale: "en_US",
    // Images are automatically generated via app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: "Creation Partners | Commercial Real Estate Investment & Management",
    description: "Creation Partners is a Los Angeles-based, vertically integrated real estate investment and operating platform.",
    // Images are automatically generated via app/twitter-image.tsx
  },
  alternates: {
    canonical: "https://creation-partners.com",
  },
  other: {
    'theme-color': '#FAF8F3',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover', // For iOS safe area
  themeColor: '#FAF8F3',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Creation Partners",
    "description": "A Los Angeles-based, vertically integrated real estate investment and operating platform.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "10700 Santa Monica Blvd, Suite 205",
      "addressLocality": "Los Angeles",
      "addressRegion": "CA",
      "postalCode": "90025",
      "addressCountry": "US"
    },
    "url": "https://creation-partners.com",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-310-749-9628",
      "contactType": "Sales",
      "email": "ys@creation-partners.com"
    },
    "sameAs": [
      "https://www.linkedin.com/company/creation-partners",
      "https://www.instagram.com/creationpartners"
    ]
  };

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Creation Partners",
    "url": "https://creation-partners.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://creation-partners.com/?s={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://creation-partners.com"
      }
    ]
  };

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Favicons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <Script
          id="organization-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Script
          id="website-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
        <Script
          id="breadcrumb-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}


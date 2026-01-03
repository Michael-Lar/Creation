import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Creation Partners | Commercial Real Estate Investment & Management",
  description: "Creation Partners is a Los Angeles-based, vertically integrated real estate investment and operating platform. We work across acquisitions, advisory, capital formation, and asset management.",
  keywords: ["real estate", "commercial real estate", "investment", "Los Angeles", "property management", "advisory"],
  authors: [{ name: "Creation Partners" }],
  openGraph: {
    title: "Creation Partners | Commercial Real Estate Investment & Management",
    description: "Creation Partners is a Los Angeles-based, vertically integrated real estate investment and operating platform.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Creation Partners | Commercial Real Estate Investment & Management",
    description: "Creation Partners is a Los Angeles-based, vertically integrated real estate investment and operating platform.",
  },
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
    "url": "https://creation-partners.com"
  };

  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}


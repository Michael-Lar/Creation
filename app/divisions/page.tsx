import type { Metadata } from 'next';
import DivisionsDetail from '@/components/DivisionsDetail';

export const metadata: Metadata = {
  title: 'Divisions | Creation Partners',
  description: 'Creation Partners participates in real estate through investment, strategic advisory, and asset management across Los Angeles — through Creation Equities, Creation Realty Corporation, and Creation Asset Management.',
  openGraph: {
    title: 'Divisions | Creation Partners',
    description: 'Creation Partners participates in real estate through investment, strategic advisory, and asset management across Los Angeles.',
    url: '/divisions',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Divisions | Creation Partners',
    description: 'Creation Partners participates in real estate through investment, strategic advisory, and asset management across Los Angeles.',
  },
  alternates: {
    canonical: '/divisions',
  },
};

export default function DivisionsPage() {
  return <DivisionsDetail />;
}

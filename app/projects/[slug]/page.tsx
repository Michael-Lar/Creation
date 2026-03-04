import type { Metadata } from 'next';
import { projects, getProjectBySlug } from '@/data/projects';
import ProjectDetailClient from '@/components/ProjectDetailClient';

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return { title: 'Project Not Found | Creation Partners' };
  }

  const title = `${project.name} | Creation Partners`;
  const description =
    project.description ||
    `${project.name} — ${project.types.join(' / ')} in ${project.location}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://creation-partners.com/projects/${params.slug}`,
      images: project.images?.[0]
        ? [{ url: `https://creation-partners.com${project.images[0]}`, width: 1200, height: 800 }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://creation-partners.com/projects/${params.slug}`,
    },
  };
}

export default function ProjectDetailPage({ params }: PageProps) {
  return <ProjectDetailClient projectSlug={params.slug} />;
}

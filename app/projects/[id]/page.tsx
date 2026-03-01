import type { Metadata } from 'next';
import { getProjectById } from '@/data/projects';
import ProjectDetailClient from '@/components/ProjectDetailClient';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const id = parseInt(params.id, 10);
  const project = !isNaN(id) && id > 0 ? getProjectById(id) : undefined;

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
      url: `https://creation-partners.com/projects/${params.id}`,
      images: project.images?.[0]
        ? [{ url: `https://creation-partners.com${project.images[0]}`, width: 1200, height: 800 }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function ProjectDetailPage({ params }: PageProps) {
  return <ProjectDetailClient projectId={params.id} />;
}

export interface Project {
  id: number;
  name: string;
  location: string;
  type: string;
  year?: string;
  slug: string;
  description?: string;
  details?: string;
  images?: string[];
  status?: string;
  size?: string;
  role?: string;
}

// Extended project data - replace with actual project details
export const projects: Project[] = [
  {
    id: 1,
    name: 'Project Name',
    location: 'Los Angeles, CA',
    type: 'Commercial',
    year: '2024',
    slug: 'project-name',
    description: 'A premier commercial real estate development in the heart of Los Angeles.',
    details: 'This project represents a significant investment in the commercial real estate market, featuring modern design and sustainable practices.',
    images: [],
    status: 'In Development',
    size: '50,000 sq ft',
    role: 'Development & Management',
  },
  {
    id: 2,
    name: 'Project Name',
    location: 'Beverly Hills, CA',
    type: 'Mixed Use',
    year: '2024',
    slug: 'beverly-hills-project',
    description: 'A mixed-use development combining residential and commercial spaces.',
    details: 'Strategic location with premium amenities and thoughtful design.',
    images: [],
    status: 'Completed',
    size: '75,000 sq ft',
    role: 'Acquisition & Development',
  },
  {
    id: 3,
    name: 'Project Name',
    location: 'Santa Monica, CA',
    type: 'Residential',
    year: '2023',
    slug: 'santa-monica-residential',
    description: 'Luxury residential development with ocean views.',
    details: 'High-end residential project featuring premium finishes and exceptional location.',
    images: [],
    status: 'Completed',
    size: '30,000 sq ft',
    role: 'Development',
  },
  {
    id: 4,
    name: 'Project Name',
    location: 'West Hollywood, CA',
    type: 'Commercial',
    year: '2023',
    slug: 'west-hollywood-commercial',
    description: 'Modern commercial space in vibrant West Hollywood.',
    details: 'Contemporary commercial development designed for modern businesses.',
    images: [],
    status: 'Completed',
    size: '40,000 sq ft',
    role: 'Acquisition & Management',
  },
  {
    id: 5,
    name: 'Project Name',
    location: 'Culver City, CA',
    type: 'Mixed Use',
    year: '2024',
    slug: 'culver-city-mixed-use',
    description: 'Mixed-use development in emerging Culver City market.',
    details: 'Forward-thinking development combining retail, office, and residential.',
    images: [],
    status: 'In Development',
    size: '60,000 sq ft',
    role: 'Development & Advisory',
  },
  {
    id: 6,
    name: 'Project Name',
    location: 'Venice, CA',
    type: 'Residential',
    year: '2024',
    slug: 'venice-residential',
    description: 'Boutique residential project in Venice Beach.',
    details: 'Intimate residential development capturing the essence of Venice.',
    images: [],
    status: 'In Planning',
    size: '25,000 sq ft',
    role: 'Development',
  },
];

export function getProjectById(id: number): Project | undefined {
  // Validate input
  if (!id || typeof id !== 'number' || isNaN(id) || id <= 0) {
    return undefined;
  }
  
  const project = projects.find(project => project && project.id === id);
  
  // Validate project data integrity
  if (project && (!project.name || !project.location || !project.type)) {
    console.warn(`Project ${id} has missing required fields`);
    return undefined;
  }
  
  return project;
}

export function getProjectBySlug(slug: string): Project | undefined {
  // Validate input
  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    return undefined;
  }
  
  const project = projects.find(project => project && project.slug === slug);
  
  // Validate project data integrity
  if (project && (!project.name || !project.location || !project.type)) {
    console.warn(`Project with slug "${slug}" has missing required fields`);
    return undefined;
  }
  
  return project;
}


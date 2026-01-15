import { ErrorHandler } from '@/utils/errorHandler';

export interface Project {
  id: number;
  name: string;
  location: string;
  types: string[];
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
    id: 3,
    name: '152-154 N La Brea Blvd',
    location: 'Los Angeles, CA',
    types: ['Retail', 'Office'],
    year: '2026',
    slug: '152-n-la-brea-blvd',
    description: 'Retail and office space in the heart of Los Angeles.',
    details: 'A prime retail and office development located on La Brea Boulevard, combining commercial and professional spaces.',
    images: ['/projects/152 N La Brea Blvd, Los Angeles (Retail_Office).png'],
    status: 'Completed',
    size: 'TBD',
    role: 'Acquisition & Development',
  },
  {
    id: 5,
    name: '1601-1611 S Robertson Blvd',
    location: 'Los Angeles, CA',
    types: ['Retail', 'Education'],
    year: '2025',
    slug: '1601-1611-s-robertson-blvd',
    description: 'Education facility development in Los Angeles.',
    details: 'A purpose-built education facility designed to serve the local community with modern learning spaces.',
    images: ['/projects/1601-1611 S Robertson Blvd, Los Angeles (Education).png'],
    status: 'Completed',
    size: 'TBD',
    role: 'Development',
  },
  {
    id: 6,
    name: '421 N Beverly Drive',
    location: 'Beverly Hills, CA',
    types: ['Office'],
    year: '2025',
    slug: '421-n-beverly-drive',
    description: 'Premium office space in Beverly Hills.',
    details: 'A sophisticated office development in the heart of Beverly Hills, offering premium workspace solutions.',
    images: ['/projects/421 N Beverly Drive, Beverly Hills (Office).png'],
    status: 'Completed',
    size: 'TBD',
    role: 'Acquisition & Management',
  },
  {
    id: 8,
    name: '4651-4611 W Pico Blvd',
    location: 'Los Angeles, CA',
    types: ['Retail', 'Education'],
    year: '2025',
    slug: '4651-4661-w-pico-blvd',
    description: 'Education facility on Pico Boulevard.',
    details: 'A community-focused education facility development designed to enhance learning opportunities in the area.',
    images: ['/projects/4651-4661 W Pico Blvd, Los Angeles 90019 (Education).png'],
    status: 'Completed',
    size: 'TBD',
    role: 'Development',
  },
  {
    id: 1,
    name: '10773-10775 Ashton Ave',
    location: 'Los Angeles, CA',
    types: ['Multifamily', 'Development'],
    year: '2025',
    slug: '10773-10775-ashton-ave',
    description: 'Multifamily development project in Los Angeles.',
    details: 'A strategic multifamily development project designed to meet the growing demand for quality residential spaces in Los Angeles.',
    images: ['/projects/10773-10775 Ashton Ave (Multifamily_Development).png'],
    status: 'In Development',
    size: 'TBD',
    role: 'Development & Management',
  },
  {
    id: 11,
    name: '7801-7807 Beverly Blvd',
    location: 'Los Angeles, CA',
    types: ['Retail'],
    year: '2025',
    slug: '7801-7807-beverly-blvd',
    description: 'Retail development on Beverly Boulevard.',
    details: 'A strategic retail development project on Beverly Boulevard, designed for modern retail experiences in a prime location.',
    images: ['/projects/7801-7807 Beverly Blvd, Los Angeles (Retail).png'],
    status: 'Completed',
    size: 'TBD',
    role: 'Development & Management',
  },
  {
    id: 9,
    name: '6801 N Figueroa St',
    location: 'Highland Park, CA',
    types: ['Retail', 'Education'],
    year: '2025',
    slug: '6801-n-figueroa-st',
    description: 'Education facility in Highland Park.',
    details: 'An educational facility development in Highland Park, designed to serve the local community with quality learning environments.',
    images: ['/projects/6801 N Figueroa St, Highland Park (Education).png'],
    status: 'Completed',
    size: 'TBD',
    role: 'Development',
  },
  {
    id: 12,
    name: '7910-7928 W Third St',
    location: 'Los Angeles, CA',
    types: ['Retail', 'Hospitality'],
    year: '2024',
    slug: '7910-7928-w-3rd-st',
    description: 'Retail and hospitality project on West 3rd Street.',
    details: 'A retail and hospitality project on West 3rd Street, designed for high-visibility, tenant-ready storefronts in a prime corridor.',
    images: ['/projects/7910-7928 W 3rd St, Los Angeles (Retail_Hospitality) FInal.png'],
    status: 'Completed',
    size: 'TBD',
    role: 'Development & Management',
  },
  {
    id: 2,
    name: '11047-11103 Hartsook St',
    location: 'North Hollywood, CA',
    types: ['Multifamily', 'Development'],
    year: '2024',
    slug: '11047-11103-hartsook-st',
    description: 'Multifamily development in North Hollywood.',
    details: 'A comprehensive multifamily development project in the vibrant North Hollywood neighborhood.',
    images: ['/projects/11047-11103 Hartsook St, North Hollywood (Multifamily_Development).png'],
    status: 'In Development',
    size: 'TBD',
    role: 'Development & Management',
  },
  {
    id: 10,
    name: '7174 Melrose Ave',
    location: 'Los Angeles, CA',
    types: ['Hospitality'],
    year: '2024',
    slug: '7174-melrose-ave',
    description: 'Hospitality development on Melrose Avenue.',
    details: 'A distinctive hospitality project on Melrose Avenue, featuring unique design and premium amenities.',
    images: [
      '/projects/7174 Melrose Ave, Los Angeles (Hospitality).png',
      '/projects/7174 Melrose Ave - Interior (Watercolor).png'
    ],
    status: 'Completed',
    size: 'TBD',
    role: 'Development & Management',
  },
  {
    id: 4,
    name: '153-155 S Robertson Blvd',
    location: 'Los Angeles, CA',
    types: ['Retail', 'Hospitality'],
    year: '2024',
    slug: '153-155-s-robertson-blvd',
    description: 'Retail and hospitality development in Beverly Hills.',
    details: 'A premium retail and hospitality project in the prestigious Beverly Hills area, designed for luxury experiences.',
    images: ['/projects/153-155 S Robertson Blvd, Beverly Hills (Retail_Hospitality).png'],
    status: 'Completed',
    size: 'TBD',
    role: 'Development & Management',
  },
  {
    id: 7,
    name: '431 North Fairfax Ave',
    location: 'Los Angeles, CA',
    types: ['Retail'],
    year: '2024',
    slug: '431-n-fairfax-ave',
    description: 'Retail development on Fairfax Avenue.',
    details: 'A strategic retail development project in the vibrant Fairfax district, designed for modern retail experiences.',
    images: ['/projects/431 N Fairfax Ave, Los Angeles (Retail).png'],
    status: 'Completed',
    size: 'TBD',
    role: 'Development & Management',
  },
];

export function getProjectById(id: number): Project | undefined {
  // Validate input
  if (!id || typeof id !== 'number' || isNaN(id) || id <= 0) {
    return undefined;
  }
  
  const project = projects.find(project => project && project.id === id);
  
  // Validate project data integrity
  if (project && (!project.name || !project.location || !project.types || project.types.length === 0)) {
    // Use ErrorHandler for validation warnings
    ErrorHandler.handleValidationWarning(
      `Project ${id} has missing required fields`,
      { projectId: id, project }
    );
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
  if (project && (!project.name || !project.location || !project.types || project.types.length === 0)) {
    // Use ErrorHandler for validation warnings
    ErrorHandler.handleValidationWarning(
      `Project with slug "${slug}" has missing required fields`,
      { slug, project }
    );
    return undefined;
  }
  
  return project;
}


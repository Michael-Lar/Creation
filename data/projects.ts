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

export const projects: Project[] = [
  {
    id: 3,
    name: '152-154 N La Brea Blvd',
    location: 'Los Angeles, CA',
    types: ['Retail'],
    year: '2026',
    slug: '152-n-la-brea-blvd',
    description: 'Located along one of Los Angeles\' most dynamic retail corridors, 152–154 North La Brea Boulevard represents a strategic investment by Creation Partners focused on long-term placemaking and corridor revitalization.',
    details: 'The property sits within a stretch of La Brea Avenue that has emerged as one of the city\'s most sought-after destinations for independent retailers, design-forward brands, and experiential concepts. Creation Partners acquired the asset with a focus on thoughtful tenant curation and long-term stewardship of the corridor.',
    images: ['/projects/152-n-la-brea-blvd.webp'],
    status: 'Completed',
    role: 'Acquisition & Development',
  },
  {
    id: 5,
    name: '1601-1611 S Robertson Blvd',
    location: 'Los Angeles, CA',
    types: ['Retail', 'Education'],
    year: '2025',
    slug: '1601-1611-s-robertson-blvd',
    description: 'Situated along the Robertson Boulevard corridor, this property plays an important role within the neighborhood\'s evolving mix of retail and institutional uses.',
    details: 'Creation Partners identified the site as an opportunity to serve a prominent educational institution seeking a permanent home in the area. The project reflects the firm\'s ability to navigate complex use requirements and deliver purpose-built solutions that strengthen the communities in which they operate.',
    images: ['/projects/1601-1611-s-robertson-blvd.webp'],
    status: 'Completed',
    role: 'Development',
  },
  {
    id: 6,
    name: '421 N Beverly Drive',
    location: 'Beverly Hills, CA',
    types: ['Office'],
    year: '2025',
    slug: '421-n-beverly-drive',
    description: 'Located in the heart of Beverly Hills\' Golden Triangle, 421 North Beverly Drive occupies a prime position within one of Southern California\'s most prestigious commercial districts.',
    details: 'Creation Partners was engaged to provide strategic advisory and asset management services for this property, working closely with ownership to optimize leasing, enhance tenant relationships, and position the asset for long-term performance within one of the region\'s most competitive office markets.',
    images: ['/projects/421-n-beverly-drive.webp'],
    status: 'Completed',
    role: 'Acquisition & Management',
  },
  {
    id: 8,
    name: '4651-4611 W Pico Blvd',
    location: 'Los Angeles, CA',
    types: ['Retail', 'Education'],
    year: '2025',
    slug: '4651-4661-w-pico-blvd',
    description: 'Located along the Pico Boulevard corridor, this property represents the culmination of a multi-year effort to identify and secure the right facility for the expansion of a prominent educational institution.',
    details: 'Creation Partners sourced the opportunity, structured the transaction, and managed the process from acquisition through occupancy — delivering a facility that met the institution\'s programmatic needs while creating a lasting anchor for the surrounding neighborhood.',
    images: ['/projects/4651-4661-w-pico-blvd.webp'],
    status: 'Completed',
    role: 'Development',
  },
  {
    id: 1,
    name: '10773-10775 Ashton Ave',
    location: 'Los Angeles, CA',
    types: ['Multifamily', 'Development'],
    year: '2025',
    slug: '10773-10775-ashton-ave',
    description: 'Located just steps from Westwood Village and UCLA, this property presents a compelling opportunity for residential redevelopment in one of Los Angeles\' most supply-constrained submarkets.',
    details: 'Creation Partners identified the site as an underutilized asset with significant upside potential given its proximity to major employment centers, transit, and one of the region\'s most stable demand drivers. The firm is actively working to unlock the property\'s full development potential through a thoughtful repositioning strategy.',
    images: ['/projects/10773-10775-ashton-ave.webp'],
    status: 'In Development',
    role: 'Development & Management',
  },
  {
    id: 11,
    name: '7801-7807 Beverly Blvd',
    location: 'Los Angeles, CA',
    types: ['Retail'],
    year: '2025',
    slug: '7801-7807-beverly-blvd',
    description: 'Situated along the vibrant Beverly Boulevard corridor, this retail property benefits from strong visibility and proximity to some of Los Angeles\' most creative neighborhoods.',
    details: 'Creation Partners acquired the asset with a focus on curating a tenant mix that complements the corridor\'s established identity as a destination for design, hospitality, and lifestyle brands. The property represents the firm\'s ongoing commitment to street-oriented retail and long-term corridor stewardship.',
    images: ['/projects/7801-7807-beverly-blvd.webp'],
    status: 'Completed',
    role: 'Development & Management',
  },
  {
    id: 9,
    name: '6801 N Figueroa St',
    location: 'Highland Park, CA',
    types: ['Retail', 'Education'],
    year: '2025',
    slug: '6801-n-figueroa-st',
    description: 'Located in the heart of Highland Park, one of Los Angeles\' most culturally rich neighborhoods, this property sits along the active Figueroa Street commercial corridor.',
    details: 'Creation Partners recognized the site\'s potential to serve a growing community need and worked to deliver a purpose-built educational facility that anchors the block and contributes to the neighborhood\'s ongoing evolution. The project reflects the firm\'s broader thesis around institutional uses as long-term stabilizers of emerging commercial corridors.',
    images: ['/projects/6801-n-figueroa-st.webp'],
    status: 'Completed',
    role: 'Development',
  },
  {
    id: 12,
    name: '7910-7928 W Third St',
    location: 'Los Angeles, CA',
    types: ['Retail', 'Hospitality'],
    year: '2024',
    slug: '7910-7928-w-3rd-st',
    description: 'Located along the West Third Street corridor between Fairfax and La Brea, this property benefits from one of Los Angeles\' most curated collections of independent retailers, restaurants, and hospitality concepts.',
    details: 'Creation Partners manages the asset with a focus on maintaining the corridor\'s distinctive character while maximizing long-term performance. The firm\'s deep relationships in the retail and hospitality community have been instrumental in attracting and retaining tenants that enhance the overall experience of the block.',
    images: ['/projects/7910-7928-w-3rd-st.webp'],
    status: 'Completed',
    role: 'Development & Management',
  },
  {
    id: 2,
    name: '11047-11103 Hartsook St',
    location: 'North Hollywood, CA',
    types: ['Multifamily', 'Development'],
    year: '2024',
    slug: '11047-11103-hartsook-st',
    description: 'Situated in North Hollywood\'s rapidly evolving Arts District, this property represents a compelling opportunity for residential development within a transit-oriented neighborhood.',
    details: 'Creation Partners identified the site as an ideal candidate for multifamily development given its proximity to Metro rail, major employment centers, and a growing ecosystem of creative and cultural amenities. The project is being developed with a focus on design quality, community integration, and long-term value creation.',
    images: ['/projects/11047-11103-hartsook-st.webp'],
    status: 'In Development',
    role: 'Development & Management',
  },
  {
    id: 10,
    name: '7174 Melrose Ave',
    location: 'Los Angeles, CA',
    types: ['Hospitality'],
    year: '2024',
    slug: '7174-melrose-ave',
    description: 'Located along the iconic Melrose Avenue corridor, this property sits within one of Los Angeles\' most recognizable retail and cultural districts.',
    details: 'Creation Partners worked closely with the tenant to deliver a hospitality concept that reflects the energy and identity of Melrose Avenue. The project underscores the firm\'s ability to identify the right operator for the right location and structure transactions that create lasting value for all parties.',
    images: [
      '/projects/7174-melrose-ave.webp',
      '/projects/7174-melrose-ave-interior.webp',
    ],
    status: 'Completed',
    role: 'Development & Management',
  },
  {
    id: 4,
    name: '153-155 S Robertson Blvd',
    location: 'Los Angeles, CA',
    types: ['Retail', 'Hospitality'],
    year: '2024',
    slug: '153-155-s-robertson-blvd',
    description: 'This Robertson Boulevard property reflects the corridor\'s continued transformation into a hub for boutique retail and hospitality concepts.',
    details: 'Creation Partners managed the leasing and repositioning of this asset, curating a tenant mix that enhances the block\'s identity and drives long-term foot traffic. The property is representative of the firm\'s approach to street-oriented retail: thoughtful stewardship, strong tenant relationships, and a deep understanding of how individual properties contribute to the character of the corridors they anchor.',
    images: ['/projects/153-155-s-robertson-blvd.webp'],
    status: 'Completed',
    role: 'Development & Management',
  },
  {
    id: 7,
    name: '431 North Fairfax Ave',
    location: 'Los Angeles, CA',
    types: ['Retail'],
    year: '2024',
    slug: '431-n-fairfax-ave',
    description: 'Located within the culturally significant Fairfax District, this retail property sits at the intersection of fashion, street culture, and Los Angeles history.',
    details: 'Creation Partners identified the opportunity to reposition the asset within one of the city\'s most storied retail corridors, working to attract tenants whose brands resonate with the district\'s unique identity. The project reflects the firm\'s commitment to placemaking and its belief that the right tenant in the right location can meaningfully shape the experience of a neighborhood.',
    images: ['/projects/431-n-fairfax-ave.webp'],
    status: 'Completed',
    role: 'Development & Management',
  },
];

export function getProjectById(id: number): Project | undefined {
  if (!id || typeof id !== 'number' || isNaN(id) || id <= 0) {
    return undefined;
  }

  const project = projects.find(project => project && project.id === id);

  if (project && (!project.name || !project.location || !project.types || project.types.length === 0)) {
    ErrorHandler.handleValidationWarning(
      `Project ${id} has missing required fields`,
      { projectId: id, project }
    );
    return undefined;
  }

  return project;
}

export function getProjectBySlug(slug: string): Project | undefined {
  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    return undefined;
  }

  const project = projects.find(project => project && project.slug === slug);

  if (project && (!project.name || !project.location || !project.types || project.types.length === 0)) {
    ErrorHandler.handleValidationWarning(
      `Project with slug "${slug}" has missing required fields`,
      { slug, project }
    );
    return undefined;
  }

  return project;
}

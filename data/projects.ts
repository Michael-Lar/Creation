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
}

export const projects: Project[] = [
  {
    id: 3,
    name: '152-154 N La Brea Blvd',
    location: 'Los Angeles, CA',
    types: ['Retail'],
    year: '2026',
    slug: '152-n-la-brea-blvd',
    description: 'Located along one of Los Angeles\' most dynamic retail corridors, 152–154 North La Brea Boulevard represents a strategic investment by Creation Partners focused on long-term placemaking and corridor revitalization. The property sits within the rapidly evolving La Brea retail district, benefiting from strong visibility, walkability, and proximity to major cultural and commercial anchors.',
    details: 'Creation Partners acquired the asset with strategic partners through the Rushmore Equities investment imprint, with the goal of thoughtfully repositioning the property and contributing to the street\'s growing identity as a destination for design, culture, and experiential retail.',
    images: ['/projects/152-n-la-brea-blvd.webp'],
    status: 'Completed',
  },
  {
    id: 5,
    name: '1601-1611 S Robertson Blvd',
    location: 'Los Angeles, CA',
    types: ['Retail', 'Education'],
    year: '2025',
    slug: '1601-1611-s-robertson-blvd',
    description: 'Situated along the Robertson Boulevard corridor, this property plays an important role within the neighborhood\'s evolving mix of retail and institutional uses.',
    details: 'Creation Partners represented and advised the buyers, YULA High School, in the acquisition of the asset on behalf of a notable educational institution expanding its presence in the area. The project reflects Creation Partners\' broader focus on supporting schools and mission-driven organizations seeking to establish long-term anchors within their communities.',
    images: ['/projects/1601-1611-s-robertson-blvd.webp'],
    status: 'Completed',
  },
  {
    id: 6,
    name: '421 N Beverly Drive',
    location: 'Beverly Hills, CA',
    types: ['Office'],
    year: '2025',
    slug: '421-n-beverly-drive',
    description: 'Located in the heart of Beverly Hills\' Golden Triangle, 421 North Beverly Drive occupies a prime position within one of Southern California\'s most prestigious commercial districts.',
    details: 'Creation Partners advised and represented a prominent private equity firm in securing the property as the location for its Los Angeles headquarters. The engagement reflects Creation Partners\' strategic relationships with investment groups seeking thoughtfully located office environments within premier markets.',
    images: ['/projects/421-n-beverly-drive.webp'],
    status: 'Completed',
  },
  {
    id: 8,
    name: '4651-4611 W Pico Blvd',
    location: 'Los Angeles, CA',
    types: ['Retail', 'Education'],
    year: '2025',
    slug: '4651-4661-w-pico-blvd',
    description: 'Located along the Pico Boulevard corridor, this property represents the culmination of a multi-year effort to identify and secure the right facility for the expansion of a prominent educational institution affiliated with the Chabad of Beverly Hills.',
    details: 'Creation Partners worked closely with the organization to source and execute on the acquisition of a property capable of supporting its growing community and day school. The project reflects Creation Partners\' ongoing commitment to helping mission-driven organizations find and secure spaces that enable long-term growth and community impact.',
    images: ['/projects/4651-4661-w-pico-blvd.webp'],
    status: 'Completed',
  },
  {
    id: 1,
    name: '10773-10775 Ashton Ave',
    location: 'Los Angeles, CA',
    types: ['Multifamily', 'Development'],
    year: '2025',
    slug: '10773-10775-ashton-ave',
    description: 'Located just steps from Westwood Village and UCLA, this property presents a compelling opportunity for residential redevelopment in one of Los Angeles\' most supply-constrained submarkets.',
    details: 'Creation Partners represented the parties in the sale of the asset, helping guide the transaction toward buyers well-positioned to unlock the site\'s long-term development potential while contributing thoughtfully to the surrounding neighborhood.',
    images: ['/projects/10773-10775-ashton-ave.webp'],
    status: 'In Development',
  },
  {
    id: 11,
    name: '7801-7807 Beverly Blvd',
    location: 'Los Angeles, CA',
    types: ['Retail'],
    year: '2025',
    slug: '7801-7807-beverly-blvd',
    description: 'Situated along the vibrant Beverly Boulevard corridor, this retail property benefits from strong visibility and proximity to some of Los Angeles\' most creative neighborhoods.',
    details: 'Creation Partners has advised ownership for several years, working closely to strategically curate a distinctive mix of tenants while supporting the long-term positioning of the asset. Through thoughtful leasing and asset strategy, the property continues to evolve as part of Beverly Boulevard\'s growing ecosystem of retail, food, and cultural destinations.',
    images: ['/projects/7801-7807-beverly-blvd.webp'],
    status: 'Completed',
  },
  {
    id: 9,
    name: '6801 N Figueroa St',
    location: 'Highland Park, CA',
    types: ['Retail', 'Education'],
    year: '2025',
    slug: '6801-n-figueroa-st',
    description: 'Located in the heart of Highland Park, one of Los Angeles\' most culturally rich neighborhoods, this property sits along the active Figueroa Street commercial corridor.',
    details: 'Creation Partners advised a growing educational institution in securing the asset as part of its expansion, following an extended search to identify a property capable of meeting the organization\'s long-term needs. The project reflects Creation Partners\' experience navigating complex transactions for institutions seeking to establish lasting roots within dynamic urban neighborhoods.',
    images: ['/projects/6801-n-figueroa-st.webp'],
    status: 'Completed',
  },
  {
    id: 12,
    name: '7910-7928 W Third St',
    location: 'Los Angeles, CA',
    types: ['Retail', 'Hospitality'],
    year: '2024',
    slug: '7910-7928-w-3rd-st',
    description: 'Located along the West Third Street corridor between Fairfax and La Brea, this property benefits from one of Los Angeles\' most curated collections of independent retailers, restaurants, and hospitality concepts.',
    details: 'Creation Partners has worked in close collaboration with ownership over several years, advising on leasing strategy and tenant placement to reinforce the street\'s reputation as a vibrant destination for dining, shopping, and culture.',
    images: ['/projects/7910-7928-w-3rd-st.webp'],
    status: 'Completed',
  },
  {
    id: 2,
    name: '11047-11103 Hartsook St',
    location: 'North Hollywood, CA',
    types: ['Multifamily', 'Development'],
    year: '2024',
    slug: '11047-11103-hartsook-st',
    description: 'Situated in North Hollywood\'s rapidly evolving Arts District, this property represents a compelling opportunity for residential development within a transit-oriented neighborhood experiencing significant growth.',
    details: 'Creation Partners advised on acquisition and development considerations, helping evaluate strategies for unlocking the site\'s long-term residential potential within one of Los Angeles\' most active development corridors.',
    images: ['/projects/11047-11103-hartsook-st.webp'],
    status: 'In Development',
  },
  {
    id: 10,
    name: '7174 Melrose Ave',
    location: 'Los Angeles, CA',
    types: ['Hospitality'],
    year: '2024',
    slug: '7174-melrose-ave',
    description: 'Located along the iconic Melrose Avenue corridor, this property sits within one of Los Angeles\' most recognizable retail and cultural districts.',
    details: 'Creation Partners advised ownership in bringing a dynamic new hospitality concept to the space, helping position the property as home to one of the city\'s most exciting emerging destinations within the evolving Melrose retail landscape.',
    images: [
      '/projects/7174-melrose-ave.webp',
      '/projects/7174-melrose-ave-interior.webp',
    ],
    status: 'Completed',
  },
  {
    id: 4,
    name: '153-155 S Robertson Blvd',
    location: 'Los Angeles, CA',
    types: ['Retail', 'Hospitality'],
    year: '2024',
    slug: '153-155-s-robertson-blvd',
    description: 'This Robertson Boulevard property reflects the corridor\'s continued transformation into a hub for boutique retail and hospitality concepts.',
    details: 'Creation Partners assisted with the acquisition of the asset and continues to advise on its positioning, helping align the property with tenants and concepts that contribute to the street\'s pedestrian character and long-term vibrancy.',
    images: ['/projects/153-155-s-robertson-blvd.webp'],
    status: 'Completed',
  },
  {
    id: 7,
    name: '431 North Fairfax Ave',
    location: 'Los Angeles, CA',
    types: ['Retail'],
    year: '2024',
    slug: '431-n-fairfax-ave',
    description: 'Located within the culturally significant Fairfax District, this retail property sits at the intersection of fashion, street culture, and Los Angeles history.',
    details: 'Creation Partners advised on leasing strategy and tenant placement, helping position the property within one of the city\'s most distinctive and culturally influential retail corridors.',
    images: ['/projects/431-n-fairfax-ave.webp'],
    status: 'Completed',
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

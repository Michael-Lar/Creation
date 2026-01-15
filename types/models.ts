/**
 * Shared type definitions for the Creation Partners website
 * These types are exported for reuse across components and modules
 */

// Re-export Project type from data/projects.ts for convenience
export type { Project } from '@/data/projects';

/**
 * Team member information
 */
export interface TeamMember {
  id: number;
  name: string;
  title: string;
  bio?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  image?: string; // Path to headshot image
}

/**
 * Division information
 */
export interface Division {
  name: string;
  description: string;
  image: string; // Path to division image
  icon?: string; // Emoji or icon identifier
}

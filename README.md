# Creation Partners Website

A clean Next.js website built with TypeScript and Tailwind CSS.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build & Lint

- Build for production: `npm run build`
- Run linter: `npm run lint`
- Start production server: `npm start`

## Deployment

Connect this repo to Vercel; main branch deploys automatically.

## Code Style & Naming Conventions

This project follows consistent naming conventions and component structure standards.

### Component Structure

All components should follow the standard structure defined in [`components/COMPONENT_TEMPLATE.md`](./components/COMPONENT_TEMPLATE.md). Key points:

- **Prop destructuring**: Always destructure props in function parameters with inline defaults
- **Hook ordering**: State hooks → Refs → Custom hooks → Effects → Callbacks
- **Interface placement**: Always before the component function
- **Export pattern**: Use `export default function` for simple components, `memo()` for expensive ones
- **Constants**: Place large/shared constants before component, component-specific ones inside

### Naming Conventions

- **JavaScript/TypeScript**: Use `camelCase` for all variables, functions, and identifiers
  - Variables: `scrollToSection`, `preloaderComplete`, `activeFilter`
  - Functions: `fadeInContent`, `scrollToAbout`, `handleMemberClick`
  - State: `isModalOpen`, `isScrolled`, `shouldSkipPreloader`
  - Refs: `mainContentRef`, `headerRef`, `sectionRef`
  - Constants: `SCROLL`, `TIMING`, `VISUAL` (UPPER_SNAKE_CASE for exported constants)

- **CSS/HTML**: Use `kebab-case` for CSS classes, custom properties, and HTML attributes
  - CSS classes: `section-spacing`, `divider-bronze`, `container-main`
  - CSS custom properties: `--color-cream`, `--duration-normal`
  - HTML attributes: `aria-label`, `aria-hidden`, `data-*`

- **Files**: Use `kebab-case` for file and directory names (Next.js convention)

## Video Optimization

The hero section uses 6 video files that loop continuously. For optimal performance:

- **Video Format**: Use MP4 (H.264 codec) for maximum browser compatibility
- **Video Size**: Keep individual video files under 5MB when possible
- **Resolution**: 1920x1080 (1080p) is recommended for balance between quality and file size
- **Duration**: Each video should be approximately 3 seconds
- **Compression**: Use tools like HandBrake or FFmpeg to compress videos:
  ```bash
  # Example FFmpeg command for compression
  ffmpeg -i input.mp4 -vcodec h264 -acodec aac -crf 23 -preset medium output.mp4
  ```

Videos are preloaded on mount to ensure smooth transitions. The component uses a two-video element approach with crossfade transitions for seamless looping.


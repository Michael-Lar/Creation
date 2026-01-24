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

The hero section uses 6 video files (`video1.mp4` through `video6.mp4`) that loop continuously. For optimal performance and fast loading:

### Quick Start

Encode all hero videos with optimized settings:

```bash
# Simple single-pass encoding (recommended for most cases)
npm run encode:videos

# Two-pass encoding (better quality, slower)
npm run encode:videos:2pass
```

### Video Specifications

- **Format**: MP4 (H.264 codec, High profile)
- **Resolution**: 1920x1080 (1080p)
- **Bitrate**: 4 Mbps (max 6 Mbps)
- **Fast-start**: Enabled (moov atom at front for instant playback)
- **Audio**: Removed (background videos don't need audio)
- **Target Size**: Under 2-3 MB per video for fast loading

### Manual Encoding

If you need to encode videos manually or adjust settings:

```bash
# Edit scripts/encode-hero-videos-simple.sh to adjust:
# - BITRATE (default: 4M)
# - CRF (default: 23, lower = better quality)
# - PRESET (default: medium, faster = larger files)

./scripts/encode-hero-videos-simple.sh
```

### Why These Settings?

- **4 Mbps bitrate**: Optimal balance for hero backgrounds - high enough quality, small enough to load in ~4 seconds
- **Fast-start**: Allows browser to begin playback before entire file downloads
- **No audio**: Reduces file size by 10-20% without affecting visual quality
- **1080p resolution**: Matches typical display size, no need for 4K

### Performance Goals

Videos should load and be ready to play **within the preloader duration** (~4 seconds) on average connections. If videos take longer:

1. Reduce bitrate to `3M` in the script
2. Increase CRF to `24` or `25` (slightly lower quality, smaller files)
3. Check video file sizes - should be under 3MB each

Videos are preloaded on mount via `<link rel="preload">` in the HTML head to ensure smooth transitions. The component uses a two-video element approach with crossfade transitions for seamless looping.


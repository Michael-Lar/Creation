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


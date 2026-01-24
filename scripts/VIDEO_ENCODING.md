# Hero Video Encoding Guide

## Quick Start

```bash
# Encode all hero videos (recommended)
npm run encode:videos

# Or use the two-pass version for better quality
npm run encode:videos:2pass
```

## Current Settings

The encoding scripts use these optimized settings:

- **Resolution**: 1920x1080 (1080p)
- **Bitrate**: 4 Mbps (max 6 Mbps)
- **Quality (CRF)**: 23
- **Preset**: medium
- **Fast-start**: Enabled (critical for instant playback)
- **Audio**: Removed (saves 10-20% file size)

## Adjusting Settings

### If videos are too large / load too slowly:

1. **Reduce bitrate** (in `encode-hero-videos-simple.sh`):
   ```bash
   BITRATE="3M"        # Lower from 4M
   MAX_BITRATE="4.5M" # Lower from 6M
   ```

2. **Increase CRF** (lower quality, smaller files):
   ```bash
   CRF="24"  # or 25 for even smaller files
   ```

3. **Use faster preset** (faster encoding, slightly larger files):
   ```bash
   PRESET="fast"  # or "veryfast"
   ```

### If videos look low quality:

1. **Increase bitrate**:
   ```bash
   BITRATE="5M"        # Higher from 4M
   MAX_BITRATE="7M"    # Higher from 6M
   ```

2. **Decrease CRF** (better quality, larger files):
   ```bash
   CRF="22"  # or 21 for even better quality
   ```

3. **Use slower preset** (better compression, slower encoding):
   ```bash
   PRESET="slow"  # or "veryslow" for best compression
   ```

## Understanding the Settings

### Bitrate (4M)
- Controls file size and quality
- 4 Mbps is optimal for 1080p hero backgrounds
- Lower = smaller files but may have visible compression
- Higher = better quality but larger files

### CRF (23)
- Constant Rate Factor - quality setting
- Range: 18 (best) to 28 (smallest)
- 23 is the "sweet spot" for web video
- Each +1 point ≈ 10% smaller file, slightly lower quality

### Preset (medium)
- Encoding speed vs file size tradeoff
- Options: `ultrafast`, `fast`, `medium`, `slow`, `veryslow`
- Slower = better compression (smaller files) but takes longer
- Faster = quicker encoding but larger files

### Fast-start (+faststart)
- **Critical**: Moves metadata to front of file
- Allows browser to start playback before full download
- Without this, videos must fully download before playing
- Always keep this enabled!

## File Size Targets

For videos to load within ~4 seconds on average connections:

- **Target**: 2-3 MB per video
- **Maximum**: 4 MB per video
- **Connection speed**: ~5-10 Mbps average

If files are larger, reduce bitrate or increase CRF.

## Testing

After encoding:

1. Check file sizes in `public/videos/`
2. Test in browser - videos should be ready when preloader finishes
3. Verify quality looks good on your display
4. Test on slower connection if possible

## Backups

The scripts automatically create backups in `public/videos/backups/` before encoding. If you need to restore:

```bash
cp public/videos/backups/video1.mp4.backup public/videos/video1.mp4
```

## Troubleshooting

### "ffmpeg not found"
Install ffmpeg:
- **macOS**: `brew install ffmpeg`
- **Linux**: `sudo apt-get install ffmpeg`
- **Windows**: Download from https://ffmpeg.org/

### Videos still too large
1. Check original file sizes - may need to start with better source files
2. Try CRF=24 or CRF=25
3. Reduce bitrate to 3M
4. Consider lower resolution (1440x810) if acceptable

### Quality looks bad
1. Increase bitrate to 5M or 6M
2. Decrease CRF to 22 or 21
3. Use slower preset (slow or veryslow)
4. Check source video quality - encoding can't improve bad source

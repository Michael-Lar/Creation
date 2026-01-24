#!/bin/bash

# Simple Hero Video Encoding Script (Single Pass)
# Faster encoding with good quality - suitable for most cases
# Usage: ./scripts/encode-hero-videos-simple.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

INPUT_DIR="./public/videos"
BACKUP_DIR="${INPUT_DIR}/backups"

# Video settings optimized for web
RESOLUTION="1920x1080"
BITRATE="4M"
MAX_BITRATE="6M"
BUFSIZE="8M"
CRF="23"
PRESET="medium"

# Check ffmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "Error: ffmpeg is not installed"
    echo "Install: brew install ffmpeg (macOS) or apt-get install ffmpeg (Linux)"
    exit 1
fi

mkdir -p "$BACKUP_DIR"

echo -e "${GREEN}Encoding hero videos...${NC}\n"

for video in video1.mp4 video2.mp4 video3.mp4 video4.mp4 video5.mp4 video6.mp4; do
    input="${INPUT_DIR}/${video}"
    
    if [ ! -f "$input" ]; then
        echo -e "${YELLOW}Skipping ${video} (not found)${NC}"
        continue
    fi
    
    echo "Encoding ${video}..."
    
    # Backup
    cp "$input" "${BACKUP_DIR}/${video}.backup"
    
    # Single-pass encoding with faststart
    # Use scale filter that handles aspect ratio and padding correctly
    if ffmpeg -i "$input" \
        -c:v libx264 \
        -preset "$PRESET" \
        -b:v "$BITRATE" \
        -maxrate "$MAX_BITRATE" \
        -bufsize "$BUFSIZE" \
        -vf "scale=1920:1080:force_original_aspect_ratio=decrease" \
        -profile:v high \
        -level 4.0 \
        -g 60 \
        -keyint_min 60 \
        -movflags +faststart \
        -an \
        -y \
        "${INPUT_DIR}/${video}.tmp.mp4" > /dev/null 2>&1; then
        
        mv "${INPUT_DIR}/${video}.tmp.mp4" "$input"
        echo -e "${GREEN}✓ ${video} complete${NC}\n"
    else
        echo -e "${YELLOW}  ⚠ Error encoding ${video}, keeping original${NC}"
        rm -f "${INPUT_DIR}/${video}.tmp.mp4"
        continue
    fi
done

echo -e "${GREEN}All videos encoded!${NC}"
echo "Backups: ${BACKUP_DIR}"

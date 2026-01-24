#!/bin/bash

# Hero Video Encoding Script
# Optimizes hero videos for web with fast-start and optimal bitrate
# Usage: ./scripts/encode-hero-videos.sh [input_directory] [output_directory]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default paths
INPUT_DIR="${1:-./public/videos}"
OUTPUT_DIR="${2:-./public/videos}"
BACKUP_DIR="${OUTPUT_DIR}/backups"

# Video settings (optimized for hero background videos)
# These settings balance quality and file size for fast loading
RESOLUTION="1920x1080"           # 1080p - standard for hero videos
BITRATE="4M"                      # 4 Mbps - optimal for hero backgrounds
MAX_BITRATE="6M"                  # Max bitrate cap
BUFSIZE="8M"                      # Buffer size (2x bitrate)
CRF="23"                          # Quality factor (18-28, lower = better quality)
PRESET="medium"                   # Encoding speed (ultrafast/fast/medium/slow)
PROFILE="high"                    # H.264 profile
LEVEL="4.0"                       # H.264 level
KEYFRAME_INTERVAL="2"             # Keyframe every 2 seconds for smooth seeking

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}Error: ffmpeg is not installed${NC}"
    echo "Install it with: brew install ffmpeg (macOS) or apt-get install ffmpeg (Linux)"
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Function to encode a single video
encode_video() {
    local input_file="$1"
    local output_file="$2"
    local filename=$(basename "$input_file")
    
    echo -e "${YELLOW}Encoding: ${filename}${NC}"
    
    # Get original file size
    local original_size=$(stat -f%z "$input_file" 2>/dev/null || stat -c%s "$input_file" 2>/dev/null)
    local original_size_mb=$(echo "scale=2; $original_size / 1024 / 1024" | bc)
    
    # Create backup
    echo "  Creating backup..."
    cp "$input_file" "${BACKUP_DIR}/${filename}.backup"
    
    # Encode with 2-pass for optimal quality at target bitrate
    echo "  Pass 1/2: Analyzing video..."
    ffmpeg -i "$input_file" \
        -c:v libx264 \
        -preset "$PRESET" \
        -b:v "$BITRATE" \
        -maxrate "$MAX_BITRATE" \
        -bufsize "$BUFSIZE" \
        -vf "scale=$RESOLUTION:force_original_aspect_ratio=decrease,pad=$RESOLUTION:(ow-iw)/2:(oh-ih)/2" \
        -g $(echo "$KEYFRAME_INTERVAL * 30" | bc) \
        -keyint_min $(echo "$KEYFRAME_INTERVAL * 30" | bc) \
        -sc_threshold 0 \
        -profile:v "$PROFILE" \
        -level "$LEVEL" \
        -an \
        -pass 1 \
        -f null \
        /dev/null 2>/dev/null
    
    echo "  Pass 2/2: Encoding video..."
    ffmpeg -i "$input_file" \
        -c:v libx264 \
        -preset "$PRESET" \
        -b:v "$BITRATE" \
        -maxrate "$MAX_BITRATE" \
        -bufsize "$BUFSIZE" \
        -vf "scale=$RESOLUTION:force_original_aspect_ratio=decrease,pad=$RESOLUTION:(ow-iw)/2:(oh-ih)/2" \
        -g $(echo "$KEYFRAME_INTERVAL * 30" | bc) \
        -keyint_min $(echo "$KEYFRAME_INTERVAL * 30" | bc) \
        -sc_threshold 0 \
        -profile:v "$PROFILE" \
        -level "$LEVEL" \
        -movflags +faststart \
        -an \
        -pass 2 \
        -y \
        "$output_file"
    
    # Clean up 2-pass files
    rm -f ffmpeg2pass-*.log* 2>/dev/null
    
    # Get new file size
    local new_size=$(stat -f%z "$output_file" 2>/dev/null || stat -c%s "$output_file" 2>/dev/null)
    local new_size_mb=$(echo "scale=2; $new_size / 1024 / 1024" | bc)
    local reduction=$(echo "scale=1; (1 - $new_size / $original_size) * 100" | bc)
    
    echo -e "${GREEN}  ✓ Complete: ${filename}${NC}"
    echo "    Original: ${original_size_mb} MB → New: ${new_size_mb} MB (${reduction}% reduction)"
    echo ""
}

# Main execution
echo -e "${GREEN}Hero Video Encoding Script${NC}"
echo "================================"
echo "Input directory: $INPUT_DIR"
echo "Output directory: $OUTPUT_DIR"
echo "Backup directory: $BACKUP_DIR"
echo ""
echo "Settings:"
echo "  Resolution: $RESOLUTION"
echo "  Bitrate: $BITRATE (max: $MAX_BITRATE)"
echo "  Quality (CRF): $CRF"
echo "  Preset: $PRESET"
echo "  Fast-start: Enabled"
echo ""

# Encode all hero videos
for video in video1.mp4 video2.mp4 video3.mp4 video4.mp4 video5.mp4 video6.mp4; do
    input_path="${INPUT_DIR}/${video}"
    output_path="${OUTPUT_DIR}/${video}"
    
    if [ -f "$input_path" ]; then
        encode_video "$input_path" "$output_path"
    else
        echo -e "${YELLOW}Warning: ${video} not found, skipping...${NC}"
    fi
done

echo -e "${GREEN}All videos encoded successfully!${NC}"
echo "Backups saved to: $BACKUP_DIR"
echo ""
echo "Next steps:"
echo "1. Test the videos in your browser"
echo "2. Verify they load within the preloader duration (~4s)"
echo "3. If quality is too low, adjust BITRATE in this script and re-run"
echo "4. If quality is fine but file size is still large, try CRF=24 or CRF=25"

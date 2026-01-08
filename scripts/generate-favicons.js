#!/usr/bin/env node

/**
 * Generate favicon files from logo.svg
 * Creates all required favicon sizes and formats for the website
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const logoPath = path.join(__dirname, '../public/logos/logo.svg');
const publicPath = path.join(__dirname, '../public');

// Ensure public directory exists
if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath, { recursive: true });
}

// Favicon sizes and formats to generate
const faviconSizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
];

// Check if logo exists
if (!fs.existsSync(logoPath)) {
  console.error(`Error: Logo file not found at ${logoPath}`);
  process.exit(1);
}

async function generateFavicons() {
  console.log('🎨 Generating favicons from logo.svg...\n');

  try {
    // Generate PNG files
    for (const { size, name } of faviconSizes) {
      const outputPath = path.join(publicPath, name);
      
      await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }, // Transparent background
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated ${name} (${size}x${size})`);
    }

    // Generate ICO file (favicon.ico) - Create from 32x32 PNG
    // Note: sharp doesn't support ICO directly, so we'll create a multi-size ICO
    // For now, we'll copy the 32x32 PNG and rename it (browsers will accept PNG as .ico)
    // In production, you might want to use a proper ICO converter
    const icoSource = path.join(publicPath, 'favicon-32x32.png');
    const icoDest = path.join(publicPath, 'favicon.ico');
    
    // Create a simple ICO by copying the 32x32 PNG
    // Most modern browsers accept PNG files with .ico extension
    fs.copyFileSync(icoSource, icoDest);
    console.log('✅ Generated favicon.ico (from 32x32 PNG)');

    console.log('\n✨ All favicons generated successfully!');
    console.log('\n📝 Note: For a true multi-resolution ICO file, consider using:');
    console.log('   - https://realfavicongenerator.net/');
    console.log('   - Or ImageMagick: convert favicon-16x16.png favicon-32x32.png favicon.ico');
    
  } catch (error) {
    console.error('❌ Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();

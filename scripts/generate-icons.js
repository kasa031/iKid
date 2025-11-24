/**
 * Script to generate PWA icons from SVG
 * Run: node scripts/generate-icons.js
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const svg192 = readFileSync(join(rootDir, 'public/icon-192.svg'));
const svg512 = readFileSync(join(rootDir, 'public/icon-512.svg'));

async function generateIcons() {
  try {
    // Generate 192x192 PNG
    await sharp(svg192)
      .resize(192, 192)
      .png()
      .toFile(join(rootDir, 'public/icon-192.png'));

    // Generate 512x512 PNG
    await sharp(svg512)
      .resize(512, 512)
      .png()
      .toFile(join(rootDir, 'public/icon-512.png'));

    // Generate Apple Touch Icon (180x180)
    await sharp(svg192)
      .resize(180, 180)
      .png()
      .toFile(join(rootDir, 'public/apple-touch-icon.png'));

    console.log('✅ Icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();

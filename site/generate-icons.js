/**
 * Generate PWA icons from SVG
 * Run: node generate-icons.js
 * Requires: npm install sharp
 */

import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, 'public', 'icons');
const svgPath = join(iconsDir, 'icon.svg');

const sizes = [192, 512];

async function generateIcons() {
  if (!existsSync(iconsDir)) {
    mkdirSync(iconsDir, { recursive: true });
  }

  const svg = readFileSync(svgPath);

  for (const size of sizes) {
    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(join(iconsDir, `icon-${size}.png`));

    console.log(`✓ Generated icon-${size}.png`);
  }

  console.log('\nDone! Icons generated in /icons/');
}

generateIcons().catch(console.error);

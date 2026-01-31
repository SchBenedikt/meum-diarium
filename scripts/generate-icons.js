#!/usr/bin/env node
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgPath = path.join(__dirname, '../public/icons/favicon.svg');
const outputDir = path.join(__dirname, '../public/icons');

const sizes = [192, 512];

async function generateIcons() {
  const svgBuffer = fs.readFileSync(svgPath);
  
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated ${outputPath}`);
  }
  
  console.log('Icon generation complete');
}

generateIcons().catch(console.error);

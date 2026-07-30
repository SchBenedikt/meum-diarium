import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const svgContent = readFileSync(join(root, 'public', 'favicon-light.svg'), 'utf-8');

const sizes = [48, 72, 96, 144, 152, 167, 180, 192, 512];

async function generate() {
  const iconsDir = join(root, 'public', 'icons');
  mkdirSync(iconsDir, { recursive: true });

  for (const size of sizes) {
    const png = await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png()
      .toBuffer();

    writeFileSync(join(iconsDir, `icon-${size}x${size}.png`), png);

    // Generate maskable variant for 192 and 512
    if (size === 192 || size === 512) {
      const maskable = await sharp(Buffer.from(svgContent))
        .resize(Math.round(size * 0.8), Math.round(size * 0.8))
        .extend({
          top: Math.round(size * 0.1),
          bottom: Math.round(size * 0.1),
          left: Math.round(size * 0.1),
          right: Math.round(size * 0.1),
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();

      writeFileSync(join(iconsDir, `icon-${size}x${size}-maskable.png`), maskable);
    }

    console.log(`Generated ${size}x${size} icon`);
  }

  // Also generate apple-touch-icons (same as standard, some are duplicates)
  console.log('All icons generated successfully!');
}

generate().catch(console.error);

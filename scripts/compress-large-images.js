#!/usr/bin/env node

/**
 * Compress images larger than 10MB to fit Cloudinary free tier limits
 * Usage: node scripts/compress-large-images.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const TARGET_SIZE = 8 * 1024 * 1024; // 8MB target

async function compressImages() {
  try {
    console.log('🚀 Starting image compression...\n');

    // Get all image files recursively
    const largeFiles = [];

    function walkDir(dir) {
      const files = fs.readdirSync(dir);

      files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          walkDir(fullPath);
        } else if (/\.(jpg|jpeg|png|webp)$/i.test(file) && stat.size > MAX_SIZE) {
          largeFiles.push({
            path: fullPath,
            filename: file,
            size: stat.size,
          });
        }
      });
    }

    walkDir(IMAGES_DIR);

    if (largeFiles.length === 0) {
      console.log('✅ No images larger than 10MB found!');
      return;
    }

    console.log(`📷 Found ${largeFiles.length} images to compress\n`);

    let successCount = 0;
    let errorCount = 0;

    // Compress each image
    for (const image of largeFiles) {
      try {
        const originalSize = image.size;
        const originalSizeMB = (originalSize / (1024 * 1024)).toFixed(1);

        console.log(`⏳ Compressing: ${image.filename} (${originalSizeMB}MB)`);

        // Start with quality 80 and reduce if needed
        let quality = 80;
        let buffer;
        let compressed;

        // Try compression with progressive quality reduction
        do {
          buffer = await sharp(image.path)
            .resize(3000, 3000, {
              fit: 'inside',
              withoutEnlargement: true,
            })
            .jpeg({ quality, progressive: true, mozjpeg: true })
            .toBuffer();

          if (buffer.length <= TARGET_SIZE) {
            compressed = buffer;
            break;
          }

          quality -= 5;
          if (quality < 40) {
            // If still too large, use more aggressive resizing
            buffer = await sharp(image.path)
              .resize(2000, 2000, {
                fit: 'inside',
                withoutEnlargement: true,
              })
              .jpeg({ quality: 70, progressive: true, mozjpeg: true })
              .toBuffer();
            compressed = buffer;
            break;
          }
        } while (!compressed);

        // Write compressed image back
        fs.writeFileSync(image.path, compressed);

        const compressedSizeMB = (compressed.length / (1024 * 1024)).toFixed(1);
        const reduction = (((originalSize - compressed.length) / originalSize) * 100).toFixed(0);

        console.log(`✅ Success: ${originalSizeMB}MB → ${compressedSizeMB}MB (${reduction}% reduction)\n`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error compressing ${image.filename}: ${error.message}\n`);
        errorCount++;
      }
    }

    console.log(`📊 Compression Summary:`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`\n🎉 Compression complete!`);

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

compressImages();

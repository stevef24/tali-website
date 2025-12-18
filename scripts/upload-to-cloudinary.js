#!/usr/bin/env node

/**
 * Bulk upload images to Cloudinary
 * Usage: node scripts/upload-to-cloudinary.js
 */

require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const CLOUDINARY_FOLDER = 'tali-portfolio';

async function uploadImages() {
  try {
    console.log('🚀 Starting Cloudinary bulk upload...\n');

    // Get all image files recursively
    const imageFiles = [];

    function walkDir(dir, prefix = '') {
      const files = fs.readdirSync(dir);

      files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          walkDir(fullPath, prefix ? `${prefix}/${file}` : file);
        } else if (/\.(jpg|jpeg|png|webp|gif)$/i.test(file)) {
          imageFiles.push({
            path: fullPath,
            folder: prefix,
            filename: file,
          });
        }
      });
    }

    walkDir(IMAGES_DIR);

    console.log(`📷 Found ${imageFiles.length} images to upload\n`);

    let successCount = 0;
    let errorCount = 0;

    // Upload each image
    for (const image of imageFiles) {
      try {
        // Create public_id without the folder prefix (folder param adds it)
        const publicId = image.folder
          ? `${image.folder}/${image.filename.replace(/\.[^/.]+$/, '')}`
          : image.filename.replace(/\.[^/.]+$/, '');

        console.log(`⏳ Uploading: ${publicId}`);

        const result = await cloudinary.uploader.upload(image.path, {
          public_id: publicId,
          resource_type: 'auto',
          overwrite: true,
          quality: 'auto',
          folder: CLOUDINARY_FOLDER,
        });

        console.log(`✅ Success: ${result.public_id}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error uploading ${image.filename}: ${error.message}`);
        errorCount++;
      }
    }

    console.log(`\n📊 Upload Summary:`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`\n🎉 Bulk upload complete!`);

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

uploadImages();

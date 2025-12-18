import type { CategoryKey } from '@/lib/types/artwork'
import { FOLDER_NAME_MAP, artworkCategories } from '@/lib/data/artwork-data'

function encodePathSegments(path: string): string {
  return path
    .split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/')
}

/**
 * Get the full image path for a given category and filename
 * Returns Cloudinary URL with optimization
 * Example: getImagePath('landscape', 'photo.jpg') => Cloudinary optimized URL
 */
export function getImagePath(categoryKey: CategoryKey, filename: string): string {
  const folderName = FOLDER_NAME_MAP[categoryKey]
  if (!folderName) {
    console.warn(`Unknown category key: ${categoryKey}`)
    return ''
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  if (!cloudName) {
    console.warn('Cloudinary cloud name not configured')
    return ''
  }

  // Construct the Cloudinary public ID from folder and filename
  const baseFilename = filename.replace(/\.[^/.]+$/, '')
  const publicId = `tali-portfolio/${folderName}/${baseFilename}`

  // Build Cloudinary URL with optimization
  // Note: Don't encode the full path - just ensure each segment is URL-safe
  const cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/image/upload/q_auto,f_auto,w_1200,h_1200,c_limit/${publicId}.jpg`

  return cloudinaryUrl
}

/**
 * Get category slug from category key
 * Example: getCategorySlug('my-dutch-heroes') => 'my-dutch-heroes'
 */
export function getCategorySlug(key: CategoryKey): string {
  const category = artworkCategories.find(cat => cat.key === key)
  return category?.slug ?? ''
}

/**
 * Get category key from slug (for dynamic routes)
 * Example: getCategoryFromSlug('my-dutch-heroes') => 'my-dutch-heroes'
 */
export function getCategoryFromSlug(slug: string): CategoryKey | undefined {
  const category = artworkCategories.find(cat => cat.slug === slug)
  return category?.key
}

/**
 * Get category data by key or slug
 */
export function getCategoryData(keyOrSlug: string) {
  return (
    artworkCategories.find(cat => cat.key === keyOrSlug) ||
    artworkCategories.find(cat => cat.slug === keyOrSlug)
  )
}

/**
 * Clean filename into display title
 * Removes common patterns like gigapixel processing, dates, and camera prefixes
 */
export function cleanFilenameToTitle(filename: string): string {
  // Remove file extension
  let title = filename.replace(/\.[^/.]+$/, '')

  // Remove gigapixel processing patterns
  title = title.replace(/-gigapixel-standard-scale-4_00x/g, '')
  title = title.replace(/-gigapixel-art-scale-4_00x/g, '')
  title = title.replace(/-cropped/g, '')

  // Remove date patterns
  title = title.replace(/^PHOTO-\d{4}-\d{2}-\d{2}-/i, '')
  title = title.replace(/\s*\d{2}-\d{2}-\d{2}\s*/g, ' ')

  // Remove common camera prefixes
  title = title.replace(/^(tali|Itali|tail|IMG|PHOTO|MG_?)/i, '')

  // Clean up extra whitespace and underscores
  title = title.replace(/[_-]+/g, ' ').trim()

  // Convert to title case
  return title
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Get all artworks across all categories
 */
export function getAllArtworks() {
  return artworkCategories.flatMap(cat => cat.artworks)
}

/**
 * Get artworks for a specific category
 */
export function getArtworksByCategory(categoryKeyOrSlug: string) {
  const category = getCategoryData(categoryKeyOrSlug)
  return category?.artworks ?? []
}

/**
 * Generate a blur placeholder data URL for Next.js Image component
 * Creates a lightweight blurred version for smooth loading
 */
export function getBlurDataUrl(): string {
  // Ultra-light 1x1 blurred SVG placeholder
  return 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221%22 height=%221%22%3E%3Cfilter id=%22blur%22%3E%3CfeGaussianBlur in=%22SourceGraphic%22 stdDeviation=%222%22/%3E%3C/filter%3E%3Crect width=%221%22 height=%221%22 fill=%22%23888%22 filter=%22url(%23blur)%22/%3E%3C/svg%3E'
}

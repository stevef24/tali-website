/**
 * Image loading utilities for the infinite canvas
 * Integrates with existing artwork data and Cloudinary
 */

import { artworkCategories } from '@/lib/data/artwork-data'
import { getCanvasImagePath } from '@/lib/utils/image-paths'
import type { Artwork, CategoryKey } from '@/lib/types/artwork'

export interface CanvasArtwork extends Artwork {
  categoryKey: CategoryKey
  imageUrl: string
}

/**
 * Get all artworks flattened with their category info and Cloudinary URLs
 */
export function getAllCanvasArtworks(): CanvasArtwork[] {
  const artworks: CanvasArtwork[] = []

  for (const category of artworkCategories) {
    for (const artwork of category.artworks) {
      artworks.push({
        ...artwork,
        categoryKey: category.key,
        imageUrl: getCanvasImagePath(category.key, artwork.filename),
      })
    }
  }

  return artworks
}

/**
 * Get a specific artwork by index (wraps around if out of bounds)
 */
export function getArtworkByIndex(index: number, artworks: CanvasArtwork[]): CanvasArtwork {
  const wrappedIndex = ((index % artworks.length) + artworks.length) % artworks.length
  return artworks[wrappedIndex]
}

/**
 * Preload an image and return a promise
 */
export function preloadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

/**
 * Preload multiple images with concurrency limit
 */
export async function preloadImages(
  urls: string[],
  concurrency: number = 4
): Promise<HTMLImageElement[]> {
  const results: HTMLImageElement[] = []
  const queue = [...urls]

  async function worker() {
    while (queue.length > 0) {
      const url = queue.shift()
      if (url) {
        try {
          const img = await preloadImage(url)
          results.push(img)
        } catch (e) {
          console.warn(`Failed to preload image: ${url}`)
        }
      }
    }
  }

  // Start workers
  const workers = Array(Math.min(concurrency, urls.length))
    .fill(null)
    .map(() => worker())

  await Promise.all(workers)
  return results
}

/**
 * Get optimized Cloudinary URL for canvas (smaller size for performance)
 */
export function getCanvasOptimizedUrl(imageUrl: string): string {
  // Replace w_1200,h_1200 with smaller dimensions for canvas performance
  return imageUrl.replace(/w_\d+,h_\d+/, 'w_800,h_600')
}

/**
 * Group artworks by category for organized display
 */
export function getArtworksByCategory(): Map<CategoryKey, CanvasArtwork[]> {
  const grouped = new Map<CategoryKey, CanvasArtwork[]>()

  for (const category of artworkCategories) {
    const artworks: CanvasArtwork[] = category.artworks.map((artwork) => ({
      ...artwork,
      categoryKey: category.key,
      imageUrl: getCanvasImagePath(category.key, artwork.filename),
    }))
    grouped.set(category.key, artworks)
  }

  return grouped
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(categoryKey: CategoryKey): string {
  const category = artworkCategories.find((c) => c.key === categoryKey)
  return category?.slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) ?? categoryKey
}

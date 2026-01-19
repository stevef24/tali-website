/**
 * Custom Texture Manager for Infinite Canvas
 *
 * Following Codrops pattern: non-blocking texture loading with caching.
 * - Returns a placeholder texture immediately
 * - Caches loaded textures to prevent duplicate network requests
 * - Uses callback queue for async completion
 * - Never blocks the render cycle (no Suspense)
 */

import * as THREE from 'three'

// Texture cache to store loaded textures by URL
const textureCache = new Map<string, THREE.Texture>()

// Callback queue for textures that are still loading
const loadCallbacks = new Map<string, Array<(texture: THREE.Texture) => void>>()

// Track which URLs are currently loading
const loadingUrls = new Set<string>()

// Track loading state for progress reporting
let totalToLoad = 0
let totalLoaded = 0
let progressCallback: ((progress: number) => void) | null = null

// Shared texture loader instance
const textureLoader = new THREE.TextureLoader()

// Placeholder texture (gray) for use while loading
const placeholderTexture = new THREE.Texture()

/**
 * Configure texture with high-quality settings
 */
function configureTexture(texture: THREE.Texture, gl?: THREE.WebGLRenderer): void {
  // Enable mipmaps for sharp textures at any distance
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter

  // Anisotropic filtering for quality at oblique angles
  const maxAnisotropy = gl?.capabilities?.getMaxAnisotropy?.() ?? 4
  texture.anisotropy = Math.min(4, maxAnisotropy)

  // Correct color space for accurate colors
  texture.colorSpace = THREE.SRGBColorSpace

  texture.needsUpdate = true
}

/**
 * Get or load a texture by URL
 * Returns placeholder if not loaded, calls onLoad when ready
 */
export function getTexture(
  url: string,
  onLoad?: (texture: THREE.Texture) => void,
  gl?: THREE.WebGLRenderer
): THREE.Texture {
  // Check cache first - return loaded texture immediately
  if (textureCache.has(url)) {
    const cached = textureCache.get(url)!
    // If callback provided, call it immediately (deferred)
    if (onLoad) {
      setTimeout(() => onLoad(cached), 0)
    }
    return cached
  }

  // Check if already loading - add to callback queue
  if (loadingUrls.has(url)) {
    if (onLoad) {
      const callbacks = loadCallbacks.get(url) || []
      callbacks.push(onLoad)
      loadCallbacks.set(url, callbacks)
    }
    // Return placeholder while loading
    return placeholderTexture
  }

  // Start new load
  loadingUrls.add(url)
  totalToLoad++

  // Initialize callback queue
  if (onLoad) {
    loadCallbacks.set(url, [onLoad])
  } else {
    loadCallbacks.set(url, [])
  }

  // Load texture asynchronously
  textureLoader.load(
    url,
    (loadedTexture) => {
      // Configure with high-quality settings
      configureTexture(loadedTexture, gl)

      // Cache the ACTUAL loaded texture
      textureCache.set(url, loadedTexture)
      loadingUrls.delete(url)

      // Update progress
      totalLoaded++
      if (progressCallback) {
        const progress = totalToLoad > 0 ? totalLoaded / totalToLoad : 1
        progressCallback(progress)
      }

      // Execute all queued callbacks (deferred to avoid render conflicts)
      const pendingCallbacks = loadCallbacks.get(url) || []
      loadCallbacks.delete(url)

      // Use setTimeout to defer callbacks outside of any render cycle
      setTimeout(() => {
        for (const cb of pendingCallbacks) {
          try {
            cb(loadedTexture)
          } catch (e) {
            console.error('Texture callback error:', e)
          }
        }
      }, 0)
    },
    undefined,
    (error) => {
      console.warn(`Failed to load texture: ${url}`, error)
      loadingUrls.delete(url)
      totalLoaded++

      // Still report progress on error
      if (progressCallback) {
        const progress = totalToLoad > 0 ? totalLoaded / totalToLoad : 1
        progressCallback(progress)
      }

      // Clean up callbacks
      loadCallbacks.delete(url)
    }
  )

  // Return placeholder while loading
  return placeholderTexture
}

/**
 * Set progress callback for loading tracking
 */
export function setProgressCallback(callback: ((progress: number) => void) | null): void {
  progressCallback = callback
}

/**
 * Get current loading progress (0-1)
 */
export function getLoadingProgress(): number {
  return totalToLoad > 0 ? totalLoaded / totalToLoad : 1
}

/**
 * Reset loading counters (call when navigating away)
 */
export function resetLoadingState(): void {
  totalToLoad = 0
  totalLoaded = 0
}

/**
 * Preload a list of URLs (for initial visible images)
 */
export function preloadTextures(urls: string[], gl?: THREE.WebGLRenderer): void {
  for (const url of urls) {
    getTexture(url, undefined, gl)
  }
}

/**
 * Clear texture cache (for memory management)
 */
export function clearTextureCache(): void {
  textureCache.forEach((texture) => {
    texture.dispose()
  })
  textureCache.clear()
  loadCallbacks.clear()
  loadingUrls.clear()
  resetLoadingState()
}

/**
 * Get cache stats for debugging
 */
export function getCacheStats(): { cached: number; loading: number; total: number; loaded: number } {
  return {
    cached: textureCache.size,
    loading: loadingUrls.size,
    total: totalToLoad,
    loaded: totalLoaded,
  }
}

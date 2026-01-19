/**
 * Constants for the infinite canvas experience
 * Inspired by Codrops infinite canvas tutorial
 * All measurements are in world units (Three.js units)
 */

// Chunk configuration (matching Codrops reference)
export const CHUNK_SIZE = 110 // World units per chunk
export const RENDER_DISTANCE = 2 // Chunks to render in each direction
export const CHUNK_FADE_MARGIN = 1 // Extra chunks for smooth fade
export const IMAGES_PER_CHUNK = 5 // Number of images spawned per chunk

// Camera configuration (PerspectiveCamera)
export const CAMERA_FOV = 60 // Field of view
export const CAMERA_NEAR = 1
export const CAMERA_FAR = 500
export const INITIAL_CAMERA_Z = 50 // Starting Z position

// Movement configuration
export const MAX_VELOCITY = 3.2 // Maximum movement speed
export const KEYBOARD_SPEED = 0.18 // Keyboard movement sensitivity
export const VELOCITY_LERP = 0.16 // Velocity interpolation factor
export const VELOCITY_DECAY = 0.9 // Velocity decay (inertia)
export const PAN_SPEED = 0.025 // Mouse drag sensitivity (matches Codrops)

// Fog configuration for depth fading
export const FOG_NEAR = 120 // Fog starts at this distance
export const FOG_FAR = 320 // Fully fogged at this distance
export const DEPTH_FADE_START = 140 // Start opacity fade
export const DEPTH_FADE_END = 260 // End opacity fade
export const INVIS_THRESHOLD = 0.01 // Below this opacity, skip rendering

// Image plane configuration
export const IMAGE_SIZE = { min: 12, max: 20 } // Image size range
export const IMAGE_SPACING = 0.3 // Minimum spacing factor

// Animation timing (matching site's luxury easing)
export const LUXURY_EASING = [0.76, 0, 0.24, 1] as const
export const FADE_DURATION = 0.5 // Seconds for fade animations
export const HOVER_SCALE = 1.08 // Scale on hover

// Color configuration
export const AMBIENT_LIGHT_INTENSITY = 1.5
export const BACKGROUND_COLOR_LIGHT = '#fafafa'
export const BACKGROUND_COLOR_DARK = '#0a0a0a'

// Chunk offset generation helper
export type ChunkOffset = {
  dx: number
  dy: number
  dz: number
  dist: number
}

// Pre-compute chunk offsets for performance
export const CHUNK_OFFSETS: ChunkOffset[] = (() => {
  const maxDist = RENDER_DISTANCE + CHUNK_FADE_MARGIN
  const offsets: ChunkOffset[] = []
  for (let dx = -maxDist; dx <= maxDist; dx++) {
    for (let dy = -maxDist; dy <= maxDist; dy++) {
      for (let dz = -maxDist; dz <= maxDist; dz++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz))
        if (dist > maxDist) continue
        offsets.push({ dx, dy, dz, dist })
      }
    }
  }
  return offsets
})()

/**
 * Chunk-based infinite canvas utilities
 * Uses seeded random for deterministic, reproducible layouts
 * Inspired by Codrops infinite canvas tutorial
 */

import * as THREE from 'three'
import {
  CHUNK_SIZE,
  IMAGES_PER_CHUNK,
  IMAGE_SIZE,
  CHUNK_OFFSETS,
  RENDER_DISTANCE,
  DEPTH_FADE_START,
  DEPTH_FADE_END,
  INVIS_THRESHOLD,
} from './constants'

/**
 * Simple string hash function
 */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

/**
 * Seeded random number generator (Mulberry32)
 * Produces consistent results for the same seed
 */
export function seededRandom(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Generate a unique seed from chunk coordinates
 */
export function chunkSeed(chunkX: number, chunkY: number, chunkZ: number): number {
  return hashString(`${chunkX},${chunkY},${chunkZ}`)
}

export interface PlaneData {
  id: string
  position: THREE.Vector3
  scale: THREE.Vector3
  mediaIndex: number
}

export interface ChunkData {
  key: string
  cx: number
  cy: number
  cz: number
}

// Cache for generated planes
const planeCache = new Map<string, PlaneData[]>()
const cacheOrder: string[] = []
const MAX_CACHE_SIZE = 256

function touchPlaneCache(key: string) {
  const idx = cacheOrder.indexOf(key)
  if (idx > -1) {
    cacheOrder.splice(idx, 1)
  }
  cacheOrder.push(key)
}

function evictPlaneCache() {
  while (planeCache.size > MAX_CACHE_SIZE && cacheOrder.length > 0) {
    const oldKey = cacheOrder.shift()
    if (oldKey) planeCache.delete(oldKey)
  }
}

/**
 * Generate plane positions for a specific chunk
 */
export function generateChunkPlanes(
  cx: number,
  cy: number,
  cz: number,
  totalMedia: number
): PlaneData[] {
  const seed = chunkSeed(cx, cy, cz)
  const random = seededRandom(seed)
  const planes: PlaneData[] = []

  for (let i = 0; i < IMAGES_PER_CHUNK; i++) {
    const id = `${cx}_${cy}_${cz}_${i}`

    // Random position within chunk
    const x = cx * CHUNK_SIZE + random() * CHUNK_SIZE
    const y = cy * CHUNK_SIZE + random() * CHUNK_SIZE
    const z = cz * CHUNK_SIZE + random() * CHUNK_SIZE

    // Random size within range
    const size = IMAGE_SIZE.min + random() * (IMAGE_SIZE.max - IMAGE_SIZE.min)

    // Deterministic media selection
    const mediaIndex = Math.floor(random() * totalMedia)

    planes.push({
      id,
      position: new THREE.Vector3(x, y, z),
      scale: new THREE.Vector3(size, size, 1),
      mediaIndex,
    })
  }

  return planes
}

/**
 * Cached version of generateChunkPlanes
 */
export function generateChunkPlanesCached(
  cx: number,
  cy: number,
  cz: number,
  totalMedia: number
): PlaneData[] {
  const key = `${cx},${cy},${cz}`

  if (planeCache.has(key)) {
    touchPlaneCache(key)
    return planeCache.get(key)!
  }

  const planes = generateChunkPlanes(cx, cy, cz, totalMedia)
  planeCache.set(key, planes)
  touchPlaneCache(key)
  evictPlaneCache()

  return planes
}

// Pending async chunk generations
const pendingChunks = new Map<string, Promise<PlaneData[]>>()

/**
 * Async version of generateChunkPlanesCached using requestIdleCallback
 * Defers computation to idle time for smoother pan/zoom
 */
export function generateChunkPlanesAsync(
  cx: number,
  cy: number,
  cz: number,
  totalMedia: number
): Promise<PlaneData[]> {
  const key = `${cx},${cy},${cz}`

  // Return cached immediately
  if (planeCache.has(key)) {
    touchPlaneCache(key)
    return Promise.resolve(planeCache.get(key)!)
  }

  // Return pending promise if already generating
  if (pendingChunks.has(key)) {
    return pendingChunks.get(key)!
  }

  // Create new async generation
  const promise = new Promise<PlaneData[]>((resolve) => {
    // Use requestIdleCallback if available, otherwise setTimeout
    const scheduleWork = typeof requestIdleCallback !== 'undefined'
      ? requestIdleCallback
      : (cb: () => void) => setTimeout(cb, 1)

    scheduleWork(() => {
      const planes = generateChunkPlanes(cx, cy, cz, totalMedia)
      planeCache.set(key, planes)
      touchPlaneCache(key)
      evictPlaneCache()
      pendingChunks.delete(key)
      resolve(planes)
    })
  })

  pendingChunks.set(key, promise)
  return promise
}

/**
 * Get visible chunks around a camera position
 */
export function getVisibleChunks(
  cameraX: number,
  cameraY: number,
  cameraZ: number
): ChunkData[] {
  const baseCx = Math.floor(cameraX / CHUNK_SIZE)
  const baseCy = Math.floor(cameraY / CHUNK_SIZE)
  const baseCz = Math.floor(cameraZ / CHUNK_SIZE)

  const chunks: ChunkData[] = []

  for (const offset of CHUNK_OFFSETS) {
    if (offset.dist > RENDER_DISTANCE + 1) continue

    const cx = baseCx + offset.dx
    const cy = baseCy + offset.dy
    const cz = baseCz + offset.dz

    chunks.push({
      key: `${cx},${cy},${cz}`,
      cx,
      cy,
      cz,
    })
  }

  return chunks
}

/**
 * Calculate opacity based on distance from camera (depth fade)
 */
export function calculateDepthOpacity(
  planeZ: number,
  cameraZ: number
): number {
  const distance = Math.abs(planeZ - cameraZ)

  if (distance <= DEPTH_FADE_START) return 1
  if (distance >= DEPTH_FADE_END) return 0

  const t = (distance - DEPTH_FADE_START) / (DEPTH_FADE_END - DEPTH_FADE_START)
  return 1 - t
}

/**
 * Check if plane should be visible
 */
export function isPlaneVisible(opacity: number): boolean {
  return opacity > INVIS_THRESHOLD
}

/**
 * Generate a chunk key for Map/Set storage
 */
export function chunkKey(x: number, y: number, z: number): string {
  return `${x},${y},${z}`
}

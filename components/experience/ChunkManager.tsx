'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { RENDER_DISTANCE } from '@/lib/canvas/constants'
import {
  generateChunkPlanesCached,
  getVisibleChunks,
  type PlaneData,
  type ChunkData,
} from '@/lib/canvas/chunk-utils'
import {
  getAllCanvasArtworks,
  getArtworkByIndex,
  type CanvasArtwork,
} from '@/lib/canvas/image-loader'
import { ImagePlane } from './ImagePlane'

// Throttle configuration (matching Codrops reference)
const MIN_THROTTLE_MS = 100
const MAX_THROTTLE_MS = 400
const ZOOM_SPEED_THRESHOLD = 5 // Z units per second to trigger throttling

interface ChunkManagerProps {
  cameraPosition: THREE.Vector3
  onArtworkClick: (artwork: CanvasArtwork, index: number) => void
}

interface ActiveChunk {
  key: string
  planes: PlaneData[]
}

export function ChunkManager({ cameraPosition, onArtworkClick }: ChunkManagerProps) {
  const [activeChunks, setActiveChunks] = useState<Map<string, ActiveChunk>>(new Map())

  // Throttling state for zoom
  const lastUpdateRef = useRef(0)
  const lastZRef = useRef(cameraPosition.z)
  const throttleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load all artworks once
  const artworks = useMemo(() => getAllCanvasArtworks(), [])

  // Update visible chunks when camera moves (with zoom throttling)
  useEffect(() => {
    const now = Date.now()
    const zDelta = Math.abs(cameraPosition.z - lastZRef.current)
    const timeDelta = now - lastUpdateRef.current

    // Calculate zoom speed (Z units per second)
    const zoomSpeed = timeDelta > 0 ? (zDelta / timeDelta) * 1000 : 0

    // Adaptive throttle: slower updates during fast zoom
    const throttleMs = zoomSpeed > ZOOM_SPEED_THRESHOLD
      ? Math.min(MAX_THROTTLE_MS, MIN_THROTTLE_MS + zoomSpeed * 10)
      : MIN_THROTTLE_MS

    // Clear any pending throttled update
    if (throttleTimeoutRef.current) {
      clearTimeout(throttleTimeoutRef.current)
      throttleTimeoutRef.current = null
    }

    const updateChunks = () => {
      const visibleChunkCoords = getVisibleChunks(
        cameraPosition.x,
        cameraPosition.y,
        cameraPosition.z
      )

      const newChunks = new Map<string, ActiveChunk>()

      for (const coord of visibleChunkCoords) {
        const { key, cx, cy, cz } = coord

        // Reuse existing chunk data if available
        if (activeChunks.has(key)) {
          newChunks.set(key, activeChunks.get(key)!)
        } else {
          // Generate new chunk planes
          const planes = generateChunkPlanesCached(cx, cy, cz, artworks.length)
          newChunks.set(key, { key, planes })
        }
      }

      // Only update if chunks changed
      if (newChunks.size !== activeChunks.size ||
          [...newChunks.keys()].some(k => !activeChunks.has(k))) {
        setActiveChunks(newChunks)
      }

      lastUpdateRef.current = Date.now()
      lastZRef.current = cameraPosition.z
    }

    // Throttle updates during fast zoom, immediate update otherwise
    if (timeDelta < throttleMs && zoomSpeed > ZOOM_SPEED_THRESHOLD) {
      throttleTimeoutRef.current = setTimeout(updateChunks, throttleMs - timeDelta)
    } else {
      updateChunks()
    }

    return () => {
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current)
      }
    }
  }, [cameraPosition.x, cameraPosition.y, cameraPosition.z, artworks.length, activeChunks])

  // Flatten all planes from active chunks
  const allPlanes = useMemo(() => {
    const planes: Array<PlaneData & { artwork: CanvasArtwork }> = []

    activeChunks.forEach((chunk) => {
      for (const plane of chunk.planes) {
        const artwork = getArtworkByIndex(plane.mediaIndex, artworks)
        planes.push({ ...plane, artwork })
      }
    })

    return planes
  }, [activeChunks, artworks])

  const handleArtworkClick = (artwork: CanvasArtwork) => {
    const index = artworks.findIndex((a) => a.id === artwork.id)
    onArtworkClick(artwork, index >= 0 ? index : 0)
  }

  return (
    <group>
      {allPlanes.map((plane) => (
        <ImagePlane
          key={plane.id}
          artwork={plane.artwork}
          position={plane.position}
          scale={plane.scale}
          onClick={handleArtworkClick}
        />
      ))}
    </group>
  )
}

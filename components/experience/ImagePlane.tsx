'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import {
  DEPTH_FADE_START,
  DEPTH_FADE_END,
  INVIS_THRESHOLD,
  HOVER_SCALE,
  RENDER_DISTANCE,
  CHUNK_SIZE,
} from '@/lib/canvas/constants'
import { getTexture } from '@/lib/canvas/texture-manager'
import type { CanvasArtwork } from '@/lib/canvas/image-loader'

// Shared geometry for all image planes (memory optimization)
const SHARED_PLANE_GEOMETRY = new THREE.PlaneGeometry(1, 1)

interface ImagePlaneProps {
  artwork: CanvasArtwork
  position: THREE.Vector3
  scale: THREE.Vector3
  onClick: (artwork: CanvasArtwork) => void
}

export function ImagePlane({ artwork, position, scale, onClick }: ImagePlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const frameCountRef = useRef(0)
  const targetScaleRef = useRef(new THREE.Vector3())
  const [hovered, setHovered] = useState(false)
  const [isTextureReady, setIsTextureReady] = useState(false)
  const { camera, gl } = useThree()

  // Create material once (without texture initially)
  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  }, [])

  // Load texture using custom TextureManager (non-blocking)
  useEffect(() => {
    // getTexture returns cached texture immediately if available,
    // or placeholder while loading. Callback fires when ready.
    const texture = getTexture(
      artwork.imageUrl,
      (loadedTexture) => {
        // Callback fires when texture is loaded (or immediately if cached)
        material.map = loadedTexture
        material.needsUpdate = true
        setIsTextureReady(true)
      },
      gl
    )

    // If we got a cached texture (not placeholder), use it immediately
    // Placeholder has no image, cached textures do
    if (texture.image) {
      material.map = texture
      material.needsUpdate = true
      setIsTextureReady(true)
    }

    return () => {
      // Cleanup: don't dispose texture (it's cached), just clear reference
      material.map = null
      setIsTextureReady(false)
    }
  }, [artwork.imageUrl, material, gl])

  // Update opacity based on distance from camera (depth fade)
  useFrame(() => {
    if (!meshRef.current) return

    const mesh = meshRef.current

    // Frame skipping for invisible planes (performance optimization)
    frameCountRef.current++
    if (!mesh.visible && (frameCountRef.current & 1) === 0) return

    const meshPosition = mesh.position
    const cameraPosition = camera.position

    // Calculate 3D distance for depth fade
    const distance = meshPosition.distanceTo(cameraPosition)

    // Dual fade system (matching Codrops reference):
    // 1. Grid distance fade (based on chunk distance)
    const gridDist = Math.max(
      Math.abs(meshPosition.x - cameraPosition.x),
      Math.abs(meshPosition.y - cameraPosition.y),
      Math.abs(meshPosition.z - cameraPosition.z)
    ) / CHUNK_SIZE
    const gridFade = Math.max(0, 1 - (gridDist - RENDER_DISTANCE) / 1.5)

    // 2. Depth fade with squared falloff for smoother transition
    let depthFade = 1
    if (distance > DEPTH_FADE_START) {
      const t = Math.min(1, (distance - DEPTH_FADE_START) / (DEPTH_FADE_END - DEPTH_FADE_START))
      depthFade = 1 - (t * t) // Squared falloff
    }

    // Combine fades, but only show if texture is ready
    const targetOpacity = isTextureReady ? Math.min(gridFade, depthFade) : 0

    // Smooth opacity lerp for fade-in effect
    const currentOpacity = material.opacity
    const newOpacity = currentOpacity + (targetOpacity - currentOpacity) * 0.1

    // Skip rendering if nearly invisible
    mesh.visible = newOpacity > INVIS_THRESHOLD

    // Only update material opacity when it changes significantly
    if (Math.abs(material.opacity - newOpacity) > 0.005) {
      material.opacity = newOpacity
      // Dynamic depthWrite: only enabled when fully opaque (GPU optimization)
      material.depthWrite = newOpacity > 0.99
    }

    // Smooth scale on hover (reuse Vector3 to avoid GC)
    const targetScale = hovered ? HOVER_SCALE : 1
    targetScaleRef.current.set(scale.x * targetScale, scale.y * targetScale, 1)
    mesh.scale.lerp(targetScaleRef.current, 0.1)
  })

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setHovered(false)
    document.body.style.cursor = 'default'
  }

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onClick(artwork)
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={[scale.x, scale.y, 1]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      material={material}
      geometry={SHARED_PLANE_GEOMETRY}
    />
  )
}

// Shared fallback material (no longer needed with new pattern, but keeping for compatibility)
const FALLBACK_MATERIAL = new THREE.MeshBasicMaterial({
  color: '#333',
  transparent: true,
  opacity: 0.3,
})

// Fallback component for when texture is loading (optional, may not be needed)
export function ImagePlaneFallback({
  position,
  scale,
}: {
  position: THREE.Vector3
  scale: THREE.Vector3
}) {
  return (
    <mesh
      position={position}
      scale={[scale.x, scale.y, 1]}
      geometry={SHARED_PLANE_GEOMETRY}
      material={FALLBACK_MATERIAL}
    />
  )
}

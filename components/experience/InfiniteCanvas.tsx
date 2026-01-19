'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { useTheme } from 'next-themes'
import {
  CAMERA_FOV,
  CAMERA_NEAR,
  CAMERA_FAR,
  INITIAL_CAMERA_Z,
  FOG_NEAR,
  FOG_FAR,
  AMBIENT_LIGHT_INTENSITY,
  BACKGROUND_COLOR_LIGHT,
  BACKGROUND_COLOR_DARK,
} from '@/lib/canvas/constants'
import { setProgressCallback, resetLoadingState } from '@/lib/canvas/texture-manager'
import { CameraController } from './CameraController'
import { ChunkManager } from './ChunkManager'
import type { CanvasArtwork } from '@/lib/canvas/image-loader'

interface InfiniteCanvasProps {
  onArtworkSelect: (artwork: CanvasArtwork, index: number) => void
  onProgress?: (progress: number) => void
}

export function InfiniteCanvas({ onArtworkSelect, onProgress }: InfiniteCanvasProps) {
  const [cameraPosition, setCameraPosition] = useState(new THREE.Vector3(0, 0, INITIAL_CAMERA_Z))
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  const { resolvedTheme } = useTheme()
  const maxProgressRef = useRef(0)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Set up progress tracking via TextureManager (non-blocking, no React errors)
  useEffect(() => {
    // Reset loading state on mount
    resetLoadingState()

    // Set up progress callback - only increases, never decreases
    setProgressCallback((progress) => {
      if (progress > maxProgressRef.current) {
        maxProgressRef.current = progress
        onProgress?.(progress)
      }
    })

    return () => {
      // Cleanup: remove progress callback
      setProgressCallback(() => {})
    }
  }, [onProgress])

  const handleCameraMove = useCallback((position: THREE.Vector3) => {
    setCameraPosition(position.clone())
  }, [])

  const handleArtworkClick = useCallback((artwork: CanvasArtwork, index: number) => {
    onArtworkSelect(artwork, index)
  }, [onArtworkSelect])

  const backgroundColor = resolvedTheme === 'dark'
    ? BACKGROUND_COLOR_DARK
    : BACKGROUND_COLOR_LIGHT

  const fogColor = backgroundColor

  return (
    <div className="h-full w-full" suppressHydrationWarning>
      <Canvas
        gl={{
          antialias: false, // Disabled for transparent objects (performance)
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, typeof window !== 'undefined' && 'ontouchstart' in window ? 1.25 : 1.5]} // Cap DPR: 1.25 touch, 1.5 desktop
        camera={{
          fov: CAMERA_FOV,
          near: CAMERA_NEAR,
          far: CAMERA_FAR,
          position: [0, 0, INITIAL_CAMERA_Z],
        }}
        style={{ background: backgroundColor }}
        onCreated={({ gl }) => {
          gl.setClearColor(backgroundColor)
        }}
      >
        {/* Fog for depth fading effect */}
        <fog attach="fog" args={[fogColor, FOG_NEAR, FOG_FAR]} />

        <ambientLight intensity={AMBIENT_LIGHT_INTENSITY} />

        <CameraController
          onCameraMove={handleCameraMove}
          enabled={!isReducedMotion}
        />

        <ChunkManager
          cameraPosition={cameraPosition}
          onArtworkClick={handleArtworkClick}
        />
      </Canvas>
    </div>
  )
}

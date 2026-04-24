'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LightboxModal } from '@/components/lightbox-modal'
import { OnboardingOverlay } from '@/components/experience/OnboardingOverlay'
import { getAllCanvasArtworks, type CanvasArtwork } from '@/lib/canvas/image-loader'
import { useLanguage } from '@/lib/i18n'
import type { Artwork } from '@/lib/types/artwork'

// Dynamic import for InfiniteCanvas to avoid SSR issues with Three.js
const InfiniteCanvas = dynamic(
  () => import('@/components/experience/InfiniteCanvas').then(mod => ({ default: mod.InfiniteCanvas })),
  { ssr: false }
)

// Minimum time to show loader for polished experience
const MIN_LOADER_DURATION = 1500

// Smooth lerp-based progress bar (matching Codrops reference)
function PageLoader({
  isLoading,
  progress
}: {
  isLoading: boolean
  progress: number
}) {
  const visualProgressRef = useRef(0)
  const startTimeRef = useRef(Date.now())
  const [visualProgress, setVisualProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    startTimeRef.current = Date.now()
  }, [])

  useEffect(() => {
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current
      const minTimeElapsed = elapsed >= MIN_LOADER_DURATION

      // Smooth lerp animation (matching Codrops: 0.08 factor)
      const diff = progress - visualProgressRef.current
      if (Math.abs(diff) > 0.001) {
        // Accelerate when catching up, smooth otherwise
        const lerpFactor = diff > 0.1 ? 0.08 : 0.04
        visualProgressRef.current += diff * lerpFactor
      } else {
        visualProgressRef.current = progress
      }

      setVisualProgress(visualProgressRef.current)

      // Dismiss conditions: minTime elapsed + 100% progress + visual caught up
      if (minTimeElapsed && progress >= 1 && visualProgressRef.current > 0.995) {
        setIsVisible(false)
      } else {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [progress])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          <div className="text-center w-full max-w-52 px-8">
            {/* Title text */}
            <h2 className="font-serif text-xl md:text-2xl text-foreground mb-8 tracking-wide">
              Explore Art
            </h2>
            {/* Progress bar container */}
            <div className="mb-4 h-1 w-full rounded-full bg-foreground/10 overflow-hidden">
              <div
                className="h-full bg-foreground rounded-full origin-left transition-none"
                style={{
                  transform: `scaleX(${visualProgress})`,
                }}
              />
            </div>
            <p className="font-serif text-sm text-muted-foreground tracking-wide">
              {Math.round(visualProgress * 100)}%
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function ExperiencePage() {
  const { t } = useLanguage()
  const [selectedArtwork, setSelectedArtwork] = useState<{
    artwork: CanvasArtwork
    index: number
  } | null>(null)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const allArtworks = getAllCanvasArtworks()

  const handleArtworkSelect = useCallback((artwork: CanvasArtwork, index: number) => {
    setSelectedArtwork({ artwork, index })
  }, [])

  const handleProgress = useCallback((progress: number) => {
    setLoadingProgress(progress)
    if (progress >= 1) {
      setIsLoading(false)
    }
  }, [])

  const handleCloseLightbox = useCallback(() => {
    setSelectedArtwork(null)
  }, [])

  // Convert CanvasArtwork[] to Artwork[] for lightbox
  const artworksForLightbox: Artwork[] = allArtworks.map((a) => ({
    id: a.id,
    filename: a.filename,
    title: a.title,
    year: a.year,
    medium: a.medium,
    size: a.size,
    detailImages: a.detailImages,
  }))

  return (
    <div className="fixed inset-0 bg-background">
      {/* Mobile not supported overlay */}
      <div className="md:hidden fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-8 text-center">
        <p className="font-serif text-2xl mb-4">Infinite Canvas</p>
        <p className="font-sans text-sm text-muted-foreground uppercase tracking-widest mb-8">
          This experience is designed for desktop
        </p>
        <Link
          href="/"
          className="font-sans text-xs uppercase tracking-widest underline underline-offset-4 hover:opacity-60 transition-opacity"
        >
          Back to gallery
        </Link>
      </div>
      {/* Loading overlay */}
      <PageLoader isLoading={isLoading} progress={loadingProgress} />

      {/* Navigation header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 md:p-6"
      >
        <Link
          href="/#work"
          className="no-underline flex items-center gap-2 font-sans text-sm uppercase tracking-widest transition-opacity hover:opacity-60"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          <span>{t.work.backToGallery}</span>
        </Link>

        <h1 className="font-serif text-lg md:text-xl">
          Infinite Canvas
        </h1>
      </motion.header>

      {/* Persistent gesture reminder — shown once loading completes, always visible */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ delay: isLoading ? 0 : 0.4, duration: 0.5 }}
        className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 z-10 pointer-events-none"
      >
        <p className="font-sans text-xs text-muted-foreground uppercase tracking-widest">
          Drag · Scroll · Click · WASD
        </p>
      </motion.div>

      {/* Canvas container */}
      <InfiniteCanvas onArtworkSelect={handleArtworkSelect} onProgress={handleProgress} />

      {/* First-visit onboarding — only shows once per visitor */}
      {!isLoading && <OnboardingOverlay />}

      {/* Lightbox modal */}
      {selectedArtwork && (
        <LightboxModal
          artworks={artworksForLightbox}
          initialIndex={selectedArtwork.index}
          isOpen={true}
          onClose={handleCloseLightbox}
          categoryKey={selectedArtwork.artwork.categoryKey}
        />
      )}
    </div>
  )
}

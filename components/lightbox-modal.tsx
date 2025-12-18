'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import type { Artwork, CategoryKey } from '@/lib/types/artwork'
import { getImagePath, getBlurDataUrl } from '@/lib/utils/image-paths'

interface LightboxModalProps {
  artworks: Artwork[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
  categoryKey: CategoryKey
}

export function LightboxModal({
  artworks,
  initialIndex,
  isOpen,
  onClose,
  categoryKey,
}: LightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [zoom, setZoom] = useState(1)
  const [selectedDetailIndex, setSelectedDetailIndex] = useState<number | null>(null)
  const { t } = useLanguage()

  // Reset states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      setZoom(1)
      setSelectedDetailIndex(null)
    }
  }, [isOpen, initialIndex])

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') handlePrevious()
      if (e.key === 'ArrowRight') handleNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex])

  const handleNext = () => {
    if (selectedDetailIndex !== null) {
      setSelectedDetailIndex(null)
    } else {
      setCurrentIndex(prev => (prev + 1) % artworks.length)
      setZoom(1)
    }
  }

  const handlePrevious = () => {
    if (selectedDetailIndex !== null) {
      setSelectedDetailIndex(null)
    } else {
      setCurrentIndex(prev => (prev - 1 + artworks.length) % artworks.length)
      setZoom(1)
    }
  }

  const currentArtwork = artworks[currentIndex]
  const isShowingDetail = selectedDetailIndex !== null && currentArtwork.detailImages
  const displayedImage = isShowingDetail
    ? currentArtwork.detailImages![selectedDetailIndex]
    : currentArtwork.filename

  return (
    <AnimatePresence>
      {isOpen && currentArtwork && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col bg-background"
          role="dialog"
          aria-modal="true"
          aria-label="Artwork lightbox"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="font-sans text-xs uppercase tracking-widest md:text-sm">
              {isShowingDetail ? (
                <>
                  {t.work.detailImages} • {selectedDetailIndex! + 1} / {currentArtwork.detailImages!.length}
                </>
              ) : (
                <>
                  {currentArtwork.title}
                  {currentArtwork.year && <>, {currentArtwork.year}</> }
                  {currentArtwork.medium && <> | {currentArtwork.medium}</> }
                  {currentArtwork.size && <> | {currentArtwork.size}</> }
                </>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 transition-opacity hover:opacity-60"
              aria-label="Close lightbox"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Main image area */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden p-8">
            {/* Navigation arrows */}
            {!isShowingDetail && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute start-4 z-10 p-2 transition-opacity hover:opacity-60 md:start-8"
                  aria-label="Previous artwork"
                >
                  <ChevronLeft className="h-8 w-8 rtl:rotate-180" strokeWidth={1} />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute end-4 z-10 p-2 transition-opacity hover:opacity-60 md:end-8"
                  aria-label="Next artwork"
                >
                  <ChevronRight className="h-8 w-8 rtl:rotate-180" strokeWidth={1} />
                </button>
              </>
            )}

            {/* Image display */}
            <motion.div
              key={`${currentIndex}-${selectedDetailIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative max-h-full max-w-full overflow-auto"
            >
              <img
                src={getImagePath(categoryKey, displayedImage)}
                alt={isShowingDetail ? `Detail ${selectedDetailIndex! + 1}` : currentArtwork.title}
                decoding="async"
                className="max-h-[70vh] w-auto object-contain transition-transform duration-300"
                style={{ transform: `scale(${zoom})` }}
                draggable={false}
              />
            </motion.div>
          </div>

          {/* Zoom controls and detail images section */}
          <div className="space-y-4 border-t border-border px-6 py-4">
            {/* Zoom controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setZoom(z => Math.max(1, z - 0.5))}
                className="p-2 transition-opacity hover:opacity-60"
                aria-label="Zoom out"
              >
                <ZoomOut className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <span className="font-sans text-xs uppercase tracking-widest">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(z => Math.min(3, z + 0.5))}
                className="p-2 transition-opacity hover:opacity-60"
                aria-label="Zoom in"
              >
                <ZoomIn className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Detail images thumbnails */}
            {currentArtwork.detailImages && !isShowingDetail && (
              <div className="flex flex-wrap gap-3 justify-center pt-4">
                {currentArtwork.detailImages.map((detailPath, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedDetailIndex(idx)
                      setZoom(1)
                    }}
                    className="relative h-20 w-20 overflow-hidden border-2 border-border transition-colors hover:border-foreground"
                    aria-label={`View detail ${idx + 1}`}
                  >
                    <Image
                      src={getImagePath(categoryKey, detailPath)}
                      alt={`Detail ${idx + 1}`}
                      fill
                      sizes="80px"
                      placeholder="blur"
                      blurDataURL={getBlurDataUrl()}
                      className="object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}

            {/* Back button when viewing details */}
            {isShowingDetail && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setSelectedDetailIndex(null)}
                  className="px-4 py-2 font-sans text-sm uppercase tracking-widest transition-opacity hover:opacity-60"
                >
                  ← {t.work.mainImage}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { getLocalizedText, formatSize } from '@/lib/utils'
import type { Artwork, CategoryKey } from '@/lib/types/artwork'
import { getImagePath, getBlurDataUrl } from '@/lib/utils/image-paths'

interface LightboxModalProps {
  artworks: Artwork[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
  categoryKey: CategoryKey
  onIndexChange?: (index: number) => void
}

// Arrows live in the dark gutter outside the image, not over it.
// Subtle by default, gain opacity on hover/focus.
const navigationButtonClassName =
  'hidden md:flex z-10 h-10 w-10 items-center justify-center rounded-full text-foreground/50 transition-all duration-300 hover:text-foreground hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:text-foreground cursor-pointer'

const counterButtonClassName =
  'flex h-11 w-11 md:h-7 md:w-7 items-center justify-center rounded-full text-foreground/40 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:text-foreground cursor-pointer'

export function LightboxModal({
  artworks,
  initialIndex,
  isOpen,
  onClose,
  categoryKey,
  onIndexChange,
}: LightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [zoom, setZoom] = useState(1)
  const [selectedDetailIndex, setSelectedDetailIndex] = useState<number | null>(null)
  const [showKeyboardHint, setShowKeyboardHint] = useState(false)
  const { t, language } = useLanguage()
  const reducedMotion = useReducedMotion()

  // Reset states and lock body scroll when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      setZoom(1)
      setSelectedDetailIndex(null)
      document.body.style.overflow = 'hidden'

      // Show keyboard-shortcut hint on first-ever open; auto-dismiss after 3s.
      if (typeof window !== 'undefined' && !localStorage.getItem('lightbox-hint-seen')) {
        setShowKeyboardHint(true)
        localStorage.setItem('lightbox-hint-seen', '1')
        const timer = setTimeout(() => setShowKeyboardHint(false), 3000)
        return () => {
          document.body.style.overflow = ''
          clearTimeout(timer)
        }
      }
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, initialIndex])

  // Notify parent when the active artwork changes (for URL hash sync)
  useEffect(() => {
    if (isOpen) onIndexChange?.(currentIndex)
  }, [currentIndex, isOpen, onIndexChange])

  const handleNext = useCallback(() => {
    if (selectedDetailIndex !== null) {
      setSelectedDetailIndex(null)
    } else {
      setCurrentIndex(prev => (prev + 1) % artworks.length)
      setZoom(1)
    }
  }, [artworks.length, selectedDetailIndex])

  const handlePrevious = useCallback(() => {
    if (selectedDetailIndex !== null) {
      setSelectedDetailIndex(null)
    } else {
      setCurrentIndex(prev => (prev - 1 + artworks.length) % artworks.length)
      setZoom(1)
    }
  }, [artworks.length, selectedDetailIndex])

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const SWIPE_THRESHOLD = 60
      const VELOCITY_THRESHOLD = 400
      const offset = info.offset.x
      const velocity = info.velocity.x

      if (offset > SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
        handlePrevious()
      } else if (offset < -SWIPE_THRESHOLD || velocity < -VELOCITY_THRESHOLD) {
        handleNext()
      }
    },
    [handleNext, handlePrevious],
  )

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
  }, [handleNext, handlePrevious, isOpen, onClose])

  const currentArtwork = artworks[currentIndex]
  const isShowingDetail = selectedDetailIndex !== null && currentArtwork.detailImages
  const displayedImage = isShowingDetail
    ? currentArtwork.detailImages![selectedDetailIndex]
    : currentArtwork.filename

  if (typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && currentArtwork && (
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.3 }}
          className="fixed inset-0 z-50 flex flex-col bg-background"
          role="dialog"
          aria-modal="true"
          aria-label="Artwork lightbox"
        >
          {/* Header */}
          <div className="relative flex items-center justify-center border-b border-border px-14 py-4">
            <div className="flex min-w-0 max-w-[min(90%,40rem)] flex-col items-center gap-0.5 text-center">
              {isShowingDetail ? (
                <span className="truncate font-sans text-xs uppercase tracking-widest md:text-sm">
                  {t.work.detailImages} • {selectedDetailIndex! + 1} / {currentArtwork.detailImages!.length}
                </span>
              ) : (
                <>
                  <span className="truncate font-serif text-lg tracking-wide md:text-xl">
                    {getLocalizedText(currentArtwork.title, language)}
                  </span>
                  {(currentArtwork.year || currentArtwork.medium || currentArtwork.size) && (
                    <span className="truncate font-sans text-sm text-muted-foreground tabular-nums md:text-base">
                      {[
                        currentArtwork.year,
                        getLocalizedText(currentArtwork.medium, language),
                        formatSize(currentArtwork.size, language),
                      ].filter(Boolean).join(' | ')}
                    </span>
                  )}
                </>
              )}
            </div>
            <button
              onClick={onClose}
              className="absolute end-4 p-2 transition-opacity hover:opacity-60 cursor-pointer"
              aria-label="Close lightbox"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Main image area — arrows live in the dark gutter on the sides, never on the image */}
          <div className="relative flex min-h-0 flex-1 items-stretch justify-center overflow-hidden">
            {/* Left gutter (desktop arrow) */}
            {!isShowingDetail && artworks.length > 1 && (
              <div className="hidden md:flex w-16 lg:w-20 flex-shrink-0 items-center justify-center">
                <button
                  onClick={handlePrevious}
                  className={navigationButtonClassName}
                  aria-label={language === 'he' ? 'יצירה קודמת' : 'Previous artwork'}
                >
                  <ChevronLeft className="h-7 w-7 rtl:rotate-180" strokeWidth={1.25} aria-hidden="true" />
                </button>
              </div>
            )}

            {/* Image stage — swipeable on touch */}
            <motion.div
              key={`${currentIndex}-${selectedDetailIndex}`}
              initial={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: reducedMotion ? 0.01 : 0.3 }}
              drag={reducedMotion ? false : !isShowingDetail && artworks.length > 1 && zoom === 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={reducedMotion ? 0 : 0.18}
              onDragEnd={handleDragEnd}
              className="relative flex-1 min-w-0 max-w-[75rem] overflow-hidden p-2 md:p-8 touch-pan-y"
            >
              <Image
                src={getImagePath(categoryKey, displayedImage)}
                alt={
                  isShowingDetail
                    ? `${getLocalizedText(currentArtwork.title, language) || 'Untitled'} — detail ${
                        selectedDetailIndex! + 1
                      }`
                    : `${getLocalizedText(currentArtwork.title, language) || 'Untitled'} by Tali Assa${
                        currentArtwork.year ? `, ${currentArtwork.year}` : ''
                      }`
                }
                fill
                sizes="(min-width: 1280px) 1200px, 90vw"
                placeholder="blur"
                blurDataURL={getBlurDataUrl()}
                priority
                className="select-none object-contain transition-transform duration-300"
                style={{ transform: `scale(${zoom})` }}
                draggable={false}
              />

            </motion.div>

            {/* Right gutter (desktop arrow) */}
            {!isShowingDetail && artworks.length > 1 && (
              <div className="hidden md:flex w-16 lg:w-20 flex-shrink-0 items-center justify-center">
                <button
                  onClick={handleNext}
                  className={navigationButtonClassName}
                  aria-label={language === 'he' ? 'יצירה הבאה' : 'Next artwork'}
                >
                  <ChevronRight className="h-7 w-7 rtl:rotate-180" strokeWidth={1.25} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          {/* Zoom controls and detail images section */}
          <div className="space-y-3 border-t border-border px-6 py-4">
            {/* Persistent navigation indicator — always visible, tappable */}
            {!isShowingDetail && artworks.length > 1 && (
              <div className="flex items-center justify-center gap-3 md:gap-2">
                <button
                  onClick={handlePrevious}
                  className={counterButtonClassName}
                  aria-label={language === 'he' ? 'יצירה קודמת' : 'Previous artwork'}
                >
                  <ChevronLeft className="h-6 w-6 md:h-4 md:w-4 rtl:rotate-180" strokeWidth={1.25} aria-hidden="true" />
                </button>
                <span
                  className="font-sans text-[11px] uppercase tracking-widest text-foreground/50 tabular-nums select-none"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {currentIndex + 1} / {artworks.length}
                </span>
                <button
                  onClick={handleNext}
                  className={counterButtonClassName}
                  aria-label={language === 'he' ? 'יצירה הבאה' : 'Next artwork'}
                >
                  <ChevronRight className="h-6 w-6 md:h-4 md:w-4 rtl:rotate-180" strokeWidth={1.25} aria-hidden="true" />
                </button>
              </div>
            )}

            {/* Zoom controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setZoom(z => Math.max(1, z - 0.5))}
                className="p-2 transition-opacity hover:opacity-60 cursor-pointer"
                aria-label="Zoom out"
              >
                <ZoomOut className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <span className="font-sans text-xs uppercase tracking-widest">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(z => Math.min(3, z + 0.5))}
                className="p-2 transition-opacity hover:opacity-60 cursor-pointer"
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
                    whileHover={reducedMotion ? {} : { scale: 1.05 }}
                    whileTap={reducedMotion ? {} : { scale: 0.95 }}
                    onClick={() => {
                      setSelectedDetailIndex(idx)
                      setZoom(1)
                    }}
                    className="relative h-20 w-20 overflow-hidden border-2 border-border transition-colors hover:border-foreground cursor-pointer"
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
                  className="px-4 py-2 font-sans text-sm uppercase tracking-widest transition-opacity hover:opacity-60 cursor-pointer"
                >
                  ← {t.work.mainImage}
                </button>
              </div>
            )}
          </div>

          {/* Keyboard-shortcut hint — shown once per visitor, 3-second auto-dismiss */}
          <AnimatePresence>
            {showKeyboardHint && (
              <motion.div
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                transition={{ duration: reducedMotion ? 0.01 : 0.4, ease: 'easeOut' }}
                className="pointer-events-none absolute bottom-28 left-1/2 -translate-x-1/2 rounded-full border border-border bg-background/90 px-4 py-2 font-sans text-[11px] uppercase tracking-widest text-muted-foreground backdrop-blur-sm"
                aria-hidden="true"
              >
                <span className="tabular-nums">← →</span>
                <span className="mx-3 opacity-40">·</span>
                <span>Esc</span>
                <span className="mx-3 opacity-40">·</span>
                <span className="tabular-nums">+/−</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/i18n'
import { getLocalizedText, formatSize } from '@/lib/utils'
import { getImagePath } from '@/lib/utils/image-paths'
import type { CategoryData } from '@/lib/types/artwork'
import { LightboxModal } from '@/components/lightbox-modal'
import { ChevronLeft } from 'lucide-react'
import { getBlurDataUrl } from '@/lib/utils/image-paths'

interface CategoryPageContentProps {
  categoryData: CategoryData
}

export function CategoryPageContent({ categoryData }: CategoryPageContentProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const { t, language } = useLanguage()

  const categoryTitle = t.work.categories[categoryData.key]

  return (
    <>
      <div className="min-h-screen bg-background px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header with back button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Link
              href="/#work"
              className="mb-8 inline-flex items-center gap-2 font-sans text-sm uppercase tracking-widest transition-opacity hover:opacity-60 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" strokeWidth={1.5} />
              {t.work.backToGallery}
            </Link>
            <h1 className="font-serif text-4xl tracking-tight md:text-5xl">{categoryTitle}</h1>
            <p className="mt-4 font-sans text-sm text-muted-foreground">
              {categoryData.artworks.length} {categoryData.artworks.length === 1 ? t.work.artwork : t.work.artworks}
            </p>
          </motion.div>

          {/* Image grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {categoryData.artworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col"
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedIndex(index)
                    setIsLightboxOpen(true)
                  }}
                  aria-label={`${t.work.viewDetails}: ${getLocalizedText(artwork.title, language)}`}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-muted cursor-pointer"
                >
                  <Image
                    src={getImagePath(categoryData.key, artwork.filename)}
                    alt={getLocalizedText(artwork.title, language)}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    placeholder="blur"
                    blurDataURL={getBlurDataUrl()}
                    className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-70"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="bg-background/90 px-3 py-2 font-sans text-xs uppercase tracking-widest">
                      {t.work.viewDetails}
                    </span>
                  </div>
                </button>
                <div className="mt-3 space-y-0.5 text-center">
                  <p className="font-serif text-sm tracking-wide">
                    {getLocalizedText(artwork.title, language)}
                  </p>
                  {(artwork.year || artwork.medium || artwork.size) && (
                    <p className="font-sans text-xs text-muted-foreground">
                      {[
                        artwork.year,
                        getLocalizedText(artwork.medium, language),
                        formatSize(artwork.size, language),
                      ].filter(Boolean).join(' | ')}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox modal */}
      <LightboxModal
        artworks={categoryData.artworks}
        initialIndex={selectedIndex ?? 0}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        categoryKey={categoryData.key}
      />
    </>
  )
}

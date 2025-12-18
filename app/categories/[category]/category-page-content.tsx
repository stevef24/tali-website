'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/i18n'
import { getImagePath } from '@/lib/utils/image-paths'
import type { CategoryData } from '@/lib/types/artwork'
import { LightboxModal } from '@/components/lightbox-modal'
import { ChevronLeft } from 'lucide-react'
import { startTransition } from 'react'
import { useRouter } from 'next/navigation'
import { getBlurDataUrl } from '@/lib/utils/image-paths'

interface CategoryPageContentProps {
  categoryData: CategoryData
}

export function CategoryPageContent({ categoryData }: CategoryPageContentProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const { t } = useLanguage()
  const router = useRouter()

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
            <button
              onClick={() => startTransition(() => router.push('/#work'))}
              className="mb-8 inline-flex items-center gap-2 font-sans text-sm uppercase tracking-widest transition-opacity hover:opacity-60"
            >
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" strokeWidth={1.5} />
              {t.work.backToGallery}
            </button>
            <h1 className="font-serif text-4xl tracking-tight md:text-5xl">{categoryTitle}</h1>
            <p className="mt-4 font-sans text-sm text-muted-foreground">
              {categoryData.artworks.length} {categoryData.artworks.length === 1 ? 'artwork' : 'artworks'}
            </p>
          </motion.div>

          {/* Image grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categoryData.artworks.map((artwork, index) => (
              <motion.button
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  setSelectedIndex(index)
                  setIsLightboxOpen(true)
                }}
                className="group relative aspect-square overflow-hidden bg-muted"
              >
                <Image
                  src={getImagePath(categoryData.key, artwork.filename)}
                  alt={artwork.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  placeholder="blur"
                  blurDataURL={getBlurDataUrl()}
                  className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-70"
                />
                {artwork.detailImages && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="bg-background/90 px-3 py-2 font-sans text-xs uppercase tracking-widest">
                      {t.work.viewDetails}
                    </span>
                  </div>
                )}
              </motion.button>
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

"use client"

import type React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"
import { useLanguage } from "@/lib/i18n"
import { artworkCategories } from "@/lib/data/artwork-data"
import { getImagePath } from "@/lib/utils/image-paths"
import { EASE_LUXURY } from "@/lib/animations"
import type { CategoryKey } from "@/lib/types/artwork"

interface DesktopCategoryCardProps {
  categoryKey: CategoryKey
  categorySlug: string
  previewImage: string
  categoryTitle: string
  index: number
  onClick: (slug: string) => void
}

function DesktopCategoryCard({
  categoryKey,
  categorySlug,
  previewImage,
  categoryTitle,
  index,
  onClick,
}: DesktopCategoryCardProps) {
  const reducedMotion = useReducedMotion()
  return (
    <motion.button
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      whileHover={
        reducedMotion
          ? {}
          : {
              scale: 1.05,
              transition: { duration: 0.4, ease: EASE_LUXURY },
            }
      }
      viewport={{ once: true, amount: 0.3 }}
      transition={
        reducedMotion
          ? { duration: 0.01 }
          : { delay: index * 0.04, duration: 0.6, ease: EASE_LUXURY }
      }
      style={
        {
          viewTransitionName: `artwork-${categoryKey}`,
        } as React.CSSProperties
      }
      onClick={() => onClick(categorySlug)}
      data-magnetic
      className="group relative aspect-square overflow-hidden bg-muted cursor-pointer"
    >
      <Image
        src={getImagePath(categoryKey, previewImage)}
        alt={categoryTitle}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 85vw"
        className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="bg-background/90 px-4 py-2 font-sans text-sm uppercase tracking-widest">
          {categoryTitle}
        </span>
      </div>
    </motion.button>
  )
}

export function ArtworkSection() {
  const router = useRouter()
  const { t } = useLanguage()
  const reducedMotion = useReducedMotion()
  return (
    <section id="work" className="px-6 py-16 md:py-24 lg:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reducedMotion ? 0.01 : 1.0, ease: EASE_LUXURY }}
          className="mb-4 md:mb-16 font-serif text-fluid-3xl tracking-tight"
        >
          {t.work.title}
        </motion.h2>

        {/* Desktop: Grid with parallax columns */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-4">
          {artworkCategories.map((category, index) => (
            <DesktopCategoryCard
              key={category.key}
              categoryKey={category.key}
              categorySlug={category.slug}
              previewImage={category.previewImage}
              categoryTitle={t.work.categories[category.key]}
              index={index}
              onClick={(slug) => router.push(`/categories/${slug}`)}
            />
          ))}
        </div>

        {/* Mobile: Vertical grid — all categories visible */}
        <div className="md:hidden grid grid-cols-2 gap-3">
          {artworkCategories.map((category, index) => {
            const categoryTitle = t.work.categories[category.key]
            return (
              <motion.button
                key={category.key}
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={
                  reducedMotion
                    ? { duration: 0.01 }
                    : { delay: index * 0.04, duration: 0.6, ease: EASE_LUXURY }
                }
                whileTap={reducedMotion ? {} : { scale: 0.97 }}
                onClick={() => router.push(`/categories/${category.slug}`)}
                className="group relative overflow-hidden bg-muted cursor-pointer"
                style={{
                  aspectRatio: "3/4",
                  viewTransitionName: `artwork-${category.key}`,
                } as React.CSSProperties}
              >
                <Image
                  src={getImagePath(category.key, category.previewImage)}
                  alt={categoryTitle}
                  fill
                  sizes="50vw"
                  className="object-cover transition-all duration-500 ease-in-out group-active:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 media-overlay-label px-3 pb-3 pt-8">
                  <span className="font-sans text-xs uppercase tracking-widest">
                    {categoryTitle}
                  </span>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

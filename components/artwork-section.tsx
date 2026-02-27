"use client"

import type React from "react"
import { useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, type MotionValue, useScroll, useTransform } from "framer-motion"
import { useLanguage } from "@/lib/i18n"
import { artworkCategories } from "@/lib/data/artwork-data"
import { getImagePath } from "@/lib/utils/image-paths"
import { EASE_LUXURY } from "@/lib/animations"
import { isMobile } from "@/lib/animations"
import type { CategoryKey } from "@/lib/types/artwork"

interface DesktopCategoryCardProps {
  categoryKey: CategoryKey
  categorySlug: string
  previewImage: string
  categoryTitle: string
  index: number
  scrollYProgress: MotionValue<number>
  mobile: boolean
  onClick: (slug: string) => void
}

function DesktopCategoryCard({
  categoryKey,
  categorySlug,
  previewImage,
  categoryTitle,
  index,
  scrollYProgress,
  mobile,
  onClick,
}: DesktopCategoryCardProps) {
  const columnIndex = index % 4
  const isEven = columnIndex % 2 === 0
  const y = useTransform(scrollYProgress, [0, 1], isEven ? [0, -50] : [0, 50])

  return (
    <motion.button
      initial={{ opacity: 0, y: 40, scale: 0.94, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.4, ease: EASE_LUXURY }
      }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        delay: index * 0.04,
        duration: 0.8,
        ease: EASE_LUXURY,
      }}
      style={
        {
          y: mobile ? 0 : y,
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
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const mobile = typeof window !== "undefined" ? isMobile() : false

  return (
    <section id="work" ref={sectionRef} className="px-6 py-12 md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, filter: "blur(20px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, ease: EASE_LUXURY }}
          className="mb-8 md:mb-16 font-serif text-fluid-3xl tracking-tight"
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
              scrollYProgress={scrollYProgress}
              mobile={mobile}
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
                initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  delay: index * 0.04,
                  duration: 0.6,
                  ease: EASE_LUXURY,
                }}
                whileTap={{ scale: 0.97 }}
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

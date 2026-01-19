'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

export function ExperienceButton() {
  const { t } = useLanguage()

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />

      <div className="container relative mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="max-w-2xl mx-auto"
        >
          {/* Label */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6"
          >
            New Experience
          </motion.p>

          {/* Heading */}
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight">
            Explore the Collection
            <br />
            <span className="text-muted-foreground">in Infinite Space</span>
          </h2>

          {/* Description */}
          <p className="font-sans text-base text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed">
            Navigate through an immersive 3D canvas where artworks float in endless space.
            Drag to explore, click to view details.
          </p>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <Link
              href="/experience"
              className="no-underline inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background font-sans text-sm uppercase tracking-widest transition-all duration-300 hover:bg-foreground/90 cursor-pointer"
            >
              <Sparkles className="h-4 w-4" strokeWidth={1.5} />
              <span>Enter the Experience</span>
            </Link>
          </motion.div>

          {/* Hint text */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="font-sans text-xs text-muted-foreground/60 mt-6"
          >
            Best experienced on desktop with a mouse
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

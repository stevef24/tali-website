"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion"
import { DURATION, EASE_LUXURY, isMobile } from "@/lib/animations"

export function HeroSection() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const scale = useTransform(scrollY, [0, 500], [1.2, 1.0])

  useEffect(() => {
    setScrolled(scrollY.get() > 100)
  }, [scrollY])

  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > 100
    setScrolled((prev) => (prev === next ? prev : next))
  })

  const mobile = typeof window !== "undefined" ? isMobile() : false

  return (
    <section className="relative flex min-h-screen items-center justify-center px-6 pt-20 md:px-8">
      <motion.div
        initial={{ opacity: 0, filter: "blur(20px)", scale: 0.95 }}
        animate={{ opacity: 1, filter: "blur(0px)", scale: mobile ? 1.0 : 1.2 }}
        transition={{ duration: DURATION.heroBlur, ease: EASE_LUXURY }}
        style={{
          y: mobile ? 0 : y,
          scale: mobile ? 1 : scale
        }}
        className="relative w-full max-w-5xl md:max-w-5xl"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-muted md:aspect-video">
          <video
            src="/video/testgaby.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
        </div>
      </motion.div>

      <AnimatePresence>
        {!scrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6], y: [0, 8, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg
                className="h-6 w-6 text-foreground/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

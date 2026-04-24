"use client"

import { useEffect, useState } from "react"
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion"
import MuxPlayer from "@mux/mux-player-react"
import { DURATION, EASE_LUXURY, isMobile } from "@/lib/animations"

export function HeroSection() {
  const [scrolled, setScrolled] = useState(false)
  const reducedMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const scale = useTransform(scrollY, [0, 500], [1.2, 1.0])

  useEffect(() => {
    if (reducedMotion) {
      setScrolled(false)
      return
    }

    setScrolled(scrollY.get() > 100)
  }, [scrollY, reducedMotion])

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (reducedMotion) return

    const next = latest > 100
    setScrolled((prev) => (prev === next ? prev : next))
  })

  const mobile = typeof window !== "undefined" ? isMobile() : false

  return (
    <section className="relative flex min-h-[60dvh] md:min-h-[100dvh] items-start md:items-center justify-center px-6 pt-16 md:pt-20 md:px-8">
      <motion.div
        initial={reducedMotion ? { opacity: 1, filter: "blur(0px)", scale: mobile ? 1 : 1.2 } : { opacity: 0, filter: "blur(20px)", scale: 0.95 }}
        animate={{ opacity: 1, filter: "blur(0px)", scale: mobile ? 1 : 1.2 }}
        transition={
          reducedMotion
            ? { duration: 0.01, ease: "linear" }
            : { duration: DURATION.heroBlur, ease: EASE_LUXURY }
        }
        style={{
          y: reducedMotion ? 0 : mobile ? 0 : y,
          scale: mobile ? 1 : (reducedMotion ? 1.2 : scale),
        }}
        className="relative w-full max-w-5xl md:max-w-5xl"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-background dark:bg-black md:aspect-video rounded-lg">
          <MuxPlayer
            playbackId={process.env.NEXT_PUBLIC_MUX_PLAYBACK_ID || "KphmhwQt5JBU02hfqx2Isf5Z01qcCsawlxSbdXy02RY01C8"}
            poster={`https://image.mux.com/${process.env.NEXT_PUBLIC_MUX_PLAYBACK_ID || "KphmhwQt5JBU02hfqx2Isf5Z01qcCsawlxSbdXy02RY01C8"}/thumbnail.webp?time=0`}
            autoPlay={!reducedMotion}
            muted
            loop
            playsInline
            className="h-full w-full [--media-background-color:transparent] dark:[--media-background-color:black]"
            metadata={{
              videoTitle: "Tali Assa - Artist Portfolio",
              viewerUserId: "portfolio-visitor",
            }}
          />
        </div>
      </motion.div>

      <AnimatePresence>
        {!reducedMotion && !scrolled && (
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
                duration: reducedMotion ? 0.01 : 3,
                repeat: reducedMotion ? 0 : Infinity,
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

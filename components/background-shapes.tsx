"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function BackgroundShapes() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Subtle parallax transformations for depth
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 80])
  const y4 = useTransform(scrollYProgress, [0, 1], [0, 120])

  return (
    <div ref={containerRef} className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Vertical line - left side, slow parallax */}
      <motion.div
        style={{ y: y1 }}
        className="absolute left-[8%] top-0 h-screen w-px bg-foreground/8"
      />

      {/* Vertical line - right side, medium parallax */}
      <motion.div
        style={{ y: y2 }}
        className="absolute right-[12%] top-0 h-screen w-px bg-foreground/6"
      />

      {/* Horizontal line - upper third, subtle parallax */}
      <motion.div
        style={{ y: y3 }}
        className="absolute top-[20%] left-0 h-px w-full bg-foreground/7"
      />

      {/* Horizontal line - middle section, medium parallax */}
      <motion.div
        style={{ y: y4 }}
        className="absolute top-[60%] left-0 h-px w-full bg-foreground/6"
      />

      {/* Accent vertical line - center, very subtle */}
      <div className="absolute left-1/2 top-0 h-screen w-px bg-foreground/5" />

      {/* Diagonal line - subtle accent, top-left to bottom-right */}
      <motion.div
        className="absolute top-[-10%] left-[-5%] w-[200%] h-px bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
        style={{
          y: y1,
          rotate: -15,
          transformOrigin: "center",
        }}
      />
    </div>
  )
}

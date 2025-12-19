"use client"

import { motion } from "framer-motion"
import { EASE_LUXURY } from "@/lib/animations"

interface AnimatedHeadingProps {
  text: string
  className?: string
  staggerDelay?: number
  viewport?: {
    once?: boolean
    amount?: number | "some" | "all"
  }
}

export function AnimatedHeading({
  text,
  className = "",
  staggerDelay = 0.02,
  viewport = { once: true },
}: AnimatedHeadingProps) {
  const chars = text.split("")

  return (
    <motion.h1
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, filter: "blur(8px)" },
            visible: {
              opacity: 1,
              filter: "blur(0px)",
              transition: {
                delay: i * staggerDelay,
                duration: 0.6,
                ease: EASE_LUXURY,
              },
            },
          }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h1>
  )
}

'use client'

import { useRef } from 'react'
import { useScroll, useTransform, MotionValue } from 'framer-motion'

interface ScrollRevealOptions {
  distance?: number
  offset?: [string, string]
  amount?: 'some' | 'all' | number
}

interface ScrollRevealReturn {
  ref: React.RefObject<HTMLDivElement>
  scrollYProgress: MotionValue<number>
}

/**
 * useScrollReveal - Hook for scroll-triggered animations
 *
 * Usage:
 * ```tsx
 * const { ref, scrollYProgress } = useScrollReveal()
 * const y = useTransform(scrollYProgress, [0, 1], [-50, 50])
 *
 * <motion.div ref={ref} style={{ y }}>
 *   Content
 * </motion.div>
 * ```
 */
export function useScrollReveal(options: ScrollRevealOptions = {}): ScrollRevealReturn {
  const { offset = ['start end', 'end start'], amount = 0.3 } = options

  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  })

  return { ref, scrollYProgress }
}

interface ParallaxOptions extends ScrollRevealOptions {
  speed?: number // 0-1, where 0.5 is half scroll speed
}

interface ParallaxReturn extends ScrollRevealReturn {
  y: MotionValue<number>
  x?: MotionValue<number>
}

/**
 * useParallax - Hook for parallax scroll effects
 *
 * @param distance - How far to move in pixels (default: 100)
 * @param speed - Parallax speed multiplier (default: 0.5, range 0-1)
 * @param direction - 'vertical' or 'horizontal' (default: 'vertical')
 *
 * Usage:
 * ```tsx
 * const { ref, y } = useParallax(100, 0.5, 'vertical')
 *
 * <motion.div ref={ref} style={{ y }}>
 *   Parallax content
 * </motion.div>
 * ```
 */
export function useParallax(
  distance: number = 100,
  speed: number = 0.5,
  direction: 'vertical' | 'horizontal' = 'vertical',
  options: ParallaxOptions = {}
): ParallaxReturn {
  const { offset = ['start end', 'end start'], amount = 0.3 } = options

  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  })

  if (direction === 'vertical') {
    const y = useTransform(
      scrollYProgress,
      [0, 1],
      [distance * speed, -distance * speed]
    )
    return { ref, scrollYProgress, y }
  } else {
    const x = useTransform(
      scrollYProgress,
      [0, 1],
      [distance * speed, -distance * speed]
    )
    return { ref, scrollYProgress, x }
  }
}

/**
 * useScrollToTransform - Advanced scroll-linked transformation
 *
 * Maps scroll progress to multiple output values for complex animations
 *
 * Usage:
 * ```tsx
 * const { ref, scale, opacity } = useScrollToTransform({
 *   scale: [[0, 1], [0.8, 1.2]],
 *   opacity: [[0, 1], [0, 1]]
 * })
 *
 * <motion.div ref={ref} style={{ scale, opacity }}>
 *   Content
 * </motion.div>
 * ```
 */
interface TransformConfig {
  [key: string]: [number, number][]
}

interface ScrollToTransformReturn extends ScrollRevealReturn {
  [key: string]: MotionValue<number> | React.RefObject<HTMLDivElement>
}

export function useScrollToTransform(
  transforms: TransformConfig,
  options: ScrollRevealOptions = {}
): ScrollToTransformReturn {
  const { offset = ['start end', 'end start'], amount = 0.3 } = options

  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  })

  const result: ScrollToTransformReturn = { ref, scrollYProgress }

  Object.entries(transforms).forEach(([key, [inputRange, outputRange]]) => {
    result[key] = useTransform(scrollYProgress, inputRange, outputRange)
  })

  return result
}

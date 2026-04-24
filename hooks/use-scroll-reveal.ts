'use client'

import { useRef } from 'react'
import { useScroll, useTransform, useReducedMotion, MotionValue } from 'framer-motion'

interface ScrollRevealOptions {
  distance?: number
  offset?: ["start end" | "end start" | "center center", "start end" | "end start" | "center center"]
  amount?: 'some' | 'all' | number
}

interface ScrollRevealReturn {
  ref: React.RefObject<HTMLDivElement | null>
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
  const { offset = ['start end', 'end start'] as const } = options

  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref as React.RefObject<HTMLDivElement>,
    offset,
  })

  return { ref, scrollYProgress }
}

interface ParallaxOptions extends ScrollRevealOptions {
  speed?: number // 0-1, where 0.5 is half scroll speed
}

interface ParallaxReturn extends ScrollRevealReturn {
  y: MotionValue<number>
  x: MotionValue<number>
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
  options: ParallaxOptions = {},
  respectReducedMotion: boolean = true,
): ParallaxReturn {
  const { offset = ['start end', 'end start'] as const } = options
  const reducedMotion = useReducedMotion()
  const suppress = respectReducedMotion && reducedMotion

  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref as React.RefObject<HTMLDivElement>,
    offset,
  })

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    suppress ? [0, 0] : direction === 'vertical' ? [distance * speed, -distance * speed] : [0, 0]
  )

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    suppress ? [0, 0] : direction === 'horizontal' ? [distance * speed, -distance * speed] : [0, 0]
  )

  return { ref, scrollYProgress, y, x }
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
  [key: string]: [number[], number[]]
}

interface ScrollToTransformReturn {
  ref: React.RefObject<HTMLDivElement | null>
  scrollYProgress: MotionValue<number>
  transforms: Record<string, MotionValue<number>>
}

export function useScrollToTransform(
  transforms: TransformConfig,
  options: ScrollRevealOptions = {}
): ScrollToTransformReturn {
  const { offset = ['start end', 'end start'] as const } = options

  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref as React.RefObject<HTMLDivElement>,
    offset,
  })

  const transformValues: Record<string, MotionValue<number>> = {}

  Object.entries(transforms).forEach(([key, [inputRange, outputRange]]) => {
    transformValues[key] = useTransform(scrollYProgress, inputRange, outputRange)
  })

  return { ref, scrollYProgress, transforms: transformValues }
}

import { Variants } from 'framer-motion'

// Easing curves for luxury animations
export const EASE_LUXURY = [0.165, 0.84, 0.44, 1] as const
export const EASE_SMOOTH = [0.76, 0, 0.24, 1] as const

// Spring configurations
export const SPRING_SMOOTH = { stiffness: 500, damping: 30 }
export const SPRING_BOUNCY = { stiffness: 400, damping: 25 }

// Animation durations (in seconds)
export const DURATION = {
  fast: 0.3,
  normal: 0.6,
  slow: 1.0,
  blur: 1.0,
  heroBlur: 1.4,
} as const

// Stagger delays (in seconds)
export const STAGGER = {
  fast: 0.02,
  normal: 0.05,
  slow: 0.1,
} as const

// ============================================
// Animation Variants
// ============================================

export const blurVariants: Variants = {
  hidden: { opacity: 0, filter: 'blur(20px)' },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: DURATION.blur, ease: EASE_LUXURY },
  },
}

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE_SMOOTH },
  },
}

export const charVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * STAGGER.fast,
      duration: 0.4,
      ease: EASE_SMOOTH,
    },
  }),
}

export const menuVariants: Variants = {
  focused: { opacity: 1, filter: 'blur(0px)' },
  unfocused: { opacity: 0.3, filter: 'blur(4px)' },
}

// ============================================
// Responsive Configuration
// ============================================

export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

export const isTouch = (): boolean => {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export interface AnimationConfig {
  duration: number
  blurAmount: number
  parallaxEnabled: boolean
}

/**
 * Get animation configuration based on device and user preferences
 * @returns Config object with duration, blurAmount, and parallaxEnabled
 */
export function getAnimationConfig(): AnimationConfig {
  if (isMobile()) {
    return {
      duration: 0.6,
      blurAmount: 10,
      parallaxEnabled: false,
    }
  }

  return {
    duration: 1.0,
    blurAmount: 20,
    parallaxEnabled: true,
  }
}

/**
 * Get transition config that respects prefers-reduced-motion
 * Use with Framer Motion components for accessibility
 * @param duration - Duration in seconds (default: 0.6)
 * @param ease - Easing function (default: EASE_SMOOTH)
 * @returns Transition config or instant transition if reduced motion preferred
 */
export function getAccessibleTransition(
  duration: number = DURATION.normal,
  ease: any = EASE_SMOOTH
) {
  if (typeof window === 'undefined') {
    return { duration, ease }
  }

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  if (prefersReducedMotion) {
    return { duration: 0.01 }
  }

  return { duration, ease }
}

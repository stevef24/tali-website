'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useTheme } from '@/lib/theme'

export function CustomCursor() {
  const [isTouch, setIsTouch] = useState(true)

  useEffect(() => {
    // Check if device supports touch
    const hasTouch =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0)

    setIsTouch(hasTouch)
  }, [])

  if (isTouch) return null

  return <CursorTracker />
}

function CursorTracker() {
  const { theme } = useTheme()
  const [isHovering, setIsHovering] = useState(false)
  const isHoveringRef = useRef(false)

  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const scale = useMotionValue(1)

  const springConfig = { stiffness: 500, damping: 30 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)
  const scaleSpring = useSpring(scale, springConfig)

  useEffect(() => {
    const lastPos = { x: 0, y: 0 }
    let rafId: number | null = null

    const isInteractiveTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false
      return Boolean(
        target.closest(
          '[data-magnetic],button,a,input,textarea,select,[role="button"],[role="link"]'
        )
      )
    }

    const getCursorScale = (target: EventTarget | null): number => {
      if (!(target instanceof Element)) return 1

      // Precision mode for form inputs
      if (target.closest('input,textarea,select')) {
        return 0.4
      }

      // Enhanced scale for buttons and links
      if (target.closest('button,[data-magnetic],a,[role="button"],[role="link"]')) {
        return 2.2
      }

      return 1
    }

    const setHovering = (next: boolean, target: EventTarget | null = null) => {
      if (isHoveringRef.current === next) return
      isHoveringRef.current = next
      setIsHovering(next)

      if (next) {
        const cursorScale = getCursorScale(target)
        scale.set(cursorScale)
      } else {
        scale.set(1)
      }
    }

    const flush = () => {
      rafId = null
      cursorX.set(lastPos.x)
      cursorY.set(lastPos.y)
    }

    const handlePointerMove = (e: PointerEvent) => {
      lastPos.x = e.clientX
      lastPos.y = e.clientY
      if (rafId == null) rafId = requestAnimationFrame(flush)
    }

    const handlePointerOver = (e: PointerEvent) => {
      if (isInteractiveTarget(e.target)) setHovering(true, e.target)
    }

    const handlePointerOut = (e: PointerEvent) => {
      if (!isInteractiveTarget(e.target)) return
      if (isInteractiveTarget(e.relatedTarget)) return
      setHovering(false)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerover', handlePointerOver, { passive: true })
    window.addEventListener('pointerout', handlePointerOut, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerover', handlePointerOver)
      window.removeEventListener('pointerout', handlePointerOut)
      if (rafId != null) cancelAnimationFrame(rafId)
    }
  }, [cursorX, cursorY, scale])

  // Determine cursor color based on theme
  const cursorColor = theme === 'dark'
    ? 'rgb(255, 255, 255)'
    : 'rgb(0, 0, 0)'

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9998]"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      {/* Outer circle - grows on hover */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          scale: scaleSpring,
          borderWidth: 2,
          borderColor: cursorColor,
          opacity: 0.3,
        }}
      />

      {/* Inner solid dot */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full"
        style={{
          backgroundColor: cursorColor,
          translateX: '-50%',
          translateY: '-50%',
          scale: isHovering ? 0.8 : 1,
          transition: 'all 0.2s ease-out',
        }}
      />
    </motion.div>
  )
}

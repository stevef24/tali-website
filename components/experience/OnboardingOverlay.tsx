'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Hand, MousePointerClick, Scroll, Keyboard } from 'lucide-react'

const SEEN_KEY = 'experience-onboarding-seen'

export function OnboardingOverlay() {
  const [visible, setVisible] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const seen = localStorage.getItem(SEEN_KEY)
    if (!seen) {
      const show = setTimeout(() => setVisible(true), 1600)
      return () => clearTimeout(show)
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem(SEEN_KEY, '1')
    }
  }

  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') dismiss()
    }
    const onPointer = () => dismiss()
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [visible])

  const hints: { icon: typeof Hand; label: string; detail: string }[] = [
    { icon: Hand, label: 'Drag', detail: 'pan around' },
    { icon: Scroll, label: 'Scroll', detail: 'zoom in & out' },
    { icon: MousePointerClick, label: 'Click', detail: 'open an artwork' },
    { icon: Keyboard, label: 'WASD · Q/E', detail: 'pan & zoom with keys' },
  ]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.4, ease: [0.19, 1, 0.22, 1] }}
          className="pointer-events-auto fixed inset-0 z-30 flex items-center justify-center bg-background/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="How to use the infinite canvas"
        >
          <motion.div
            initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.45, ease: [0.19, 1, 0.22, 1] }}
            className="mx-6 max-w-lg rounded-2xl border border-border bg-background/95 p-8 shadow-lg backdrop-blur-md"
          >
            <p className="mb-2 font-sans text-xs uppercase tracking-widest text-muted-foreground">
              How to explore
            </p>
            <h2 className="mb-6 font-serif text-2xl tracking-tight md:text-3xl">
              An infinite field of Tali&rsquo;s work
            </h2>
            <ul className="mb-8 space-y-3">
              {hints.map(({ icon: Icon, label, detail }) => (
                <li key={label} className="flex items-center gap-4">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-border/60 bg-foreground/[0.03] text-foreground/70">
                    <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="flex flex-wrap items-baseline gap-x-2 font-sans text-sm">
                    <span className="font-medium text-foreground">{label}</span>
                    <span className="text-muted-foreground">{detail}</span>
                  </span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={dismiss}
              className="w-full rounded-full border border-foreground/80 bg-foreground px-6 py-3 font-sans text-sm uppercase tracking-widest text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 cursor-pointer"
            >
              Start exploring
            </button>
            <p className="mt-4 text-center font-sans text-[11px] uppercase tracking-widest text-muted-foreground/70">
              Click anywhere or press Esc to dismiss
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

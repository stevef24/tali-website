'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const reducedMotion = useReducedMotion()
  const { language } = useLanguage()

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? 'instant' : 'smooth',
    })
  }

  const label = language === 'he' ? 'גלול למעלה' : 'Scroll to top'

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label={label}
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.3, ease: 'easeOut' }}
          whileHover={reducedMotion ? {} : { y: -2 }}
          whileTap={reducedMotion ? {} : { scale: 0.95 }}
          className="fixed bottom-6 end-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/80 text-foreground/60 backdrop-blur-sm transition-colors hover:text-foreground cursor-pointer"
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
        >
          <ArrowUp className="h-5 w-5" strokeWidth={1.5} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

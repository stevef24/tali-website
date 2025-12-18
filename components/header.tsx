"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Sun, Moon, Globe } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { useTheme } from "@/lib/theme"
import { EASE_SMOOTH } from "@/lib/animations"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      document.documentElement.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
    }
  }, [isOpen])

  const navItems = [
    { label: t.nav.work, href: "#work" },
    { label: t.nav.about, href: "#about" },
    { label: t.nav.exhibitions, href: "#exhibitions" },
    { label: t.nav.contact, href: "#contact" },
  ]

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "he" : "en")
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <a href="#" className="font-serif text-2xl tracking-tight">
            Tali Assa
          </a>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={toggleTheme}
              data-magnetic
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="p-2"
              aria-label={theme === "light" ? t.theme.dark : t.theme.light}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 transition-opacity opacity-100 hover:opacity-60" strokeWidth={1.5} />
              ) : (
                <Sun className="h-5 w-5 transition-opacity opacity-100 hover:opacity-60" strokeWidth={1.5} />
              )}
            </motion.button>
            <motion.button
              onClick={toggleLanguage}
              data-magnetic
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex items-center gap-1 p-2 font-sans text-xs uppercase tracking-widest"
              aria-label="Toggle language"
            >
              <Globe className="h-4 w-4 transition-opacity opacity-100 hover:opacity-60" strokeWidth={1.5} />
              <span className="transition-opacity opacity-100 hover:opacity-60">{language === "en" ? "עב" : "EN"}</span>
            </motion.button>
            <motion.button
              onClick={() => setIsOpen(true)}
              data-magnetic
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="p-2"
              aria-label="Open menu"
            >
              <motion.div
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Menu className="h-6 w-6 transition-opacity opacity-100 hover:opacity-60" strokeWidth={1.5} />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background"
          >
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
              <span className="font-serif text-2xl tracking-tight">Tali Assa</span>
              <button
                onClick={() => setIsOpen(false)}
                data-magnetic
                className="p-2 transition-opacity hover:opacity-60"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </div>
            <nav className="flex h-[calc(100vh-5rem)] flex-col items-center justify-center gap-12">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.12, duration: 0.5 }}
                  className="overflow-hidden"
                >
                  <motion.a
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: index * 0.12,
                      duration: 0.6,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                    whileHover={{
                      x: 8,
                      transition: { duration: 0.4, ease: "easeOut" },
                    }}
                    whileTap={{ scale: 0.96 }}
                    data-magnetic
                    className="relative font-sans text-4xl font-light tracking-wide md:text-5xl group cursor-pointer"
                    style={{
                      opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.35,
                      transition: "opacity 0.3s ease-out",
                    }}
                  >
                    {item.label}
                    <motion.div
                      className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-foreground via-foreground to-transparent rounded-full"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{
                        width: hoveredIndex === index ? "100%" : 0,
                        opacity: hoveredIndex === index ? 1 : 0,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: [0.34, 1.56, 0.64, 1],
                      }}
                    />
                  </motion.a>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

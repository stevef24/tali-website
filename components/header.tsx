"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Menu, X, Sun, Moon, Globe } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { useTheme } from "@/lib/theme"
import { EASE_SMOOTH } from "@/lib/animations"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const reducedMotion = useReducedMotion()

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
    { label: t.nav.explore, href: "/experience", desktopOnly: true },
  ]

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "he" : "en")
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 md:h-20 max-w-7xl items-center justify-between gap-2 px-6 lg:px-8">
          <a
            href="#"
            className="font-serif text-xl md:text-4xl tracking-tight leading-none cursor-pointer relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-foreground after:transition-transform after:duration-300 hover:after:scale-x-100"
          >
            Tali Assa Art
          </a>
          <div className="flex items-center gap-1 md:gap-2">
            <motion.button
              onClick={toggleTheme}
              data-magnetic
              whileHover={reducedMotion ? {} : { y: -2 }}
              whileTap={reducedMotion ? {} : { scale: 0.95 }}
              transition={reducedMotion ? { duration: 0.01 } : { type: "spring", stiffness: 400, damping: 10 }}
              className="p-1.5 md:p-2 cursor-pointer"
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
              whileHover={reducedMotion ? {} : { y: -2 }}
              whileTap={reducedMotion ? {} : { scale: 0.95 }}
              transition={reducedMotion ? { duration: 0.01 } : { type: "spring", stiffness: 400, damping: 10 }}
              className="flex items-center gap-1 p-1.5 md:p-2 font-sans text-xs uppercase tracking-widest cursor-pointer"
              aria-label="Toggle language"
            >
              <Globe className="h-5 w-5 transition-opacity opacity-100 hover:opacity-60" strokeWidth={1.5} />
              <span className="transition-opacity opacity-100 hover:opacity-60">{language === "en" ? "עב" : "EN"}</span>
            </motion.button>
            <motion.button
              onClick={() => setIsOpen(true)}
              data-magnetic
              whileTap={reducedMotion ? {} : { scale: 0.95 }}
              transition={reducedMotion ? { duration: 0.01 } : { type: "spring", stiffness: 400, damping: 10 }}
              className="p-1.5 md:p-2 cursor-pointer"
              aria-label="Open menu"
            >
              <motion.div
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={reducedMotion ? { duration: 0.01 } : { duration: 0.3, ease: "easeInOut" }}
              >
                <Menu className="h-5 w-5 transition-opacity opacity-100 hover:opacity-60" strokeWidth={1.5} />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.3 }}
            className="fixed inset-0 z-50 bg-background"
          >
            <div className="mx-auto flex h-14 md:h-20 max-w-7xl items-center justify-between gap-2 px-6 lg:px-8">
              <span className="font-serif text-xl md:text-4xl tracking-tight leading-none">Tali Assa Art</span>
              <button
                onClick={() => setIsOpen(false)}
                data-magnetic
                className="p-1.5 md:p-2 transition-opacity hover:opacity-60 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <nav className="flex mobile-menu-panel flex-col items-center justify-center gap-12">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: reducedMotion ? 0 : index * 0.12,
                    duration: reducedMotion ? 0.01 : 0.5,
                  }}
                  className={`overflow-hidden${item.desktopOnly ? " hidden md:block" : ""}`}
                >
                  <motion.a
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    initial={reducedMotion ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={
                      reducedMotion
                        ? { duration: 0.01 }
                        : {
                            delay: index * 0.12,
                            duration: 0.6,
                            ease: EASE_SMOOTH,
                          }
                    }
                    whileTap={reducedMotion ? {} : { scale: 0.96 }}
                    data-magnetic
                    className="font-sans text-3xl font-light tracking-wide md:text-4xl cursor-pointer relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-foreground after:transition-transform after:duration-300 hover:after:scale-x-100"
                  >
                    {item.label}
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

"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n"
import { EASE_LUXURY, DURATION } from "@/lib/animations"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, filter: "blur(20px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: DURATION.blur, ease: EASE_LUXURY }}
          className="text-center"
        >
          <h1 className="font-serif text-8xl tracking-tight text-foreground/10 md:text-[12rem]">
            404
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: DURATION.normal, ease: EASE_LUXURY }}
            className="mt-4 font-sans text-lg text-foreground/60"
          >
            {t.notFound.message}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: DURATION.normal, ease: EASE_LUXURY }}
            className="mt-8"
          >
            <Link
              href="/"
              className="no-underline inline-block border border-foreground/20 px-6 py-3 font-sans text-sm uppercase tracking-widest text-foreground/80 transition-colors duration-300 hover:border-foreground/60 hover:text-foreground"
            >
              {t.notFound.backHome}
            </Link>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </main>
  )
}

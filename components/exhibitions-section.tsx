"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n"
import { EASE_LUXURY } from "@/lib/animations"

export function ExhibitionsSection() {
  const { t } = useLanguage()

  return (
    <section id="exhibitions" className="bg-muted/30 px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, filter: "blur(20px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, ease: EASE_LUXURY }}
          className="mb-16 font-serif text-3xl tracking-tight md:text-4xl"
        >
          {t.exhibitions.title}
        </motion.h2>
        <div className="space-y-0">
          {t.exhibitions.items.map((exhibition, index) => (
            <motion.div
              key={`${exhibition.year}-${exhibition.title}`}
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                delay: index * 0.06,
                duration: 0.7,
                ease: EASE_LUXURY,
              }}
              whileHover={{ scale: 1.01 }}
              data-magnetic
              className="grid grid-cols-12 gap-4 border-t border-border py-6 first:border-t-0 transition-transform duration-300 cursor-pointer"
            >
              <div className="col-span-2 font-sans text-sm uppercase tracking-widest text-muted-foreground md:col-span-1">
                {exhibition.year}
              </div>
              <div className="col-span-10 md:col-span-11">
                <h3 className="font-sans text-base font-medium md:text-lg">{exhibition.title}</h3>
                <p className="mt-1 font-sans text-sm text-muted-foreground">
                  {exhibition.venue}, {exhibition.location}
                  {exhibition.curator && (
                    <span>
                      {" "}
                      — {t.exhibitions.curator}: {exhibition.curator}
                    </span>
                  )}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

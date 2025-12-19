"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n"
import { EASE_LUXURY } from "@/lib/animations"
import { getEncodedEmailDisplay } from "@/lib/email-obfuscator"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const { t } = useLanguage()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const formFields = [
    { name: "name", type: "input", placeholder: t.contact.name },
    { name: "email", type: "input", placeholder: t.contact.email },
    { name: "message", type: "textarea", placeholder: t.contact.message },
  ]

  return (
    <section id="contact" className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, filter: "blur(20px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, ease: EASE_LUXURY }}
          className="mb-16 font-serif text-3xl tracking-tight md:text-4xl"
        >
          {t.contact.title}
        </motion.h2>
        <div className="grid gap-16 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE_LUXURY }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {formFields.map((field, index) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, filter: "blur(12px)" }}
                  whileInView={{ opacity: 1, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.3 }}
                  animate={{
                    scale: focusedField === field.name ? 1.01 : 1,
                  }}
                  transition={{
                    delay: index * 0.08,
                    duration: 0.6,
                    ease: EASE_LUXURY,
                  }}
                  className="group"
                >
                  {field.type === "input" ? (
                    <input
                      type={field.name === "email" ? "email" : "text"}
                      name={field.name}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                      onFocus={() => setFocusedField(field.name)}
                      onBlur={() => setFocusedField(null)}
                      placeholder={field.placeholder}
                      required
                      className="w-full border-b border-border bg-transparent py-3 font-sans text-base outline-none transition-all duration-300 placeholder:text-muted-foreground focus:border-foreground focus:border-b-2"
                    />
                  ) : (
                    <textarea
                      name={field.name}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                      onFocus={() => setFocusedField(field.name)}
                      onBlur={() => setFocusedField(null)}
                      placeholder={field.placeholder}
                      rows={4}
                      required
                      className="w-full resize-none border-b border-border bg-transparent py-3 font-sans text-base outline-none transition-all duration-300 placeholder:text-muted-foreground focus:border-foreground focus:border-b-2"
                    />
                  )}
                </motion.div>
              ))}
              <motion.button
                type="submit"
                initial={{ opacity: 0, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6, ease: EASE_LUXURY }}
                whileHover={{
                  scale: 1.05,
                  borderColor: "var(--foreground)",
                  boxShadow: "0 0 0 1px var(--foreground)",
                }}
                whileTap={{ scale: 0.98 }}
                data-magnetic
                className="border border-foreground bg-transparent px-8 py-3 font-sans text-sm uppercase tracking-widest transition-all duration-300 hover:bg-foreground hover:text-background cursor-pointer"
              >
                {t.contact.send}
              </motion.button>
            </form>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8, ease: EASE_LUXURY }}
            className="flex flex-col justify-center"
          >
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-sans text-xs uppercase tracking-widest text-muted-foreground">
                  {t.contact.emailLabel}
                </h3>
                <a
                  href="mailto:assa.talia@gmail.com"
                  className="font-sans text-base transition-opacity hover:opacity-60 cursor-pointer"
                  dangerouslySetInnerHTML={{
                    __html: getEncodedEmailDisplay("assa.talia@gmail.com"),
                  }}
                />
              </div>
              <div>
                <h3 className="mb-2 font-sans text-xs uppercase tracking-widest text-muted-foreground">
                  {t.contact.whatsappLabel}
                </h3>
                <a
                  href="https://wa.me/972528776998"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-base transition-opacity hover:opacity-60 cursor-pointer"
                >
                  +972 52 877 6998
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

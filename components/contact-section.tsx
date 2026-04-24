"use client"

import type React from "react"
import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const { t } = useLanguage()
  const reducedMotion = useReducedMotion()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    const form = new FormData()
    form.append("access_key", "28e8ac11-b587-4e51-b1b1-c823ad29ace0")
    form.append("name", formData.name)
    form.append("email", formData.email)
    form.append("message", formData.message)

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: form,
      })
      const data = await response.json()
      if (data.success) {
        setSubmitStatus("success")
        setFormData({ name: "", email: "", message: "" })
      } else {
        setSubmitStatus("error")
      }
    } catch {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const formFields: Array<{
    name: keyof typeof formData
    type: "input" | "textarea"
    placeholder: string
    autoComplete: string
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
    spellCheck?: boolean
  }> = [
    {
      name: "name",
      type: "input",
      placeholder: t.contact.name,
      autoComplete: "name",
      inputMode: "text",
    },
    {
      name: "email",
      type: "input",
      placeholder: t.contact.email,
      autoComplete: "email",
      inputMode: "email",
      spellCheck: false,
    },
    {
      name: "message",
      type: "textarea",
      placeholder: t.contact.message,
      autoComplete: "off",
    },
  ]

  return (
    <section id="contact" className="px-6 py-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={reducedMotion ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(20px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: reducedMotion ? 0.01 : 1.0, ease: EASE_LUXURY }}
          className="mb-4 md:mb-16 font-serif text-fluid-3xl tracking-tight"
        >
          {t.contact.title}
        </motion.h2>
        <div className="grid gap-16 md:grid-cols-2">
          <motion.div
            initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reducedMotion ? 0.01 : 0.8, ease: EASE_LUXURY }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {formFields.map((field, index) => {
                const fieldId = `contact-${field.name}`

                return (
                  <motion.div
                    key={field.name}
                    initial={reducedMotion ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, filter: "blur(0px)" }}
                    viewport={{ once: true, amount: 0.3 }}
                    animate={{
                      scale: reducedMotion ? 1 : focusedField === field.name ? 1.01 : 1,
                    }}
                    transition={
                      reducedMotion
                        ? { duration: 0.01 }
                        : { delay: index * 0.08, duration: 0.6, ease: EASE_LUXURY }
                    }
                    className="group"
                  >
                    <label htmlFor={fieldId} className="sr-only">
                      {field.placeholder}
                    </label>
                    {field.type === "input" ? (
                      <input
                        id={fieldId}
                        type={field.name === "email" ? "email" : "text"}
                        name={field.name}
                        autoComplete={field.autoComplete}
                        inputMode={field.inputMode}
                        spellCheck={field.spellCheck}
                        value={formData[field.name]}
                        onChange={handleChange}
                        onFocus={() => setFocusedField(field.name)}
                        onBlur={() => setFocusedField(null)}
                        placeholder={field.placeholder}
                        required
                        className="w-full border-b border-border bg-transparent py-3 font-sans text-base outline-none transition-all duration-300 placeholder:text-muted-foreground focus:border-foreground focus:border-b-2"
                      />
                    ) : (
                      <textarea
                        id={fieldId}
                        name={field.name}
                        autoComplete={field.autoComplete}
                        spellCheck={field.spellCheck}
                        value={formData[field.name]}
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
                )
              })}
              <div className="space-y-4">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  initial={reducedMotion ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  animate={isSubmitting && !reducedMotion ? { opacity: [1, 0.6, 1] } : { opacity: 1 }}
                  transition={
                    isSubmitting && !reducedMotion
                      ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
                      : reducedMotion
                        ? { duration: 0.01 }
                        : { delay: 0.3, duration: 0.6, ease: EASE_LUXURY }
                  }
                  whileHover={
                    isSubmitting || reducedMotion
                      ? {}
                      : {
                          scale: 1.05,
                          borderColor: "var(--foreground)",
                          boxShadow: "0 0 0 1px var(--foreground)",
                        }
                  }
                  whileTap={isSubmitting || reducedMotion ? {} : { scale: 0.98 }}
                  data-magnetic
                  className="border border-foreground bg-transparent px-8 py-3 font-sans text-sm uppercase tracking-widest transition-all duration-300 hover:bg-foreground hover:text-background cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending…" : t.contact.send}
                </motion.button>

                <div aria-live="polite">
                  {submitStatus === "success" && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-sans text-sm text-muted-foreground tracking-wide"
                    >
                      {t.contact.success}
                    </motion.p>
                  )}
                  {submitStatus === "error" && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-sans text-sm text-destructive tracking-wide"
                    >
                      {t.contact.error}
                    </motion.p>
                  )}
                </div>
              </div>
            </form>
          </motion.div>
          <motion.div
            initial={reducedMotion ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={
              reducedMotion
                ? { duration: 0.01 }
                : { delay: 0.2, duration: 0.8, ease: EASE_LUXURY }
            }
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
              <div>
                <h3 className="mb-2 font-sans text-xs uppercase tracking-widest text-muted-foreground">
                  Social
                </h3>
                <div className="flex items-center gap-4">
                  <a
                    href="https://www.facebook.com/share/1AouCA95Aw/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-base transition-opacity hover:opacity-60 cursor-pointer"
                    aria-label="Facebook"
                  >
                    Facebook
                  </a>
                  <span className="text-muted-foreground">·</span>
                  <a
                    href="https://www.instagram.com/tali_assa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-base transition-opacity hover:opacity-60 cursor-pointer"
                    aria-label="Instagram"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

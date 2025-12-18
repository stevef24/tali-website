"use client"

import { Phone } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { ObfuscatedEmailLink } from "@/components/obfuscated-email-link"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-border px-6 py-12 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <span className="font-serif text-lg tracking-tight">Tali Assa</span>
        <div className="flex items-center gap-6">
          <ObfuscatedEmailLink
            encodedEmail="nffn.gnyn@tznvy.pbz"
            ariaLabel="Email"
            showIcon
            className="transition-opacity hover:opacity-60"
          />
          <a
            href="https://wa.me/972528776998"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-60"
            aria-label="WhatsApp"
          >
            <Phone className="h-5 w-5" strokeWidth={1.5} />
          </a>
        </div>
        <span className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
          © {new Date().getFullYear()} {t.footer.rights}
        </span>
      </div>
    </footer>
  )
}

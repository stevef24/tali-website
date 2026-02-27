"use client"

import { Phone, Facebook, Instagram } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { ObfuscatedEmailLink } from "@/components/obfuscated-email-link"

export function Footer() {
  const { t } = useLanguage()
  const iconLinkClass = "inline-flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-60 no-underline cursor-pointer"

  return (
    <footer className="border-t border-border px-6 py-8 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <span className="font-serif text-lg tracking-tight">Tali Assa Art</span>
        <div className="flex items-center gap-5">
          <ObfuscatedEmailLink
            encodedEmail="nffn.gnyn@tznvy.pbz"
            ariaLabel="Email"
            showIcon
            className={iconLinkClass}
          />
          <a
            href="https://wa.me/972528776998"
            target="_blank"
            rel="noopener noreferrer"
            className={iconLinkClass}
            aria-label="WhatsApp"
          >
            <Phone className="h-5 w-5" strokeWidth={1.5} />
          </a>
          <a
            href="https://www.facebook.com/share/1AouCA95Aw/"
            target="_blank"
            rel="noopener noreferrer"
            className={iconLinkClass}
            aria-label="Facebook"
          >
            <Facebook className="h-5 w-5" strokeWidth={1.5} />
          </a>
          <a
            href="https://www.instagram.com/tali_assa"
            target="_blank"
            rel="noopener noreferrer"
            className={iconLinkClass}
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" strokeWidth={1.5} />
          </a>
        </div>
        <span className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
          © {new Date().getFullYear()} {t.footer.rights}
        </span>
      </div>
    </footer>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Mail } from "lucide-react"

interface ObfuscatedEmailLinkProps {
  encodedEmail?: string
  ariaLabel?: string
  className?: string
  showIcon?: boolean
}

/**
 * Component that renders an email link with obfuscated href attribute
 * The actual email is only constructed on the client side, making it
 * harder for scrapers to harvest
 */
export function ObfuscatedEmailLink({
  encodedEmail = "nffn.gnyn@tznvy.pbz", // ROT13 encoded: assa.talia@gmail.com
  ariaLabel = "Email",
  className = "transition-opacity hover:opacity-60",
  showIcon = false,
}: ObfuscatedEmailLinkProps) {
  const [href, setHref] = useState("#")
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Decode the email on client side only
    const decodedEmail = encodedEmail
      .split("")
      .map((char) => {
        if (char >= "a" && char <= "z") {
          return String.fromCharCode(((char.charCodeAt(0) - 97 + 13) % 26) + 97)
        }
        if (char >= "A" && char <= "Z") {
          return String.fromCharCode(((char.charCodeAt(0) - 65 + 13) % 26) + 65)
        }
        return char
      })
      .join("")

    setHref(`mailto:${decodedEmail}`)
    setIsHydrated(true)
  }, [encodedEmail])

  if (!isHydrated) {
    return null
  }

  if (showIcon) {
    return (
      <a href={href} className={className} aria-label={ariaLabel}>
        <Mail className="h-5 w-5" strokeWidth={1.5} />
      </a>
    )
  }

  return (
    <a href={href} className={className}>
      <span
        dangerouslySetInnerHTML={{
          __html: encodedEmail
            .split("")
            .map((char) => {
              if (char === "@") return "&#64;"
              if (char === ".") return "&#46;"
              return char
            })
            .join(""),
        }}
      />
    </a>
  )
}

/**
 * Email obfuscation utilities to prevent scraper bots from harvesting emails
 */

export const obfuscatedEmail = {
  address: "assa.talia@gmail.com",
  // Encode using ROT13-like obfuscation for static references
  encoded: "nffn.gnyn@tznvy.pbz",
  decode: (encoded: string): string => {
    return encoded
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
  },
}

/**
 * Get HTML entity encoded version of email for display
 * Example: "assa.talia@gmail.com" → "assa.talia&#64;gmail.com"
 */
export function getEncodedEmailDisplay(email: string): string {
  return email
    .split("")
    .map((char) => {
      // Encode @ symbol as &#64;
      if (char === "@") {
        return "&#64;"
      }
      // Optionally encode other common characters
      if (char === ".") {
        return "&#46;"
      }
      return char
    })
    .join("")
}

/**
 * Create a safe mailto link with obfuscated display text
 */
export function createMailtoLink(
  email: string
): { href: string; displayHtml: string } {
  return {
    href: `mailto:${email}`,
    displayHtml: getEncodedEmailDisplay(email),
  }
}

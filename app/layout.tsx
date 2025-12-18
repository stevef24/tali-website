import type React from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond, DM_Sans, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/lib/theme"
import { LanguageProvider } from "@/lib/i18n"
import { CustomCursor } from "@/components/custom-cursor"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Tali Assa — Artist",
  description:
    "Portfolio of Tali Assa, a painter, psychologist, and musician exploring abstraction, texture, and the boundaries between observation and imagination.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${dmSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <CustomCursor />
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

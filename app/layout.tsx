import type React from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond, DM_Sans, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Agentation } from "agentation"
import { ThemeProvider } from "@/lib/theme"
import { LanguageProvider } from "@/lib/i18n"
import { CustomCursor } from "@/components/custom-cursor"
import { ScrollToTop } from "@/components/scroll-to-top"
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taliassa.art"
const siteDescription =
  "Portfolio of Tali Assa — painter, psychologist, and jazz musician. A body of work spanning landscape, human studies, spheres, architecture of destruction, organic forms, still life, and master copies."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tali Assa Art — Painter, Psychologist, Musician",
    template: "%s — Tali Assa Art",
  },
  description: siteDescription,
  applicationName: "Tali Assa Art",
  authors: [{ name: "Tali Assa" }],
  creator: "Tali Assa",
  publisher: "Tali Assa",
  keywords: [
    "Tali Assa",
    "Tali Assa Art",
    "Israeli artist",
    "contemporary painting",
    "charcoal drawing",
    "pastel art",
    "oil painting",
    "art portfolio",
    "spheres series",
    "architecture of destruction",
    "landscape painting",
    "fine art",
    "MFA Haifa",
  ],
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      he: "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["he_IL"],
    url: siteUrl,
    title: "Tali Assa Art — Painter, Psychologist, Musician",
    description: siteDescription,
    siteName: "Tali Assa Art",
    images: [
      {
        url: "/female-artist-portrait-professional.jpg",
        width: 1200,
        height: 630,
        alt: "Tali Assa — artist portrait",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tali Assa Art",
    description: siteDescription,
    images: ["/female-artist-portrait-professional.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
  },
  category: "art",
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
          <LanguageProvider>
            {children}
            <ScrollToTop />
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  )
}

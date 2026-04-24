import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ArtworkSection } from "@/components/artwork-section"
import { AboutSection } from "@/components/about-section"
import { ExhibitionsSection } from "@/components/exhibitions-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { artworkCategories } from "@/lib/data/artwork-data"
import { getLocalizedText } from "@/lib/utils"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taliassa.art"

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Tali Assa",
  alternateName: "טלי אסא",
  url: siteUrl,
  image: `${siteUrl}/female-artist-portrait-professional.jpg`,
  jobTitle: ["Painter", "Psychologist", "Jazz Musician"],
  description:
    "Israeli painter, psychologist, and jazz musician whose practice spans landscape, human studies, charcoal, pastel, and oil — drawing on four decades of parallel work in all three fields.",
  sameAs: [
    "https://www.facebook.com/share/1AouCA95Aw/",
    "https://www.instagram.com/tali_assa",
  ],
}

const galleryItems = artworkCategories.flatMap((category) =>
  category.artworks.slice(0, 4).map((artwork) => {
    const name = getLocalizedText(artwork.title, "en")
    const medium = artwork.medium ? getLocalizedText(artwork.medium, "en") : undefined
    return {
      "@type": "VisualArtwork",
      name,
      creator: { "@type": "Person", name: "Tali Assa" },
      ...(medium && { artMedium: medium, artworkSurface: medium }),
      ...(artwork.year && { dateCreated: artwork.year }),
      ...(artwork.size && { size: artwork.size }),
    }
  }),
)

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Tali Assa Art",
  url: siteUrl,
  inLanguage: ["en", "he"],
}

const gallerySchema = {
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  name: "Tali Assa — Selected Works",
  url: siteUrl,
  creator: { "@type": "Person", name: "Tali Assa" },
  hasPart: galleryItems,
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded focus:bg-foreground focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:text-background"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="min-h-screen bg-background">
        <h1 className="sr-only">Tali Assa Art — Painter, Psychologist, Musician</h1>
        <HeroSection />
        <ArtworkSection />
        <AboutSection />
        <ExhibitionsSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  )
}


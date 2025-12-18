import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ArtworkSection } from "@/components/artwork-section"
import { AboutSection } from "@/components/about-section"
import { ExhibitionsSection } from "@/components/exhibitions-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { BackgroundShapes } from "@/components/background-shapes"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <BackgroundShapes />
      <Header />
      <HeroSection />
      <ArtworkSection />
      <AboutSection />
      <ExhibitionsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}


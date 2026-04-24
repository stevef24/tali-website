import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCategoryData, getImagePath } from '@/lib/utils/image-paths'
import { CategoryPageContent } from './category-page-content'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taliassa.art'

const englishPart = (text: string | undefined): string | undefined => {
  if (!text) return undefined
  const parts = text.split(' | ').map((s) => s.trim())
  return parts[1] || parts[0] || undefined
}

export async function generateMetadata(props: CategoryPageProps): Promise<Metadata> {
  const params = await props.params
  const categoryData = getCategoryData(params.category)

  if (!categoryData) {
    return {}
  }

  const slugTitle = params.category.charAt(0).toUpperCase() + params.category.slice(1)
  const title = `${slugTitle} — Tali Assa Art`
  const description = `View ${categoryData.artworks.length} artworks in this collection`
  const ogUrl = `${siteUrl}/og/category/${categoryData.slug}`

  return {
    title,
    description,
    alternates: {
      canonical: `/categories/${categoryData.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/categories/${categoryData.slug}`,
      type: 'website',
      siteName: 'Tali Assa Art',
      images: [{ url: ogUrl, width: 1200, height: 630, alt: slugTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogUrl],
    },
  }
}

export default async function CategoryPage(props: CategoryPageProps) {
  const params = await props.params
  const categoryData = getCategoryData(params.category)

  if (!categoryData) {
    notFound()
  }

  const categoryUrl = `${siteUrl}/categories/${categoryData.slug}`
  const imageArtworks = categoryData.artworks.filter((a) => !a.video)

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryData.slug.charAt(0).toUpperCase() + categoryData.slug.slice(1)} — Tali Assa Art`,
    url: categoryUrl,
    inLanguage: ['en', 'he'],
    isPartOf: { '@type': 'WebSite', name: 'Tali Assa Art', url: siteUrl },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: imageArtworks.length,
      itemListElement: imageArtworks.map((artwork, index) => {
        const name = englishPart(artwork.title) || 'Untitled'
        const medium = englishPart(artwork.medium)
        return {
          '@type': 'ListItem',
          position: index + 1,
          url: `${categoryUrl}#${artwork.id}`,
          item: {
            '@type': 'VisualArtwork',
            name,
            url: `${categoryUrl}#${artwork.id}`,
            image: getImagePath(categoryData.key, artwork.filename),
            creator: { '@type': 'Person', name: 'Tali Assa', url: siteUrl },
            ...(medium && { artMedium: medium, artworkSurface: medium }),
            ...(artwork.year && { dateCreated: artwork.year }),
            ...(artwork.size && { size: artwork.size }),
          },
        }
      }),
    },
  }

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <Header />
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <CategoryPageContent categoryData={categoryData} />
      </Suspense>
      <Footer />
    </main>
  )
}

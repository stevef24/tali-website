import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCategoryData } from '@/lib/utils/image-paths'
import { CategoryPageContent } from './category-page-content'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata(props: CategoryPageProps): Promise<Metadata> {
  const params = await props.params
  const categoryData = getCategoryData(params.category)

  if (!categoryData) {
    return {}
  }

  return {
    title: `${params.category.charAt(0).toUpperCase() + params.category.slice(1)} — Tali Assa Art`,
    description: `View ${categoryData.artworks.length} artworks in this collection`,
  }
}

export default async function CategoryPage(props: CategoryPageProps) {
  const params = await props.params
  const categoryData = getCategoryData(params.category)

  if (!categoryData) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <CategoryPageContent categoryData={categoryData} />
      </Suspense>
      <Footer />
    </main>
  )
}

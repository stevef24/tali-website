import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCategoryData } from '@/lib/utils/image-paths'
import { CategoryPageContent } from './category-page-content'

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
    title: `${params.category.charAt(0).toUpperCase() + params.category.slice(1)} - Artist Portfolio`,
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
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <CategoryPageContent categoryData={categoryData} />
    </Suspense>
  )
}

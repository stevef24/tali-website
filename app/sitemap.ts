import type { MetadataRoute } from "next"
import { artworkCategories } from "@/lib/data/artwork-data"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taliassa.art"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/experience`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = artworkCategories.map((category) => ({
    url: `${siteUrl}/categories/${category.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  return [...staticRoutes, ...categoryRoutes]
}

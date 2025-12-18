export type CategoryKey =
  | 'landscape'
  | 'human'
  | 'spheres'
  | 'architecture-of-destruction'
  | 'my-dutch-heroes'
  | 'still-life'
  | 'master-copy'

export interface Artwork {
  id: string // slug-friendly ID
  filename: string // actual filename in public/images/
  title: string // display title (from cleaned filename)
  year?: string // optional metadata
  medium?: string // optional metadata
  size?: string // optional metadata
  detailImages?: string[] // array of detail image paths (spheres only)
}

export interface CategoryData {
  key: CategoryKey
  slug: string // URL-friendly slug
  folderName: string // actual folder name in public/images/
  previewImage: string // filename to show on home page
  artworks: Artwork[]
}

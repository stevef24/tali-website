import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taliassa.art'

export const metadata: Metadata = {
  title: 'Infinite Canvas',
  description:
    'An infinite 3D field of Tali Assa\'s paintings, drawings, and master copies — drag to pan, scroll to zoom, click any work to view it in detail.',
  alternates: { canonical: '/experience' },
  openGraph: {
    title: 'Infinite Canvas · Tali Assa Art',
    description:
      'An infinite 3D field of Tali Assa\'s work. Drag, zoom, and open any piece.',
    url: `${siteUrl}/experience`,
    type: 'website',
    siteName: 'Tali Assa Art',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Infinite Canvas · Tali Assa Art',
    description:
      'An infinite 3D field of Tali Assa\'s work. Drag, zoom, and open any piece.',
  },
}

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return children
}

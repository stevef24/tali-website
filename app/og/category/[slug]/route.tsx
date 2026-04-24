import { ImageResponse } from 'next/og'
import { getCategoryData, getImagePath } from '@/lib/utils/image-paths'

export const runtime = 'edge'

interface RouteContext {
  params: Promise<{ slug: string }>
}

export async function GET(_req: Request, context: RouteContext) {
  const { slug } = await context.params
  const categoryData = getCategoryData(slug)
  if (!categoryData) {
    return new Response('Not found', { status: 404 })
  }

  const imageArtworks = categoryData.artworks.filter((a) => !a.video)
  const imageUrl = getImagePath(categoryData.key, categoryData.previewImage)
  const slugTitle = categoryData.slug.charAt(0).toUpperCase() + categoryData.slug.slice(1)

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#111',
          color: '#f5f5f0',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', width: '58%', height: '100%', background: '#000' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={slugTitle}
            width={720}
            height={630}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '64px 56px',
            width: '42%',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: 20,
                letterSpacing: 4,
                textTransform: 'uppercase',
                opacity: 0.55,
                fontFamily: 'sans-serif',
              }}
            >
              Collection
            </div>
            <div
              style={{
                fontSize: 80,
                lineHeight: 1,
                marginTop: 24,
                letterSpacing: -1.5,
              }}
            >
              {slugTitle}
            </div>
            <div
              style={{
                fontSize: 22,
                marginTop: 24,
                opacity: 0.7,
                fontFamily: 'sans-serif',
              }}
            >
              {`${imageArtworks.length} ${imageArtworks.length === 1 ? 'artwork' : 'artworks'}`}
            </div>
          </div>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 5,
              textTransform: 'uppercase',
              opacity: 0.7,
              fontFamily: 'sans-serif',
            }}
          >
            Tali Assa
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}

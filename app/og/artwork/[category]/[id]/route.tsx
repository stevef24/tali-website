import { ImageResponse } from 'next/og'
import { getCategoryData, getImagePath } from '@/lib/utils/image-paths'
import { getLocalizedText } from '@/lib/utils'

export const runtime = 'edge'

interface RouteContext {
  params: Promise<{ category: string; id: string }>
}

export async function GET(_req: Request, context: RouteContext) {
  const { category, id } = await context.params
  const categoryData = getCategoryData(category)
  if (!categoryData) {
    return new Response('Not found', { status: 404 })
  }
  const artwork = categoryData.artworks.find((a) => a.id === id && !a.video)
  if (!artwork) {
    return new Response('Not found', { status: 404 })
  }

  const title = getLocalizedText(artwork.title, 'en')
  const medium = artwork.medium ? getLocalizedText(artwork.medium, 'en') : undefined
  const meta = [artwork.year, medium, artwork.size].filter(Boolean).join(' · ')
  const imageUrl = getImagePath(categoryData.key, artwork.filename)

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
        <div
          style={{
            display: 'flex',
            width: '58%',
            height: '100%',
            background: '#000',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title}
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
              {categoryData.slug}
            </div>
            <div
              style={{
                fontSize: 64,
                lineHeight: 1.1,
                marginTop: 24,
                letterSpacing: -1,
              }}
            >
              {title}
            </div>
            {meta && (
              <div
                style={{
                  fontSize: 22,
                  marginTop: 24,
                  opacity: 0.7,
                  fontFamily: 'sans-serif',
                }}
              >
                {meta}
              </div>
            )}
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

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { LightboxModal } from '@/components/lightbox-modal'

vi.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    language: 'en',
    t: {
      work: {
        detailImages: 'Detail Images',
        mainImage: 'Main Image',
      },
    },
  }),
}))

const artworks = [
  {
    id: 'human-1',
    filename: 'anna.jpg',
    title: 'אנה | Anna',
    year: '2015',
    medium: 'שמן על קנווס | Oil on Canvas',
    size: '30x40',
  },
  {
    id: 'human-2',
    filename: 'untitled.jpg',
    title: 'ללא כותרת | Untitled',
    year: '2013',
    medium: 'פחם ופסטל על נייר | Charcoal and pastel on paper',
    size: '50x70',
  },
] as const

describe('LightboxModal', () => {
  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('renders outside a contained page shell when opened', async () => {
    render(
      <main data-testid="page-shell" style={{ contain: 'layout style paint', minHeight: '200vh' }}>
        <LightboxModal
          artworks={[...artworks]}
          initialIndex={1}
          isOpen
          onClose={() => {}}
          categoryKey="human"
        />
      </main>,
    )

    const dialog = await screen.findByRole('dialog', { name: 'Artwork lightbox' })

    await waitFor(() => {
      expect(screen.getByTestId('page-shell')).not.toContainElement(dialog)
    })
    expect(document.body).toContainElement(dialog)
  })

  it('navigates between artworks with the arrow controls', async () => {
    render(
      <LightboxModal
        artworks={[...artworks]}
        initialIndex={0}
        isOpen
        onClose={() => {}}
        categoryKey="human"
      />,
    )

    await screen.findByRole('dialog', { name: 'Artwork lightbox' })
    expect(screen.getByText('Anna')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Next artwork' }))
    expect(screen.getByText('Untitled')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Previous artwork' }))
    expect(screen.getByText('Anna')).toBeInTheDocument()
  })

  it('renders circular navigation controls with contrast styling', async () => {
    render(
      <LightboxModal
        artworks={[...artworks]}
        initialIndex={0}
        isOpen
        onClose={() => {}}
        categoryKey="human"
      />,
    )

    const previousButton = await screen.findByRole('button', { name: 'Previous artwork' })
    const nextButton = screen.getByRole('button', { name: 'Next artwork' })

    expect(previousButton.className).toContain('rounded-full')
    expect(previousButton.className).toContain('bg-background/80')
    expect(previousButton.className).toContain('border')

    expect(nextButton.className).toContain('rounded-full')
    expect(nextButton.className).toContain('bg-background/80')
    expect(nextButton.className).toContain('border')
  })

  it('locks body scroll while open and restores it when closed', async () => {
    const { rerender } = render(
      <LightboxModal
        artworks={[...artworks]}
        initialIndex={0}
        isOpen
        onClose={() => {}}
        categoryKey="human"
      />,
    )

    await waitFor(() => {
      expect(document.body.style.overflow).toBe('hidden')
    })

    rerender(
      <LightboxModal
        artworks={[...artworks]}
        initialIndex={0}
        isOpen={false}
        onClose={() => {}}
        categoryKey="human"
      />,
    )

    await waitFor(() => {
      expect(document.body.style.overflow).toBe('')
    })
  })
})

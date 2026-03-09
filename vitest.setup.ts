import React from 'react'
import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = 'test-cloud'

vi.mock('next/image', () => ({
  default: ({
    alt = '',
    blurDataURL: _blurDataURL,
    fill: _fill,
    loader: _loader,
    placeholder: _placeholder,
    priority: _priority,
    quality: _quality,
    src,
    unoptimized: _unoptimized,
    ...props
  }: Record<string, unknown>) =>
    React.createElement('img', {
      alt,
      src: typeof src === 'string' ? src : '',
      ...props,
    }),
}))

vi.mock('framer-motion', () => {
  type MockMotionProps = React.PropsWithChildren<Record<string, unknown>>

  const stripMotionProps = (props: Record<string, unknown>) => {
    const {
      animate: _animate,
      exit: _exit,
      initial: _initial,
      layout: _layout,
      layoutId: _layoutId,
      transition: _transition,
      viewport: _viewport,
      whileHover: _whileHover,
      whileInView: _whileInView,
      whileTap: _whileTap,
      ...rest
    } = props

    return rest
  }

  const motion = new Proxy(
    {},
    {
      get: (_target, tagName: string) =>
        React.forwardRef<HTMLElement, MockMotionProps>(({ children, ...props }, ref) =>
          React.createElement(tagName, { ref, ...stripMotionProps(props) }, children as React.ReactNode),
        ),
    },
  )

  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
    motion,
  }
})

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 artist portfolio website for Tali Assa. The site features a single-page design with smooth scrolling, bilingual support (English/Hebrew), dark/light theme support, and uses Framer Motion for animations. The project leverages a comprehensive Radix UI component library wrapped with custom styling via Tailwind CSS v4 with OKLCH color space.

## Development Commands

```bash
pnpm install       # Install dependencies
pnpm run dev       # Start development server (localhost:3000)
pnpm run build     # Create production build
pnpm run start     # Start production server
pnpm run lint      # Run ESLint checks
```

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS v4 (OKLCH color space) + PostCSS 8
- **UI Components**: Radix UI primitives (60+ components)
- **Forms**: React Hook Form + Zod validation
- **Animation**: Framer Motion 12
- **Theme Management**: Custom context-based system with dark/light modes
- **Internationalization**: Custom context-based system (English/Hebrew)
- **Analytics**: Vercel Analytics

### Project Structure

```
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with theme/language providers
│   ├── page.tsx                 # Home page (composition of sections)
│   └── globals.css              # Global styles + theme variables
├── components/
│   ├── ui/                      # Radix UI wrapped components (form, dialog, menu, etc.)
│   ├── header.tsx               # Navigation with language/theme toggles
│   ├── hero-section.tsx         # Hero area with artist intro
│   ├── artwork-section.tsx      # Portfolio/gallery of work
│   ├── about-section.tsx        # Artist biography
│   ├── exhibitions-section.tsx  # Exhibition history
│   ├── contact-section.tsx      # Contact form
│   └── footer.tsx               # Footer info
├── lib/
│   ├── theme.tsx                # Theme provider context + hooks
│   ├── i18n.tsx                 # Internationalization context + translation keys
│   └── utils.ts                 # Utility functions (cn() for classname merging)
├── next.config.mjs              # Next.js config (ignores TS build errors, unoptimized images)
├── postcss.config.mjs           # PostCSS with Tailwind plugin
└── tsconfig.json                # TypeScript strict mode enabled
```

## Key Design Patterns

### Styling System

The project uses **OKLCH color space** for color variables defined in `globals.css`. Color variables follow a consistent naming convention:

- **Semantic colors**: `--background`, `--foreground`, `--card`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`
- **Chart colors**: `--chart-1` through `--chart-5`
- **Sidebar colors**: `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-accent`, `--sidebar-border`, `--sidebar-ring`
- **Dark mode**: Colors are redefined in `.dark` class selector

Font configuration uses:
- **Sans-serif**: Inter (system default fallback)
- **Serif**: Playfair Display (for headings/branding)

Border radius is controlled by `--radius` variable with modifiers: `sm`, `md`, `lg`, `xl`.

When creating UI, match the existing cinematic styling with smooth color transitions and proper contrast ratios.

### Theme Management (`lib/theme.tsx`)

Custom React context managing light/dark mode toggling. Providers wrap the app in `layout.tsx`. Usage in components:

```typescript
const { theme, toggleTheme } = useTheme()
```

Theme preference is persisted via local storage.

### Internationalization (`lib/i18n.tsx`)

Custom context for English/Hebrew translations. Includes nested translation object structure for organizing strings by section (nav, theme, common). Usage in components:

```typescript
const { language, setLanguage, t } = useLanguage()
```

Language preference is persisted via local storage. Component text should use `t.section.key` pattern.

### Animation Patterns

Framer Motion is used throughout:
- **Menu animations**: `AnimatePresence` + `motion.div` with opacity/y transitions
- **Staggered lists**: delay-based animations using array indices
- **Timing**: Transitions typically 0.3s duration with easing
- **Page transitions**: Smooth scroll behavior is enabled globally via `scroll-behavior: smooth`

Keep animation timings consistent and respect motion preferences when implementing new animations.

### Component Organization

- **Page composition**: `app/page.tsx` imports and arranges sections in order
- **Section components**: Self-contained sections handling their own layout and responsiveness
- **UI components**: Wrapper components around Radix UI primitives with consistent styling
- **"use client" directive**: Used in interactive components (Header, Form sections)

## Important Configuration Notes

### Next.js Configuration (`next.config.mjs`)

- `typescript.ignoreBuildErrors`: Enabled (be aware this bypasses type checking at build time)
- `images.unoptimized`: Enabled (images are served as-is without Next.js optimization)

### TypeScript Configuration

- Strict mode enabled
- Path alias `@/*` maps to project root for clean imports
- React JSX transform enabled

### Color Space

All colors use **OKLCH** color space (format: `oklch(lightness saturation hue)`). When adding new colors, use OKLCH format for consistency with existing theme system.

## Development Guidelines

### When Adding New Sections

1. Create section component in `components/`
2. Import and compose in `app/page.tsx`
3. Add translation keys to `lib/i18n.tsx` if needed
4. Use semantic color variables from `globals.css`
5. Use Framer Motion for any animations
6. Test in both light/dark modes and English/Hebrew

### When Adding Forms

1. Use Radix UI form components from `components/ui/`
2. Integrate React Hook Form for state management
3. Add Zod schema for validation
4. Use `useToast()` from `components/ui/use-toast.ts` for feedback
5. Consider accessibility (labels, error messages, ARIA attributes)

### When Styling

- Import component classes using `@apply` in component files or use className utilities
- Leverage Tailwind v4 features (e.g., `bg-background`, `text-foreground`)
- For custom animations, use Framer Motion `motion.*` components, not pure CSS
- Ensure colors meet WCAG contrast requirements (especially dark mode)

### When Testing UI Changes

Use Playwright for automated testing if needed. Ask the user whether they prefer manual or automated testing for interactive components before implementing test coverage.

## Common Dependencies and Patterns

- **Button variants**: Use `class-variance-authority` for managing button states/sizes
- **Form validation**: React Hook Form + Zod schemas
- **Toast notifications**: `sonner` library with custom `Toaster` component
- **Date picking**: `react-day-picker` with calendar component wrapper
- **Charts**: `recharts` for data visualization
- **Icons**: `lucide-react` for consistent iconography
- **Type-safe classnames**: `cn()` utility from `lib/utils.ts` (uses `clsx` + `tailwind-merge`)

## Codebase Notes

- Project was migrated from portfolio-final directory (see git history)
- Uses PNPM for package management (not npm)
- ESLint is configured for code quality checks
- Vercel Analytics is integrated for monitoring user interactions
- No API routes currently—this is a static portfolio site with client-side interactivity

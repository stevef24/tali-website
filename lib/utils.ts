import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts the correct language half from a bilingual string formatted as
 * "טקסט בעברית | English text". Falls back to the first part if no English is present.
 */
export function getLocalizedText(text: unknown, language: 'en' | 'he'): string {
  if (text == null || text === '') {
    return language === 'he' ? 'ללא כותרת' : 'Untitled'
  }
  if (typeof text !== 'string') {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[getLocalizedText] expected a "HE | EN" string, got:', text)
    }
    return language === 'he' ? 'ללא כותרת' : 'Untitled'
  }
  const [hePart, enPart] = text.split(' | ').map(s => s.trim())
  if (language === 'he') return hePart
  return enPart || hePart
}

/**
 * Formats a size string for the given language.
 * Normalises "x" separators to "×" and switches between ס"מ and cm.
 */
export function formatSize(size: string | undefined, language: 'en' | 'he'): string {
  if (!size) return ''
  let s = size.replace(/(\d)\s*x\s*(\d)/gi, '$1×$2')
  const hasHebrewUnit = /ס"מ/.test(s)
  if (language === 'en') {
    if (hasHebrewUnit) return s.replace(/ס"מ/, 'cm')
    return s + ' cm'
  } else {
    if (hasHebrewUnit) return s
    return s + ' ס"מ'
  }
}

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function ageRangeLabel(range: string): string {
  const map: Record<string, string> = {
    '3-5': 'Early Years (3–5)',
    '6-9': 'KS1 (6–9)',
    '10-13': 'KS2 (10–13)',
  }
  return map[range] ?? range
}

export function genreLabel(genre: string): string {
  return genre.charAt(0).toUpperCase() + genre.slice(1)
}

export function toneLabel(tone: string): string {
  return tone.charAt(0).toUpperCase() + tone.slice(1)
}

export function parseLyrics(lyrics: string): Array<{ section: string | null; lines: string[] }> {
  const result: Array<{ section: string | null; lines: string[] }> = []
  const rawParts = lyrics.split(/\n\n+/)

  for (const part of rawParts) {
    const lines = part.trim().split('\n').filter(l => l.trim())
    if (!lines.length) continue

    const firstLine = lines[0]
    const sectionMatch = firstLine.match(/^\[(.+)\]$/)

    if (sectionMatch) {
      result.push({ section: sectionMatch[1], lines: lines.slice(1) })
    } else {
      result.push({ section: null, lines })
    }
  }

  return result
}

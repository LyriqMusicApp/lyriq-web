'use client'

import { parseLyrics } from '@/lib/utils'

interface Props {
  lyrics: string
  bigMode?: boolean
}

export function LyricsDisplay({ lyrics, bigMode = false }: Props) {
  const sections = parseLyrics(lyrics)

  if (bigMode) {
    return (
      <div className="space-y-10">
        {sections.map((section, i) => (
          <div key={i}>
            {section.section && (
              <p
                className="uppercase tracking-widest font-semibold mb-4"
                style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', letterSpacing: '0.15em' }}
              >
                {section.section}
              </p>
            )}
            <div className="space-y-2">
              {section.lines.map((line, j) => (
                <p
                  key={j}
                  className="leading-relaxed font-medium"
                  style={{
                    fontFamily: 'var(--font-lora), Georgia, serif',
                    fontSize: '48px',
                    color: line.startsWith('(') ? 'rgba(255,255,255,0.5)' : '#FFFFFF',
                    fontStyle: line.startsWith('(') ? 'italic' : 'normal',
                  }}
                >
                  {line || ' '}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {sections.map((section, i) => (
        <div key={i}>
          {section.section && (
            <div className="flex items-center gap-3 mb-3">
              <span
                className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{
                  background: '#EEEBFF',
                  color: '#5B47FB',
                  letterSpacing: '0.12em',
                }}
              >
                {section.section}
              </span>
              <div className="flex-1 h-px" style={{ background: '#E4E7EC' }} />
            </div>
          )}
          <div className="space-y-1.5">
            {section.lines.map((line, j) => (
              <p
                key={j}
                className="leading-relaxed"
                style={{
                  fontFamily: 'var(--font-lora), Georgia, serif',
                  fontSize: '20px',
                  color: line.startsWith('(') ? '#98A2B3' : '#101828',
                  fontStyle: line.startsWith('(') ? 'italic' : 'normal',
                }}
              >
                {line || ' '}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

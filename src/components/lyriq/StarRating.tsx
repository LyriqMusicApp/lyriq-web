'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface Props {
  value: number
  count?: number
  interactive?: boolean
  onRate?: (rating: number) => void
  size?: 'sm' | 'md'
}

export function StarRating({ value, count, interactive = false, onRate, size = 'md' }: Props) {
  const [hovered, setHovered] = useState(0)
  const display = hovered || value
  const px = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5'

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onRate?.(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}
          >
            <Star
              className={px}
              fill={star <= display ? '#F59E0B' : 'none'}
              style={{ color: star <= display ? '#F59E0B' : '#D1D5DB' }}
            />
          </button>
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs" style={{ color: '#98A2B3' }}>
          {value > 0 ? value.toFixed(1) : '—'}
          {count > 0 && ` (${count})`}
        </span>
      )}
    </div>
  )
}

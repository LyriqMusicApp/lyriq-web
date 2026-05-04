'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Play, Pause, Trash2, Heart } from 'lucide-react'
import { StarRating } from './StarRating'
import { ageRangeLabel, genreLabel } from '@/lib/utils'
import type { Song } from '@/types'

// Module-level — only one preview plays at a time across all cards
let currentAudio: HTMLAudioElement | null = null
let currentStop: (() => void) | null = null

interface Props {
  song: Song
  showOwnerActions?: boolean
  onDelete?: (id: string) => void
  onShare?: (id: string) => void
  onUnshare?: (id: string) => void
}

export function SongCard({ song, showOwnerActions, onShare, onUnshare, onDelete }: Props) {
  const router = useRouter()
  const [isPreviewing, setIsPreviewing] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const stopPreview = () => {
    audioRef.current?.pause()
    setIsPreviewing(false)
  }

  const togglePreview = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (isPreviewing) {
      stopPreview()
      currentAudio = null
      currentStop = null
      return
    }

    // Stop any other playing preview
    if (currentStop) {
      currentStop()
    }

    const audio = new Audio(song.preview_url || song.audio_url)
    audioRef.current = audio
    currentAudio = audio
    currentStop = stopPreview

    audio.play().catch(() => {})
    setIsPreviewing(true)

    audio.addEventListener('ended', () => {
      setIsPreviewing(false)
      currentAudio = null
      currentStop = null
    })
  }

  const labelMap: Record<string, string> = {
    '3-5': 'Early Years', '6-9': 'KS1', '10-13': 'KS2',
  }

  return (
    <div
      onClick={() => router.push(`/song/${song.id}`)}
      className="rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-0.5 flex flex-col gap-4"
      style={{
        background: '#FFFFFF',
        border: '1px solid #E4E7EC',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)' }}
    >
      {/* Title + creator */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-base leading-snug mb-1 truncate" style={{ color: '#101828' }}>
          {song.title}
        </h3>
        {song.creator && (
          <p className="text-sm truncate" style={{ color: '#98A2B3' }}>
            by {song.creator.display_name}
          </p>
        )}
      </div>

      {/* Pills */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#EEEBFF', color: '#5B47FB' }}>
          {labelMap[song.age_range] ?? song.age_range}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize" style={{ background: '#F0FDF4', color: '#166534' }}>
          {genreLabel(song.genre)}
        </span>
        {song.subject && (
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#FFF7ED', color: '#9A3412' }}>
            {song.subject}
          </span>
        )}
        {showOwnerActions && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={song.is_public
              ? { background: '#F0FDF4', color: '#166534' }
              : { background: '#F8F9FA', color: '#98A2B3' }
            }
          >
            {song.is_public ? 'Public' : 'Private'}
          </span>
        )}
      </div>

      {/* Bottom row: rating + actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          {song.average_rating > 0 && (
            <StarRating value={song.average_rating} count={song.rating_count} size="sm" />
          )}
          {song.like_count > 0 && (
            <span className="flex items-center gap-1 text-xs" style={{ color: '#98A2B3' }}>
              <Heart className="w-3 h-3" fill="#FF6B6B" style={{ color: '#FF6B6B' }} />
              {song.like_count}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Mini preview */}
          {(song.preview_url || song.audio_url) && (
            <button
              onClick={togglePreview}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={isPreviewing
                ? { background: '#5B47FB' }
                : { background: '#EEEBFF' }
              }
              aria-label={isPreviewing ? 'Stop preview' : 'Preview song'}
            >
              {isPreviewing
                ? <Pause className="w-3.5 h-3.5 text-white" fill="white" />
                : <Play className="w-3.5 h-3.5 ml-0.5" style={{ color: '#5B47FB' }} fill="#5B47FB" />
              }
            </button>
          )}

          {/* Owner quick actions */}
          {showOwnerActions && (
            <>
              {!song.is_public && onShare && (
                <button
                  onClick={e => { e.stopPropagation(); onShare(song.id) }}
                  className="text-xs px-2.5 py-1 rounded-lg font-medium transition-colors"
                  style={{ color: '#5B47FB', background: '#EEEBFF' }}
                >
                  Share
                </button>
              )}
              {song.is_public && onUnshare && (
                <button
                  onClick={e => { e.stopPropagation(); onUnshare(song.id) }}
                  className="text-xs px-2.5 py-1 rounded-lg font-medium transition-colors hover:bg-gray-100"
                  style={{ color: '#475467', border: '1px solid #E4E7EC' }}
                >
                  Unshare
                </button>
              )}
              {onDelete && (
                <button
                  onClick={e => {
                    e.stopPropagation()
                    if (confirm('Delete this song?')) onDelete(song.id)
                  }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50"
                  style={{ color: '#EF4444' }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Play, Pause, Volume2, VolumeX, X, Music } from 'lucide-react'
import { LyricsDisplay } from './LyricsDisplay'
import { formatDuration } from '@/lib/utils'
import type { Song } from '@/types'

interface Props {
  song: Song
  onClose: () => void
}

export function ProjectorMode({ song, onClose }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Esc to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.code === 'Space') { e.preventDefault(); togglePlay() }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isPlaying]) // eslint-disable-line react-hooks/exhaustive-deps

  // Audio events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setCurrentTime(audio.currentTime)
    const onDuration = () => setDuration(audio.duration)
    const onEnded = () => setIsPlaying(false)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onDuration)
    audio.addEventListener('durationchange', onDuration)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onDuration)
      audio.removeEventListener('durationchange', onDuration)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  // Auto-hide controls after 3s of no mouse movement
  const resetHideTimer = useCallback(() => {
    setControlsVisible(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3000)
  }, [])

  useEffect(() => {
    resetHideTimer()
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current) }
  }, [resetHideTimer])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) audio.pause()
    else audio.play().catch(() => {})
    setIsPlaying(p => !p)
  }, [isPlaying])

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !isMuted
    setIsMuted(m => !m)
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * duration
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const labelMap: Record<string, string> = {
    '3-5': 'Early Years', '6-9': 'KS1', '10-13': 'KS2',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      style={{ background: '#0D0B1E' }}
      onMouseMove={resetHideTimer}
      onClick={resetHideTimer}
    >
      <audio ref={audioRef} src={song.audio_url} preload="metadata" />

      {/* Top bar — fades in/out */}
      <div
        className="flex items-center justify-between px-10 py-6 transition-opacity duration-300 flex-shrink-0"
        style={{ opacity: controlsVisible ? 1 : 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#5B47FB' }}>
            <Music className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">{song.title}</h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {labelMap[song.age_range] ?? song.age_range} · {song.genre} · {song.subject ?? ''}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
        >
          <X className="w-4 h-4" />
          Exit (Esc)
        </button>
      </div>

      {/* Lyrics — scrollable centre area */}
      <div className="flex-1 overflow-y-auto px-10 pb-4">
        <div className="max-w-4xl mx-auto">
          <LyricsDisplay lyrics={song.lyrics} bigMode />
        </div>
      </div>

      {/* Bottom player — fades in/out */}
      <div
        className="flex-shrink-0 px-10 py-6 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(to top, rgba(13,11,30,0.95), transparent)',
          opacity: controlsVisible ? 1 : 0,
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-5">
          {/* Play/pause */}
          <button
            onClick={togglePlay}
            className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105"
            style={{ background: '#5B47FB' }}
          >
            {isPlaying
              ? <Pause className="w-6 h-6 text-white" fill="white" />
              : <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
            }
          </button>

          {/* Scrub */}
          <div className="flex-1 min-w-0">
            <div
              className="h-2 rounded-full cursor-pointer mb-1.5"
              style={{ background: 'rgba(255,255,255,0.15)' }}
              onClick={seek}
            >
              <div
                className="h-full rounded-full transition-none"
                style={{ width: `${progress}%`, background: '#5B47FB' }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-xs tabular-nums" style={{ color: 'rgba(255,255,255,0.4)' }}>{formatDuration(currentTime)}</span>
              <span className="text-xs tabular-nums" style={{ color: 'rgba(255,255,255,0.4)' }}>{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Mute */}
          <button onClick={toggleMute} className="p-2 rounded-lg transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  )
}

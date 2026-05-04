'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Play, Pause, Volume2, VolumeX, Download } from 'lucide-react'
import { formatDuration } from '@/lib/utils'

interface Props {
  audioUrl: string
  title: string
  onDownload?: () => void
}

export function AudioPlayer({ audioUrl, title, onDownload }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const scrubRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => { if (!isDragging) setCurrentTime(audio.currentTime) }
    const onDurationChange = () => setDuration(audio.duration)
    const onEnded = () => setIsPlaying(false)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('loadedmetadata', onDurationChange)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('loadedmetadata', onDurationChange)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [isDragging])

  // Space bar = play/pause
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        togglePlay()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isPlaying]) // eslint-disable-line react-hooks/exhaustive-deps

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) audio.pause()
    else audio.play().catch(() => {})
  }, [isPlaying])

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    setIsMuted(v === 0)
    if (audioRef.current) {
      audioRef.current.volume = v
      audioRef.current.muted = v === 0
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isMuted) {
      audio.muted = false
      audio.volume = volume || 0.7
      setIsMuted(false)
    } else {
      audio.muted = true
      setIsMuted(true)
    }
  }

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate)
    if (audioRef.current) audioRef.current.playbackRate = rate
  }

  const seekTo = (clientX: number) => {
    const bar = scrubRef.current
    const audio = audioRef.current
    if (!bar || !audio || !duration) return
    const rect = bar.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    audio.currentTime = ratio * duration
    setCurrentTime(ratio * duration)
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const rates = [0.75, 1, 1.25]

  return (
    <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #E4E7EC', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Title */}
      <p className="text-sm font-medium mb-5 truncate" style={{ color: '#475467' }}>{title}</p>

      {/* Play button + time */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={togglePlay}
          className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #5B47FB, #3D2EE3)',
            boxShadow: '0 4px 16px rgba(91,71,251,0.4)',
          }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying
            ? <Pause className="w-6 h-6 text-white" fill="white" />
            : <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
          }
        </button>

        <div className="flex-1 min-w-0">
          {/* Scrub bar */}
          <div
            ref={scrubRef}
            className="relative h-2 rounded-full cursor-pointer group"
            style={{ background: '#E4E7EC' }}
            onClick={e => seekTo(e.clientX)}
            onMouseDown={e => {
              setIsDragging(true)
              seekTo(e.clientX)
              const onMove = (ev: MouseEvent) => seekTo(ev.clientX)
              const onUp = () => { setIsDragging(false); document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
              document.addEventListener('mousemove', onMove)
              document.addEventListener('mouseup', onUp)
            }}
          >
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-none"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #5B47FB, #3D2EE3)' }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                left: `calc(${progress}% - 8px)`,
                border: '2px solid #5B47FB',
                boxShadow: '0 0 0 3px rgba(91,71,251,0.2)',
              }}
            />
          </div>
          {/* Times */}
          <div className="flex justify-between mt-1.5">
            <span className="text-xs tabular-nums" style={{ color: '#98A2B3' }}>{formatDuration(currentTime)}</span>
            <span className="text-xs tabular-nums" style={{ color: '#98A2B3' }}>{formatDuration(duration)}</span>
          </div>
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between gap-4 mt-2">
        {/* Volume */}
        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className="p-1 rounded transition-colors" style={{ color: '#98A2B3' }}>
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: '#5B47FB' }}
          />
        </div>

        {/* Speed */}
        <div className="flex items-center gap-1">
          {rates.map(r => (
            <button
              key={r}
              onClick={() => handleRateChange(r)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
              style={playbackRate === r
                ? { background: '#EEEBFF', color: '#5B47FB' }
                : { background: 'transparent', color: '#98A2B3' }
              }
            >
              {r}x
            </button>
          ))}
        </div>

        {/* Download */}
        {onDownload && (
          <button
            onClick={onDownload}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all hover:bg-gray-50"
            style={{ color: '#475467', border: '1px solid #E4E7EC' }}
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </button>
        )}
      </div>
    </div>
  )
}

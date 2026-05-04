'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { RotateCcw, Share2, Check } from 'lucide-react'
import { GenerateForm } from '@/components/lyriq/GenerateForm'
import { GenerateProgress } from '@/components/lyriq/GenerateProgress'
import { AudioPlayer } from '@/components/lyriq/AudioPlayer'
import { LyricsDisplay } from '@/components/lyriq/LyricsDisplay'
import { ShareDialog } from '@/components/lyriq/ShareDialog'
import { generateSong } from '@/lib/api/songs'
import { shareSong } from '@/lib/api/songs'
import { getSchoolUsage } from '@/lib/api/school'
import type { GenerateSongRequest, Song } from '@/types'

type Status = 'idle' | 'generating' | 'result' | 'error'

export default function CreatePage() {
  const [status, setStatus] = useState<Status>('idle')
  const [song, setSong] = useState<Song | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [lastFormValues, setLastFormValues] = useState<GenerateSongRequest | null>(null)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [isShared, setIsShared] = useState(false)

  const { data: usage, refetch: refetchUsage } = useQuery({
    queryKey: ['school-usage'],
    queryFn: getSchoolUsage,
    staleTime: 30000,
  })

  const handleGenerate = async (data: GenerateSongRequest) => {
    setLastFormValues(data)
    setStatus('generating')
    setErrorMessage(null)

    try {
      const res = await generateSong(data)
      setSong(res.song)
      setIsShared(res.song.is_public)
      setStatus('result')
      refetchUsage()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'

      if (message.toLowerCase().includes('429') || message.toLowerCase().includes('limit')) {
        setErrorMessage('Your school has used all its generations for this month. Talk to your school admin to upgrade.')
      } else {
        setErrorMessage("Something went wrong generating your song. Don't worry — you haven't been charged.")
      }
      setStatus('error')
    }
  }

  const handleDownload = () => {
    if (!song?.audio_url) return
    const a = document.createElement('a')
    a.href = song.audio_url
    a.download = `${song.title ?? 'song'}.mp3`
    a.target = '_blank'
    a.click()
  }

  const handleShare = async (data: { title: string; subject?: string; curriculum_area?: string; keywords?: string[] }) => {
    if (!song) return
    try {
      const updated = await shareSong(song.id, data)
      setSong(updated)
      setIsShared(true)
      setShowShareDialog(false)
      toast.success('Shared to the library!')
    } catch {
      toast.error('Could not share song — please try again')
    }
  }

  const handleReset = () => {
    setSong(null)
    setStatus('idle')
    setErrorMessage(null)
    setIsShared(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#101828' }}>Create a song</h1>
        <p style={{ color: '#475467' }}>
          Tell us what to write about and we&apos;ll generate an educational song, complete with music.
        </p>
      </div>

      {/* Usage indicator */}
      {usage && (
        <div className="mb-6 px-4 py-2.5 rounded-xl inline-flex items-center gap-2" style={{ background: '#EEEBFF' }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#5B47FB' }} />
          <span className="text-sm" style={{ color: '#5B47FB' }}>
            {usage.generations_used} of {usage.generations_limit} songs used this month
            {usage.reset_date && ` · resets ${new Date(usage.reset_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
          </span>
        </div>
      )}

      <div className="rounded-2xl p-8" style={{ background: '#FFFFFF', border: '1px solid #E4E7EC', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

        {/* Form state */}
        {status === 'idle' && (
          <GenerateForm onGenerate={handleGenerate} isLoading={false} />
        )}

        {/* Generating state */}
        {status === 'generating' && (
          <GenerateProgress />
        )}

        {/* Error state */}
        {status === 'error' && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: '#FEF2F2' }}>
              <span className="text-2xl">😕</span>
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#101828' }}>Generation failed</h2>
            <p className="mb-8 max-w-sm mx-auto" style={{ color: '#475467' }}>
              {errorMessage}
            </p>
            <div className="flex gap-3 justify-center">
              {lastFormValues && !errorMessage?.includes('limit') && (
                <button
                  onClick={() => handleGenerate(lastFormValues)}
                  className="px-5 py-2.5 rounded-xl text-white font-medium text-sm flex items-center gap-2 transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #5B47FB, #3D2EE3)' }}
                >
                  <RotateCcw className="w-4 h-4" />
                  Try again
                </button>
              )}
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{ border: '1px solid #E4E7EC', color: '#475467' }}
              >
                Start over
              </button>
              <a
                href="mailto:lyriqmusicapp@gmail.com?subject=Generation failed"
                className="px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{ border: '1px solid #E4E7EC', color: '#475467' }}
              >
                Contact support
              </a>
            </div>
          </div>
        )}

        {/* Result state */}
        {status === 'result' && song && (
          <div className="space-y-6">
            {/* Song header */}
            <div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: '#101828' }}>{song.title}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-xs px-2.5 py-1 rounded-full font-medium capitalize" style={{ background: '#EEEBFF', color: '#5B47FB' }}>{song.genre}</span>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: '#F0FDF4', color: '#166534' }}>{song.age_range === '3-5' ? 'Early Years' : song.age_range === '6-9' ? 'KS1' : 'KS2'}</span>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium capitalize" style={{ background: '#FFF7ED', color: '#9A3412' }}>{song.tone}</span>
                <span className="text-xs ml-1 flex items-center gap-1" style={{ color: '#10B981' }}>
                  <Check className="w-3.5 h-3.5" />
                  Saved to My Songs
                </span>
              </div>
            </div>

            {/* Audio player */}
            <AudioPlayer
              audioUrl={song.audio_url}
              title={song.title}
              onDownload={handleDownload}
            />

            {/* Lyrics */}
            <div className="pt-2">
              <h3 className="text-base font-semibold mb-5" style={{ color: '#101828' }}>Lyrics</h3>
              <LyricsDisplay lyrics={song.lyrics} />
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex flex-wrap gap-3" style={{ borderTop: '1px solid #E4E7EC' }}>
              {!isShared ? (
                <button
                  onClick={() => setShowShareDialog(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #FF6B6B, #e05555)', color: '#FFFFFF', boxShadow: '0 4px 12px rgba(255,107,107,0.3)' }}
                >
                  <Share2 className="w-4 h-4" />
                  Share to Library
                </button>
              ) : (
                <span className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: '#F0FDF4', color: '#166534' }}>
                  <Check className="w-4 h-4" />
                  Shared to Library
                </span>
              )}

              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-gray-50"
                style={{ border: '1px solid #E4E7EC', color: '#475467' }}
              >
                <RotateCcw className="w-4 h-4" />
                Generate another
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Share dialog */}
      {showShareDialog && song && (
        <ShareDialog
          initialTitle={song.title}
          onShare={handleShare}
          onClose={() => setShowShareDialog(false)}
        />
      )}
    </div>
  )
}

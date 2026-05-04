'use client'

import { use, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  ArrowLeft, Heart, Download, Share2, Monitor, Link2,
  Trash2, Globe, Lock, Loader2, Check,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { getSong, deleteSong, shareSong, unshareSong } from '@/lib/api/songs'
import { getLibrarySong, downloadSong, likeSong, unlikeSong, rateSong, getComments, addComment } from '@/lib/api/library'
import { AudioPlayer } from '@/components/lyriq/AudioPlayer'
import { LyricsDisplay } from '@/components/lyriq/LyricsDisplay'
import { ProjectorMode } from '@/components/lyriq/ProjectorMode'
import { ShareDialog } from '@/components/lyriq/ShareDialog'
import { StarRating } from '@/components/lyriq/StarRating'
import { ageRangeLabel, genreLabel } from '@/lib/utils'
import type { Song } from '@/types'

const labelMap = {
  '3-5': 'Early Years', '6-9': 'KS1', '10-13': 'KS2',
} as const

export default function SongPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const [projectorOpen, setProjectorOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [newComment, setNewComment] = useState('')

  // Try user's own songs first, then library
  const { data: song, isLoading, error } = useQuery<Song>({
    queryKey: ['song', id],
    queryFn: async () => {
      try {
        return await getSong(id)
      } catch {
        return getLibrarySong(id)
      }
    },
  })

  const { data: commentsData } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => getComments(id),
    enabled: commentsOpen,
  })

  const isOwner = song && user && (song.creator?.id === user.id || song.creator?.id === user.user_id)

  const deleteMutation = useMutation({
    mutationFn: () => deleteSong(id),
    onSuccess: () => {
      toast.success('Song deleted')
      router.push('/my-songs')
    },
    onError: () => toast.error('Could not delete song'),
  })

  const shareMutation = useMutation({
    mutationFn: (data: { title: string; subject?: string; curriculum_area?: string; keywords?: string[] }) =>
      shareSong(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(['song', id], updated)
      setShareDialogOpen(false)
      toast.success('Shared to the library!')
    },
    onError: () => toast.error('Could not share song'),
  })

  const unshareMutation = useMutation({
    mutationFn: () => unshareSong(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(['song', id], updated)
      toast.success('Song set to private')
    },
    onError: () => toast.error('Could not unshare song'),
  })

  const likeMutation = useMutation({
    mutationFn: () => song?.is_liked ? unlikeSong(id) : likeSong(id),
    onMutate: () => {
      const prev = queryClient.getQueryData<Song>(['song', id])
      if (prev) {
        queryClient.setQueryData<Song>(['song', id], {
          ...prev,
          is_liked: !prev.is_liked,
          like_count: prev.like_count + (prev.is_liked ? -1 : 1),
        })
      }
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['song', id] })
      toast.error('Could not update like')
    },
  })

  const downloadMutation = useMutation({
    mutationFn: () => downloadSong(id),
    onSuccess: (data) => {
      const a = document.createElement('a')
      a.href = data.audio_url
      a.download = `${data.title ?? 'song'}.mp3`
      a.target = '_blank'
      a.click()
      queryClient.setQueryData<Song>(['song', id], s => s ? { ...s, download_count: s.download_count + 1 } : s)
      toast.success('Download started')
    },
    onError: () => toast.error('Could not download song'),
  })

  const rateMutation = useMutation({
    mutationFn: (rating: number) => rateSong(id, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['song', id] })
      toast.success('Rating saved')
    },
    onError: () => toast.error('Could not save rating'),
  })

  const commentMutation = useMutation({
    mutationFn: () => addComment(id, newComment),
    onSuccess: () => {
      setNewComment('')
      queryClient.invalidateQueries({ queryKey: ['comments', id] })
      toast.success('Comment posted')
    },
    onError: () => toast.error('Could not post comment'),
  })

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard')
  }

  const handleDownload = () => {
    if (!song) return
    if (isOwner) {
      const a = document.createElement('a')
      a.href = song.audio_url
      a.download = `${song.title ?? 'song'}.mp3`
      a.target = '_blank'
      a.click()
    } else {
      downloadMutation.mutate()
    }
  }

  // --- Loading / error states ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#5B47FB' }} />
      </div>
    )
  }

  if (error || !song) {
    return (
      <div className="text-center py-32">
        <p className="text-lg font-medium mb-2" style={{ color: '#101828' }}>Song not found</p>
        <p className="mb-6" style={{ color: '#475467' }}>This song may be private or has been deleted.</p>
        <button onClick={() => router.back()} className="text-sm font-medium" style={{ color: '#5B47FB' }}>← Go back</button>
      </div>
    )
  }

  const pill = (text: string, bg: string, color: string) => (
    <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: bg, color }}>{text}</span>
  )

  return (
    <>
      {/* Projector mode overlay */}
      {projectorOpen && <ProjectorMode song={song} onClose={() => setProjectorOpen(false)} />}

      {/* Share dialog */}
      {shareDialogOpen && (
        <ShareDialog
          initialTitle={song.title}
          onShare={async (data) => { await shareMutation.mutateAsync(data) }}
          onClose={() => setShareDialogOpen(false)}
        />
      )}

      {/* Page content */}
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm font-medium mb-6 transition-colors hover:opacity-70"
          style={{ color: '#475467' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Title + meta */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#101828' }}>{song.title}</h1>
          <div className="flex flex-wrap items-center gap-2">
            {song.creator && (
              <span className="text-sm" style={{ color: '#475467' }}>by {song.creator.display_name}</span>
            )}
            <span style={{ color: '#E4E7EC' }}>·</span>
            {pill(labelMap[song.age_range as keyof typeof labelMap] ?? song.age_range, '#EEEBFF', '#5B47FB')}
            {pill(genreLabel(song.genre), '#F0FDF4', '#166534')}
            {song.subject && pill(song.subject, '#FFF7ED', '#9A3412')}
            {song.curriculum_area && pill(song.curriculum_area, '#F8F9FA', '#475467')}
            {isOwner && (
              song.is_public
                ? <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: '#F0FDF4', color: '#166534' }}><Globe className="w-3 h-3" />Public</span>
                : <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: '#F8F9FA', color: '#475467' }}><Lock className="w-3 h-3" />Private</span>
            )}
          </div>
        </div>

        {/* Two-column layout on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Audio player — takes 2 cols */}
          <div className="lg:col-span-2">
            <AudioPlayer
              audioUrl={song.audio_url}
              title={song.title}
              onDownload={handleDownload}
            />
          </div>

          {/* Actions panel */}
          <div className="rounded-2xl p-5 space-y-3" style={{ background: '#FFFFFF', border: '1px solid #E4E7EC', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: '#101828' }}>Actions</h3>

            {/* Projector mode */}
            <ActionButton icon={<Monitor className="w-4 h-4" />} onClick={() => setProjectorOpen(true)} primary>
              Projector mode
            </ActionButton>

            {/* Download */}
            <ActionButton
              icon={downloadMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              onClick={handleDownload}
            >
              Download
            </ActionButton>

            {/* Copy link */}
            <ActionButton icon={<Link2 className="w-4 h-4" />} onClick={copyLink}>
              Copy link
            </ActionButton>

            {/* Like — only for non-owners on public songs */}
            {!isOwner && song.is_public && (
              <ActionButton
                icon={<Heart className="w-4 h-4" fill={song.is_liked ? '#FF6B6B' : 'none'} />}
                onClick={() => likeMutation.mutate()}
                active={song.is_liked}
                style={{ color: song.is_liked ? '#FF6B6B' : undefined }}
              >
                {song.is_liked ? 'Liked' : 'Like'} {song.like_count > 0 && `(${song.like_count})`}
              </ActionButton>
            )}

            {/* Owner: share / unshare */}
            {isOwner && !song.is_public && (
              <ActionButton icon={<Share2 className="w-4 h-4" />} onClick={() => setShareDialogOpen(true)} coral>
                Share to Library
              </ActionButton>
            )}
            {isOwner && song.is_public && (
              <ActionButton
                icon={unshareMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                onClick={() => unshareMutation.mutate()}
              >
                Make private
              </ActionButton>
            )}

            {/* Owner: delete */}
            {isOwner && (
              <ActionButton
                icon={deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                onClick={() => {
                  if (confirm('Delete this song? This cannot be undone.')) deleteMutation.mutate()
                }}
                destructive
              >
                Delete song
              </ActionButton>
            )}

            {/* Stats */}
            {song.is_public && (
              <div className="pt-3 mt-3 space-y-2" style={{ borderTop: '1px solid #E4E7EC' }}>
                <div className="flex items-center justify-between text-xs" style={{ color: '#98A2B3' }}>
                  <span>Downloads</span>
                  <span className="font-medium" style={{ color: '#475467' }}>{song.download_count}</span>
                </div>
                <div className="flex items-center justify-between text-xs" style={{ color: '#98A2B3' }}>
                  <span>Rating</span>
                  <StarRating value={song.average_rating} count={song.rating_count} size="sm" />
                </div>
                {!isOwner && (
                  <div className="pt-1">
                    <p className="text-xs mb-1.5" style={{ color: '#98A2B3' }}>Rate this song</p>
                    <StarRating value={0} interactive onRate={(r) => rateMutation.mutate(r)} size="sm" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Lyrics */}
        <div className="rounded-2xl p-8 mb-6" style={{ background: '#FFFFFF', border: '1px solid #E4E7EC' }}>
          <h2 className="text-lg font-bold mb-6" style={{ color: '#101828' }}>Lyrics</h2>
          <LyricsDisplay lyrics={song.lyrics} />
        </div>

        {/* Comments — public songs only */}
        {song.is_public && (
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #E4E7EC' }}>
            <button
              onClick={() => setCommentsOpen(o => !o)}
              className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50"
              style={{ background: '#FFFFFF' }}
            >
              <span className="font-semibold" style={{ color: '#101828' }}>
                Comments
                {commentsData?.total ? ` (${commentsData.total})` : ''}
              </span>
              <span className="text-sm" style={{ color: '#98A2B3' }}>{commentsOpen ? 'Hide' : 'Show'}</span>
            </button>

            {commentsOpen && (
              <div className="px-6 pb-6" style={{ background: '#FFFFFF', borderTop: '1px solid #E4E7EC' }}>
                {/* New comment */}
                <div className="flex gap-3 mt-5 mb-6">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0" style={{ background: '#5B47FB' }}>
                    {user?.display_name?.charAt(0)?.toUpperCase() ?? 'T'}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      rows={2}
                      placeholder="Used this with my class — they loved it!"
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                      style={{ border: '1px solid #E4E7EC', color: '#101828' }}
                      onFocus={e => { e.target.style.borderColor = '#5B47FB' }}
                      onBlur={e => { e.target.style.borderColor = '#E4E7EC' }}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => newComment.trim() && commentMutation.mutate()}
                        disabled={!newComment.trim() || commentMutation.isPending}
                        className="px-4 py-1.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 flex items-center gap-1.5"
                        style={{ background: '#5B47FB' }}
                      >
                        {commentMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Post
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comment list */}
                {commentsData?.comments?.length ? (
                  <div className="space-y-4">
                    {commentsData.comments.map(c => (
                      <div key={c.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0" style={{ background: '#E4E7EC', color: '#475467' }}>
                          {c.user.display_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-medium" style={{ color: '#101828' }}>{c.user.display_name}</span>
                            <span className="text-xs" style={{ color: '#98A2B3' }}>
                              {new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                          <p className="text-sm" style={{ color: '#475467' }}>{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-center py-4" style={{ color: '#98A2B3' }}>No comments yet — be the first!</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

// Small helper to keep action buttons DRY
function ActionButton({
  icon, children, onClick, primary, coral, destructive, active, style: extraStyle,
}: {
  icon: React.ReactNode
  children: React.ReactNode
  onClick: () => void
  primary?: boolean
  coral?: boolean
  destructive?: boolean
  active?: boolean
  style?: React.CSSProperties
}) {
  let bg = '#FFFFFF'
  let color = '#475467'
  let border = '1px solid #E4E7EC'

  if (primary) { bg = 'linear-gradient(135deg, #5B47FB, #3D2EE3)'; color = '#FFFFFF'; border = 'none' }
  else if (coral) { bg = '#FF6B6B'; color = '#FFFFFF'; border = 'none' }
  else if (destructive) { color = '#EF4444' }
  else if (active) { bg = '#EEEBFF'; color = '#5B47FB'; border = '1px solid #EEEBFF' }

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90 hover:-translate-y-px"
      style={{ background: bg, color, border, ...extraStyle }}
    >
      {icon}
      {children}
    </button>
  )
}

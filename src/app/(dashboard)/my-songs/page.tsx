'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Music2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { SongCard } from '@/components/lyriq/SongCard'
import { ShareDialog } from '@/components/lyriq/ShareDialog'
import { getMySongs, deleteSong, shareSong, unshareSong } from '@/lib/api/songs'
import type { Song } from '@/types'

export default function MySongsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [sharingId, setSharingId] = useState<string | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['my-songs', page],
    queryFn: () => getMySongs(page, 18),
    staleTime: 30000,
  })

  const sharingWith = data?.songs.find(s => s.id === sharingId)

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSong(id),
    onSuccess: () => {
      toast.success('Song deleted')
      queryClient.invalidateQueries({ queryKey: ['my-songs'] })
    },
    onError: () => toast.error('Could not delete song'),
  })

  const shareMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof shareSong>[1] }) =>
      shareSong(id, data),
    onSuccess: () => {
      toast.success('Shared to the library!')
      setSharingId(null)
      queryClient.invalidateQueries({ queryKey: ['my-songs'] })
    },
    onError: () => toast.error('Could not share song'),
  })

  const unshareMutation = useMutation({
    mutationFn: (id: string) => unshareSong(id),
    onSuccess: () => {
      toast.success('Song set to private')
      queryClient.invalidateQueries({ queryKey: ['my-songs'] })
    },
    onError: () => toast.error('Could not unshare song'),
  })

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#101828' }}>My Songs</h1>
          <p style={{ color: '#475467' }}>All the songs you&apos;ve generated.</p>
        </div>
        <button
          onClick={() => router.push('/create')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #5B47FB, #3D2EE3)', boxShadow: '0 4px 14px rgba(91,71,251,0.25)' }}
        >
          <Plus className="w-4 h-4" />
          Create new
        </button>
      </div>

      {/* Count */}
      {data && data.total > 0 && (
        <p className="text-sm mb-4" style={{ color: '#98A2B3' }}>
          {data.total} song{data.total !== 1 ? 's' : ''}
        </p>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl animate-pulse" style={{ background: '#F3F4F6' }} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-20">
          <p className="text-base font-medium mb-1" style={{ color: '#101828' }}>Couldn&apos;t load your songs</p>
          <p className="text-sm" style={{ color: '#475467' }}>Check your connection and try refreshing.</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && data?.songs.length === 0 && (
        <div className="text-center py-24">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#EEEBFF' }}>
            <Music2 className="w-7 h-7" style={{ color: '#5B47FB' }} />
          </div>
          <p className="text-lg font-semibold mb-1" style={{ color: '#101828' }}>No songs yet</p>
          <p className="text-sm mb-6" style={{ color: '#475467' }}>
            Generate your first song and it&apos;ll appear here.
          </p>
          <button
            onClick={() => router.push('/create')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #5B47FB, #3D2EE3)', boxShadow: '0 4px 14px rgba(91,71,251,0.25)' }}
          >
            <Plus className="w-4 h-4" />
            Create your first song
          </button>
        </div>
      )}

      {/* Grid */}
      {!isLoading && data && data.songs.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.songs.map(song => (
              <SongCard
                key={song.id}
                song={song}
                showOwnerActions
                onShare={(id) => setSharingId(id)}
                onUnshare={(id) => unshareMutation.mutate(id)}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
          </div>

          {data.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40"
                style={{ border: '1px solid #E4E7EC', color: '#475467' }}
              >
                Previous
              </button>
              <span className="text-sm px-3" style={{ color: '#98A2B3' }}>Page {page} of {data.pages}</span>
              <button
                onClick={() => setPage(p => Math.min(data.pages, p + 1))}
                disabled={page === data.pages}
                className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40"
                style={{ border: '1px solid #E4E7EC', color: '#475467' }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Share dialog */}
      {sharingId && sharingWith && (
        <ShareDialog
          initialTitle={sharingWith.title}
          onShare={async (shareData) => {
            await shareMutation.mutateAsync({ id: sharingId, data: shareData })
          }}
          onClose={() => setSharingId(null)}
        />
      )}
    </div>
  )
}

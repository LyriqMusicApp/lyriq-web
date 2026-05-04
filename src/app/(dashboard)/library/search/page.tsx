'use client'

import { useState, Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Search, Music2 } from 'lucide-react'
import { SongCard } from '@/components/lyriq/SongCard'
import { searchLibrary } from '@/lib/api/library'

function SearchResults() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const [newSearch, setNewSearch] = useState(q)
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useQuery({
    queryKey: ['library-search', q, page],
    queryFn: () => searchLibrary(q, { page, limit: 18 }),
    enabled: q.length >= 2,
    staleTime: 60000,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (newSearch.trim().length >= 2) {
      router.push(`/library/search?q=${encodeURIComponent(newSearch.trim())}`)
    }
  }

  return (
    <div>
      <button
        onClick={() => router.push('/library')}
        className="flex items-center gap-1.5 text-sm font-medium mb-6 hover:opacity-70 transition-opacity"
        style={{ color: '#475467' }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Library
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1" style={{ color: '#101828' }}>
          {q ? `Results for "${q}"` : 'Search the Library'}
        </h1>
        {data && q && (
          <p style={{ color: '#475467' }}>
            {data.total === 0 ? 'No songs found' : `${data.total} song${data.total !== 1 ? 's' : ''} found`}
          </p>
        )}
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#98A2B3' }} />
          <input
            value={newSearch}
            onChange={e => setNewSearch(e.target.value)}
            placeholder="Search songs, topics, subjects…"
            className="w-full pl-11 pr-28 py-3 rounded-xl text-sm outline-none transition-all"
            style={{ border: '1px solid #E4E7EC', background: '#FFFFFF', color: '#101828' }}
            onFocus={e => { e.target.style.borderColor = '#5B47FB'; e.target.style.boxShadow = '0 0 0 3px rgba(91,71,251,0.1)' }}
            onBlur={e => { e.target.style.borderColor = '#E4E7EC'; e.target.style.boxShadow = 'none' }}
          />
          <button
            type="submit"
            disabled={newSearch.trim().length < 2}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg text-sm font-semibold text-white disabled:opacity-40 transition-opacity"
            style={{ background: '#5B47FB' }}
          >
            Search
          </button>
        </div>
      </form>

      {/* Loading skeletons */}
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
          <p className="text-base font-medium mb-1" style={{ color: '#101828' }}>Search failed</p>
          <p className="text-sm" style={{ color: '#475467' }}>Try again or browse the full library.</p>
        </div>
      )}

      {/* No results */}
      {!isLoading && data?.songs.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#EEEBFF' }}>
            <Music2 className="w-7 h-7" style={{ color: '#5B47FB' }} />
          </div>
          <p className="text-lg font-semibold mb-1" style={{ color: '#101828' }}>No songs found</p>
          <p className="text-sm mb-4" style={{ color: '#475467' }}>
            Try different keywords, or browse the full library.
          </p>
          <button
            onClick={() => router.push('/library')}
            className="text-sm font-medium"
            style={{ color: '#5B47FB' }}
          >
            Browse Library
          </button>
        </div>
      )}

      {/* Results grid */}
      {!isLoading && data && data.songs.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.songs.map(song => (
              <SongCard key={song.id} song={song} />
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

      {/* Prompt to search */}
      {!q && (
        <div className="text-center py-20">
          <p className="text-base" style={{ color: '#98A2B3' }}>Enter a topic, subject, or keyword above to search.</p>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm" style={{ color: '#98A2B3' }}>Loading…</div>}>
      <SearchResults />
    </Suspense>
  )
}

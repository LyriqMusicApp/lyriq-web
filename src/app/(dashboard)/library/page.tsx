'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Search, SlidersHorizontal, Music2 } from 'lucide-react'
import { SongCard } from '@/components/lyriq/SongCard'
import { getLibrary } from '@/lib/api/library'
import type { Genre, AgeRange } from '@/types'

// NOTE: Backend has a bug where genre/age_range filters crash the DB query
// (Python enum serialised as "Genre.POP" instead of "pop").
// Workaround: fetch all songs and filter client-side.
// When the backend is fixed, replace the client-side filter with server-side params.

const PAGE_SIZE = 18

const GENRES: { value: Genre; label: string }[] = [
  { value: 'pop', label: 'Pop' },
  { value: 'rock', label: 'Rock' },
  { value: 'rap', label: 'Rap' },
  { value: 'country', label: 'Country' },
  { value: 'folk', label: 'Folk' },
  { value: 'chant', label: 'Chant' },
  { value: 'lullaby', label: 'Lullaby' },
]

const AGE_RANGES: { value: AgeRange; label: string }[] = [
  { value: '3-5', label: 'Early Years' },
  { value: '6-9', label: 'KS1' },
  { value: '10-13', label: 'KS2' },
]

const SORT_OPTIONS = [
  { value: 'downloads', label: 'Most downloaded' },
  { value: 'rating', label: 'Top rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'trending', label: 'Trending' },
]

export default function LibraryPage() {
  const router = useRouter()
  const [searchInput, setSearchInput] = useState('')
  const [genre, setGenre] = useState<Genre | undefined>()
  const [ageRange, setAgeRange] = useState<AgeRange | undefined>()
  const [sort, setSort] = useState<'downloads' | 'rating' | 'newest' | 'trending'>('downloads')
  const [page, setPage] = useState(1)

  // Fetch all songs (no genre/age_range — those filters are broken server-side)
  const { data, isLoading, error } = useQuery({
    queryKey: ['library-all', sort],
    queryFn: () => getLibrary({ sort, limit: 100 }),
    staleTime: 30000,
  })

  // Filter client-side
  const filtered = useMemo(() => {
    if (!data?.songs) return []
    return data.songs.filter(song => {
      if (genre && song.genre !== genre) return false
      if (ageRange && song.age_range !== ageRange) return false
      return true
    })
  }, [data?.songs, genre, ageRange])

  // Client-side pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageSongs = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim().length >= 2) {
      router.push(`/library/search?q=${encodeURIComponent(searchInput.trim())}`)
    }
  }

  const clearFilters = () => {
    setGenre(undefined)
    setAgeRange(undefined)
    setSort('downloads')
    setPage(1)
  }

  const hasFilters = !!genre || !!ageRange || sort !== 'downloads'

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1" style={{ color: '#101828' }}>Library</h1>
        <p style={{ color: '#475467' }}>Songs shared by teachers — ready to use in your classroom.</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-5">
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#98A2B3' }} />
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search songs, topics, subjects…"
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{ border: '1px solid #E4E7EC', background: '#FFFFFF', color: '#101828' }}
            onFocus={e => { e.target.style.borderColor = '#5B47FB'; e.target.style.boxShadow = '0 0 0 3px rgba(91,71,251,0.1)' }}
            onBlur={e => { e.target.style.borderColor = '#E4E7EC'; e.target.style.boxShadow = 'none' }}
          />
          {searchInput.trim().length >= 2 && (
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg text-xs font-semibold text-white"
              style={{ background: '#5B47FB' }}
            >
              Search
            </button>
          )}
        </div>
      </form>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <SlidersHorizontal className="w-4 h-4 flex-shrink-0" style={{ color: '#98A2B3' }} />

        {AGE_RANGES.map(a => (
          <FilterChip
            key={a.value}
            label={a.label}
            active={ageRange === a.value}
            onClick={() => { setAgeRange(ageRange === a.value ? undefined : a.value); setPage(1) }}
          />
        ))}

        <div className="w-px h-5 mx-1" style={{ background: '#E4E7EC' }} />

        {GENRES.map(g => (
          <FilterChip
            key={g.value}
            label={g.label}
            active={genre === g.value}
            onClick={() => { setGenre(genre === g.value ? undefined : g.value); setPage(1) }}
          />
        ))}

        <div className="w-px h-5 mx-1" style={{ background: '#E4E7EC' }} />

        <select
          value={sort}
          onChange={e => { setSort(e.target.value as typeof sort); setPage(1) }}
          className="text-sm px-3 py-1.5 rounded-lg outline-none cursor-pointer"
          style={{ border: '1px solid #E4E7EC', background: '#FFFFFF', color: '#475467' }}
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {hasFilters && (
          <button onClick={clearFilters} className="text-sm px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-100" style={{ color: '#EF4444' }}>
            Clear filters
          </button>
        )}
      </div>

      {/* Results count */}
      {!isLoading && data && (
        <p className="text-sm mb-4" style={{ color: '#98A2B3' }}>
          {filtered.length === 0
            ? 'No songs match these filters'
            : `${filtered.length} song${filtered.length !== 1 ? 's' : ''}${hasFilters ? ' matching filters' : ''}`
          }
        </p>
      )}

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl animate-pulse" style={{ background: '#F3F4F6' }} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-20">
          <p className="text-base font-medium mb-1" style={{ color: '#101828' }}>Couldn&apos;t load the library</p>
          <p className="text-sm" style={{ color: '#475467' }}>Check your connection and try refreshing.</p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && filtered.length === 0 && !error && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#EEEBFF' }}>
            <Music2 className="w-7 h-7" style={{ color: '#5B47FB' }} />
          </div>
          <p className="text-lg font-semibold mb-1" style={{ color: '#101828' }}>
            {hasFilters ? 'No songs match these filters' : 'No songs yet'}
          </p>
          <p className="text-sm mb-4" style={{ color: '#475467' }}>
            {hasFilters ? 'Try a different combination, or clear all filters.' : 'Be the first to share a song to the library!'}
          </p>
          {hasFilters && (
            <button onClick={clearFilters} className="text-sm font-medium" style={{ color: '#5B47FB' }}>
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {!isLoading && pageSongs.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pageSongs.map(song => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40"
                style={{ border: '1px solid #E4E7EC', color: '#475467' }}
              >
                Previous
              </button>
              <span className="text-sm px-3" style={{ color: '#98A2B3' }}>Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40"
                style={{ border: '1px solid #E4E7EC', color: '#475467' }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
      style={active
        ? { background: '#5B47FB', color: '#FFFFFF' }
        : { background: '#FFFFFF', color: '#475467', border: '1px solid #E4E7EC' }
      }
    >
      {label}
    </button>
  )
}

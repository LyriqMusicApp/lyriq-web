import { apiRequest } from './client'
import type { Song, PaginatedSongs, LibraryFilters } from '@/types'

function buildQuery(params: Record<string, string | number | undefined>): string {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&')
  return q ? `?${q}` : ''
}

export async function getLibrary(filters: LibraryFilters = {}): Promise<PaginatedSongs & { filters_applied: Record<string, unknown> }> {
  const query = buildQuery(filters as Record<string, string | number | undefined>)
  return apiRequest(`/api/v1/library${query}`, {}, false)
}

export async function searchLibrary(q: string, filters: Omit<LibraryFilters, 'genre' | 'tone' | 'subject' | 'min_rating' | 'sort'> = {}): Promise<PaginatedSongs> {
  const query = buildQuery({ q, ...filters } as Record<string, string | number | undefined>)
  return apiRequest(`/api/v1/library/search${query}`, {}, false)
}

export async function getTrending(limit = 10): Promise<{ songs: Song[] }> {
  return apiRequest(`/api/v1/library/trending?limit=${limit}`, {}, false)
}

export async function getTopRated(limit = 10): Promise<{ songs: Song[] }> {
  return apiRequest(`/api/v1/library/top-rated?limit=${limit}`, {}, false)
}

export async function getLibrarySong(id: string): Promise<Song> {
  return apiRequest(`/api/v1/library/song/${id}`, {}, false)
}

export async function downloadSong(id: string): Promise<Song> {
  return apiRequest(`/api/v1/library/song/${id}/download`, { method: 'POST' })
}

export async function likeSong(id: string): Promise<unknown> {
  return apiRequest(`/api/v1/library/song/${id}/like`, { method: 'POST' })
}

export async function unlikeSong(id: string): Promise<unknown> {
  return apiRequest(`/api/v1/library/song/${id}/like`, { method: 'DELETE' })
}

export async function rateSong(id: string, rating: number): Promise<unknown> {
  return apiRequest(`/api/v1/library/song/${id}/rate`, {
    method: 'POST',
    body: JSON.stringify({ rating }),
  })
}

export async function getComments(id: string, page = 1): Promise<{ comments: Array<{ id: string; content: string; created_at: string; user: { display_name: string } }>; total: number }> {
  return apiRequest(`/api/v1/library/song/${id}/comments?page=${page}`)
}

export async function addComment(id: string, content: string): Promise<unknown> {
  return apiRequest(`/api/v1/library/song/${id}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}

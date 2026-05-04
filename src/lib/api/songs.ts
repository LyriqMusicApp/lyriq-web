import { apiRequest } from './client'
import type { Song, GenerateSongRequest, PaginatedSongs, SongUsage } from '@/types'

export async function generateSong(data: GenerateSongRequest): Promise<{ success: boolean; song: Song; usage: SongUsage }> {
  return apiRequest('/api/v1/songs/generate', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getMySongs(page = 1, limit = 20): Promise<PaginatedSongs> {
  return apiRequest(`/api/v1/songs/my?page=${page}&limit=${limit}`)
}

export async function getSong(id: string): Promise<Song> {
  return apiRequest(`/api/v1/songs/${id}`)
}

export async function updateSong(id: string, data: Partial<Pick<Song, 'title' | 'subject' | 'curriculum_area' | 'keywords' | 'is_public'>>): Promise<Song> {
  return apiRequest(`/api/v1/songs/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function deleteSong(id: string): Promise<void> {
  return apiRequest(`/api/v1/songs/${id}`, { method: 'DELETE' })
}

export async function shareSong(id: string, data?: { title?: string; keywords?: string[]; subject?: string; curriculum_area?: string }): Promise<Song> {
  return apiRequest(`/api/v1/songs/${id}/share`, {
    method: 'POST',
    body: JSON.stringify(data ?? {}),
  })
}

export async function unshareSong(id: string): Promise<Song> {
  return apiRequest(`/api/v1/songs/${id}/unshare`, { method: 'POST' })
}

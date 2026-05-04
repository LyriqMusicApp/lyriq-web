export interface User {
  id: string
  user_id: string
  display_name: string
  country: string
  is_public: boolean
  songs_created: number
  songs_shared: number
  total_downloads: number
  total_likes: number
  average_rating_received: number
  reputation_score: number
  badges: string[]
  created_at: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: User
}

export type Genre = 'pop' | 'rap' | 'chant' | 'rock' | 'country' | 'lullaby' | 'folk'
export type Tone = 'calm' | 'happy' | 'encouraging' | 'energetic' | 'silly' | 'peaceful'
export type AgeRange = '3-5' | '6-9' | '10-13'
export type Language = 'en' | 'de' | 'fr' | 'es' | 'it' | 'nl' | 'pl' | 'sv' | 'da' | 'no' | 'fi' | 'pt'

export interface Song {
  id: string
  title: string
  topic: string
  genre: Genre
  tone: Tone
  age_range: AgeRange
  language: Language
  subject?: string
  curriculum_area?: string
  keywords?: string[]
  lyrics: string
  audio_url: string
  preview_url: string
  duration_seconds: number
  is_public: boolean
  status: string
  download_count: number
  like_count: number
  average_rating: number
  rating_count: number
  created_at: string
  creator?: {
    id: string
    display_name: string
    avatar_url: string | null
    reputation_score: number
  }
  is_liked?: boolean
  is_downloaded?: boolean
}

export interface SongUsage {
  generations_used: number
  generations_limit: number
  generations_remaining: number
  reset_date: string | null
}

export interface GenerateSongRequest {
  topic: string
  genre: Genre
  tone: Tone
  age_range: AgeRange
  language: Language
  subject?: string
  curriculum_area?: string
  keywords?: string[]
  share_to_library?: boolean
}

export interface PaginatedSongs {
  songs: Song[]
  page: number
  limit: number
  total: number
  pages: number
}

export interface LibraryFilters {
  genre?: Genre
  tone?: Tone
  age_range?: AgeRange
  language?: Language
  subject?: string
  min_rating?: number
  sort?: 'downloads' | 'rating' | 'newest' | 'trending'
  page?: number
  limit?: number
}

export interface ApiError {
  success: false
  error: string
  detail?: string
}

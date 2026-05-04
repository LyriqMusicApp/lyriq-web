import { create } from 'zustand'
import type { Song } from '@/types'

interface PlayerState {
  currentSong: Song | null
  isPlaying: boolean
  setCurrentSong: (song: Song) => void
  setIsPlaying: (playing: boolean) => void
  clearPlayer: () => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentSong: null,
  isPlaying: false,
  setCurrentSong: (song) => set({ currentSong: song }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  clearPlayer: () => set({ currentSong: null, isPlaying: false }),
}))

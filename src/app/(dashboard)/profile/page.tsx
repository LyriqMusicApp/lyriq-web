'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Pencil, Check, X, LogOut, Music, Share2, Download, Heart, Star, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { getProfile, updateProfile } from '@/lib/api/profile'

export default function ProfilePage() {
  const router = useRouter()
  const { user, clearAuth, updateUser } = useAuthStore()
  const queryClient = useQueryClient()

  const [editingName, setEditingName] = useState(false)
  const [editingBio, setEditingBio] = useState(false)
  const [nameValue, setNameValue] = useState('')
  const [bioValue, setBioValue] = useState('')

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: 60000,
  })

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updated) => {
      updateUser({ display_name: updated.display_name })
      queryClient.setQueryData(['profile'], updated)
      toast.success('Profile updated')
      setEditingName(false)
      setEditingBio(false)
    },
    onError: () => toast.error('Could not update profile'),
  })

  const handleLogout = () => {
    clearAuth()
    document.cookie = 'lyriq-authed=; path=/; max-age=0'
    router.push('/login')
  }

  const display = profile ?? user
  const initials = display?.display_name?.slice(0, 2).toUpperCase() ?? 'TT'

  const stats = [
    { icon: <Music className="w-5 h-5" />, label: 'Songs created', value: display?.songs_created ?? 0, color: '#5B47FB', bg: '#EEEBFF' },
    { icon: <Share2 className="w-5 h-5" />, label: 'Shared to library', value: display?.songs_shared ?? 0, color: '#10B981', bg: '#F0FDF4' },
    { icon: <Download className="w-5 h-5" />, label: 'Total downloads', value: display?.total_downloads ?? 0, color: '#F59E0B', bg: '#FFFBEB' },
    { icon: <Heart className="w-5 h-5" />, label: 'Total likes', value: display?.total_likes ?? 0, color: '#FF6B6B', bg: '#FFF5F5' },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8" style={{ color: '#101828' }}>Profile</h1>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#5B47FB' }} />
        </div>
      ) : (
        <div className="space-y-5">

          {/* Avatar + name card */}
          <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #E4E7EC' }}>
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #5B47FB, #3D2EE3)' }}
              >
                {initials}
              </div>

              {/* Name + bio */}
              <div className="flex-1 min-w-0">
                {/* Display name */}
                <div className="flex items-center gap-2 mb-1">
                  {editingName ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        value={nameValue}
                        onChange={e => setNameValue(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg text-base font-semibold outline-none"
                        style={{ border: '1px solid #5B47FB', color: '#101828', boxShadow: '0 0 0 3px rgba(91,71,251,0.1)' }}
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') updateMutation.mutate({ display_name: nameValue })
                          if (e.key === 'Escape') setEditingName(false)
                        }}
                      />
                      <button
                        onClick={() => updateMutation.mutate({ display_name: nameValue })}
                        disabled={updateMutation.isPending || !nameValue.trim()}
                        className="p-1.5 rounded-lg transition-colors hover:bg-green-50 disabled:opacity-50"
                        style={{ color: '#10B981' }}
                      >
                        {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      </button>
                      <button onClick={() => setEditingName(false)} className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: '#98A2B3' }}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold" style={{ color: '#101828' }}>
                        {display?.display_name ?? 'Teacher'}
                      </h2>
                      <button
                        onClick={() => { setNameValue(display?.display_name ?? ''); setEditingName(true) }}
                        className="p-1 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                        style={{ color: '#98A2B3' }}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Bio */}
                {editingBio ? (
                  <div className="mt-2">
                    <textarea
                      value={bioValue}
                      onChange={e => setBioValue(e.target.value)}
                      rows={3}
                      maxLength={200}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                      style={{ border: '1px solid #5B47FB', color: '#475467', boxShadow: '0 0 0 3px rgba(91,71,251,0.1)' }}
                      autoFocus
                      placeholder="Tell other teachers a bit about yourself…"
                    />
                    <div className="flex justify-between items-center mt-1.5">
                      <span className="text-xs" style={{ color: '#98A2B3' }}>{bioValue.length}/200</span>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingBio(false)} className="text-xs px-3 py-1 rounded-lg" style={{ color: '#98A2B3' }}>Cancel</button>
                        <button
                          onClick={() => updateMutation.mutate({ bio: bioValue })}
                          disabled={updateMutation.isPending}
                          className="text-xs px-3 py-1 rounded-lg text-white"
                          style={{ background: '#5B47FB' }}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 mt-1">
                    <p className="text-sm" style={{ color: '#475467' }}>
                      {(profile as { bio?: string })?.bio || (
                        <span style={{ color: '#98A2B3' }}>No bio yet</span>
                      )}
                    </p>
                    <button
                      onClick={() => { setBioValue((profile as { bio?: string })?.bio ?? ''); setEditingBio(true) }}
                      className="p-1 rounded-lg hover:bg-gray-100 flex-shrink-0 mt-0.5"
                      style={{ color: '#98A2B3' }}
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* School */}
                {(profile as { school_name?: string })?.school_name && (
                  <p className="text-sm mt-2" style={{ color: '#98A2B3' }}>
                    🏫 {(profile as { school_name?: string }).school_name}
                  </p>
                )}
              </div>
            </div>

            {/* Reputation */}
            <div className="mt-5 pt-5 flex items-center gap-2" style={{ borderTop: '1px solid #E4E7EC' }}>
              <Star className="w-4 h-4" fill="#F59E0B" style={{ color: '#F59E0B' }} />
              <span className="text-sm font-medium" style={{ color: '#101828' }}>
                Reputation score: {display?.reputation_score ?? 0}
              </span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map(stat => (
              <div
                key={stat.label}
                className="rounded-2xl p-5 flex items-center gap-4"
                style={{ background: '#FFFFFF', border: '1px solid #E4E7EC' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: stat.bg, color: stat.color }}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold leading-none mb-0.5" style={{ color: '#101828' }}>{stat.value}</p>
                  <p className="text-xs" style={{ color: '#98A2B3' }}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Account actions */}
          <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #E4E7EC' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: '#101828' }}>Account</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium" style={{ color: '#101828' }}>Email</p>
                  <p className="text-sm" style={{ color: '#98A2B3' }}>To change your email or password, contact support</p>
                </div>
                <a
                  href="mailto:lyriqmusicapp@gmail.com?subject=Account help"
                  className="text-sm font-medium"
                  style={{ color: '#5B47FB' }}
                >
                  Contact
                </a>
              </div>

              <div style={{ borderTop: '1px solid #E4E7EC', paddingTop: 12 }}>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-red-50 w-full"
                  style={{ color: '#EF4444', border: '1px solid #FECACA' }}
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

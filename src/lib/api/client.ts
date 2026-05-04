import { useAuthStore } from '@/store/authStore'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://lyriq-backend-production-bb5b.up.railway.app'

let isRefreshing = false
let refreshQueue: Array<(token: string) => void> = []

async function refreshTokens(): Promise<string | null> {
  const { refreshToken, setAuth, clearAuth } = useAuthStore.getState()
  if (!refreshToken) return null

  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
    if (!res.ok) {
      clearAuth()
      return null
    }
    const data = await res.json()
    setAuth(data.access_token, data.refresh_token, data.user)
    return data.access_token
  } catch {
    clearAuth()
    return null
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  requireAuth = true
): Promise<T> {
  const { accessToken } = useAuthStore.getState()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> ?? {}),
  }

  // Always send the token when we have one — requireAuth only controls
  // whether to hard-fail (redirect to login) when there's no token
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (res.status === 401 && requireAuth) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push(async (newToken) => {
          headers['Authorization'] = `Bearer ${newToken}`
          const retryRes = await fetch(`${BASE_URL}${path}`, { ...options, headers })
          if (retryRes.ok) resolve(retryRes.json())
          else reject(new Error('Request failed after token refresh'))
        })
      })
    }

    isRefreshing = true
    const newToken = await refreshTokens()
    isRefreshing = false

    if (newToken) {
      refreshQueue.forEach(cb => cb(newToken))
      refreshQueue = []
      headers['Authorization'] = `Bearer ${newToken}`
      const retryRes = await fetch(`${BASE_URL}${path}`, { ...options, headers })
      if (!retryRes.ok) {
        const err = await retryRes.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(err.error ?? 'Request failed')
      }
      return retryRes.json()
    } else {
      refreshQueue = []
      if (typeof window !== 'undefined') {
        window.location.href = '/login?expired=1'
      }
      throw new Error('Session expired')
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
    throw new Error(err.error ?? `HTTP ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

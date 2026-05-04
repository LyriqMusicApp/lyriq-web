import { apiRequest } from './client'
import type { AuthResponse } from '@/types'

export async function login(email: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }, false)
}

export async function register(data: {
  email: string
  password: string
  display_name: string
  school_code: string
  country: string
}): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }, false)
}

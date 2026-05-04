import { apiRequest } from './client'
import type { User } from '@/types'

export interface ProfileData extends User {
  bio?: string
  school_name?: string
  school_type?: string
}

export async function getProfile(): Promise<ProfileData> {
  return apiRequest('/api/v1/profile')
}

export async function updateProfile(data: { display_name?: string; bio?: string }): Promise<ProfileData> {
  return apiRequest('/api/v1/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

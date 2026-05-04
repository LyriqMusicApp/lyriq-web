import { apiRequest } from './client'

export interface SchoolUsage {
  generations_used: number
  generations_limit: number
  generations_remaining: number
  reset_date: string | null
}

export async function getSchoolUsage(): Promise<SchoolUsage> {
  return apiRequest('/api/v1/school/usage')
}

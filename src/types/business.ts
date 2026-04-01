import type { AuthSession, BackendAuthResponse } from '@/types/auth'

export interface BackendBusinessResponse {
  id: string
  owner_user_id: string
  name: string
  slug_uk: string
  description?: string | null
  category: string
  phone?: string | null
  email?: string | null
  address_line1: string
  address_line2?: string | null
  city: string
  postcode: string
  timezone: string
  latitude?: number | null
  longitude?: number | null
  status: string
  created_at: string
  updated_at: string
}

export interface BackendCreateBusinessResponse {
  business: BackendBusinessResponse
  auth: BackendAuthResponse
}

export type BusinessStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED'

export interface Business {
  id: string
  ownerUserId: string
  name: string
  slugUk: string
  description: string | null
  category: string
  phone: string | null
  email: string | null
  addressLine1: string
  addressLine2: string | null
  city: string
  postcode: string
  timezone: string
  latitude: number | null
  longitude: number | null
  status: BusinessStatus
  createdAt: string
  updatedAt: string
}

export interface CreateBusinessRequestPayload {
  name: string
  description?: string | null
  category: string
  phone?: string | null
  email?: string | null
  address_line1: string
  address_line2?: string | null
  city: string
  postcode: string
  timezone: string
  latitude?: number | null
  longitude?: number | null
}

export type UpdateBusinessRequestPayload = CreateBusinessRequestPayload

export interface UpdateBusinessStatusRequestPayload {
  status: BusinessStatus
}

export interface BusinessListResponse {
  businesses: Business[]
}

export interface CreateBusinessSuccessResponse {
  message: string
  business: Business
  session: AuthSession
  redirectTo: string
}

export interface BusinessUpdateSuccessResponse {
  message: string
  business: Business
}

export interface BusinessStatusUpdateSuccessResponse {
  message: string
  business: Business
}

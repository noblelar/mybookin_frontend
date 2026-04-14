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

export type BusinessDayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY'

export interface BackendBusinessHoursResponse {
  id: string
  business_id: string
  day_of_week: BusinessDayOfWeek
  open_time?: string | null
  close_time?: string | null
  is_closed: boolean
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

export interface BusinessHoursDay {
  id: string
  businessId: string
  dayOfWeek: BusinessDayOfWeek
  openTime: string | null
  closeTime: string | null
  isClosed: boolean
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

export interface UpdateBusinessHoursPayload {
  hours: {
    day_of_week: BusinessDayOfWeek
    open_time?: string | null
    close_time?: string | null
    is_closed: boolean
  }[]
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

export interface BusinessHoursResponse {
  hours: BusinessHoursDay[]
}

export interface BusinessHoursMutationResponse {
  message: string
  hours: BusinessHoursDay[]
}

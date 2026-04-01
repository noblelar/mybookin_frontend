export interface BackendServiceCategoryResponse {
  id: string
  business_id: string
  name: string
  sort_order: number
  created_at: string
}

export interface BackendServiceResponse {
  id: string
  business_id: string
  service_category_id: string
  service_category_name: string
  name: string
  description?: string | null
  duration_minutes: number
  price_amount: string
  deposit_amount: string
  currency: string
  allow_cash_payment: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ServiceCategory {
  id: string
  businessId: string
  name: string
  sortOrder: number
  createdAt: string
}

export interface Service {
  id: string
  businessId: string
  serviceCategoryId: string
  serviceCategoryName: string
  name: string
  description: string | null
  durationMinutes: number
  priceAmount: string
  depositAmount: string
  currency: string
  allowCashPayment: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateServiceCategoryPayload {
  name: string
  sort_order?: number
}

export interface CreateServicePayload {
  service_category_id: string
  name: string
  description?: string | null
  duration_minutes: number
  price_amount: string
  deposit_amount?: string | null
  currency: string
  allow_cash_payment: boolean
}

export type UpdateServicePayload = CreateServicePayload

export interface UpdateServiceActivePayload {
  is_active: boolean
}

export interface ServiceCategoryListResponse {
  categories: ServiceCategory[]
}

export interface ServiceListResponse {
  services: Service[]
}

export interface ServiceCategoryMutationResponse {
  message: string
  category: ServiceCategory
}

export interface ServiceMutationResponse {
  message: string
  service: Service
}

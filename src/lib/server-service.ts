import type {
  BackendServiceCategoryResponse,
  BackendServiceResponse,
  Service,
  ServiceCategory,
} from '@/types/service'

export const toServiceCategory = (
  category: BackendServiceCategoryResponse
): ServiceCategory => {
  return {
    id: category.id,
    businessId: category.business_id,
    name: category.name,
    sortOrder: category.sort_order,
    createdAt: category.created_at,
  }
}

export const toService = (service: BackendServiceResponse): Service => {
  return {
    id: service.id,
    businessId: service.business_id,
    serviceCategoryId: service.service_category_id,
    serviceCategoryName: service.service_category_name,
    name: service.name,
    description: service.description ?? null,
    durationMinutes: service.duration_minutes,
    priceAmount: service.price_amount,
    depositAmount: service.deposit_amount,
    currency: service.currency,
    allowCashPayment: service.allow_cash_payment,
    isActive: service.is_active,
    createdAt: service.created_at,
    updatedAt: service.updated_at,
  }
}

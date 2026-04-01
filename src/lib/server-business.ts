import type { ApiErrorResponse } from '@/types/auth'
import type { BackendBusinessResponse, Business, BusinessStatus } from '@/types/business'
import type { BackendBookingResponse, Booking, BookingStatus } from '@/types/booking'

export const toApiErrorResponse = (
  payload: unknown,
  fallbackMessage: string
): ApiErrorResponse => {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'message' in payload &&
    typeof payload.message === 'string' &&
    payload.message.trim().length
  ) {
    return { message: payload.message }
  }

  if (
    typeof payload === 'object' &&
    payload !== null &&
    'error' in payload &&
    typeof payload.error === 'string' &&
    payload.error.trim().length
  ) {
    return { message: payload.error }
  }

  return { message: fallbackMessage }
}

export const toBusiness = (business: BackendBusinessResponse): Business => {
  return {
    id: business.id,
    ownerUserId: business.owner_user_id,
    name: business.name,
    slugUk: business.slug_uk,
    description: business.description ?? null,
    category: business.category,
    phone: business.phone ?? null,
    email: business.email ?? null,
    addressLine1: business.address_line1,
    addressLine2: business.address_line2 ?? null,
    city: business.city,
    postcode: business.postcode,
    timezone: business.timezone,
    latitude: business.latitude ?? null,
    longitude: business.longitude ?? null,
    status: business.status as BusinessStatus,
    createdAt: business.created_at,
    updatedAt: business.updated_at,
  }
}

export const toBooking = (booking: BackendBookingResponse): Booking => {
  return {
    id: booking.id,
    businessId: booking.business_id,
    businessName: booking.business_name,
    businessTimezone: booking.business_timezone,
    serviceId: booking.service_id,
    serviceName: booking.service_name,
    customerUserId: booking.customer_user_id,
    customerFirstName: booking.customer_first_name,
    customerLastName: booking.customer_last_name,
    customerEmail: booking.customer_email,
    assignedStaffId: booking.assigned_staff_id,
    assignedStaffDisplayName: booking.assigned_staff_display_name,
    startAt: booking.start_at,
    endAt: booking.end_at,
    partySize: booking.party_size,
    status: booking.status as BookingStatus,
    cancelledBy: booking.cancelled_by ?? null,
    cancelledByUserId: booking.cancelled_by_user_id ?? null,
    cancelReason: booking.cancel_reason ?? null,
    cancelledAt: booking.cancelled_at ?? null,
    createdAt: booking.created_at,
    updatedAt: booking.updated_at,
  }
}

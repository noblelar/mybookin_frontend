export interface BackendBookingResponse {
  id: string
  business_id: string
  business_name: string
  business_timezone: string
  service_id: string
  service_name: string
  customer_user_id: string
  customer_first_name: string
  customer_last_name: string
  customer_email: string
  assigned_staff_id: string
  assigned_staff_display_name: string
  start_at: string
  end_at: string
  party_size: number
  status: string
  cancelled_by?: string | null
  cancelled_by_user_id?: string | null
  cancel_reason?: string | null
  cancelled_at?: string | null
  created_at: string
  updated_at: string
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'

export interface Booking {
  id: string
  businessId: string
  businessName: string
  businessTimezone: string
  serviceId: string
  serviceName: string
  customerUserId: string
  customerFirstName: string
  customerLastName: string
  customerEmail: string
  assignedStaffId: string
  assignedStaffDisplayName: string
  startAt: string
  endAt: string
  partySize: number
  status: BookingStatus
  cancelledBy: string | null
  cancelledByUserId: string | null
  cancelReason: string | null
  cancelledAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateBookingPayload {
  assigned_staff_id: string
  start_at: string
  party_size: number
}

export interface CancelBookingPayload {
  cancel_reason?: string | null
}

export interface UpdateBookingStatusPayload {
  status: BookingStatus
}

export interface BookingListResponse {
  bookings: Booking[]
}

export interface BookingMutationResponse {
  message: string
  booking: Booking
}

export type BusinessBookingsResponse = BookingListResponse

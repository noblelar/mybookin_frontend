export interface BackendAvailabilitySlotResponse {
  staff_member_id: string
  staff_member_display_name: string
  start_at: string
  end_at: string
}

export interface BackendAvailabilityResponse {
  business_id: string
  service_id: string
  date: string
  timezone: string
  duration_minutes: number
  slots: BackendAvailabilitySlotResponse[]
}

export interface AvailabilitySlot {
  staffMemberId: string
  staffMemberDisplayName: string
  startAt: string
  endAt: string
}

export interface Availability {
  businessId: string
  serviceId: string
  date: string
  timezone: string
  durationMinutes: number
  slots: AvailabilitySlot[]
}

export interface AvailabilityResponse {
  availability: Availability
}

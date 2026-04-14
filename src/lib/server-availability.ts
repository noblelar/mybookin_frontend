import type {
  Availability,
  AvailabilitySlot,
  BackendAvailabilityResponse,
} from '@/types/availability'

const toAvailabilitySlot = (slot: BackendAvailabilityResponse['slots'][number]): AvailabilitySlot => {
  return {
    staffMemberId: slot.staff_member_id,
    staffMemberDisplayName: slot.staff_member_display_name,
    startAt: slot.start_at,
    endAt: slot.end_at,
    status: slot.status ?? 'AVAILABLE',
  }
}

export const toAvailability = (availability: BackendAvailabilityResponse): Availability => {
  return {
    businessId: availability.business_id,
    serviceId: availability.service_id,
    date: availability.date,
    timezone: availability.timezone,
    durationMinutes: availability.duration_minutes,
    slots: availability.slots.map(toAvailabilitySlot),
    timelineSlots: availability.timeline_slots?.map(toAvailabilitySlot) ?? [],
  }
}

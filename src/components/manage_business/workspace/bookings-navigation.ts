import { buildWorkspaceSubNavItems } from '@/components/manage_business/workspace/workspace-navigation'

const BOOKINGS_SECTIONS = [
  { key: '/manage_business/bookings', label: 'Queue' },
  { key: '/manage_business/bookings/detail', label: 'Detail' },
] as const

export function buildBookingsSubNavItems(businessId: string | null) {
  return buildWorkspaceSubNavItems([...BOOKINGS_SECTIONS], businessId)
}

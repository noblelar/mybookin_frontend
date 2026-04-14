import { buildWorkspaceSubNavItems } from '@/components/manage_business/workspace/workspace-navigation'

const STAFF_SECTIONS = [
  { key: '/manage_business/staff', label: 'Team' },
  { key: '/manage_business/staff/schedule', label: 'Schedule' },
] as const

export function buildStaffSubNavItems(businessId: string | null) {
  return buildWorkspaceSubNavItems([...STAFF_SECTIONS], businessId)
}

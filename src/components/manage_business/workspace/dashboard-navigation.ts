import { buildWorkspaceSubNavItems } from '@/components/manage_business/workspace/workspace-navigation'

const DASHBOARD_SECTIONS = [
  { key: '/manage_business', label: 'Overview' },
  { key: '/manage_business/readiness', label: 'Readiness' },
] as const

export function buildDashboardSubNavItems(businessId: string | null) {
  return buildWorkspaceSubNavItems([...DASHBOARD_SECTIONS], businessId)
}

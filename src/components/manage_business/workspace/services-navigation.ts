import { buildWorkspaceSubNavItems } from '@/components/manage_business/workspace/workspace-navigation'

const SERVICES_SECTIONS = [
  { key: '/manage_business/services', label: 'Catalog' },
  { key: '/manage_business/services/operations', label: 'Operations' },
] as const

export function buildServicesSubNavItems(businessId: string | null) {
  return buildWorkspaceSubNavItems([...SERVICES_SECTIONS], businessId)
}

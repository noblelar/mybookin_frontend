import { buildWorkspaceSubNavItems } from '@/components/manage_business/workspace/workspace-navigation'

const RESOURCE_SECTIONS = [{ key: '/manage_business/resources', label: 'Inventory' }] as const

export function buildResourcesSubNavItems(businessId: string | null) {
  return buildWorkspaceSubNavItems([...RESOURCE_SECTIONS], businessId)
}

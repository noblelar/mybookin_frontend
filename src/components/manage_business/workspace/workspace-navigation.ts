import type { ManageBusinessTopBarSubNavItem } from '@/components/manage_business/ManageBusinessTopBar'

type WorkspaceSection = {
  key: string
  label: string
}

export function buildWorkspaceSubNavItems(
  sections: WorkspaceSection[],
  businessId: string | null
): ManageBusinessTopBarSubNavItem[] {
  return sections.map((section) => ({
    key: section.key,
    label: section.label,
    href: businessId ? `${section.key}?businessId=${businessId}` : section.key,
  }))
}

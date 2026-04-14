import type { ManageBusinessTopBarSubNavItem } from '@/components/manage_business/ManageBusinessTopBar'

const SETTINGS_SECTIONS = [
  { key: '/manage_business/settings/profile', label: 'Profile' },
  { key: '/manage_business/settings/hours', label: 'Hours' },
  { key: '/manage_business/settings/media', label: 'Media' },
  { key: '/manage_business/settings/billing', label: 'Billing' },
  { key: '/manage_business/settings/owner-access', label: 'Owner Access' },
] as const

export const buildSettingsSubNavItems = (
  businessId: string | null
): ManageBusinessTopBarSubNavItem[] => {
  return SETTINGS_SECTIONS.map((section) => ({
    key: section.key,
    label: section.label,
    href: businessId ? `${section.key}?businessId=${businessId}` : section.key,
  }))
}

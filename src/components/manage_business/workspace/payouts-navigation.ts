import { buildWorkspaceSubNavItems } from '@/components/manage_business/workspace/workspace-navigation'

const PAYOUTS_SECTIONS = [
  { key: '/manage_business/payouts', label: 'Overview' },
  { key: '/manage_business/payouts/invoices', label: 'Invoices' },
  { key: '/manage_business/payouts/plan', label: 'Plan' },
] as const

export function buildPayoutsSubNavItems(businessId: string | null) {
  return buildWorkspaceSubNavItems([...PAYOUTS_SECTIONS], businessId)
}
